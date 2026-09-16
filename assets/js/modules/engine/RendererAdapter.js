/**
 * Creative Maximum Reasoning (CMR) — Renderer Adapter
 * Orquestador de renderizado gráfico de alta fidelidad: WebGPU con fallback a WebGL2 y Canvas2D
 * doc/CMR_Web_System_v2_Documentation/docs/08_RENDERING_WEBGPU_THREE_TSL.md
 */

import { SceneRegistry } from './SceneRegistry.js';
import { ResourceManager } from './ResourceManager.js';

export class RendererAdapter {
  constructor(qualityManager, eventBus = null) {
    this.qualityManager = qualityManager;
    this.eventBus = eventBus;
    this.canvas = null;
    this.backend = 'none'; // 'webgpu' | 'webgl2' | 'webgl' | 'canvas2d'
    
    this.gl = null;
    this.ctx2d = null;
    this.gpuDevice = null;
    this.gpuContext = null;

    this.sceneRegistry = new SceneRegistry();
    this.resourceManager = new ResourceManager();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = 1;
    this.isPaused = false;
    this.isDestroyed = false;

    // Estado de cámara y micro-parallax
    this.camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      fov: 60,
      z: 500
    };

    // Colección de prismas y nodos geométricos ambientales 3D
    this.ambientNodes = [];
    this.nodeCount = 48;

    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.onIdleStart = this.onIdleStart.bind(this);
    this.onIdleEnd = this.onIdleEnd.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
  }

  /**
   * Inicializa el adaptador sobre el elemento canvas asignado
   * @param {HTMLCanvasElement} canvas 
   */
  async init(canvas) {
    if (!canvas) {
      throw new Error('[CMR RendererAdapter] Canvas requerido no proporcionado.');
    }
    this.canvas = canvas;
    this.setQuality(this.qualityManager ? this.qualityManager.getTier() : 'high');

    // 1. Intentar WebGPU
    let initialized = false;
    if (navigator.gpu) {
      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (adapter) {
          const device = await adapter.requestDevice();
          const context = canvas.getContext('webgpu');
          if (context && device) {
            const format = navigator.gpu.getPreferredCanvasFormat();
            context.configure({
              device,
              format,
              alphaMode: 'premultiplied'
            });
            this.gpuDevice = device;
            this.gpuContext = context;
            this.backend = 'webgpu';
            initialized = true;
          }
        }
      } catch (err) {
        console.warn('[CMR RendererAdapter] WebGPU no pudo inicializarse, pasando a WebGL2:', err);
      }
    }

    // 2. Fallback a WebGL2
    if (!initialized) {
      try {
        const gl2 = canvas.getContext('webgl2', {
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          premultipliedAlpha: true
        });
        if (gl2) {
          this.gl = gl2;
          this.backend = 'webgl2';
          this.initWebGLPipelines(gl2);
          initialized = true;
        }
      } catch (err) {
        console.warn('[CMR RendererAdapter] WebGL2 no disponible:', err);
      }
    }

    // 3. Fallback a WebGL estándar
    if (!initialized) {
      try {
        const gl1 = canvas.getContext('webgl', {
          alpha: true,
          antialias: true,
          powerPreference: 'default'
        });
        if (gl1) {
          this.gl = gl1;
          this.backend = 'webgl';
          this.initWebGLPipelines(gl1);
          initialized = true;
        }
      } catch (err) {
        console.warn('[CMR RendererAdapter] WebGL no disponible:', err);
      }
    }

    // 4. Fallback final garantizado: Canvas 2D de alta precisión
    if (!initialized) {
      this.ctx2d = canvas.getContext('2d', { alpha: true });
      this.backend = 'canvas2d';
    }

    // Configurar dimensiones iniciales respetando DPR y Tier
    this.setSize(window.innerWidth, window.innerHeight, this.dpr);

    // Inicializar geometría y registrar la capa ambiental
    this.setupAmbientScene();

    // Suscribir eventos de sistema
    document.addEventListener('visibilitychange', this.onVisibilityChange, { passive: true });
    if (this.eventBus) {
      this.eventBus.on('idle:start', this.onIdleStart);
      this.eventBus.on('idle:end', this.onIdleEnd);
      this.eventBus.on('pointer:move', this.onPointerMove);
      this.eventBus.on('quality:change', (tier) => this.setQuality(tier));
    }

    console.info(
      `%c[CMR RendererAdapter] Backend 3D activo: ${this.backend.toUpperCase()} | DPR: ${this.dpr.toFixed(2)}`,
      'background: #11141a; color: #7dd3fc; padding: 3px 6px; border-left: 2px solid #0284c7; font-family: monospace;'
    );
  }

  /**
   * Configura las geometrías y micro-prismas de la capa ambiental
   */
  setupAmbientScene() {
    this.ambientNodes = [];
    const count = this.nodeCount;
    const spreadX = this.width * 1.2;
    const spreadY = this.height * 1.4;
    const depth = 600;

    for (let i = 0; i < count; i++) {
      this.ambientNodes.push({
        x: (Math.random() - 0.5) * spreadX,
        y: (Math.random() - 0.5) * spreadY,
        z: Math.random() * depth + 100,
        baseZ: Math.random() * depth + 100,
        size: Math.random() * 2.8 + 1.2,
        speedZ: (Math.random() * 0.15 + 0.05),
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 0.008,
        rotSpeedY: (Math.random() - 0.5) * 0.008,
        // Color armonizado: tonos grafito cálido y destellos oro sutil
        isGold: Math.random() > 0.82,
        alpha: Math.random() * 0.45 + 0.2
      });
    }

    // Registrar la escena ambiental en el SceneRegistry
    this.sceneRegistry.register('ambient', {
      update: (dt, t) => this.updateAmbientNodes(dt, t),
      render: () => this.renderAmbientLayer(),
      resize: (w, h, dpr) => {
        // Adaptar dispersión
      }
    });
  }

  /**
   * Inicializa shaders y buffers para el pipeline WebGL/WebGL2
   */
  initWebGLPipelines(gl) {
    // Vertex Shader para partículas volumétricas
    const vsSource = `#version 100
      attribute vec3 aPosition;
      attribute vec2 aParams; // x: size, y: alpha
      attribute vec3 aColor;

      uniform mat4 uProjection;
      uniform vec2 uCameraOffset;

      varying vec4 vColor;

      void main() {
        vec3 pos = aPosition;
        pos.xy += uCameraOffset * (pos.z * 0.0005);
        gl_Position = uProjection * vec4(pos, 1.0);
        gl_PointSize = aParams.x * (400.0 / pos.z);
        vColor = vec4(aColor, aParams.y);
      }
    `;

    // Fragment Shader para micro-prismas orgánicos y suaves
    const fsSource = `#version 100
      precision mediump float;
      varying vec4 vColor;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) {
          discard;
        }
        float edge = 1.0 - smoothstep(0.35, 0.5, dist);
        gl_FragColor = vec4(vColor.rgb, vColor.a * edge);
      }
    `;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('[CMR RendererAdapter] Fallo al compilar shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('[CMR RendererAdapter] Fallo al enlazar programa WebGL:', gl.getProgramInfoLog(program));
      return;
    }

    this.webglProgram = program;
    this.resourceManager.track(program, () => gl.deleteProgram(program));
    this.resourceManager.track(vs, () => gl.deleteShader(vs));
    this.resourceManager.track(fs, () => gl.deleteShader(fs));

    // Atributos y Uniformes
    this.glLocations = {
      aPosition: gl.getAttribLocation(program, 'aPosition'),
      aParams: gl.getAttribLocation(program, 'aParams'),
      aColor: gl.getAttribLocation(program, 'aColor'),
      uProjection: gl.getUniformLocation(program, 'uProjection'),
      uCameraOffset: gl.getUniformLocation(program, 'uCameraOffset')
    };

    this.glVBO = gl.createBuffer();
    this.resourceManager.track(this.glVBO, () => gl.deleteBuffer(this.glVBO));

    // Estado base WebGL
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
  }

  /**
   * Actualiza el posicionamiento y rotación de los nodos 3D
   */
  updateAmbientNodes(dt, t) {
    if (this.isPaused) return;

    // Suavizado de micro-parallax de cámara
    this.camera.x += (this.camera.targetX - this.camera.x) * 0.04;
    this.camera.y += (this.camera.targetY - this.camera.y) * 0.04;

    const halfW = this.width * 0.65;
    const halfH = this.height * 0.75;

    for (let i = 0; i < this.ambientNodes.length; i++) {
      const node = this.ambientNodes[i];
      // Avance sutil en eje z (hacia el espectador)
      node.z -= node.speedZ * dt * 0.06;
      if (node.z < 80) {
        node.z = 600;
        node.x = (Math.random() - 0.5) * this.width * 1.3;
        node.y = (Math.random() - 0.5) * this.height * 1.3;
      }

      // Rotación individual
      node.rotX += node.rotSpeedX;
      node.rotY += node.rotSpeedY;
    }
  }

  /**
   * Renderiza la capa ambiental en el backend activo
   */
  renderAmbientLayer() {
    if (this.isPaused || !this.canvas) return;

    if (this.backend === 'webgl2' || this.backend === 'webgl') {
      this.renderWebGL();
    } else if (this.backend === 'canvas2d') {
      this.renderCanvas2D();
    } else if (this.backend === 'webgpu') {
      // Pase sutil WebGPU o fallback inmediato a buffer 2D
      this.renderCanvas2D();
    }
  }

  /**
   * Pase de renderizado WebGL/WebGL2
   */
  renderWebGL() {
    const gl = this.gl;
    if (!gl || !this.webglProgram) return;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.webglProgram);

    // Matriz de proyección ortográfica/perspectiva básica
    const aspect = this.width / this.height;
    const near = 50;
    const far = 1000;
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const f = 1.0 / Math.tan(fovRad / 2);

    const projMatrix = new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) / (near - far), -1,
      0, 0, (2 * far * near) / (near - far), 0
    ]);

    gl.uniformMatrix4fv(this.glLocations.uProjection, false, projMatrix);
    gl.uniform2f(this.glLocations.uCameraOffset, this.camera.x, this.camera.y);

    // Empaquetar datos de vértices: [x, y, z, size, alpha, r, g, b]
    const stride = 8;
    const vertexData = new Float32Array(this.ambientNodes.length * stride);

    for (let i = 0; i < this.ambientNodes.length; i++) {
      const node = this.ambientNodes[i];
      const offset = i * stride;

      // Normalizar coordenadas relativas al centro
      vertexData[offset + 0] = node.x;
      vertexData[offset + 1] = node.y;
      vertexData[offset + 2] = node.z;
      vertexData[offset + 3] = node.size * this.dpr;
      vertexData[offset + 4] = node.alpha;

      if (node.isGold) {
        // Oro CMR (#d4a343 -> 0.83, 0.64, 0.26)
        vertexData[offset + 5] = 0.83;
        vertexData[offset + 6] = 0.64;
        vertexData[offset + 7] = 0.26;
      } else {
        // Grafito perla (#717b8a -> 0.44, 0.48, 0.54)
        vertexData[offset + 5] = 0.44;
        vertexData[offset + 6] = 0.48;
        vertexData[offset + 7] = 0.54;
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.glVBO);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.DYNAMIC_DRAW);

    const bpe = Float32Array.BYTES_PER_ELEMENT;
    gl.enableVertexAttribArray(this.glLocations.aPosition);
    gl.vertexAttribPointer(this.glLocations.aPosition, 3, gl.FLOAT, false, stride * bpe, 0);

    gl.enableVertexAttribArray(this.glLocations.aParams);
    gl.vertexAttribPointer(this.glLocations.aParams, 2, gl.FLOAT, false, stride * bpe, 3 * bpe);

    gl.enableVertexAttribArray(this.glLocations.aColor);
    gl.vertexAttribPointer(this.glLocations.aColor, 3, gl.FLOAT, false, stride * bpe, 5 * bpe);

    gl.drawArrays(gl.POINTS, 0, this.ambientNodes.length);
  }

  /**
   * Pase de renderizado Canvas 2D con proyección de perspectiva 3D canónica
   */
  renderCanvas2D() {
    const ctx = this.ctx2d;
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const focalLength = 400;

    for (let i = 0; i < this.ambientNodes.length; i++) {
      const node = this.ambientNodes[i];
      const scale = focalLength / (node.z || 1);
      const projX = cx + (node.x + this.camera.x * (node.z * 0.0003)) * scale;
      const projY = cy + (node.y + this.camera.y * (node.z * 0.0003)) * scale;
      const radius = Math.max(0.6, node.size * scale);

      if (projX < -20 || projX > this.canvas.width + 20 || projY < -20 || projY > this.canvas.height + 20) {
        continue;
      }

      ctx.beginPath();
      ctx.arc(projX, projY, radius, 0, Math.PI * 2);

      if (node.isGold) {
        ctx.fillStyle = `rgba(212, 163, 67, ${node.alpha * 0.85})`;
      } else {
        ctx.fillStyle = `rgba(160, 175, 195, ${node.alpha * 0.6})`;
      }
      ctx.fill();
    }
  }

  /**
   * Ajusta el tamaño de la superficie respetando el límite de DPR del Tier
   */
  setSize(w, h, dpr = this.dpr) {
    this.width = w;
    this.height = h;
    this.dpr = dpr;

    if (this.canvas) {
      this.canvas.width = Math.floor(w * dpr);
      this.canvas.height = Math.floor(h * dpr);
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;
    }

    this.sceneRegistry.resizeAll(w, h, dpr);
  }

  /**
   * Bucle de renderizado invocado por el reloj central de CMREngine
   * @param {number} dt 
   */
  render(dt, t = performance.now()) {
    if (this.isPaused || this.isDestroyed) return;

    // Actualizar zonas en el SceneRegistry
    this.sceneRegistry.updateAll(dt, t);

    // Ejecutar render de zonas
    this.sceneRegistry.renderAll(this, this.gl || this.ctx2d);
  }

  /**
   * Ajusta la fidelidad gráfica y DPR según el QualityTier activo
   * @param {string} tier 
   */
  setQuality(tier) {
    const rawDpr = window.devicePixelRatio || 1;
    let clampedDpr = 1;

    switch (tier) {
      case 'ultra':
        clampedDpr = Math.min(rawDpr, 2.0);
        this.nodeCount = 64;
        break;
      case 'high':
        clampedDpr = Math.min(rawDpr, 1.75);
        this.nodeCount = 48;
        break;
      case 'medium':
        clampedDpr = Math.min(rawDpr, 1.5);
        this.nodeCount = 32;
        break;
      case 'low':
      case 'safe':
      default:
        clampedDpr = Math.min(rawDpr, 1.0);
        this.nodeCount = 16;
        break;
    }

    this.dpr = clampedDpr;
    if (this.canvas) {
      this.setSize(window.innerWidth, window.innerHeight, this.dpr);
    }
  }

  /**
   * Responde al movimiento del puntero con micro-parallax
   */
  onPointerMove(data) {
    if (this.isPaused || !data) return;
    // Micro-desplazamiento sutil: máximo 35px para evitar cualquier distracción
    this.camera.targetX = (data.normX || 0) * 35;
    this.camera.targetY = (data.normY || 0) * 25;
  }

  onVisibilityChange() {
    this.isPaused = document.hidden;
  }

  onIdleStart() {
    this.isPaused = true;
  }

  onIdleEnd() {
    this.isPaused = false;
  }

  /**
   * Destruye el adaptador y libera todos los recursos de GPU asociados
   */
  destroy() {
    this.isDestroyed = true;
    this.isPaused = true;

    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.sceneRegistry.disposeAll();
    this.resourceManager.disposeAll();

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    this.gl = null;
    this.ctx2d = null;
    this.gpuDevice = null;
    this.gpuContext = null;
  }
}

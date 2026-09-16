/**
 * Creative Maximum Reasoning (CMR) — Preview Data
 * Contenido canónico desacoplado para las vistas previas de aplicaciones
 * Obras y universos narrativos de Jonathan Gabriel Nieto (S9U)
 */

export const CMR_WRITER_PREVIEW_DATA = {
  version: 'v0.9.4',
  status: 'En Desarrollo // Prueba Cerrada',
  title: 'CMR Writer Lite',
  subtitle: 'Editor de narrativa por capítulos con sistema de personajes y notas cronológicas, creado por Jonathan Gabriel Nieto.',
  appUrl: 'apps/cmr-writer-lite/',
  tabs: [
    {
      id: 'editor',
      label: '01 // Editor',
      excerpt: '«El silencio del Noveno Universo no era ausencia de sonido, sino el peso de una memoria que todavía nadie se había atrevido a escribir...»',
      chapter: 'Capítulo VII // El Faro de Ceniza',
      words: '2.450 palabras'
    },
    {
      id: 'characters',
      label: '02 // Personajes',
      initials: 'AK',
      name: 'Arakiel de la Niebla',
      role: 'Guardián del Umbral // Seres del Noveno Universo',
      appearances: 'Apariciones: Cap. I, IV, VII',
      archetype: 'Arquetipo: Ermitaño'
    },
    {
      id: 'timeline',
      label: '03 // Cronología',
      events: [
        { year: 'Año 412', desc: 'La fractura del velo astral y la caída de los primeros fragmentos.' },
        { year: 'Año 430', desc: 'Fundación de los Bastiones de Piedra en la cordillera austral.' }
      ],
      scope: 'Línea temporal principal',
      universe: 'S9U Canon'
    }
  ]
};

export const CMR_PING_PREVIEW_DATA = {
  version: 'v1.0.0',
  status: 'Release 1.0.0 // Android & PC',
  title: 'CMR Ping Booster',
  subtitle: 'Suite local de diagnóstico de latencia, resolución DNS optimizada y telemetría de red de autor.',
  appUrl: 'apps/cmr-ping-booster/',
  tabs: [
    {
      id: 'diagnostic',
      label: '01 // Diagnóstico',
      excerpt: 'Monitoreo ICMP en tiempo real sin túneles externos ni VPNs intermedias.',
      metrics: [
        { label: 'Latencia Promedio', value: '18 ms', state: 'optimal' },
        { label: 'Jitter de Tráfico', value: '1.2 ms', state: 'optimal' },
        { label: 'Pérdida de Paquetes', value: '0.00 %', state: 'perfect' }
      ]
    },
    {
      id: 'dns',
      label: '02 // Servidores DNS',
      excerpt: 'Resolución benchmark local hacia los principales resolvers públicos seguros.',
      servers: [
        { name: 'Cloudflare DNS', ip: '1.1.1.1', time: '9 ms' },
        { name: 'Google Public DNS', ip: '8.8.8.8', time: '14 ms' },
        { name: 'Quad9 Secure', ip: '9.9.9.9', time: '18 ms' }
      ]
    },
    {
      id: 'profiles',
      label: '03 // Perfiles',
      excerpt: 'Ajuste de sockets y priorización de paquetes adaptado al caso de uso.',
      profilesList: [
        'Modo Gaming Competitivo (Buffer mínimo)',
        'Modo Transmisión de Voz & Streaming',
        'Modo Ahorro de Recursos (Bajo consumo)'
      ]
    }
  ]
};

export const S9U_CODEX_DATA = {
  title: 'Seres del Noveno Universo (S9U)',
  subtitle: 'Cosmología, crónicas y arquitectura mitológica de autor creada por Jonathan Gabriel Nieto.',
  author: 'Jonathan Gabriel Nieto',
  region: 'Neuquén, Patagonia Argentina',
  badge: 'Códice Canónico de Autor',
  sections: [
    {
      id: 'cosmology',
      title: '01 // La Urdimbre del Noveno Universo',
      text: 'El Noveno Universo no se expande hacia afuera en un vacío inerte, sino hacia adentro de la memoria viva. Los Nueve Bastiones de Piedra sostienen la urdimbre de las realidades olvidadas tras la Gran Fragmentación Astral. Cada plano respira a través de sus cronistas.'
    },
    {
      id: 'arakiel',
      title: '02 // Las Crónicas de Arakiel',
      text: '«No temas al silencio de la estepa ni a la noche austral; teme al eco de las historias que pudiste haber concebido y elegiste callar. Toda palabra escrita es una muralla contra el olvido.»',
      cite: '— Fragmento de los Cuadernos de Arakiel, Códice de la Ceniza'
    },
    {
      id: 'kintsugi',
      title: '03 // Arquitectura Mineral & Kintsugi',
      text: 'En el canon de S9U, la fractura de la piedra jamás se oculta ni se maquilla: se sella con filamentos de oro estelar (Kintsugi metafísico). La herida cicatrizada se transforma deliberadamente en la porción más sólida y lúcida de toda la estructura narrativa.'
    },
    {
      id: 'links',
      title: '04 // Ecosistema y Publicación',
      text: 'El universo literario se encuentra en proceso de edición y transcodificación activa hacia formatos interactivos, e-books y herramientas complementarias como CMR Writer Lite.'
    }
  ]
};

export const CMR_REASONING_DATA = {
  version: 'v0.1.0-alpha',
  status: 'En Laboratorio // I+D',
  title: 'CMR Reasoning Engine',
  subtitle: 'Mecanismos de asistencia cognitiva, memoria adaptativa y orquestación contextual para creadores y escritores independientes.',
  appUrl: '#apps',
  tabs: [
    {
      id: 'architecture',
      label: '01 // Arquitectura',
      excerpt: 'Motor contextual local diseñado para asistir la creación de mundos extensos sin interferir en el estilo.',
      pillars: [
        'Mapeo de grafos de continuidad narrativa',
        'Indexación semántica local en SQLite / WASM',
        'Consistencia de personajes en sagas'
      ]
    },
    {
      id: 'modules',
      label: '02 // Módulos',
      excerpt: 'Capas de inferencia desacopladas que operan sin telemetría ni llamadas a servicios en la nube.',
      modulesList: [
        { name: 'Memory Weaver', desc: 'Recuperación precisa de eventos y cronologías' },
        { name: 'Tone Guardian', desc: 'Monitoreo de voz, ritmo y consistencia autoral' }
      ]
    },
    {
      id: 'privacy',
      label: '03 // Privacidad',
      excerpt: 'Filosofía de custodia de datos y propiedad intelectual inviolable.',
      privacyList: [
        '100% Procesamiento local y confidencial',
        'Cero telemetría de manuscritos o notas',
        'Interoperabilidad abierta con CMR Writer Lite'
      ]
    }
  ]
};


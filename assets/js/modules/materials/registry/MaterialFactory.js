/**
 * Creative Maximum Reasoning (CMR) — Material Factory & Registry
 * Factoría completa de los 10 materiales vivos de autor
 * doc/CMR_Web_System_v2_Documentation/docs/06_MATERIAL_SYSTEM.md
 */

import { RootsMaterial } from '../implementations/RootsMaterial.js';
import { StoneMaterial } from '../implementations/StoneMaterial.js';
import { ArcaneMaterial } from '../implementations/ArcaneMaterial.js';
import { FrostMaterial } from '../implementations/FrostMaterial.js';
import { MechanismMaterial } from '../implementations/MechanismMaterial.js';
import { FabricMaterial } from '../implementations/FabricMaterial.js';
import { GlassMaterial } from '../implementations/GlassMaterial.js';
import { MagneticDustMaterial } from '../implementations/MagneticDustMaterial.js';
import { LiquidMetalMaterial } from '../implementations/LiquidMetalMaterial.js';
import { InkMaterial } from '../implementations/InkMaterial.js';

export class MaterialFactory {
  static create(materialType) {
    switch (materialType?.toLowerCase()) {
      case 'roots':
        return new RootsMaterial();
      case 'stone':
        return new StoneMaterial();
      case 'arcane':
        return new ArcaneMaterial();
      case 'frost':
      case 'crystal':
        return new FrostMaterial();
      case 'mechanism':
        return new MechanismMaterial();
      case 'fabric':
        return new FabricMaterial();
      case 'glass':
      case 'dark-glass':
        return new GlassMaterial();
      case 'magnetic-dust':
      case 'magnetic':
        return new MagneticDustMaterial();
      case 'liquid-metal':
      case 'liquid':
        return new LiquidMetalMaterial();
      case 'ink':
        return new InkMaterial();
      default:
        return new RootsMaterial();
    }
  }
}

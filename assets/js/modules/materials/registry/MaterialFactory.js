/**
 * Creative Maximum Reasoning (CMR) — Material Factory & Registry
 * Factoría extensible de materiales para marcos vivos
 * doc/CMR_Web_System_v2_Documentation/docs/06_MATERIAL_SYSTEM.md
 */

import { RootsMaterial } from '../implementations/RootsMaterial.js';
import { StoneMaterial } from '../implementations/StoneMaterial.js';
import { ArcaneMaterial } from '../implementations/ArcaneMaterial.js';
import { FrostMaterial } from '../implementations/FrostMaterial.js';
import { MechanismMaterial } from '../implementations/MechanismMaterial.js';

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
      default:
        return new RootsMaterial();
    }
  }
}

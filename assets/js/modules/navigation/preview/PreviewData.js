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
  appUrl: 'apps/cmr-writer-lite.html',
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

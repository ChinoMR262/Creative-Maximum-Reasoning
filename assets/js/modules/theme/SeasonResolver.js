/**
 * Creative Maximum Reasoning (CMR) — Season Resolver
 * Resolución estacional astronómica/calendario sin geolocalización invasiva
 * Por defecto configurado para Hemisferio Sur (CMR Argentina)
 * doc/CMR_Web_System_v2_Documentation/docs/12_SEASONAL_ENGINE.md
 */

export class SeasonResolver {
  /**
   * Resuelve la estación en base a fecha y hemisferio.
   * @param {Date} date - Fecha a evaluar
   * @param {'south'|'north'} hemisphere - Hemisferio (default: south)
   * @returns {'spring'|'summer'|'autumn'|'winter'}
   */
  static resolve(date = new Date(), hemisphere = 'south') {
    const month = date.getMonth(); // 0 a 11
    const day = date.getDate();

    // Días aproximados de solsticios y equinoccios
    // 21 Marzo (día 80 approx), 21 Junio (172 approx), 21 Septiembre (264 approx), 21 Diciembre (355 approx)
    const monthDay = (month + 1) * 100 + day;

    let northSeason = 'winter';

    if (monthDay >= 321 && monthDay < 621) {
      northSeason = 'spring';
    } else if (monthDay >= 621 && monthDay < 921) {
      northSeason = 'summer';
    } else if (monthDay >= 921 && monthDay < 1221) {
      northSeason = 'autumn';
    } else {
      northSeason = 'winter';
    }

    if (hemisphere === 'north') {
      return northSeason;
    }

    // Inversión para el Hemisferio Sur (Argentina)
    const opposite = {
      summer: 'winter',
      winter: 'summer',
      spring: 'autumn',
      autumn: 'spring'
    };

    return opposite[northSeason];
  }
}

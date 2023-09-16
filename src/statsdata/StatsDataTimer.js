import StaticData from '../staticdata/StaticData.js'

/**
 * The StatsDataTimer class calculates the last time stats should have been loaded.
 * @class
 */
export default class StatsDataTimer {
  /**
   * Calculates the last time stats should have been loaded.
   * @returns {object} - The last time stats should have been loaded
   * @public
   * @static
   */
  static calculate() {
    // current time
    const currentTime = new Date()
    // current hours
    const currentHours = currentTime.getHours()
    // last interval time (0, 6, 12, 18) with delay to a time object
    const lastIntervalHours = currentHours - (currentHours % StaticData.UPDATE_INTERVAL)
    const lastIntervalTime  = new Date()
    lastIntervalTime.setHours(lastIntervalHours, StaticData.UPDATE_INTERVAL_DELAY, 0, 0)

    return lastIntervalTime
  }
}

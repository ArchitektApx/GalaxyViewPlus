import Mindash          from '../mindash/Mindash.js'
import StaticData       from '../staticdata/StaticData.js'
import StorageInterface from '../storageinterface/StorageInterface.js'
import StatsDataTimer   from './StatsDataTimer.js'

/**
 * The StatsDataLoader class loads the stats data from storage if it is valid.
 * @class
 */
export default class StatsDataLoader {
  static STATUS_FINISHED    = 'finished'
  static STATUS_IN_PROGRESS = 'inProgress'

  /**
   * Loads the stats data from storage if it is valid.
   * @param   {boolean}       ingorestatus - ingorestatus - If true, the status is ignored
   * @returns {object | void}              - The stats data or void if the stats data is not valid
   * @public
   * @static
   */
  static fromStorage(ingorestatus = false) {
    const status    = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.UPDATE_STATUS)
    const statsData = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.STATS_DATA)

    const isValid = ingorestatus
      ? StatsDataLoader.isDataValid(statsData)
      : StatsDataLoader.isDataValidWithTimestamp(status, statsData)

    return isValid ? statsData : undefined
  }

  /**
   * Loads the stats data from storage if it is valid
   * without timestamp checks (fallback for failed fetch)
   * @param   {object}        statsData - The status object
   * @returns {object | void}           - The stats data or void if the stats data is not valid
   * @public
   * @static
   */
  static isDataValid(statsData) {
    return !Mindash.isEmptyObject(statsData || {})
  }

  /**
   * checks if the stats data is valid and has been loaded in the current interval
   * @param   {object}  status    - The status object
   * @param   {object}  statsData - The stats data object
   * @returns {boolean}           - True if the stats data is valid
   * @private
   * @static
   */
  static isDataValidWithTimestamp(status, statsData) {
    return (
      StatsDataLoader.isDataValid(statsData)
      && (status?.status === StatsDataLoader.STATUS_FINISHED)
      && (status?.timestamp > StatsDataTimer.calculate())
    )
  }
}

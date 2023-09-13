import LogLevel         from '../enum/LogLevel.js'
import Mindash          from '../mindash/Mindash.js'
import StaticData       from '../staticdata/StaticData.js'
import StorageInterface from '../storageinterface/StorageInterface.js'
import Validator        from '../validator/Validator.js'

/**
 * Parse the result of the StatsDataFetcher, save it to storage and return it as an object
 * @class
 */
export default class StatsDataParser {
  static STATUS_FINISHED    = 'finished'
  static STATUS_IN_PROGRESS = 'inProgress'
  static #logName           = 'StatsDataParser'

  /**
   * extracts the stats data
   * @param   {object} statsObject - The stats object
   * @returns {object}             - The parsed stats data
   * @private
   */
  static extractFromStatsObject(statsObject) {
    const preupdateStatus = {
      status    : StatsDataParser.STATUS_IN_PROGRESS,
      timestamp : Validator.getTimestamp(),
    }

    StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.UPDATE_STATUS, preupdateStatus)
    StatsDataParser.log('Parsing StatsData', LogLevel.DEBUG)

    const result = Mindash.pickFromArray(
      statsObject,
      'playerId',
      [
        'allianceId',
        'allianceName',
        'buildingRank',
        'defensiveRank',
        'fleetRank',
        'playerName',
        'rank',
        'researchRank',
      ]
    )
    StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.STATS_DATA, result)

    const postupdateStatus = {
      status    : StatsDataParser.STATUS_FINISHED,
      timestamp : Validator.getTimestamp(),
    }
    StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.UPDATE_STATUS, postupdateStatus)

    StatsDataParser.log('StatsData was parsed and written to storage', LogLevel.DEBUG)

    return result
  }

  /**
   * Wrapper for StorageInterface.writeLog
   * @param  {string}   message - The message to log
   * @param  {LogLevel} level   - The log level
   * @param  {error}    error   - The error to log
   * @public
   * @static
   */
  static log(message, level = LogLevel.INFO, error = '') {
    StorageInterface.writeLog(message, level, StatsDataParser.#logName, error)
  }

  /**
   * processes the stats data by extracting it from the response object
   * @param   {object} response - The response object
   * @returns {object}          - The parsed statsdata object
   * @public
   * @static
   */
  static processStatsData(response) {
    const statsObject = JSON.parse(response.responseText)

    StatsDataParser.log('Starting StatsData parsing', LogLevel.DEBUG)
    return StatsDataParser.extractFromStatsObject(statsObject)
  }
}

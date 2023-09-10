import LogLevel         from '../enum/LogLevel.js'
import Mindash          from '../mindash/Mindash.js'
import StaticData       from '../staticdata/StaticData.js'
import StorageInterface from '../storageinterface/StorageInterface.js'
import Validator        from '../validator/Validator.js'
import StatsDataFetcher from './StatsDataFetcher.js'

/**
 * The StatisticsInterface is a singleton class that manages the stats data.
 * It loads the stats data from storage or fetches it from the server.
 * It provides methods to access the stats data.
 * @class
 */
export default class StatisticsInterface {
  static STATUS_FINISHED    = 'finished'
  static STATUS_IN_PROGRESS = 'inProgress'
  static #instance
  static #logName = 'StatisticsInterface'
  statsAvailable = false
  statsData

  /**
   * Creates a new StatisticsInterface instance if none exists.
   * Else it returns the existing instance (singleton).
   * executes async fetching of stats data
   * @class
   * @returns {StatisticsInterface} - The StatisticsInterface instance
   * @async
   */
  constructor() {
    if (StatisticsInterface.#instance) {
      return StatisticsInterface.#instance
    }

    StatisticsInterface.#instance = this
  }

  // public methods
  /**
   * returns a player id that matches the player name
   * @param {string} playerName - The name of the player
   * @returns {number} - The player id
   * @public
   */
  getPlayerIDByName(playerName) {
    return Object.keys(this.statsData).find(key => this.statsData[key].playerName === playerName)
  }

  /**
   * returns a player name that matches the player id
   * @param {number} playerId - The id of the player
   * @returns {string} - The player name
   * @public
   */
  getPlayerNameById(playerId) {
    return this.statsData[playerId].playerName
  }

  /**
   * returns the rank of a player for a specific rank type
   * @param {number} playerId - The id of the player
   * @param {string} rankType - The type of the rank
   * @returns {number} - The rank of the player
   * @public
   */
  getPlayerRank(playerId, rankType = 'rank') {
    return this.statsData[playerId][rankType]
  }

  /**
   * returns the rank data (all ranks) of a player
   * @param {number} playerId - The id of the player
   * @returns {object} - The rank data of the player
   * @public
   */
  getPlayerRankData(playerId) {
    return this.statsData[playerId]
  }

  /**
   * async initializer started by the constructor
   * @returns {void}
   * @async
   * @public
   */
  async initialize() {
    await this.#checkDataStatus()
  }

  // private methods
  /**
   * checks if the stats data is valid and loads it from storage if it is
   * else it fetches the stats data from the server
   * @returns {void}
   * @async
   * @private
   */
  async #checkDataStatus() {
    const status    = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.UPDATE_STATUS)
    const statsData = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.STATS_DATA)

    if (
      !Mindash.isEmptyObject(statsData)
      && !Mindash.isEmptyObject(status)
      && StatisticsInterface.#isDataValid(status)
    ) {
      this.statsData      = statsData
      this.statsAvailable = true
      StatisticsInterface.log('StatsData successfully loaded from storage', LogLevel.DEBUG)
    } else {
      StatisticsInterface.log('StatsData will be refreshed', LogLevel.DEBUG)
      await this.#fetchAndProcessStats()
    }
  }

  /**
   * extracts the stats data from the stats object and writes it to storage
   * @param {object} statsObject - The stats object
   * @returns {void}
   * @private
   */
  #extractFromStatsObject(statsObject) {
    const updateStatus = {
      status    : StatisticsInterface.STATUS_IN_PROGRESS,
      timestamp : Validator.getTimestamp(),
    }

    StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.UPDATE_STATUS, updateStatus)
    StatisticsInterface.log('Parsing StatsData', LogLevel.DEBUG)

    const result = {}

    statsObject.forEach(
      ({
        playerId,
        playerName,
        allianceId,
        allianceName,
        rank,
        researchRank,
        buildingRank,
        fleetRank,
        defensiveRank,
      }) => {
        result[playerId] = ({
          allianceId,
          allianceName,
          buildingRank,
          defensiveRank,
          fleetRank,
          playerName,
          rank,
          researchRank,
        })
      }
    )

    StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.STATS_DATA, result)
    this.statsData      = result
    this.statsAvailable = true

    updateStatus.status    = StatisticsInterface.STATUS_FINISHED
    updateStatus.timestamp = Validator.getTimestamp()
    StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.UPDATE_STATUS, updateStatus)
    StatisticsInterface.log('StatsData was parsed and written to storage', LogLevel.DEBUG)
  }

  /**
   * fetches the stats data from the server and processes it by using the StatsDataFetcher class
   * @returns {void}
   * @async
   * @private
   * @see StatsDataFetcher
   */
  async #fetchAndProcessStats() {
    try {
      const result = await StatsDataFetcher.fetchStatsJson()

      if (result.status === 200) {
        this.#processStatsData(result)
      } else {
        this.#handleErrorInFetching(result)
      }
    } catch (error) {
      this.#handleErrorInFetching(error)
    }
  }

  /**
   * handles errors that occur while fetching the stats data
   * @param {object} response - The response object
   * @returns {void}
   * @private
   */
  #handleErrorInFetching(response) {
    StatisticsInterface.log('Error while downloading StatsData:', LogLevel.WARN)
    StatisticsInterface.log('Response was:', LogLevel.WARN, response)

    const statsData = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.STATS_DATA) || {}

    if (Object.keys(statsData).length === 0) {
      StatisticsInterface.log('No old StatsData found in storage', LogLevel.DEBUG)

      return
    }

    StatisticsInterface.log('Old StatsData found in storage', LogLevel.DEBUG)
    this.statsData      = statsData
    this.statsAvailable = true
  }

  /**
   * processes the stats data by extracting it from the response object
   * @param {object} response - The response object
   * @returns {void}
   * @private
   */
  #processStatsData(response) {
    StatisticsInterface.log('StatsData was successfully downloaded', LogLevel.DEBUG)

    const statsObject = JSON.parse(response.responseText)

    StatisticsInterface.log('Starting StatsData parsing', LogLevel.DEBUG)
    this.#extractFromStatsObject(statsObject)
  }

  // this method is only used for tests to reset the singleton instance
  /**
   * Resets the singleton instance.
   * this method must only be used during jest tests to reset the singleton instance
   * @private
   */
  // eslint-disable-next-line no-underscore-dangle
  static _resetInstance() {
    StatisticsInterface.#instance = undefined
  }

  /**
   * Wrapper for StorageInterface.writeLog
   * @public
   * @param {string} message - The message to log
   * @param {LogLevel} level - The log level
   * @param {error} error    - The error to log
   */
  static log(message, level = LogLevel.INFO, error = '') {
    StorageInterface.writeLog(message, level, StatisticsInterface.#logName, error)
  }

  // static private methods
  /**
   * checks if the stats data is valid
   * @param {object} status - The status object
   * @returns {boolean} - True if the stats data is valid
   * @private
   */
  static #isDataValid(status) {
    // current time
    const currentTime = new Date()
    // current hours
    const currentHours = currentTime.getHours()

    // last interval time (0, 6, 12, 18) with delay to a time object
    const lastIntervalHours = currentHours - (currentHours % StaticData.UPDATE_INTERVAL)
    const lastIntervalTime  = new Date()

    lastIntervalTime.setHours(lastIntervalHours, StaticData.UPDATE_INTERVAL_DELAY, 0, 0)

    return (
      (status.status === StatisticsInterface.STATUS_FINISHED)
      && (status.timestamp > lastIntervalTime)
    )
  }
}

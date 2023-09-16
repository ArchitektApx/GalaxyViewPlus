import LogLevel         from '../enum/LogLevel.js'
import StorageInterface from '../storageinterface/StorageInterface.js'
import StatsDataFetcher from './StatsDataFetcher.js'
import StatsDataLoader  from './StatsDataLoader.js'
import StatsDataParser  from './StatsDataParser.js'

/**
 * The StatsDataInterface is a singleton class that manages the stats data.
 * It loads the stats data from storage or fetches it from the server.
 * It provides methods to access the stats data.
 * @class
 */
export default class StatsDataInterface {
  static STATUS_FINISHED    = 'finished'
  static STATUS_IN_PROGRESS = 'inProgress'
  statsAvailable            = false
  statsData
  static #instance
  static #logName           = 'StatsDataInterface'

  /**
   * Creates a new StatsDataInterface instance if none exists.
   * Else it returns the existing instance (singleton).
   * executes async fetching of stats data
   * @returns {StatsDataInterface} - The StatsDataInterface instance
   * @class
   */
  constructor() {
    if (StatsDataInterface.#instance) {
      return StatsDataInterface.#instance
    }

    StatsDataInterface.#instance = this
  }

  // public methods
  /**
   * returns a player id that matches the player name
   * @param   {string} playerName - The name of the player
   * @returns {number}            - The player id
   * @public
   */
  getPlayerIDByName(playerName) {
    return Object.keys(this.statsData).find(key => this.statsData[key].playerName === playerName)
  }

  /**
   * returns a player name that matches the player id
   * @param   {number} playerId - The id of the player
   * @returns {string}          - The player name
   * @public
   */
  getPlayerNameById(playerId) {
    return this.statsData[playerId].playerName
  }

  /**
   * returns the rank of a player for a specific rank type
   * @param   {number} playerId - The id of the player
   * @param   {string} rankType - The type of the rank
   * @returns {number}          - The rank of the player
   * @public
   */
  getPlayerRank(playerId, rankType = 'rank') {
    return this.statsData[playerId][rankType]
  }

  /**
   * returns the rank data (all ranks) of a player
   * @param   {number} playerId - The id of the player
   * @returns {object}          - The rank data of the player
   * @public
   */
  getPlayerRankData(playerId) {
    return this.statsData[playerId]
  }

  /**
   * async initializer
   * @returns {void|Promise} - The promise that resolves with the stats data
   * @async
   * @public
   */
  async initialize() {
    await this.#loadStatsData()
  }

  /**
   * fetches the stats data from the server and processes it by using the StatsDataFetcher class
   * @returns {void|Promise}    - The promise that resolves with the stats data
   * @async
   * @private
   * @see     StatsDataFetcher
   */
  async #fetchAndProcessStats() {
    try {
      const result = await StatsDataFetcher.fetchStatsJson()

      if (result.status === 200) {
        StatsDataInterface.log('StatsData was successfully downloaded', LogLevel.DEBUG)
        this.statsData      = StatsDataParser.processStatsData(result)
        this.statsAvailable = true
      } else {
        this.#handleErrorInFetching(result)
      }
    } catch (error) {
      this.#handleErrorInFetching(error)
    }
  }

  /**
   * handles errors that occur while fetching the stats data
   * @param   {object} response - The response object
   * @returns {void}
   * @private
   */
  #handleErrorInFetching(response) {
    StatsDataInterface.log('Error while downloading StatsData:', LogLevel.WARN)
    StatsDataInterface.log('Response was:', LogLevel.WARN, response)

    StatsDataInterface.log('Try using old StatsData as fallback if available', LogLevel.DEBUG)
    const statsData     = StatsDataLoader.fromStorage(true)
    this.statsData      = statsData
    this.statsAvailable = true
  }

  /**
   * checks if the stats data is valid and loads it from storage if it is
   * else it fetches the stats data from the server
   * @returns {void|Promise} - The promise that resolves with the stats data
   * @async
   * @private
   */
  async #loadStatsData() {
    const statsData = StatsDataLoader.fromStorage()

    if (statsData) {
      this.statsData      = statsData
      this.statsAvailable = true
      StatsDataInterface.log('StatsData successfully loaded from storage', LogLevel.DEBUG)
      return
    }

    StatsDataInterface.log('StatsData will be refreshed', LogLevel.DEBUG)
    await this.#fetchAndProcessStats()
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
    StorageInterface.writeLog(message, level, StatsDataInterface.#logName, error)
  }

  /**
   * Resets the singleton instance.
   * this method must only be used during jest tests to reset the singleton instance
   * @static
   * @private
   */
  // eslint-disable-next-line no-underscore-dangle
  static _resetInstance() {
    StatsDataInterface.#instance = undefined
  }
}

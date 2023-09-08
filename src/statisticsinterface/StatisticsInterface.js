import LogLevel         from '../enum/LogLevel.js'
import StaticData       from '../staticdata/StaticData.js'
import StorageInterface from '../storageinterface/StorageInterface.js'
import Validator        from '../validator/Validator.js'
import StatsDataFetcher from './StatsDataFetcher.js'

export default class StatisticsInterface {
  static STATUS_FINISHED    = 'finished'
  static STATUS_IN_PROGRESS = 'inProgress'
  static #instance
  static #logName = 'StatisticsInterface'
  statsAvailable = false
  statsData

  // Gets the rank json from https://pr0game.com/stats_Universe_2on
  // and parses it to a usable format
  // also handles storage of the data
  constructor() {
    if (StatisticsInterface.#instance) {
      return StatisticsInterface.#instance
    }

    StatisticsInterface.#instance = this
  }

  // public methods
  getPlayerIDByName(playerName) {
    return Object.keys(this.statsData).find(key => this.statsData[key].playerName === playerName)
  }

  getPlayerNameById(playerId) {
    return this.statsData[playerId].playerName
  }

  getPlayerRank(playerId, rankType = 'rank') {
    return this.statsData[playerId][rankType]
  }

  getPlayerRankData(playerId) {
    return this.statsData[playerId]
  }

  async initialize() {
    await this.#checkDataStatus()
  }

  // private methods
  async #checkDataStatus() {
    const status    = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.UPDATE_STATUS)
    const statsData = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.STATS_DATA)

    if (
      Object.keys(statsData).length > 0
      && Object.keys(status).length > 0
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

  #processStatsData(response) {
    StatisticsInterface.log('StatsData was successfully downloaded', LogLevel.DEBUG)

    const statsObject = JSON.parse(response.responseText)

    StatisticsInterface.log('Starting StatsData parsing', LogLevel.DEBUG)
    this.#extractFromStatsObject(statsObject)
  }

  // this method is only used for tests to reset the singleton instance
  // eslint-disable-next-line no-underscore-dangle
  static _resetInstance() {
    StatisticsInterface.#instance = undefined
  }

  static log(message, level = LogLevel.INFO, error = '') {
    StorageInterface.writeLog(message, level, StatisticsInterface.#logName, error)
  }

  // static private methods
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

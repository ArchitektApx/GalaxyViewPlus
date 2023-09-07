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
      StatisticsInterface.#log('StatsData successfully loaded from storage', 'debug')
    } else {
      StatisticsInterface.#log('StatsData will be refreshed', 'debug')
      await this.#fetchAndProcessStats()
    }
  }

  #extractFromStatsObject(statsObject) {
    const updateStatus = {
      timestamp : Validator.getTimestamp(),
      status    : StatisticsInterface.STATUS_IN_PROGRESS,
    }

    StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.UPDATE_STATUS, updateStatus)
    StatisticsInterface.#log('Parsing StatsData', 'debug')

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
          playerName,
          allianceId,
          allianceName,
          rank,
          researchRank,
          buildingRank,
          fleetRank,
          defensiveRank,
        })
      }
    )

    StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.STATS_DATA, result)
    this.statsData      = result
    this.statsAvailable = true

    updateStatus.status    = StatisticsInterface.STATUS_FINISHED
    updateStatus.timestamp = Validator.getTimestamp()
    StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.UPDATE_STATUS, updateStatus)
    StatisticsInterface.#log('StatsData was parsed and written to storage', 'debug')
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
    StatisticsInterface.#log('Error while downloading StatsData:', 'warn')
    StatisticsInterface.#log('Response was:', 'warn', response)

    const statsData = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.STATS_DATA) || {}

    if (Object.keys(statsData).length === 0) {
      StatisticsInterface.#log('No old StatsData found in storage', 'debug')

      return
    }

    StatisticsInterface.#log('Old StatsData found in storage', 'debug')
    this.statsData      = statsData
    this.statsAvailable = true
  }

  #processStatsData(response) {
    StatisticsInterface.#log('StatsData was successfully downloaded', 'debug')

    const statsObject = JSON.parse(response.responseText)

    StatisticsInterface.#log('Starting StatsData parsing', 'debug')
    this.#extractFromStatsObject(statsObject)
  }

  // this method is only used for tests to reset the singleton instance
  // eslint-disable-next-line no-underscore-dangle
  static _resetInstance() {
    StatisticsInterface.#instance = undefined
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

  static #log(message, level, error) {
    StorageInterface.writeLog(message, level, StatisticsInterface.#logName, error)
  }
}

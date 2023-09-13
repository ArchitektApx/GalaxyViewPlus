import LogLevel         from '../enum/LogLevel.js'
import Mindash          from '../mindash/Mindash.js'
import StorageInterface from '../storageinterface/StorageInterface.js'
import InactiveRecolor  from './inactiverecolor/InactiveRecolor.js'
import RangeInfo        from './rangeinfo/RangeInfo.js'
import RankRecolor      from './rankrecolor/RankRecolor.js'
import UsernameRecolor  from './usernameRecolor/UsernameRecolor.js'

/**
 * The Iterator class is used to iterate over the featureres and rows and execute them.
 * @class
 */
export default class Iterator {
  static selector = 'a.tooltip_sticky > span.galaxy-username'
  static #logName = 'IteratorModule'

  /**
   * Creates a new Iterator instance and invokes the features.
   * @param   {object}  config          - The config for the features
   * @param   {Array}   config.features - The config of the individual features
   * @param   {object}  stats           - The StatisticsInterface Instance
   * @returns {Iterator}                - The Iterator instance
   * @class
   */
  constructor({ features: config }, stats) {
    Iterator.log('Starting feature iterator ', LogLevel.DEBUG)

    this.featureMap = {
      inactiveRecolor : { Class: InactiveRecolor, params: undefined },
      rangeInfo       : { Class: RangeInfo,       params: RangeInfo.getCurrentGalaxyAndSystem() },
      rankRecolor     : { Class: RankRecolor,     params: RankRecolor.getParams(config, stats) },
      userRecolor     : { Class: UsernameRecolor, params: undefined },
    }

    this.invokeFeatures(config)

    Iterator.log('Finished running feature iterator', LogLevel.DEBUG)
  }

  /**
   * invokes all features that are active and have a valid class.
   * @param   {object} featureConfig - The config for the features
   * @returns {void}
   * @public
   */
  invokeFeatures(featureConfig) {
    const positions = Iterator.#getPositions()

    // filter out inactive/invalid features and create instances
    featureConfig
    .filter(config => (
      this.featureMap[config.feature] && config.active
    ))
    .forEach((config) => {
      const instance = new this.featureMap[config.feature].Class(
        config.data, this.featureMap[config.feature].params
      )

      positions.forEach(position => instance.execute(position))
    })
  }

  /**
   * Wrapper for StorageInterface.writeLog
   * @param  {string} message - The message to log
   * @param  {LogLevel} level - The log level
   * @param  {error} error    - The error to log
   * @public
   * @static
   */
  static log(message, level = LogLevel.INFO, error = '') {
    StorageInterface.writeLog(message, level, Iterator.#logName, error)
  }

  /**
   * Gets the positions of the elements to be iterated over.
   * @returns {Array} - The positions
   * @private
   * @static
   */
  static #getPositions() {
    return Mindash.mapAny(
      [ ...document.querySelectorAll(Iterator.selector) ],
      x => x.parentNode
    )
  }
}

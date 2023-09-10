import LogLevel         from '../enum/LogLevel.js'
import Mindash          from '../mindash/Mindash.js'
import StorageInterface from '../storageinterface/StorageInterface.js'
import InactiveRecolor  from './inactiverecolor/InactiveRecolor.js'
import RangeInfo        from './rangeinfo/RangeInfo.js'
import RankRecolor      from './rankrecolor/RankRecolor.js'
import UsernameRecolor  from './usernameRecolor/UsernameRecolor.js'

export default class Iterator {
  static selector = 'a.tooltip_sticky > span.galaxy-username'
  static #logName = 'IteratorModule'

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

  // public methods
  invokeFeatures(featureConfig) {
    const positions = Mindash.mapAny(
      [ ...document.querySelectorAll(Iterator.selector) ],
      x => x.parentNode
    )

    // filter out inactive/invalid and create instances
    featureConfig.filter(config => (
      this.featureMap[config.feature] && config.active
    ))
    .map(config => (
      new this.featureMap[config.feature].Class(
        config.data, this.featureMap[config.feature].params
      )
    ))
    .forEach(instance => (
      positions.forEach(position => instance.execute(position))
    ))
  }

  static log(message, level = LogLevel.INFO, error = '') {
    StorageInterface.writeLog(message, level, Iterator.#logName, error)
  }
}

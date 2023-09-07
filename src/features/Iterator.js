import StorageInterface from '../storageinterface/StorageInterface.js'
import InactiveRecolor  from './inactiverecolor/InactiveRecolor.js'
import RangeInfo        from './rangeinfo/RangeInfo.js'
import RankRecolor      from './rankrecolor/RankRecolor.js'
import UsernameRecolor  from './usernameRecolor/UsernameRecolor.js'

export default class Iterator {
  static selector = 'a.tooltip_sticky > span.galaxy-username'
  static #logName = 'IteratorModule'

  constructor({ features: featureConfig }, statInstance) {
    Iterator.#log('Starting feature iterator ', 'debug')

    this.featureMap = {
      rangeInfo       : { Class: RangeInfo,       params: RangeInfo.getCurrentGalaxyAndSystem() },
      inactiveRecolor : { Class: InactiveRecolor, params: undefined },
      userRecolor     : { Class: UsernameRecolor, params: undefined },
      rankRecolor     : {
        Class  : RankRecolor,
        params : {
          rank  : RankRecolor.getRankSelectorData(featureConfig),
          stats : statInstance,
        },
      },
    }

    this.invokeFeatures(featureConfig)

    Iterator.#log('Finished running feature iterator', 'debug')
  }

  // prublic methods
  invokeFeatures(featureConfig) {
    // const positions = document.querySelectorAll("a.tooltip_sticky:has(span.galaxy-username)")
    // FF doesn't support :has() yet :(
    const positions = [ ...document.querySelectorAll(Iterator.selector) ].map(elm => elm.parentNode)

    const featureInstances = featureConfig.map(config => (
      // feature class exists and is active
      (this.featureMap[config.feature] && config.active)
        ? new this.featureMap[config.feature].Class(
          config.data, this.featureMap[config.feature].params
        )
        : undefined
    ))

    // invoke instances on each player
    featureInstances.forEach((instance) => {
      if (instance) { positions.forEach(position => instance.execute(position)) }
    })
  }

  // static private methods
  static #log(message, level, error) {
    StorageInterface.writeLog(message, level, Iterator.#logName, error)
  }
}
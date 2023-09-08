import MiscElementFactory from '../../userinterface/factories/MiscElementFactory.js'

export default class RankRecolor {
  constructor(configData = [], { params: parameters } = {}) {
    // parse parameters to make sure we have the expected types
    this.parseParameters(configData, parameters)
    this.getRankTypeAndDisplayName()
  }

  execute(currentElement) {
    const playerID    = currentElement.childNodes[1].attributes.playerid.value
    const playerIDInt = Number.parseInt(playerID, 10)

    // try to get user rank from StatsInterface else use fallback method
    let userRank

    try {
      userRank = this.statsInstance.getPlayerRank(playerIDInt, this.rankType)
    } catch {
      userRank             = RankRecolor.userRankFallback(currentElement)
      this.rankDisplayName = 'Gesamt'
    }

    const rankElement = MiscElementFactory.create('span', {})
    const rankText    = `${ this.rankDisplayName }: ${ userRank }`

    rankElement.append(MiscElementFactory.create('br', {}))
    rankElement.append(MiscElementFactory.create('span', { textContent: rankText }))

    const matchingRankData = this.rankRecolorData.sort(
      (a, b) => b.key - a.key
    ).find(data => userRank >= data.key)

    if (matchingRankData) {
      rankElement.style.color = matchingRankData.value
    }

    currentElement.parentNode.append(rankElement)
  }

  getRankTypeAndDisplayName() {
    // Find the checked row, or use a default if not found
    const { value = 'rank', displayName = 'Gesamt' } = this.rankTypeData.find(row => row.checked === true) || {}
    this.rankType        = value
    this.rankDisplayName = displayName
  }

  parseParameters(configData, parameters) {
    // make sure input parameters behave as we expect even if deliberatly set to false values
    this.rankRecolorData = RankRecolor.forceArray(configData)
    console.log(`rankrecolordata is: ${  this.rankRecolorData }`)
    this.statsInstance = RankRecolor.forceObject(RankRecolor.forceOptionalProperty(parameters, 'stats', {}))
    console.log(`statsinstance is: ${  this.statsInstance }`)
    this.rankTypeData = RankRecolor.forceArray(RankRecolor.forceOptionalProperty(parameters, 'rank', []))
    console.log(`ranktypedata is: ${  this.rankTypeData }`)
  }

  static forceArray(input) {
    return Array.isArray(input) ? input : []
  }

  static forceObject(input) {
    return typeof input === 'object' ? input : {}
  }

  static forceOptionalProperty(input, property, fallback) {
    return input?.[property] || fallback
  }

  static getParams(config, statInstance) {
    return {
      params: {
        rank  : RankRecolor.getRankSelectorData(config),
        stats : statInstance,
      },
    }
  }

  static getRankSelectorData(featureConfig) {
    if (!featureConfig) { return }

    const rankSelectorConfig = featureConfig.find(feature => feature.feature === 'rankSelector')

    if (
      rankSelectorConfig
      && Object.keys(rankSelectorConfig).includes('data')
      && (Array.isArray(rankSelectorConfig.data))
    ) { return rankSelectorConfig.data }
  }

  static userRankFallback(currentElement) {
    // fallback to get total rank from html if StatsInterface is not available
    return currentElement.dataset.tooltipContent.split('</th')[0].split(' ').pop()
  }
}

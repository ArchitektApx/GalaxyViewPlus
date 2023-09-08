import MiscElementFactory from '../../userinterface/factories/MiscElementFactory.js'

export default class RankRecolor {
  constructor(configData = [], { params: parameters } = {}) {
    // make sure parameters behave as we expect
    this.rankRecolorData        = Array.isArray(configData) ? configData : []
    this.statsInterfaceInstance = typeof parameters.stats === 'object' ? parameters.stats : {}

    const rank = Array.isArray(parameters.rank) ? parameters.rank : []

    // Find the checked row, or use a default if not found
    const { value = 'rank', displayName = 'Gesamt' } = rank.find(row => row.checked === true) || {}

    this.rankType        = value
    this.rankDisplayName = displayName
  }

  execute(currentElement) {
    const playerID    = currentElement.childNodes[1].attributes.playerid.value
    const playerIDInt = Number.parseInt(playerID, 10)

    // try to get user rank from StatsInterface else use fallback method
    let userRank

    try {
      userRank = this.statsInterfaceInstance.getPlayerRank(playerIDInt, this.rankType)
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

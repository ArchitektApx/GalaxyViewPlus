import Mindash            from '../../mindash/Mindash.js'
import HtmlElementFactory from '../../userinterface/factories/HtmlElementFactory.js'

/**
 * The RankRecolor class is used to recolor the rank of players in the galaxy view.
 * @class
 */
export default class RankRecolor {
  /**
   * Creates a new RankRecolor instance.
   * @param   {Array}       configData        - The config data
   * @param   {object}      parameters        - The parameters
   * @param   {object}      parameters.params - The parameters
   * @returns {RankRecolor}                   - The RankRecolor instance
   * @class
   */
  constructor(configData = [], { params: parameters } = {}) {
    // parse parameters to make sure we have the expected types
    this.parseParameters(configData, parameters)
    this.getRankTypeAndDisplayName()
  }

  /**
   * Executes the command.
   * @param   {HTMLElement} currentElement - The current element
   * @returns {void}
   * @public
   */
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

    const rankElement = HtmlElementFactory.create('span', {})
    const rankText    = `${ this.rankDisplayName }: ${ userRank }`

    rankElement.append(HtmlElementFactory.create('br', {}))
    rankElement.append(HtmlElementFactory.create('span', { textContent: rankText }))

    const matchingRankData = this.rankRecolorData.sort(
      (a, b) => b.key - a.key
    ).find(data => userRank >= data.key)

    if (matchingRankData) {
      rankElement.style.color = matchingRankData.value
    }

    currentElement.parentNode.append(rankElement)
  }

  /**
   * Gets the rank type and display name. from the rankTypeData
   * @returns {void}
   * @public
   */
  getRankTypeAndDisplayName() {
    // Find the checked row, or use a default if not found
    const { value = 'rank', displayName = 'Gesamt' } = this.rankTypeData.find(row => row.checked === true) || {}

    this.rankType        = value
    this.rankDisplayName = displayName
  }

  /**
   * Parses the parameters.
   * @param   {object} configData - The config data
   * @param   {object} parameters - The parameters
   * @returns {void}
   * @public
   */
  parseParameters(configData, parameters) {
    // make sure input parameters behave as we expect even if deliberatly set to false values
    this.rankRecolorData = Mindash.isType(configData, []) ? configData : []
    this.statsInstance   = Mindash.defaultTo(parameters?.stats, {})
    this.rankTypeData    = Mindash.forceArray(Mindash.defaultTo(parameters?.rank, []))
  }

  /**
   * static helper which creates the formatted parameter for the constructor
   * @param   {object} config       - The config
   * @param   {object} statInstance - The stat instance
   * @returns {object}              - The formatted parameters
   * @public
   * @static
   */
  static getParams(config, statInstance) {
    return {
      params: {
        rank  : RankRecolor.getRankSelectorData(config),
        stats : statInstance,
      },
    }
  }

  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * static helper which finds the rankselector data in the config and returns it if found
   * @param   {object}           featureConfig - The feature config
   * @returns {undefined|object}               - The rankselector data or undefined if not found
   * @public
   * @static
   */
  static getRankSelectorData(featureConfig) {
    const rankSelectorConfig = Mindash.findAny(featureConfig, feature => feature.feature === 'rankSelector')

    if (rankSelectorConfig?.data && Array.isArray(rankSelectorConfig.data)) {
      return rankSelectorConfig.data
    }
  }

  /**
   * fallback to get total rank from html if StatsInterface is not available
   * @param   {HTMLElement} currentElement - The current element
   * @returns {string}                     - The user rank
   * @public
   * @static
   */
  static userRankFallback(currentElement) {
    return currentElement.dataset.tooltipContent.split('</th')[0].split(' ').pop()
  }
}

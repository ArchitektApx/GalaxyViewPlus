import Mindash            from '../../mindash/Mindash.js'
import HtmlElementFactory from '../../userinterface/factories/HtmlElementFactory.js'
import RankUtils          from './RankUtils.js'
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
    this.usedFallback = false
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
    const playerID = currentElement.childNodes[1].attributes.playerid.value

    // try to get user rank from StatsInterface else use fallback method
    const userRank    = this.#fetchUserRank(playerID, currentElement)
    const rankElement = this.#createRankElement(userRank)

    currentElement.parentNode.append(this.#setRankElementColor(rankElement, userRank))
  }

  /**
   * Gets the rank type and display name from the rankTypeData
   * @returns {void}
   * @public
   */
  getRankTypeAndDisplayName() {
    // Find the checked row, or use a default if not found
    const {
      value = 'rank',
      displayName = 'Gesamt',
    } = this.rankTypeData.find(row => row.checked === true) || {}

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
   * Creates the rank element.
   * @param   {string} userRank - The user rank
   * @returns {HTMLElement}     - The rank element
   * @private
   */
  #createRankElement(userRank) {
    const rankElement = HtmlElementFactory.create('span', {})
    let rankText      = `${ this.rankDisplayName }: ${ userRank }`

    if (this.usedFallback) {
      rankText += ' *'
    }

    rankElement.append(HtmlElementFactory.create('br', {}))
    rankElement.append(HtmlElementFactory.create('span', { textContent: rankText }))
    return rankElement
  }

  /**
   * Fetches the user rank from the stats instance or falls back to the html
   * @param   {string}      playerID       - The player id
   * @param   {HTMLElement} currentElement - The current element
   * @returns {string}                     - The user rank
   * @private
   */
  #fetchUserRank(playerID, currentElement) {
    // check if getPlayerRank method exists before calling it
    let response
    if (this.statsInstance.getPlayerRank) {
      response = this.statsInstance.getPlayerRank(Number.parseInt(playerID, 10), this.rankType)
    }

    if (Number.isInteger(response)) {
      return response
    }

    this.rankDisplayName = 'Gesamt'
    this.usedFallback    = true
    return RankUtils.userRankFallback(currentElement)
  }

  /**
   * Sets the rank element color.
   * @param   {HTMLElement} rankElement - The rank element
   * @param   {string}      userRank    - The user rank
   * @returns {HTMLElement}             - The rank element
   * @private
   */
  #setRankElementColor(rankElement, userRank) {
    const matchingRankData = this.rankRecolorData.sort(
      (a, b) => b.key - a.key
    ).find(data => userRank >= data.key)

    if (matchingRankData) {
      rankElement.style.color = matchingRankData.value
    }

    return rankElement
  }
}

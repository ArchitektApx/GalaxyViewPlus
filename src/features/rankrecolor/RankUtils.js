import Mindash from '../../mindash/Mindash.js'

/**
 * The RankUtils class is a static class that provides helper methods for the RankRecolor feature.
 * @class
 */
export default class RankUtils {
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
        rank  : RankUtils.getRankSelectorData(config),
        stats : statInstance,
      },
    }
  }

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

import HtmlElementFactory from '../../userinterface/factories/HtmlElementFactory.js'

/**
 * provides utility functions for range calculations used in RangeInfo.js
 * @class
 */
export default class RangeCalcUtils {
  static coordsRegex = /(?<Gala>[1-4]):(?<Sys>\d{1,3}):(?<Pos>\d{1,2})(?<isMoon>] M)?/g
  /**
   * Creates the near element
   * @param   {string} nearText - The text to display
   * @returns {object}          - The near element
   * @public
   * @static
   */
  static createNearElement(nearText) {
    const nearElement = HtmlElementFactory.create('span', {})

    nearElement.append(HtmlElementFactory.create('br', {}))
    nearElement.append(HtmlElementFactory.create('span', { textContent: nearText }))

    return nearElement
  }

  /**
   * Formats the near text
   * @param   {object} nearCounts             - The near counts
   * @param   {number} nearCounts.nearPlanets - The number of near planets
   * @param   {number} nearCounts.nearMoons   - The number of near moons
   * @returns {string}                        - The formatted near text
   * @public
   * @static
   */
  static formatNearText(nearCounts) {
    return `NearP: ${ nearCounts.nearPlanets } NearM: ${ nearCounts.nearMoons }`
  }

  /**
   * Gets the range of systems to check
   * @param   {number} start  - The start of the range
   * @param   {number} end    - The end of the range
   * @param   {number} minSys - The min system
   * @param   {number} maxSys - The max system
   * @returns {Array}         - The total range of systems to check
   * @public
   */
  static getCircularNumberRange(start, end, minSys, maxSys) {
    const range = maxSys - minSys + 1

    return Array.from(
      { length: (end - start + range) % range },
      (_, index) => ((start + index - minSys) % range) + minSys
    )
  }

  /**
   * Gets the circular position
   * @param   {number} value - The value to check
   * @param   {number} min   - The min value
   * @param   {number} max   - The max value
   * @returns {number}       - The circular position
   * @public
   * @static
   */
  static getCircularPosition(value, min, max) {
    const range = max - min + 1

    return ((((value - min) % range) + range) % range) + min
  }

  /**
   * Gets the coords from the tooltip
   * @param   {string} ToolTipContent - The tooltip content
   * @returns {Array}                 - The coords
   * @public
   * @static
   */
  static getCoordsFromToolTip(ToolTipContent) {
    return ToolTipContent.matchAll(RangeCalcUtils.coordsRegex)
  }

  /**
   * Gets the total range of systems to check
   * @param   {number} nearRange     - The near range
   * @param   {number} minSys        - The min system
   * @param   {number} maxSys        - The max system
   * @param   {number} currentSystem - The current system
   * @returns {Array}                - The total range of systems to check
   * @public
   */
  static getTotalRange(nearRange, minSys, maxSys, currentSystem) {
    const rangeStart = RangeCalcUtils.getCircularPosition(
      (currentSystem - nearRange),
      minSys,
      maxSys
    )

    const rangeEnd = RangeCalcUtils.getCircularPosition(
      (currentSystem + nearRange),
      minSys,
      maxSys
    )

    const rangeBefore = rangeStart <= currentSystem
      ? RangeCalcUtils.getCircularNumberRange(rangeStart, currentSystem, minSys, maxSys)
      : [ ...RangeCalcUtils.getCircularNumberRange(rangeStart, maxSys + 1, minSys, maxSys),
          ...RangeCalcUtils.getCircularNumberRange(minSys, currentSystem, minSys, maxSys) ]

    const rangeAfter = rangeEnd >= currentSystem
      ? RangeCalcUtils.getCircularNumberRange(currentSystem, rangeEnd + 1, minSys, maxSys)
      : [ ...RangeCalcUtils.getCircularNumberRange(currentSystem, maxSys + 1, minSys, maxSys),
          ...RangeCalcUtils.getCircularNumberRange(minSys, rangeEnd + 1, minSys, maxSys) ]

    return [ ...rangeBefore, ...rangeAfter ]
  }
}

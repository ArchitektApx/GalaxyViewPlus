import HtmlElementFactory from '../../userinterface/factories/HtmlElementFactory.js'

/**
 * The RangeInfo class is used to display nearby planet and moon counts
 * @class
 */
export default class RangeInfo {
  static coordsRegex = /(?<Gala>[1-4]):(?<Sys>\d{1,3}):(?<Pos>\d{1,2})(?<isMoon>] M)?/g

  /**
   * Creates a new RangeInfo instance
   * @param   {Array}     rangeInfo                     - the config containing the range info
   * @param   {string}    rangeInfo.0                   - The near range
   * @param   {string}    rangeInfo.1                   - The min system
   * @param   {string}    rangeInfo.2                   - The max system
   * @param   {object}    currentPosition               - data from getCurrentGalaxyAndSystem
   * @param   {string}    currentPosition.currentSystem - The current system
   * @param   {string}    currentPosition.currentGalaxy - The current galaxy
   * @returns {RangeInfo} - The RangeInfo instance
   */
  constructor(
    [ { value: nearRange }, { value: minSys }, { value: maxSys } ],
    { currentSystem, currentGalaxy }
  ) {
    this.nearRange     = Number.parseInt(nearRange, 10)
    this.minSys        = Number.parseInt(minSys, 10)
    this.maxSys        = Number.parseInt(maxSys, 10)
    this.currentSystem = Number.parseInt(currentSystem, 10)
    this.currentGalaxy = currentGalaxy
  }

  /**
   * Executes the command.
   * @param   {object} currentElement - The current element
   * @returns {void}
   * @public
   */
  execute(currentElement) {
    const totalRange  = this.getTotalRange()
    const coords      = RangeInfo.getCoordsFromToolTip(currentElement.dataset.tooltipContent)
    const nearCounts  = this.getNearbyCounts(coords, totalRange)
    const nearElement = RangeInfo.createNearElement(RangeInfo.formatNearText(nearCounts))

    currentElement.parentNode.append(nearElement)
  }

  /**
   * Gets the range of systems to check
   * @param   {number} start - The start of the range
   * @param   {number} end   - The end of the range
   * @returns {Array}        - The total range of systems to check
   * @public
   */
  getCircularNumberRange(start, end) {
    const range = this.maxSys - this.minSys + 1

    return Array.from(
      { length: (end - start + range) % range },
      (_, index) => ((start + index - this.minSys) % range) + this.minSys
    )
  }

  /**
   * Gets the nearby counts
   * @param   {Array}  coords        - The coords to check
   * @param   {Array}  totalRange    - The total range of systems to check
   * @returns {object}               - The nearby counts
   * @public
   * @static
   */
  getNearbyCounts(coords, totalRange) {
    this.nearPlanets = -1 // -1 to account for current planet
    this.nearMoons   = 0;

    [ ...coords ].forEach(([ , gala, sys,, moon ]) => {
      this.#updateCounts(gala, sys, moon, totalRange)
    })

    if (this.nearPlanets === -1) { this.nearPlanets = 0 }

    return { nearMoons: this.nearMoons, nearPlanets: this.nearPlanets }
  }

  /**
   * Gets the total range of systems to check
   * @returns {Array} - The total range of systems to check
   * @public
   */
  getTotalRange() {
    const rangeStart = RangeInfo.getCircularPosition(
      (this.currentSystem - this.nearRange),
      this.minSys,
      this.maxSys
    )

    const rangeEnd = RangeInfo.getCircularPosition(
      (this.currentSystem + this.nearRange),
      this.minSys,
      this.maxSys
    )

    const rangeBefore = rangeStart <= this.currentSystem
      ? this.getCircularNumberRange(rangeStart, this.currentSystem)
      : [ ...this.getCircularNumberRange(rangeStart, this.maxSys + 1),
          ...this.getCircularNumberRange(this.minSys, this.currentSystem) ]

    const rangeAfter = rangeEnd >= this.currentSystem
      ? this.getCircularNumberRange(this.currentSystem, rangeEnd + 1)
      : [ ...this.getCircularNumberRange(this.currentSystem, this.maxSys + 1),
          ...this.getCircularNumberRange(this.minSys, rangeEnd + 1) ]

    return [ ...rangeBefore, ...rangeAfter ]
  }

  /**
   * Adds to the moon count if the moon exists
   * @param   {string} moon      - The moon
   * @returns {void}
   * @private
   */
  #addMoonCount(moon) {
    if (moon) { this.nearMoons++ }
  }

  /**
   * Updates the Planet and Moon counts based on the current galaxy, system, and moon
   * @param   {string} gala       - The galaxy
   * @param   {string} sys        - The system
   * @param   {string} moon       - The moon
   * @param   {Array}  totalRange - The total range of systems to check
   * @returns {void}
   * @private
   */
  #updateCounts(gala, sys, moon, totalRange) {
    const sysInt = Number.parseInt(sys, 10)
    if (gala === this.currentGalaxy && totalRange.includes(sysInt)) {
      this.nearPlanets++
      this.#addMoonCount(moon)
    }
  }

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
    return ToolTipContent.matchAll(RangeInfo.coordsRegex)
  }

  /**
   * Gets the current galaxy and system
   * @returns {object} - The current galaxy and system
   * @public
   * @static
   */
  static getCurrentGalaxyAndSystem() {
    const [ currentGalaxy, currentSystem ] = document.evaluate(
      '//table/tbody/tr/th[contains(text(), \'System \')]',
      document,
      null,
      XPathResult.STRING_TYPE,
      null
    ).stringValue
      .split(' ')[1]
      .split(':')

    return { currentGalaxy, currentSystem }
  }
}

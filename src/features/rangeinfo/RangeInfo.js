import RangeCalcUtils from './RangeCalcUtils.js'

/**
 * The RangeInfo class is used to display nearby planet and moon counts
 * @class
 */
export default class RangeInfo {
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
    const totalRange  = RangeCalcUtils.getTotalRange(
      this.nearRange,
      this.minSys,
      this.maxSys,
      this.currentSystem
    )
    const coords      = RangeCalcUtils.getCoordsFromToolTip(currentElement.dataset.tooltipContent)
    const nearCounts  = this.getNearbyCounts(coords, totalRange)
    const nearElement = RangeCalcUtils.createNearElement(RangeCalcUtils.formatNearText(nearCounts))

    currentElement.parentNode.append(nearElement)
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

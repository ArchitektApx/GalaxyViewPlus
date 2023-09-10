import MiscElementFactory from '../../userinterface/factories/MiscElementFactory.js'

/**
 * The RangeInfo class is used to display nearby planet and moon counts
 * @class
 * @param {object} rangeInfo - The range info object from the config
 * @returns {RangeInfo} - The RangeInfo instance
 */
export default class RangeInfo {
  static coordsRegex = /(?<Gala>[1-4]):(?<Sys>\d{1,3}):(?<Pos>\d{1,2})(?<isMoon>] M)?/g

  /**
   * Creates a new RangeInfo instance
   * @param {Array} rangeInfo - the config containing the range info
   * @param {object} currentPosition - data created by the static method getCurrentGalaxyAndSystem
   * @param {string} rangeInfo."0" - The near range
   * @param {string} rangeInfo."1" - The min system
   * @param {string} rangeInfo."2" - The max system
   * @param {string} currentPosition.currentSystem - The current system
   * @param {string} currentPosition.currentGalaxy - The current galaxy
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
   * @param {object} currentElement - The current element
   * @returns {void}
   */
  execute(currentElement) {
    const totalRange  = this.getTotalRange()
    const coords      = RangeInfo.getCoordsFromToolTip(currentElement.dataset.tooltipContent)
    const nearCounts  = RangeInfo.getNearbyCounts(coords, totalRange, this.currentGalaxy)
    const nearElement = RangeInfo.createNearElement(RangeInfo.formatNearText(nearCounts))

    currentElement.parentNode.append(nearElement)
  }

  /**
   * Gets the range of systems to check
   * @param {number} start - The start of the range
   * @param {number} end - The end of the range
   * @returns {Array} - The total range of systems to check
   */
  getCircularNumberRange(start, end) {
    const range = this.maxSys - this.minSys + 1

    return Array.from(
      { length: (end - start + range) % range },
      (_, index) => ((start + index - this.minSys) % range) + this.minSys
    )
  }

  /**
   * Gets the total range of systems to check
   * @returns {Array} - The total range of systems to check
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
   * Creates the near element
   * @param {string} nearText - The text to display
   * @returns {object} - The near element
   */
  static createNearElement(nearText) {
    const nearElement = MiscElementFactory.create('span', {})

    nearElement.append(MiscElementFactory.create('br', {}))
    nearElement.append(MiscElementFactory.create('span', { textContent: nearText }))

    return nearElement
  }

  /**
   * Formats the near text
   * @param {object} nearCounts - The near counts
   * @param {number} nearCounts.nearPlanets - The number of near planets
   * @param {number} nearCounts.nearMoons - The number of near moons
   * @returns {string} - The formatted near text
   */
  static formatNearText(nearCounts) {
    return `NearP: ${ nearCounts.nearPlanets } NearM: ${ nearCounts.nearMoons }`
  }

  /**
   * Gets the circular position
   * @param {number} value - The value to check
   * @param {number} min - The min value
   * @param {number} max - The max value
   * @returns {number} - The circular position
   */
  static getCircularPosition(value, min, max) {
    const range = max - min + 1

    return ((((value - min) % range) + range) % range) + min
  }

  /**
   * Gets the coords from the tooltip
   * @param {string} ToolTipContent - The tooltip content
   * @returns {Array} - The coords
   */
  static getCoordsFromToolTip(ToolTipContent) {
    return ToolTipContent.matchAll(RangeInfo.coordsRegex)
  }

  /**
   * Gets the current galaxy and system
   * @returns {object} - The current galaxy and system
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

  /**
   * Gets the nearby counts
   * @param {Array} coords - The coords to check
   * @param {Array} totalRange - The total range of systems to check
   * @param {string} currentGalaxy - The current galaxy
   * @returns {object} - The nearby counts
   */
  static getNearbyCounts(coords, totalRange, currentGalaxy) {
    // convert regex iterator to array
    const coordsAsArray = [ ...coords ].map(([ , gala, sys, , moon ]) => ({ gala, moon, sys }))

    let nearPlanets = -1 // -1 to account for current planet
    let nearMoons   = 0

    coordsAsArray.forEach((coordElement) => {
      const sysInt = Number.parseInt(coordElement.sys, 10)

      if (coordElement.gala === currentGalaxy && totalRange.includes(sysInt)) {
        nearPlanets++
        if (coordElement.moon) { nearMoons++ }
      }
    })

    if (nearPlanets === -1) { nearPlanets = 0 }

    return { nearMoons, nearPlanets }
  }
}

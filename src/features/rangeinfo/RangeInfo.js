import MiscElementFactory from '../../userinterface/factories/MiscElementFactory.js'

export default class RangeInfo {
  static coordsRegex = /(?<Gala>[1-4]):(?<Sys>\d{1,3}):(?<Pos>\d{1,2})(?<isMoon>] M)?/g

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

  execute(currentElement) {
    const totalRange  = this.getTotalRange()
    const coords      = RangeInfo.getCoordsFromToolTip(currentElement.dataset.tooltipContent)
    const nearCounts  = RangeInfo.getNearbyCounts(coords, totalRange, this.currentGalaxy)
    const nearElement = RangeInfo.createNearElement(RangeInfo.formatNearText(nearCounts))

    currentElement.parentNode.append(nearElement)
  }

  getCircularNumberRange(start, end) {
    const range = this.maxSys - this.minSys + 1

    return Array.from(
      { length: (end - start + range) % range },
      (_, index) => ((start + index - this.minSys) % range) + this.minSys
    )
  }

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

  static createNearElement(nearText) {
    const nearElement = MiscElementFactory.create('span', {})

    nearElement.append(MiscElementFactory.create('br', {}))
    nearElement.append(MiscElementFactory.create('span', { textContent: nearText }))

    return nearElement
  }

  static formatNearText(nearCounts) {
    return `NearP: ${ nearCounts.nearPlanets } NearM: ${ nearCounts.nearMoons }`
  }

  static getCircularPosition(value, min, max) {
    const range = max - min + 1

    return ((((value - min) % range) + range) % range) + min
  }

  static getCoordsFromToolTip(ToolTipContent) {
    return ToolTipContent.matchAll(RangeInfo.coordsRegex)
  }

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

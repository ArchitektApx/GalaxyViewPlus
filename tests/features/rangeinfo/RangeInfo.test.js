/* eslint-disable sonarjs/no-duplicate-string */
import RangeInfo          from '../../../src/features/rangeinfo/RangeInfo.js'
import MiscElementFactory from '../../../src/userinterface/factories/MiscElementFactory.js'

jest.mock('../../../src/userinterface/factories/MiscElementFactory.js', () => ({
  create: jest.fn((tag, attributes) => {
    const mockElement = {
      tagName : tag,
      style   : {}, // Add this line to mock the style property
      append  : jest.fn(),
    }

    Object.keys(attributes).forEach((attribute) => {
      mockElement[attribute] = attributes[attribute]
    })

    return mockElement
  }),
}))

describe('RangeInfo', () => {
  beforeEach(() => {
    jest.spyOn(MiscElementFactory, 'create')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('calculations', () => {
    it('should getCircularPosition(start without jump below 1): currentSystem 88, nearRange 14', () => {
      const circularStart = RangeInfo.getCircularPosition((88 - 14), 1, 400)

      expect(circularStart).toBe(74)
    })

    it('should getCircularPosition(start with jump below 1): currentSystem 19, nearRange 45', () => {
      const circularStart = RangeInfo.getCircularPosition((19 - 45), 1, 400)

      expect(circularStart).toBe(374)
    })

    it('should getCircularPosition(end without jump above 400): currentSystem 270, nearRange 31', () => {
      const circularEnd = RangeInfo.getCircularPosition((270 + 31), 1, 400)

      expect(circularEnd).toBe(301)
    })

    it('should getCircularPosition(end with jump above 400): currentSystem 369, nearRange 40', () => {
      const circularEnd = RangeInfo.getCircularPosition((369 + 40), 1, 400)

      expect(circularEnd).toBe(9)
    })

    it('should getTotalRange(nearRange gets below 1): currentSystem 10, nearRange 20', () => {
      const inputData      = [ { value: '20' }, { value: '1' }, { value: '400' } ]
      const inputParameter = { currentGalaxy: '1', currentSystem: '10' }
      const rangeInfo      = new RangeInfo(inputData, inputParameter)
      const totalRange     = rangeInfo.getTotalRange()

      expect(totalRange).toEqual(
      // array from 390 to 400, then 1 to 30
        [ ...Array.from({ length: 11 }, (_, index) => 390 + index),
          ...Array.from({ length: 30 }, (_, index) => index + 1) ]
      )
    })

    it('should getTotalRange(nearRange gets above 400): currentSystem 385, nearRange 35', () => {
      const inputData      = [ { value: '35' }, { value: '1' }, { value: '400' } ]
      const inputParameter = { currentGalaxy: '1', currentSystem: '385' }
      const rangeInfo      = new RangeInfo(inputData, inputParameter)
      const totalRange     = rangeInfo.getTotalRange()

      expect(totalRange).toEqual(
      // array from 365 to 400, then 1 to 20
        [ ...Array.from({ length: 51 }, (_, index) => 350 + index),
          ...Array.from({ length: 20 }, (_, index) => index + 1) ]
      )
    })

    it('should getCoordsFromToolTip: test planet coordinates extreaction via regex', () => {
      const toolTipContent = "<table style='width:240px'><tr><th colspan='2'>Spieler architekt auf Platz 78</th></tr><tr><tr><td><a href='#' playerid='6177' onclick='return Dialog.Playercard(6177);'>Playercard</a></td></tr><tr><td><a href='?page=statistics&who=1&start=78'>Statistiken</a></td></tr><tr><th colspan='2'>Planeten</th></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=154'>[1:154:15] M</a></th></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=154'>[1:154:8]</a></th></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=17'>[1:17:8]</a></th></tr><tr><td colspan='2' style='text-align: center'><span>[1:31:10] M</span></td></tr><tr><td colspan='2' style='text-align: center'><span>[1:31:6]</span></td></tr><tr><td colspan='2' style='text-align: center'><span>[1:31:8]</span></td></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=384'>[1:384:10]</a></th></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=70'>[1:70:6]</a></th></tr></table>"
      const coords         = RangeInfo.getCoordsFromToolTip(toolTipContent)
      const coordsAsArray  = [ ...coords ].map(
        ([ gesamt, gala, sys, pos, mond ]) => ([ gesamt, gala, sys, pos, mond ])
      )

      const correctResult = [
        [ '1:154:15] M', '1', '154', '15', '] M' ],
        [ '1:154:8', '1', '154', '8', undefined ],
        [ '1:17:8', '1', '17', '8', undefined ],
        [ '1:31:10] M', '1', '31', '10', '] M' ],
        [ '1:31:6', '1', '31', '6', undefined ],
        [ '1:31:8', '1', '31', '8', undefined ],
        [ '1:384:10', '1', '384', '10', undefined ],
        [ '1:70:6', '1', '70', '6', undefined ],
      ]

      expect(coordsAsArray).toEqual(correctResult)
    })

    it('should getNearByCounts: test Planet/Moon counting', () => {
      const inputData      = [ { value: '25' }, { value: '1' }, { value: '400' } ]
      const inputParameter = { currentGalaxy: '1', currentSystem: '31' }
      const rangeInfo      = new RangeInfo(inputData, inputParameter)
      const toolTipContent = "<table style='width:240px'><tr><th colspan='2'>Spieler architekt auf Platz 78</th></tr><tr><tr><td><a href='#' playerid='6177' onclick='return Dialog.Playercard(6177);'>Playercard</a></td></tr><tr><td><a href='?page=statistics&who=1&start=78'>Statistiken</a></td></tr><tr><th colspan='2'>Planeten</th></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=154'>[1:154:15] M</a></th></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=154'>[1:154:8]</a></th></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=17'>[1:17:8]</a></th></tr><tr><td colspan='2' style='text-align: center'><span>[1:31:10] M</span></td></tr><tr><td colspan='2' style='text-align: center'><span>[1:31:6]</span></td></tr><tr><td colspan='2' style='text-align: center'><span>[1:31:8]</span></td></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=384'>[1:384:10]</a></th></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=70'>[1:70:6]</a></th></tr></table>"
      const coords         = RangeInfo.getCoordsFromToolTip(toolTipContent)
      const totalRange     = rangeInfo.getTotalRange()
      const nearByCounts   = RangeInfo.getNearbyCounts(coords, totalRange, '1')
      const correctResult  = { nearPlanets: 3, nearMoons: 1 }

      expect(nearByCounts).toEqual(correctResult)
    })
  })

  describe('execute', () => {
    it('should add near info to current element parent', () => {
      const inputData          = [ { value: '25' }, { value: '1' }, { value: '400' } ]
      const inputParameter     = { currentGalaxy: '1', currentSystem: '31' }
      const rangeInfo          = new RangeInfo(inputData, inputParameter)
      const mockCurrentElement = {
        childNodes: [
          {},
          { attributes: { playerid: { value: '1' } } },
        ],
        parentNode: {
          append: jest.fn(),
        },
        dataset: {
          tooltipContent: "<table style='width:240px'><tr><th colspan='2'>Spieler architekt auf Platz 78</th></tr><tr><tr><td><a href='#' playerid='6177' onclick='return Dialog.Playercard(6177);'>Playercard</a></td></tr><tr><td><a href='?page=statistics&who=1&start=78'>Statistiken</a></td></tr><tr><th colspan='2'>Planeten</th></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=154'>[1:154:15] M</a></th></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=154'>[1:154:8]</a></th></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=17'>[1:17:8]</a></th></tr><tr><td colspan='2' style='text-align: center'><span>[1:31:10] M</span></td></tr><tr><td colspan='2' style='text-align: center'><span>[1:31:6]</span></td></tr><tr><td colspan='2' style='text-align: center'><span>[1:31:8]</span></td></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=384'>[1:384:10]</a></th></tr><tr><th colspan='2' style='text-align: center'><a href='https://pr0game.com/uni2/game.php?page=galaxy&galaxy=1&system=70'>[1:70:6]</a></th></tr></table>",
        },
      }

      rangeInfo.execute(mockCurrentElement)

      expect(mockCurrentElement.parentNode.append).toHaveBeenCalled()
      expect(MiscElementFactory.create).toHaveBeenCalledTimes(3)
    })
  })

  describe('createNearElement', () => {
    it('should create a span element with correct text', () => {
      const nearElement = RangeInfo.createNearElement('test')

      expect(nearElement.tagName).toBe('span')

      const nearElementChild = nearElement.append.mock.calls
      const nearElementText  = nearElementChild[1][0].textContent

      expect(nearElementText).toBe('test')
      expect(nearElement.append).toHaveBeenCalledTimes(2)
      expect(MiscElementFactory.create).toHaveBeenCalledTimes(3)
    })
  })

  describe('getCurrentGalaxyAndSystem', () => {
    // Mock XPathResult
    global.XPathResult = {
      STRING_TYPE: 'Mocked STRING_TYPE',
    }

    // mock document evaluate function
    global.document = {
      evaluate: jest.fn().mockReturnValue({
        stringValue: 'System 1:31',
      }),
    }

    it('should return current galaxy and system', () => {
      const currentGalaxyAndSystem = RangeInfo.getCurrentGalaxyAndSystem()

      expect(currentGalaxyAndSystem).toEqual({ currentGalaxy: '1', currentSystem: '31' })
    })
  })

  describe('getNearbyCounts', () => {
    it('should return near planets as 0 and near moons as 0 if none are found', () => {
      const coords       = []
      const totalRange   = [ 1, 2, 3, 4, 5 ]
      const nearByCounts = RangeInfo.getNearbyCounts(coords, totalRange, '1')

      expect(nearByCounts).toEqual({ nearPlanets: 0, nearMoons: 0 })
    })
  })
})

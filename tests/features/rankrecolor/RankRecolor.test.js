import RankRecolor        from '../../../src/features/rankrecolor/RankRecolor.js'
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

describe('RankRecolor', () => {
  const mockData = [
    { key: 1, value: 'red' },
    { key: 2, value: 'blue' },
  ]

  const mockRankParameters = {
    rank: [
      { checked: false, value: 'rank', displayName: 'Gesamt' },
      { checked: true, value: 'testRank', displayName: 'TestRank' },
    ],
    stats: {
      getPlayerRank: jest.fn(),
    },
  }

  beforeEach(() => {
    jest.spyOn(MiscElementFactory, 'create')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should be instantiated with correct rank data and parameters', () => {
      const instance = new RankRecolor(mockData, mockRankParameters)

      expect(instance.rankRecolorData).toEqual(mockData)
      expect(instance.rankType).toBe('testRank')
      expect(instance.rankDisplayName).toBe('TestRank')
    })

    it('should set default rank type and display name if no parameters passed', () => {
      const instance = new RankRecolor(mockData)

      expect(instance.rankType).toBe('rank')
      expect(instance.rankDisplayName).toBe('Gesamt')
    })

    it('should do nothing if configData default array is used', () => {
      const instance = new RankRecolor()

      expect(instance.rankRecolorData).toEqual([])
    })

    it('should do nothing if configData is not an array', () => {
      const instance = new RankRecolor('test')

      expect(instance.rankRecolorData).toEqual([])
    })
  })

  describe('execute', () => {
    it('should add rank info to current element parent and recolor based on rank', () => {
      const instance           = new RankRecolor(mockData, mockRankParameters)
      const mockCurrentElement = {
        childNodes: [
          {},
          { attributes: { playerid: { value: '1' } } },
        ],
        parentNode: {
          append: jest.fn(),
        },
      }

      mockRankParameters.stats.getPlayerRank.mockReturnValue(1)

      instance.execute(mockCurrentElement)

      expect(MiscElementFactory.create).toHaveBeenCalledTimes(3)
      expect(mockCurrentElement.parentNode.append).toHaveBeenCalled()

      const appendedElement = mockCurrentElement.parentNode.append.mock.calls[0][0]

      expect(appendedElement.style.color).toBe('red')
    })

    it('should use fallback method if statsinterface is default value from constructor', () => {
      const instance = new RankRecolor(mockData)

      expect(instance.statsInterfaceInstance).toEqual({})

      const mockCurrentElement = {
        childNodes: [
          {},
          { attributes: { playerid: { value: '1' } } },
        ],
        parentNode: {
          append: jest.fn(),
        },
        dataset: {
          tooltipContent: '<th>this looks like a rank 123</th>',
        },
      }

      jest.spyOn(RankRecolor, 'userRankFallback')

      instance.execute(mockCurrentElement)

      expect(RankRecolor.userRankFallback).toHaveBeenCalled()
      expect(instance.rankDisplayName).toBe('Gesamt')
      expect(mockCurrentElement.parentNode.append).toHaveBeenCalled()
    })

    it('should recolor rank info on rank bigger than ranks in rankData', () => {
      const instance = new RankRecolor(mockData, mockRankParameters)

      const mockCurrentElement = {
        childNodes: [
          {},
          { attributes: { playerid: { value: '3' } } },
        ],
        parentNode: {
          append: jest.fn(),
        },
      }

      // Mock player rank that is bigger than the biggest rank in rankData
      instance.statsInterfaceInstance.getPlayerRank.mockReturnValue(9999)

      instance.execute(mockCurrentElement)

      expect(MiscElementFactory.create).toHaveBeenCalledTimes(3)
      expect(mockCurrentElement.parentNode.append).toHaveBeenCalled()

      const appendedElement = mockCurrentElement.parentNode.append.mock.calls[0][0]

      expect(appendedElement.style.color).toBe('blue')
    })

    it('should add rank info but not recolor if no matching rankData found', () => {
      const instance = new RankRecolor(mockData, mockRankParameters)

      const mockCurrentElement = {
        childNodes: [
          {},
          { attributes: { playerid: { value: '3' } } },
        ],
        parentNode: {
          append: jest.fn(),
        },
      }

      // Mock player rank that is smaller than the smallest rank in rankData
      instance.statsInterfaceInstance.getPlayerRank.mockReturnValue(0)

      instance.execute(mockCurrentElement)

      expect(MiscElementFactory.create).toHaveBeenCalledTimes(3)
      expect(mockCurrentElement.parentNode.append).toHaveBeenCalled()

      const appendedElement = mockCurrentElement.parentNode.append.mock.calls[0][0]

      expect(appendedElement.style.color).toBeUndefined()
    })
  })

  describe('userRankFallback', () => {
    it('should return total rank from tooltip content', () => {
      const mockCurrentElement = {
        dataset: {
          tooltipContent: '<th>this looks like a rank 123</th>',
        },
      }

      const userRank = RankRecolor.userRankFallback(mockCurrentElement)

      expect(userRank).toBe('123')
    })
  })

  describe('getRankSelectorData', () => {
    it('should return undefined if no featureConfig passed', () => {
      const rankSelectorData = RankRecolor.getRankSelectorData()

      expect(rankSelectorData).toBeUndefined()
    })

    it('should return undefined if no rankSelector featureConfig passed', () => {
      const rankSelectorData = RankRecolor.getRankSelectorData([ { feature: 'test' } ])

      expect(rankSelectorData).toBeUndefined()
    })

    it('should return undefined if no data property in rankSelector featureConfig', () => {
      const rankSelectorData = RankRecolor.getRankSelectorData([ { feature: 'rankSelector' } ])

      expect(rankSelectorData).toBeUndefined()
    })

    it('should return undefined if data property in rankSelector featureConfig is not an array', () => {
      const rankSelectorData = RankRecolor.getRankSelectorData([ { feature: 'rankSelector', data: 'test' } ])

      expect(rankSelectorData).toBeUndefined()
    })

    it('should return data property in rankSelector featureConfig', () => {
      const rankSelectorData = RankRecolor.getRankSelectorData([ { feature: 'rankSelector', data: [] } ])

      expect(rankSelectorData).toEqual([])
    })
  })

  describe('getParams', () => {
    it('should return params object with correct rank and stats', () => {
      const mockConfig = [
        { feature: 'rankSelector', data: [] },
      ]

      const mockStatsInstance = {}

      const parameters = RankRecolor.getParams(mockConfig, mockStatsInstance)

      expect(parameters).toEqual({
        params: {
          rank  : [],
          stats : mockStatsInstance,
        },
      })
    })
  })
})

import RankRecolor        from '../../../src/features/rankrecolor/RankRecolor.js'
import RankUtils          from '../../../src/features/rankrecolor/RankUtils.js'
import HtmlElementFactory from '../../../src/userinterface/factories/HtmlElementFactory.js'

jest.mock('../../../src/userinterface/factories/HtmlElementFactory.js', () => ({
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
  let mockCurrentElement
  let mockRankParameters
  const mockData = [
    { key: 1, value: 'red' },
    { key: 2, value: 'blue' },
  ]

  beforeEach(() => {
    jest.spyOn(HtmlElementFactory, 'create')

    mockRankParameters = {
      params: {
        rank: [
          { checked: false, value: 'rank', displayName: 'Gesamt' },
          { checked: true, value: 'testRank', displayName: 'TestRank' },
        ],
        stats: {
          getPlayerRank: jest.fn(),
        },
      },
    }

    mockCurrentElement = {
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

    it('should set defaut rank type and dispayname if rank / stats parameter have wrong type', () => {
      const instance = new RankRecolor(mockData, { params: { rank: 'test', stats: 'test' } })

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
      const instance = new RankRecolor(mockData, mockRankParameters)

      mockRankParameters.params.stats.getPlayerRank.mockReturnValue(1)

      instance.execute(mockCurrentElement)

      expect(HtmlElementFactory.create).toHaveBeenCalledTimes(3)
      expect(mockCurrentElement.parentNode.append).toHaveBeenCalled()

      const appendedElement = mockCurrentElement.parentNode.append.mock.calls[0][0]

      expect(appendedElement.style.color).toBe('red')
    })

    it('should use fallback method if statsinterface is default value from constructor', () => {
      const instance         = new RankRecolor(mockData, mockRankParameters)
      instance.statsInstance = {}
      expect(instance.statsInstance).toEqual({})

      jest.spyOn(RankUtils, 'userRankFallback')

      instance.execute(mockCurrentElement)

      expect(RankUtils.userRankFallback).toHaveBeenCalled()
      expect(instance.rankDisplayName).toBe('Gesamt')
      expect(mockCurrentElement.parentNode.append).toHaveBeenCalled()
    })

    it('should use fallback method if statsinterface returns undefined', () => {
      const instance = new RankRecolor(mockData, mockRankParameters)

      expect(instance.statsInstance).toEqual(mockRankParameters.params.stats)

      instance.statsInstance.getPlayerRank.mockReturnValue()

      jest.spyOn(RankUtils, 'userRankFallback')

      instance.execute(mockCurrentElement)

      expect(RankUtils.userRankFallback).toHaveBeenCalled()
      expect(instance.rankDisplayName).toBe('Gesamt')
      expect(mockCurrentElement.parentNode.append).toHaveBeenCalled()
    })

    it('should have * added to the rankText if fallback method was used', () => {
      const instance = new RankRecolor(mockData, mockRankParameters)

      expect(instance.statsInstance).toEqual(mockRankParameters.params.stats)

      instance.statsInstance.getPlayerRank.mockReturnValue()

      jest.spyOn(RankUtils, 'userRankFallback')

      instance.execute(mockCurrentElement)

      expect(RankUtils.userRankFallback).toHaveBeenCalled()
      expect(instance.rankDisplayName).toBe('Gesamt')

      expect(HtmlElementFactory.create.mock.calls[2][1].textContent).toBe('Gesamt: 123 *')
      expect(HtmlElementFactory.create).toHaveBeenCalledTimes(3)
      expect(mockCurrentElement.parentNode.append).toHaveBeenCalled()
    })

    it('should recolor rank info on rank bigger than ranks in rankData', () => {
      const instance = new RankRecolor(mockData, mockRankParameters)

      // Mock player rank that is bigger than the biggest rank in rankData
      instance.statsInstance.getPlayerRank.mockReturnValue(9999)

      instance.execute(mockCurrentElement)

      expect(HtmlElementFactory.create).toHaveBeenCalledTimes(3)
      expect(mockCurrentElement.parentNode.append).toHaveBeenCalled()

      const appendedElement = mockCurrentElement.parentNode.append.mock.calls[0][0]

      expect(appendedElement.style.color).toBe('blue')
    })

    it('should add rank info but not recolor if no matching rankData found', () => {
      mockCurrentElement.childNodes[1].attributes.playerid.value = '3'

      const instance = new RankRecolor(mockData, mockRankParameters)

      // Mock player rank that is smaller than the smallest rank in rankData
      instance.statsInstance.getPlayerRank.mockReturnValue(0)

      instance.execute(mockCurrentElement)

      expect(HtmlElementFactory.create).toHaveBeenCalledTimes(3)
      expect(mockCurrentElement.parentNode.append).toHaveBeenCalled()

      const appendedElement = mockCurrentElement.parentNode.append.mock.calls[0][0]

      expect(appendedElement.style.color).toBeUndefined()
    })
  })

  describe('userRankFallback', () => {
    it('should return total rank from tooltip content', () => {
      const userRank = RankUtils.userRankFallback(mockCurrentElement)

      expect(userRank).toBe('123')
    })
  })

  describe('getRankSelectorData', () => {
    it('should return undefined if no featureConfig passed', () => {
      const rankSelectorData = RankUtils.getRankSelectorData()

      expect(rankSelectorData).toBeUndefined()
    })

    it('should return undefined if no rankSelector featureConfig passed', () => {
      const rankSelectorData = RankUtils.getRankSelectorData([ { feature: 'test' } ])

      expect(rankSelectorData).toBeUndefined()
    })

    it('should return undefined if no data property in rankSelector featureConfig', () => {
      const rankSelectorData = RankUtils.getRankSelectorData([ { feature: 'rankSelector' } ])

      expect(rankSelectorData).toBeUndefined()
    })

    it('should return undefined if data property in rankSelector featureConfig is not an array', () => {
      const rankSelectorData = RankUtils.getRankSelectorData([ { feature: 'rankSelector', data: 'test' } ])

      expect(rankSelectorData).toBeUndefined()
    })

    it('should return data property in rankSelector featureConfig', () => {
      const rankSelectorData = RankUtils.getRankSelectorData([ { feature: 'rankSelector', data: [] } ])

      expect(rankSelectorData).toEqual([])
    })
  })

  describe('getParams', () => {
    it('should return params object with correct rank and stats', () => {
      const mockConfig = [
        { feature: 'rankSelector', data: [] },
      ]

      const mockStatsInstance = {}

      const parameters = RankUtils.getParams(mockConfig, mockStatsInstance)

      expect(parameters).toEqual({
        params: {
          rank  : [],
          stats : mockStatsInstance,
        },
      })
    })
  })
})

import StatsDataFetcher from '../../src/statisticsinterface/StatsDataFetcher.js'

// Mocking the GM.xmlHttpRequest
global.GM = {
  xmlHttpRequest: jest.fn(),
}

describe('StatsDataFetcher', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('makes the correct request using data from StaticData', async () => {
    GM.xmlHttpRequest.mockImplementationOnce(({ onload }) => {
      onload()
      return {}
    })

    await StatsDataFetcher.fetchStatsJson()

    expect(GM.xmlHttpRequest).toHaveBeenCalledWith({
      method  : StatsDataFetcher.HTTP_METHOD,
      timeout : StatsDataFetcher.HTTP_REQUEST_TIMEOUT,
      url     : StatsDataFetcher.STATS_URL,
      onload  : expect.any(Function),
      onerror : expect.any(Function),
    })
  })

  it('resolves when onload is called', async () => {
    const data = { dummy: 'data' }

    GM.xmlHttpRequest.mockImplementationOnce(({ onload }) => {
      onload(data)
      return {}
    })

    const result = await StatsDataFetcher.fetchStatsJson()

    expect(result).toEqual(data)
  })

  it('rejects when onerror is called', async () => {
    const error = new Error('Dummy error')

    GM.xmlHttpRequest.mockImplementationOnce(({ onerror }) => {
      onerror(error)
      return {}
    })

    await expect(StatsDataFetcher.fetchStatsJson()).rejects.toThrow('Dummy error')
  })
})

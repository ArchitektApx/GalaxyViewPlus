import {
  StorageInterfaceMock,
  StatsDataFetcherMock,
  StatsDataLoaderMock,
} from './mocks/SetupStatsDataMocks.js'
import LogLevel            from '../../src/enum/LogLevel.js'
import StaticData          from '../../src/staticdata/StaticData.js'
import StatisticsInterface from '../../src/statisticsinterface/StatisticsInterface.js'
import Validator           from '../../src/validator/Validator.js'

Validator.getTimestamp = jest.fn().mockReturnValue(99_999)

const mockStatsData = {
  123 : { playerName: 'John', rank: 5, otherrank: 10 },
  456 : { playerName: 'Doe', rank: 10, otherrank: 5 },
}

const logMessageRefresh = 'StatsData will be refreshed'
const logMessageError   = 'Error while downloading StatsData:'

describe('StatisticsInterface', () => {
  let instance

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
    // Reset the singleton instance
    StatisticsInterface._resetInstance()

    instance = new StatisticsInterface()
  })

  describe('initialization', () => {
    it('should create a singleton instance', () => {
      const secondInstance = new StatisticsInterface()

      expect(secondInstance).toBe(instance)
    })
  })

  describe('Interfaces', () => {
    it('should return player ID by name', () => {
      instance.statsData = mockStatsData

      expect(instance.getPlayerIDByName('John')).toBe('123')
    })

    it('should return player name by ID', () => {
      instance.statsData = mockStatsData

      expect(instance.getPlayerNameById('123')).toBe('John')
    })

    it('should return player rank by ID', () => {
      instance.statsData = mockStatsData

      expect(instance.getPlayerRank('123')).toBe(5)
    })

    it('should return rank data for player by ID', () => {
      instance.statsData = mockStatsData
      expect(instance.getPlayerRankData('123')).toEqual(instance.statsData['123'])
    })
  })

  describe('#checkDataStatus', () => {
    const fetchResponse = {
      status       : 200,
      responseText : JSON.stringify([
        { playerId: 1, playerName: 'John' },
        { playerId: 2, playerName: 'Jane' },
      ]),
    }

    it('should load stats from storage if valid', async () => {
      const mockStatus = {
        status    : StatisticsInterface.STATUS_FINISHED,
        timestamp : Date.now(),
      }

      StatsDataLoaderMock.fromStorage.mockReturnValueOnce(mockStatsData)

      await instance.initialize()

      expect(instance.statsData).toEqual(mockStatsData)
      expect(instance.statsAvailable).toBeTruthy()
    })

    it('should fetch and process stats if data is stale', async () => {
      const staleTimestamp = new Date()

      staleTimestamp.setHours(staleTimestamp.getHours() - (StaticData.UPDATE_INTERVAL + 1))

      const mockStatus = {
        status    : StatisticsInterface.STATUS_FINISHED,
        timestamp : staleTimestamp,
      }

      StorageInterfaceMock.getStorageItem
        .mockImplementationOnce(() => mockStatus)
        .mockImplementationOnce(() => ({}))

      StatsDataFetcherMock.fetchStatsJson.mockResolvedValueOnce(fetchResponse)

      await instance.initialize()

      expect(instance.statsAvailable).toBeTruthy()
      expect(instance.statsData).not.toEqual({})
    })

    it('should fetch and process stats if data is missing', async () => {
      const mockStatus = {
        status    : StatisticsInterface.STATUS_FINISHED,
        timestamp : Date.now(),
      }

      StorageInterfaceMock.getStorageItem
        .mockImplementationOnce(() => mockStatus)
        .mockImplementationOnce(() => ({}))

      StatsDataFetcherMock.fetchStatsJson.mockResolvedValueOnce(fetchResponse)

      await instance.initialize()

      expect(instance.statsAvailable).toBeTruthy()
      expect(instance.statsData).not.toEqual({})
    })
  })

  describe('logging', () => {
    it('should have static log method that calls StorageInterface.writeLog', () => {
      StatisticsInterface.log('test', LogLevel.DEBUG)
      expect(StorageInterfaceMock.writeLog).toHaveBeenCalled()
    })

    it('should call writeLog when data is loaded from storage', async () => {
      const mockStatus = {
        status    : StatisticsInterface.STATUS_FINISHED,
        timestamp : Date.now(),
      }

      StorageInterfaceMock.getStorageItem
        .mockImplementationOnce(() => mockStatus)
        .mockImplementationOnce(() => mockStatsData)
      await instance.initialize()
      expect(StorageInterfaceMock.writeLog).toHaveBeenCalled()
    })

    it('should use Loglevel enum as default', () => {
      StatisticsInterface.log('test')
      expect(StorageInterfaceMock.writeLog).toHaveBeenCalledWith(
        'test',
        'info',
        'StatisticsInterface',
        ''
      )
    })

    it('should use its own class name for logging', () => {
      StatisticsInterface.log('test', LogLevel.ERROR)
      expect(StorageInterfaceMock.writeLog).toHaveBeenCalledWith(
        'test',
        'error',
        'StatisticsInterface',
        ''
      )
    })

    it('should use the provided error object for logging', () => {
      const error = new Error('test error')
      StatisticsInterface.log('test', LogLevel.ERROR, error)
      expect(StorageInterfaceMock.writeLog).toHaveBeenCalledWith(
        'test',
        'error',
        'StatisticsInterface',
        error
      )
    })
  })

  describe('#fetchAndProcessStats', () => {
    it('should log error when fetch fails', async () => {
      const mockStatus = {
        status    : StatisticsInterface.STATUS_FINISHED,
        timestamp : new Date(),
      }

      StorageInterfaceMock.getStorageItem
        .mockImplementationOnce(() => mockStatus)
        .mockImplementationOnce(() => ({}))

      // Mock a failed fetch
      StatsDataFetcherMock.fetchStatsJson.mockRejectedValueOnce(new Error('Network error'))

      await instance.initialize()

      expect(StorageInterfaceMock.writeLog).toHaveBeenNthCalledWith(
        1, logMessageRefresh, LogLevel.DEBUG, 'StatisticsInterface', ''
      )
      expect(StorageInterfaceMock.writeLog).toHaveBeenNthCalledWith(
        2, logMessageError, LogLevel.WARN, 'StatisticsInterface', ''
      )
    })

    it('should handle status not being 200', async () => {
      const mockStatus = {
        status    : StatisticsInterface.STATUS_IN_PROGRESS,
        timestamp : new Date(),
      }

      StorageInterfaceMock.getStorageItem
        .mockImplementationOnce(() => mockStatus)
        .mockImplementationOnce(() => ({}))

      // Mock a failed fetch
      StatsDataFetcherMock.fetchStatsJson.mockResolvedValueOnce({
        status       : 404,
        responseText : '',
      })

      await instance.initialize()

      expect(StorageInterfaceMock.writeLog).toHaveBeenNthCalledWith(
        1, logMessageRefresh, LogLevel.DEBUG, 'StatisticsInterface', ''
      )
      expect(StorageInterfaceMock.writeLog).toHaveBeenNthCalledWith(
        2, logMessageError, LogLevel.WARN, 'StatisticsInterface', ''
      )
    })

    it('should handle using old data when fetch fails', async () => {
      const mockStatus = {
        status    : StatisticsInterface.STATUS_IN_PROGRESS,
        timestamp : new Date(),
      }

      StatsDataLoaderMock.fromStorage.mockImplementationOnce(() => {})
      StatsDataFetcherMock.fetchStatsJson.mockRejectedValueOnce(new Error('Network error'))
      StatsDataLoaderMock.fromStorage.mockImplementationOnce(() => mockStatsData)

      await instance.initialize()
      expect(StorageInterfaceMock.writeLog).toHaveBeenNthCalledWith(
        1, logMessageRefresh, LogLevel.DEBUG, 'StatisticsInterface', ''
      )
      expect(StorageInterfaceMock.writeLog).toHaveBeenNthCalledWith(
        2, logMessageError, LogLevel.WARN, 'StatisticsInterface', ''
      )
      expect(StorageInterfaceMock.writeLog).toHaveBeenNthCalledWith(
        4,
        'Try using old StatsData as fallback if available',
        LogLevel.DEBUG,
        'StatisticsInterface',
        ''
      )
      expect(instance.statsData).toEqual(mockStatsData)
      expect(instance.statsAvailable).toBeTruthy()
    })
  })
})

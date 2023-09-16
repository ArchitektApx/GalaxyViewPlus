import {
  StorageInterfaceMock,
  StatsDataFetcherMock,
  StatsDataLoaderMock,
} from './mocks/SetupStatsDataMocks.js'
import LogLevel           from '../../src/enum/LogLevel.js'
import StaticData         from '../../src/staticdata/StaticData.js'
import StatsDataInterface from '../../src/statsdata/StatsDataInterface.js'
import Validator          from '../../src/validator/Validator.js'

Validator.getTimestamp = jest.fn().mockReturnValue(99_999)

const mockStatsData = {
  123 : { playerName: 'John', rank: 5, otherrank: 10 },
  456 : { playerName: 'Doe', rank: 10, otherrank: 5 },
}

const logMessageRefresh = 'StatsData will be refreshed'
const logMessageError   = 'Error while downloading StatsData:'

describe('StatsDataInterface', () => {
  let instance

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
    // Reset the singleton instance
    StatsDataInterface._resetInstance()

    instance = new StatsDataInterface()
  })

  describe('initialization', () => {
    it('should create a singleton instance', () => {
      const secondInstance = new StatsDataInterface()

      expect(secondInstance).toBe(instance)
    })
  })

  describe('Interfaces', () => {
    it('should return player ID by name', () => {
      instance.statsData      = mockStatsData
      instance.statsAvailable = true

      expect(instance.getPlayerIDByName('John')).toBe('123')
    })

    it('should return undefined for ID if player name is not found', () => {
      instance.statsData      = mockStatsData
      instance.statsAvailable = true

      expect(instance.getPlayerIDByName('Jane')).toBeUndefined()
    })

    it('should return undefined for ID if stats are not available', () => {
      instance.statsData      = mockStatsData
      instance.statsAvailable = false

      expect(instance.getPlayerIDByName('John')).toBeUndefined()
    })

    it('should return player name by ID', () => {
      instance.statsData      = mockStatsData
      instance.statsAvailable = true

      expect(instance.getPlayerNameById('123')).toBe('John')
    })

    it('should return undefined if player ID is not found', () => {
      instance.statsData      = mockStatsData
      instance.statsAvailable = true

      expect(instance.getPlayerNameById('999')).toBeUndefined()
    })

    it('should return undefined for playerName if stats are not available', () => {
      instance.statsData      = mockStatsData
      instance.statsAvailable = false

      expect(instance.getPlayerNameById('123')).toBeUndefined()
    })

    it('should return playerrank by ID', () => {
      instance.statsData      = mockStatsData
      instance.statsAvailable = true

      expect(instance.getPlayerRank('123')).toBe(5)
    })

    it('should return undefined for playerRank if player ID is not found', () => {
      instance.statsData      = mockStatsData
      instance.statsAvailable = true

      expect(instance.getPlayerRank('999')).toBeUndefined()
    })

    it('shoul return undefined for playerRank if stats are not available', () => {
      instance.statsData      = mockStatsData
      instance.statsAvailable = false

      expect(instance.getPlayerRank('123')).toBeUndefined()
    })

    it('should return rank data for player by ID', () => {
      instance.statsData      = mockStatsData
      instance.statsAvailable = true
      expect(instance.getPlayerRankData('123')).toEqual(instance.statsData['123'])
    })

    it('should return undefined for rank data if player ID is not found', () => {
      instance.statsData      = mockStatsData
      instance.statsAvailable = true

      expect(instance.getPlayerRankData('999')).toBeUndefined()
    })

    it('should return undefined for rank data if stats are not available', () => {
      instance.statsData      = mockStatsData
      instance.statsAvailable = false

      expect(instance.getPlayerRankData('123')).toBeUndefined()
    })

    it('should return undefined if stats data is empty', () => {
      instance.statsData      = {}
      instance.statsAvailable = true

      expect(instance.getPlayerRank('123')).toBeUndefined()
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
        status    : StatsDataInterface.STATUS_FINISHED,
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
        status    : StatsDataInterface.STATUS_FINISHED,
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
        status    : StatsDataInterface.STATUS_FINISHED,
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
      StatsDataInterface.log('test', LogLevel.DEBUG)
      expect(StorageInterfaceMock.writeLog).toHaveBeenCalled()
    })

    it('should call writeLog when data is loaded from storage', async () => {
      const mockStatus = {
        status    : StatsDataInterface.STATUS_FINISHED,
        timestamp : Date.now(),
      }

      StorageInterfaceMock.getStorageItem
        .mockImplementationOnce(() => mockStatus)
        .mockImplementationOnce(() => mockStatsData)
      await instance.initialize()
      expect(StorageInterfaceMock.writeLog).toHaveBeenCalled()
    })

    it('should use Loglevel enum as default', () => {
      StatsDataInterface.log('test')
      expect(StorageInterfaceMock.writeLog).toHaveBeenCalledWith(
        'test',
        'info',
        'StatsDataInterface',
        ''
      )
    })

    it('should use its own class name for logging', () => {
      StatsDataInterface.log('test', LogLevel.ERROR)
      expect(StorageInterfaceMock.writeLog).toHaveBeenCalledWith(
        'test',
        'error',
        'StatsDataInterface',
        ''
      )
    })

    it('should use the provided error object for logging', () => {
      const error = new Error('test error')
      StatsDataInterface.log('test', LogLevel.ERROR, error)
      expect(StorageInterfaceMock.writeLog).toHaveBeenCalledWith(
        'test',
        'error',
        'StatsDataInterface',
        error
      )
    })
  })

  describe('#fetchAndProcessStats', () => {
    it('should log error when fetch fails', async () => {
      const mockStatus = {
        status    : StatsDataInterface.STATUS_FINISHED,
        timestamp : new Date(),
      }

      StorageInterfaceMock.getStorageItem
        .mockImplementationOnce(() => mockStatus)
        .mockImplementationOnce(() => ({}))

      // Mock a failed fetch
      StatsDataFetcherMock.fetchStatsJson.mockRejectedValueOnce(new Error('Network error'))

      await instance.initialize()

      expect(StorageInterfaceMock.writeLog).toHaveBeenNthCalledWith(
        1, logMessageRefresh, LogLevel.DEBUG, 'StatsDataInterface', ''
      )
      expect(StorageInterfaceMock.writeLog).toHaveBeenNthCalledWith(
        2, logMessageError, LogLevel.WARN, 'StatsDataInterface', ''
      )
    })

    it('should handle status not being 200', async () => {
      const mockStatus = {
        status    : StatsDataInterface.STATUS_IN_PROGRESS,
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
        1, logMessageRefresh, LogLevel.DEBUG, 'StatsDataInterface', ''
      )
      expect(StorageInterfaceMock.writeLog).toHaveBeenNthCalledWith(
        2, logMessageError, LogLevel.WARN, 'StatsDataInterface', ''
      )
    })

    it('should handle using old data when fetch fails', async () => {
      const mockStatus = {
        status    : StatsDataInterface.STATUS_IN_PROGRESS,
        timestamp : new Date(),
      }

      StatsDataLoaderMock.fromStorage.mockImplementationOnce(() => {})
      StatsDataFetcherMock.fetchStatsJson.mockRejectedValueOnce(new Error('Network error'))
      StatsDataLoaderMock.fromStorage.mockImplementationOnce(() => mockStatsData)

      await instance.initialize()
      expect(StorageInterfaceMock.writeLog).toHaveBeenNthCalledWith(
        1, logMessageRefresh, LogLevel.DEBUG, 'StatsDataInterface', ''
      )
      expect(StorageInterfaceMock.writeLog).toHaveBeenNthCalledWith(
        2, logMessageError, LogLevel.WARN, 'StatsDataInterface', ''
      )
      expect(StorageInterfaceMock.writeLog).toHaveBeenNthCalledWith(
        4,
        'Try using old StatsData as fallback if available',
        LogLevel.DEBUG,
        'StatsDataInterface',
        ''
      )
      expect(instance.statsData).toEqual(mockStatsData)
      expect(instance.statsAvailable).toBeTruthy()
    })
  })
})

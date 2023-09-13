import StatsDataLoader  from '../../src/statisticsinterface/StatsDataLoader.js' // Adjust the import path as needed
import StatsDataTimer   from '../../src/statisticsinterface/StatsDataTimer.js' // Adjust the import path as needed
import StorageInterface from '../../src/storageinterface/StorageInterface.js'

jest.mock('../../src/storageinterface/StorageInterface.js')
jest.mock('../../src/statisticsinterface/StatsDataTimer.js')

describe('StatsDataLoader', () => {
  afterEach(() => {
    jest.clearAllMocks()

    StorageInterface.getStorageItem.mockReset()
  })

  describe('fromStorage', () => {
    it('returns statsData if status is finished and timestamp is within last interval', () => {
      const lastintervalTime = Date.now() - 100
      // Mock the timer calculation
      StatsDataTimer.calculate.mockReturnValue(lastintervalTime)

      // Mock the storage calls
      StorageInterface.getStorageItem.mockReturnValueOnce({
        status    : StatsDataLoader.STATUS_FINISHED,
        timestamp : Date.now(Date.now()),
      })
      StorageInterface.getStorageItem.mockReturnValueOnce({ key: 'value' })

      const result = StatsDataLoader.fromStorage()
      expect(result).toEqual({ key: 'value' })
    })

    it('returns undefined if status is not finished', () => {
      StorageInterface.getStorageItem.mockReturnValueOnce({
        status    : StatsDataLoader.STATUS_IN_PROGRESS,
        timestamp : 1000,
      })

      const result = StatsDataLoader.fromStorage()
      expect(result).toBeUndefined()
    })

    it('returns undefined if timestamp is not within the last interval', () => {
      StorageInterface.getStorageItem.mockReturnValueOnce({
        status    : StatsDataLoader.STATUS_FINISHED,
        timestamp : 1000,
      })
      StorageInterface.getStorageItem.mockReturnValueOnce({ key: 'value' })

      // Mock the timer calculation
      StatsDataTimer.calculate.mockReturnValue(2000)

      const result = StatsDataLoader.fromStorage()
      expect(result).toBeUndefined()
    })

    it('returns statsData without status check when ignorestatus is true', () => {
      StorageInterface.getStorageItem.mockReturnValueOnce({
        status    : StatsDataLoader.STATUS_FINISHED,
        timestamp : 1000,
      })
      StorageInterface.getStorageItem.mockReturnValueOnce({ key: 'value' })

      const result = StatsDataLoader.fromStorage(true)
      expect(result).toEqual({ key: 'value' })
    })
  })

  describe('isDataValid', () => {
    it('returns true for non-empty statsData', () => {
      const statsData = { key: 'value' }
      const result    = StatsDataLoader.isDataValid(statsData)
      expect(result).toBe(true)
    })

    it('returns false for empty statsData', () => {
      const statsData = {}
      const result    = StatsDataLoader.isDataValid(statsData)
      expect(result).toBe(false)
    })
  })

  describe('isDataValidWithTimestamp', () => {
    it('returns true if status is finished and timestamp is within last interval', () => {
      const lastintervalTime = Date.now()
      const status           = {
        status    : StatsDataLoader.STATUS_FINISHED,
        timestamp : lastintervalTime,
      }

      // Mock the timer calculation
      StatsDataTimer.calculate.mockReturnValue(Date.now() - 100)

      const result = StatsDataLoader.isDataValidWithTimestamp(status, { key: 'value' })
      expect(result).toBe(true)
    })

    it('returns false if status is not finished', () => {
      const status = {
        status    : StatsDataLoader.STATUS_IN_PROGRESS,
        timestamp : 1000,
      }

      const result = StatsDataLoader.isDataValidWithTimestamp(status, { key: 'value' })
      expect(result).toBe(false)
    })

    it('returns false if timestamp is not within the last interval', () => {
      const status = {
        status    : StatsDataLoader.STATUS_FINISHED,
        timestamp : 1000,
      }

      // Mock the timer calculation
      StatsDataTimer.calculate.mockReturnValue(2000)

      const result = StatsDataLoader.isDataValidWithTimestamp(status, { key: 'value' })
      expect(result).toBe(false)
    })
  })
})

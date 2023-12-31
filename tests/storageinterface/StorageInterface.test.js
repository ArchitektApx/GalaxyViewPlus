import LogLevel         from '../../src/enum/LogLevel.js'
import StaticData       from '../../src/staticdata/StaticData.js'
import StorageInterface from '../../src/storageinterface/StorageInterface.js'
import LocalStorageMock from './mocks/SetupLocalStorageMock.js'

describe('StorageInterface', () => {
  let localStorageMock

  beforeAll(() => {
    global.localStorage   = new LocalStorageMock()
    localStorageMock      = global.localStorage
    global.__scriptName__ = 'TestScript'
  })

  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('CRUD operations', () => {
    it('should save an item to storage', () => {
      expect(StorageInterface.setStorageItem('testKey', { test: 'value' })).toBe(true)
      expect(JSON.parse(localStorage.getItem('testKey'))).toEqual({ test: 'value' })
    })

    it('should retrieve an item from storage', () => {
      localStorage.setItem('testKey', JSON.stringify({ test: 'value' }))
      expect(StorageInterface.getStorageItem('testKey')).toEqual({ test: 'value' })
    })

    it('should delete an item from storage', () => {
      localStorage.setItem('testKey', JSON.stringify({ test: 'value' }))
      expect(StorageInterface.deleteStorageItem('testKey')).toBe(true)
      expect(localStorage.getItem('testKey')).toBeNull()
    })
  })

  describe('Error handling', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {})
      jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    it('should handle errors while saving to storage', () => {
      jest.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error('Test Error1') })
      expect(StorageInterface.setStorageItem('testKey', { test: 'value' })).toBe(false)
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Failed to save a key from Storage'))
    })

    it('should handle errors while deleting from storage', () => {
      jest.spyOn(localStorage, 'removeItem').mockImplementation(() => { throw new Error('Test Error2') })
      expect(StorageInterface.deleteStorageItem('testKey')).toBe(false)
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Failed to delete a key from Storage'))
    })

    it('should handle errors while retrieving from storage by returning default value', () => {
      jest.spyOn(localStorage, 'getItem').mockImplementation(() => { throw new Error('Test Error3') })
      expect(StorageInterface.getStorageItem('testKey')).toEqual({})
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Failed to get a key from Storage'))
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })
  })

  describe('Logging functionality', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {})
      jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    it('should add a log entry', () => {
      StorageInterface.writeLog('Test log')
      const logs = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.DEBUG_LOG)
      expect(logs[0]).toContain('Test log')
    })

    it('should log error in console', () => {
      StorageInterface.writeLog('Test error', LogLevel.ERROR, '', new Error('TestError'))
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test error'))
      expect(console.error).toHaveBeenCalledWith(new Error('TestError'))
    })

    it('should handle removing old logs when max entries is reached', () => {
      const overMax = 5
      Array.from({ length: StaticData.DEBUG_LOG_MAX_ENTRIES + overMax }, (_, index) => index + 1)
      .forEach((index) => {
        StorageInterface.writeLog(`Test log ${ index }`)
      })

      const logs          = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.DEBUG_LOG)
      const lastlognumber = String(StaticData.DEBUG_LOG_MAX_ENTRIES + overMax)

      expect(logs).toHaveLength(StaticData.DEBUG_LOG_MAX_ENTRIES)
      expect(logs[0]).toContain('Test log 6')
      expect(logs[StaticData.DEBUG_LOG_MAX_ENTRIES - 1]).toContain(`Test log ${ lastlognumber }`)
    })

    it('should have static log method that calls its logwrite method StorageInterface.writeLog', () => {
      jest.spyOn(StorageInterface, 'writeLog').mockImplementation(() => {})
      StorageInterface.log('test', LogLevel.DEBUG)

      expect(StorageInterface.writeLog).toHaveBeenCalled()
    })

    it('should use Loglevel enum as default', () => {
      jest.spyOn(StorageInterface, 'writeLog').mockImplementation(() => {})
      StorageInterface.log('test')
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('test', 'info', 'StorageInterface', '')
    })

    it('should use its own class name for logging', () => {
      jest.spyOn(StorageInterface, 'writeLog').mockImplementation(() => {})
      StorageInterface.log('test', LogLevel.ERROR)
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('test', 'error', 'StorageInterface', '')
    })

    it('should use the provided error object for logging', () => {
      jest.spyOn(StorageInterface, 'writeLog').mockImplementation(() => {})
      const error = new Error('test error')
      StorageInterface.log('test', LogLevel.ERROR, error)
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('test', 'error', 'StorageInterface', error)
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })
  })
})

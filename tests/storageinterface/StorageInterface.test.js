/* eslint-disable no-loops/no-loops */
/* eslint-disable sonarjs/no-duplicate-string */
import LogLevel         from '../../src/enum/LogLevel.js'
import StaticData       from '../../src/staticdata/StaticData.js'
import StorageInterface from '../../src/storageinterface/StorageInterface.js'

describe('StorageInterface', () => {
  // Mock localStorage using LocalStorageMock
  let localStorageMock

  class LocalStorageMock {
    constructor() {
      this.store = {}
    }

    clear() {
      this.store = {}
    }

    getItem(key) {
      return this.store[key] || null
    }

    keys() {
    // Filter out internal properties
      return Object.keys(this.store).filter(k => k !== 'store')
    }

    removeItem(key) {
      delete this.store[key]
    }

    setItem(key, value) {
      this.store[key] = value
    }
  }

  beforeAll(() => {
    global.localStorage = new LocalStorageMock()
    localStorageMock    = global.localStorage
    // eslint-disable-next-line no-underscore-dangle
    global.__scriptName__ = 'TestScript'
  })

  // Clear mock localStorage before each test
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
      jest.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error('Test Error') })
      expect(StorageInterface.setStorageItem('testKey', { test: 'value' })).toBe(false)
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Failed to save a key from Storage'))
    })

    it('should handle errors while deleting from storage', () => {
      jest.spyOn(localStorage, 'removeItem').mockImplementation(() => { throw new Error('Test Error') })
      expect(StorageInterface.deleteStorageItem('testKey')).toBe(false)
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Failed to delete a key from Storage'))
    })

    it('should handle errors while retrieving from storage by returning default value', () => {
      jest.spyOn(localStorage, 'getItem').mockImplementation(() => { throw new Error('Test Error') })
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
      for (let index = 0; index < StaticData.DEBUG_LOG_MAX_ENTRIES + 1; index++) {
        StorageInterface.writeLog(`Test log ${ index }`)
      }

      const logs = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.DEBUG_LOG)

      expect(logs).toHaveLength(StaticData.DEBUG_LOG_MAX_ENTRIES)
      expect(logs[0]).toContain('Test log 1')
      expect(logs[StaticData.DEBUG_LOG_MAX_ENTRIES - 1]).toContain('Test log 20')
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

/* eslint-disable no-loops/no-loops */
/* eslint-disable sonarjs/no-duplicate-string */
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
    // Mock __scriptName__
    // eslint-disable-next-line no-underscore-dangle
    global.__scriptName__ = 'TestScript'
  })

  // Clear mock localStorage before each test
  beforeEach(() => {
    localStorageMock.clear()
  })

  // Clear mock localStorage before each test
  beforeEach(() => {
    localStorageMock.clear()
  })

  // ... rest of your tests ...

  afterAll(() => {
    // Restore the original localStorage
    delete global.localStorage
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

    it('should handle errors while retrieving from storage', () => {
      jest.spyOn(localStorage, 'getItem').mockImplementation(() => { throw new Error('Test Error') })
      expect(StorageInterface.getStorageItem('testKey')).toBe(false)
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
      StorageInterface.writeLog('Test error', 'error', '', new Error('TestError'))
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

    afterAll(() => {
    // Restore the original localStorage
      delete global.localStorage
      // Cleanup mocked __scriptName__
      // eslint-disable-next-line no-underscore-dangle
      delete global.__scriptName__
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })
  })
})

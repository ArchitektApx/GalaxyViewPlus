import ConfigLoader     from '../../src/configmanager/ConfigLoader.js'
import LogLevel         from '../../src/enum/LogLevel.js'
import StaticData       from '../../src/staticdata/StaticData.js'
import StorageInterface from '../../src/storageinterface/StorageInterface.js'
import Validator        from '../../src/validator/Validator.js'

describe('ConfigLoader', () => {
  // Mock dependencies

  // mock page reload and alert method
  global.document = {
    location: {
      reload: jest.fn(),
    },
  }

  global.confirm = jest.fn(() => true)
  global.alert   = jest.fn()

  beforeEach(() => {
    // Mock the StorageInterface methods
    jest.spyOn(StorageInterface, 'getStorageItem').mockReturnValue({})
    jest.spyOn(StorageInterface, 'setStorageItem').mockImplementation(() => {})
    jest.spyOn(StorageInterface, 'writeLog').mockImplementation(() => {})
    jest.spyOn(Validator, 'validateConfig').mockReturnValue(true)
    jest.spyOn(Validator, 'migrateConfig').mockReturnValue({ migrated: 'config' })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('load', () => {
    it('should return the default config if the stored config is empty', () => {
      jest.spyOn(StorageInterface, 'getStorageItem').mockReturnValue(null)
      const config = ConfigLoader.load()

      expect(config).toEqual(StaticData.DEFAULT_CONFIG)
    })

    it('should return the default config if the stored config is invalid', () => {
      jest.spyOn(Validator, 'validateConfig').mockReturnValue(false)
      const config = ConfigLoader.load()

      expect(config).toEqual(StaticData.DEFAULT_CONFIG)
    })

    it('should return the migrated config if the stored config is valid but needs migration', () => {
      jest.spyOn(StorageInterface, 'getStorageItem').mockReturnValue({ some: 'config' })
      jest.spyOn(Validator, 'validateConfig').mockReturnValueOnce(false)
      jest.spyOn(Validator, 'migrateConfig').mockReturnValueOnce({ migrated: 'config' })

      global.confirm = jest.fn(() => true)
      const config   = ConfigLoader.load()

      expect(config).toEqual({ migrated: 'config' })
    })

    it('should not reload after migration if users chooses so', () => {
      jest.spyOn(StorageInterface, 'getStorageItem').mockReturnValue({ some: 'config' })
      jest.spyOn(Validator, 'validateConfig').mockReturnValueOnce(false)
      jest.spyOn(Validator, 'migrateConfig').mockReturnValueOnce({ migrated: 'config' })

      document.location.reload.mockClear()
      // eslint-disable-next-line no-restricted-globals
      confirm.mockReturnValueOnce(false)
      const config = ConfigLoader.load()

      expect(config).toEqual({ migrated: 'config' })
      expect(document.location.reload).not.toHaveBeenCalled()
    })

    it('should return the stored config if it is valid and does not need migration', () => {
      jest.spyOn(StorageInterface, 'getStorageItem').mockReturnValue({ some: 'config' })
      jest.spyOn(Validator, 'validateConfig').mockReturnValueOnce(true)

      const config = ConfigLoader.load()

      expect(config).toEqual({ some: 'config' })
    })
  })

  describe('log', () => {
    it('should use default log level if none is provided', () => {
      ConfigLoader.log('test message')
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('test message', LogLevel.INFO, 'ConfigLoader', '')
    })

    it('should use its name as log name', () => {
      ConfigLoader.log('test message1')
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('test message1', LogLevel.INFO, 'ConfigLoader', '')
    })

    it('should use the provided log level', () => {
      ConfigLoader.log('test message2', LogLevel.WARN)
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('test message2', LogLevel.WARN, 'ConfigLoader', '')
    })
  })
})

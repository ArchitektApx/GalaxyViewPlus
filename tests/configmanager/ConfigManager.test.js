import ConfigManager    from '../../src/configmanager/ConfigManager.js'
import LogLevel         from '../../src/enum/LogLevel.js'
import StaticData       from '../../src/staticdata/StaticData.js'
import StorageInterface from '../../src/storageinterface/StorageInterface.js'
import Validator        from '../../src/validator/Validator.js'

describe('ConfigManager', () => {
  // Mock dependencies

  // mock page reload and alert method
  global.document = {
    location: {
      reload: jest.fn(),
    },
  }

  global.alert = jest.fn()

  beforeEach(() => {
    // Mock the StorageInterface methods
    jest.spyOn(StorageInterface, 'getStorageItem').mockReturnValue({})
    jest.spyOn(StorageInterface, 'setStorageItem').mockImplementation(() => {})
    jest.spyOn(StorageInterface, 'writeLog').mockImplementation(() => {})
    jest.spyOn(Validator, 'validateConfig').mockReturnValue(true)
    jest.spyOn(Validator, 'migrateConfig').mockReturnValue({ migrated: 'config' })

    // eslint-disable-next-line no-underscore-dangle
    ConfigManager._resetInstance()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should implement singleton pattern', () => {
      const instance1 = new ConfigManager()
      const instance2 = new ConfigManager()

      expect(instance1).toBe(instance2)
    })

    it('should initialize commandMap correctly', () => {
      const manager = new ConfigManager()

      expect(manager.commandMap.changeData).toBeDefined()
      expect(manager.commandMap.changeSorting).toBeDefined()
      expect(manager.commandMap.changeStatus).toBeDefined()
      expect(manager.commandMap.removeRow).toBeDefined()
      expect(manager.commandMap.resetConfig).toBeDefined()
      expect(manager.commandMap.saveConfig).toBeDefined()
    })
  })

  describe('actionCallback', () => {
    it('should execute the correct command based on actionType', () => {
      const manager     = new ConfigManager()
      const mockCommand = jest.fn()

      manager.commandMap.changeData = { class: mockCommand, systemInput: {} }
      manager.actionCallback('changeData', {})
      expect(mockCommand).toHaveBeenCalled()
    })

    it('should log an error for invalid actionType', () => {
      const manager = new ConfigManager()

      manager.actionCallback('invalidAction', {})
      expect(StorageInterface.writeLog).toHaveBeenCalledWith(
        expect.stringContaining('Invalid Command invalidAction'),
        'error',
        'ConfigManager',
        ''
      )
    })

    it('should log an error when command execution fails', () => {
      const errorObject = new Error('Test Error')

      class MockCommand {
        // eslint-disable-next-line class-methods-use-this
        execute() {
          throw errorObject
        }
      }

      const manager = new ConfigManager()

      manager.commandMap.changeData = { class: MockCommand, systemInput: {} }
      manager.actionCallback('changeData', {})
      expect(StorageInterface.writeLog).toHaveBeenCalledWith(
        expect.stringContaining('Error executing command MockCommand'),
        'error',
        expect.anything(),
        errorObject
      )
    })
  })

  describe('getActionCallback', () => {
    it('should return a bound actionCallback function', () => {
      const manager = new ConfigManager()

      manager.actionCallback = jest.fn()

      const callback = manager.getActionCallback()

      callback('someActionType', 'someInputData')

      // Check if the mocked actionCallback was called with the expected arguments
      expect(manager.actionCallback).toHaveBeenCalledWith('someActionType', 'someInputData')
    })
  })

  describe('#loadConfig', () => {
    it('should load default config when no config is found in storage', () => {
      jest.spyOn(StorageInterface, 'getStorageItem').mockReturnValue({})

      const manager = new ConfigManager()

      expect(manager.getCurrentConfig()).toEqual(StaticData.DEFAULT_CONFIG)
    })

    it('should load stored config when it is valid', () => {
      jest.spyOn(StorageInterface, 'getStorageItem').mockReturnValue({ some: 'config' })
      jest.spyOn(Validator, 'validateConfig').mockReturnValueOnce(true)

      const manager = new ConfigManager()

      expect(manager.getCurrentConfig()).toEqual({ some: 'config' })
    })

    it('should migrate config when stored config is invalid', () => {
      jest.spyOn(StorageInterface, 'getStorageItem').mockReturnValue({ some: 'config' })
      jest.spyOn(Validator, 'validateConfig').mockReturnValueOnce(false)
      jest.spyOn(Validator, 'migrateConfig').mockReturnValueOnce({ migrated: 'config' })

      const manager = new ConfigManager()

      expect(manager.getCurrentConfig()).toEqual({ migrated: 'config' })
    })

    it('should reset the stored config when #resetConfig is invoked', () => {
      // get a config that will be reset
      jest.spyOn(StorageInterface, 'getStorageItem').mockReturnValue({ some: 'config' })

      const manager = new ConfigManager()

      expect(manager.getCurrentConfig()).toEqual({ some: 'config' })

      // as its a private method we need to "steal" the bound one passed to the command
      const resetFunction = manager.commandMap.resetConfig.systemInput

      // invoke the reset function
      resetFunction()

      // should be default config now
      expect(manager.getCurrentConfig()).toEqual(StaticData.DEFAULT_CONFIG)
      // which should have been saved
      expect(StorageInterface.setStorageItem).toHaveBeenCalledWith(
        StaticData.STORAGE_KEYS.USER_CONFIG,
        StaticData.DEFAULT_CONFIG
      )
      // and the window should have been reloaded
      expect(document.location.reload).toHaveBeenCalled()
    })

    it('should update the running config when #updateConfig is invoked and it is valid', () => {
      // get a config that will be saved
      jest.spyOn(StorageInterface, 'getStorageItem').mockReturnValue({ some: 'config' })
      jest.spyOn(Validator, 'validateConfig').mockReturnValueOnce(true)

      const manager = new ConfigManager()

      expect(manager.getCurrentConfig()).toEqual({ some: 'config' })

      // as its a private method we need to "steal" the bound one passed to the command
      const updateFunction = manager.commandMap.saveConfig.systemInput

      // invoke the update function
      jest.spyOn(Validator, 'validateConfig').mockReturnValueOnce(true)
      updateFunction()

      expect(StorageInterface.setStorageItem).toHaveBeenCalledWith(
        StaticData.STORAGE_KEYS.USER_CONFIG,
        { some: 'config' }
      )
      // and the window should have been reloaded
      expect(document.location.reload).toHaveBeenCalled()
    })

    it('should alert when #updateConfig is invoked and confg is invalid', () => {
      jest.spyOn(StorageInterface, 'getStorageItem').mockReturnValue({ some: 'config' })
      jest.spyOn(Validator, 'validateConfig').mockReturnValueOnce(true)

      const manager = new ConfigManager()

      // steal private method again
      const updateFunction = manager.commandMap.saveConfig.systemInput

      // invoke the update function
      jest.spyOn(Validator, 'validateConfig').mockReturnValueOnce(false)
      updateFunction()

      expect(StorageInterface.setStorageItem).not.toHaveBeenCalled()
      expect(document.location.reload).not.toHaveBeenCalled()
      expect(global.alert).toHaveBeenCalled()
    })
  })

  describe('logging', () => {
    it('should have static log method that calls StorageInterface.writeLog', () => {
      ConfigManager.log('test', LogLevel.DEBUG)
      expect(StorageInterface.writeLog).toHaveBeenCalled()
    })

    it('should use Loglevel enum as default', () => {
      ConfigManager.log('test')
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('test', 'info', 'ConfigManager', '')
    })

    it('should use its own class name for logging', () => {
      ConfigManager.log('test', LogLevel.ERROR)
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('test', 'error', 'ConfigManager', '')
    })

    it('should use the provided error object for logging', () => {
      const error = new Error('test error')
      ConfigManager.log('test', LogLevel.ERROR, error)
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('test', 'error', 'ConfigManager', error)
    })
  })
})

import StaticData           from '../staticdata/StaticData.js'
import StorageInterface     from '../storageinterface/StorageInterface.js'
import Validator            from '../validator/Validator.js'
import ChangeDataCommand    from './commands/ChangeDataCommand.js'
import ChangeSortingCommand from './commands/ChangeSortingCommand.js'
import ChangeStatusCommand  from './commands/ChangeStatusCommand.js'
import RemoveRowCommand     from './commands/RemoveRowCommand.js'
import ResetConfigCommand   from './commands/ResetConfigCommand.js'
import SaveConfigCommand    from './commands/SaveConfigCommand.js'

export default class ConfigManager {
  static #instance
  static #logName = 'ConfigManager'
  #runningConfig

  constructor() {
    if (ConfigManager.#instance) {
      return ConfigManager.#instance
    }

    ConfigManager.#instance = this
    this.#loadConfig()

    // map actionCommands to their class and what input of the ConfigManagerClass they need to execute
    this.commandMap = {
      changeData    : { class: ChangeDataCommand,    systemInput: this.#runningConfig },
      changeSorting : { class: ChangeSortingCommand, systemInput: this.#runningConfig },
      changeStatus  : { class: ChangeStatusCommand,  systemInput: this.#runningConfig },
      removeRow     : { class: RemoveRowCommand,     systemInput: this.#runningConfig },
      resetConfig   : { class: ResetConfigCommand,   systemInput: this.#resetConfig.bind(this) },
      saveConfig    : { class: SaveConfigCommand,    systemInput: this.#updateConfig.bind(this) },
    }
  }

  actionCallback(actionType, inputData) {
    if (
      !Object.keys(this.commandMap).includes(actionType)
      || this.commandMap[actionType].class === undefined
    ) {
      ConfigManager.#log(`Invalid Config Manager Command ${ actionType }`, 'error')

      return
    }

    const cmdClass = this.commandMap[actionType].class

    ConfigManager.#executeCommand(cmdClass, this.commandMap[actionType].systemInput, inputData)
  }

  getActionCallback() {
    return this.actionCallback.bind(this)
  }

  getCurrentConfig() {
    return this.#runningConfig
  }

  #loadConfig() {
    try {
      const storageKeys  = StaticData.STORAGE_KEYS
      const storedConfig = StorageInterface.getStorageItem(storageKeys.USER_CONFIG, '{}')

      ConfigManager.#log('loaded config from storage', 'debug')

      if (Object.keys(storedConfig).length === 0 && storedConfig.constructor === Object) {
        // no existing config found
        this.#runningConfig = StaticData.DEFAULT_CONFIG

        ConfigManager.#log('config does not exist. loading default config.', 'warn')
        this.#saveConfig()
      } else if (Validator.validateConfig(
        storedConfig,
        StaticData.DEFAULT_CONFIG,
        StaticData.USER_DEFINED_FEATURE_PROPERTIES
      )) {
        // existing config found
        this.#runningConfig = storedConfig
      } else {
        // existing config is invalid
        ConfigManager.#log('config is empty, deprecated or invalid. starting repair', 'warn')
        this.#runningConfig = Validator.migrateConfig(storedConfig, StaticData.DEFAULT_CONFIG)

        ConfigManager.#log('migration/repair finished successfully. saving new config', 'debug')
        this.#saveConfig()
      }
    } catch (error) {
      ConfigManager.#log('Error loading configuration:', 'error', error)
      ConfigManager.#log('Loading default configuration', 'warn')
      ConfigManager.#log('if this keeps happening restore to overwrite the broken config.', 'warn')

      this.#runningConfig = StaticData.DEFAULT_CONFIG
    }
  }

  #resetConfig() {
    ConfigManager.#log('Restoring default config', 'debug')
    this.#runningConfig = StaticData.DEFAULT_CONFIG
    this.#saveConfig()
    document.location.reload()
  }

  #saveConfig() {
    StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.USER_CONFIG, this.#runningConfig)
  }

  #updateConfig() {
    // validate if the current config is valid
    if (Validator.validateConfig(
      this.#runningConfig,
      StaticData.DEFAULT_CONFIG,
      StaticData.USER_DEFINED_FEATURE_PROPERTIES
    )) {
      this.#saveConfig()
      document.location.reload()
    } else {
      alert('etzadla iwas stimmd mid deina Gonfig nedd häddix8 ghabd')
    }
  }

  // this method is only used for tests to reset the singleton instance
  // eslint-disable-next-line no-underscore-dangle
  static _resetInstance() {
    ConfigManager.#instance = undefined
  }

  static #executeCommand(CommandClass, ...arguments_) {
    try {
      const command = new CommandClass(...arguments_)

      command.execute()
    } catch (error) {
      ConfigManager.#log(`Error executing command ${ CommandClass.name }:`, 'error', error)
    }
  }

  static #log(message, level, error = '') {
    if (level === 'error' && error !== '') {
      StorageInterface.writeLog(message, level, ConfigManager.#logName, error)
    }  else {
      StorageInterface.writeLog(message, level, ConfigManager.#logName)
    }
  }
}

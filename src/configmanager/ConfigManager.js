import LogLevel             from '../enum/LogLevel.js'
import Mindash              from '../mindash/Mindash.js'
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
    if (ConfigManager.#instance) { return ConfigManager.#instance }
    ConfigManager.#instance = this

    this.#loadConfig()
    this.#initCommands()
  }

  actionCallback(actionType, inputData) {
    if (
      !Object.keys(this.commandMap).includes(actionType)
      || this.commandMap[actionType].class === undefined
    ) {
      ConfigManager.log(`Invalid Command ${ actionType }`, LogLevel.ERROR)
      return
    }

    this.#executeCommand(actionType, inputData)
  }

  getActionCallback() {
    return this.actionCallback.bind(this)
  }

  getCurrentConfig() {
    return this.#runningConfig
  }

  #executeCommand(actionType, inputData) {
    const CommandClass     = this.commandMap[actionType].class
    const commandArguments = [ this.commandMap[actionType].systemInput, inputData ]
    const command          = new CommandClass(...commandArguments)

    try {
      command.execute()
    } catch (error) {
      ConfigManager.log(`Error executing command ${ CommandClass.name }:`, LogLevel.ERROR, error)
    }
  }

  #initCommands() {
    this.commandMap = {
      changeData    : { class: ChangeDataCommand,    systemInput: this.#runningConfig },
      changeSorting : { class: ChangeSortingCommand, systemInput: this.#runningConfig },
      changeStatus  : { class: ChangeStatusCommand,  systemInput: this.#runningConfig },
      removeRow     : { class: RemoveRowCommand,     systemInput: this.#runningConfig },
      resetConfig   : { class: ResetConfigCommand,   systemInput: this.#resetConfig.bind(this) },
      saveConfig    : { class: SaveConfigCommand,    systemInput: this.#updateConfig.bind(this) },
    }
  }

  #loadConfig() {
    ConfigManager.log('loading config from storage', LogLevel.DEBUG)
    const storageKeys  = StaticData.STORAGE_KEYS
    const storedConfig = StorageInterface.getStorageItem(storageKeys.USER_CONFIG, '{}')

    if (Mindash.isEmptyObject(storedConfig)) {
      ConfigManager.log('config is empty. loading default config.', LogLevel.WARN)
      this.#runningConfig = StaticData.DEFAULT_CONFIG
      this.#saveConfig()
      return
    }

    if (Validator.validateConfig(storedConfig)) {
      ConfigManager.log('using valid config from storage', LogLevel.DEBUG)
      this.#runningConfig = storedConfig
      return
    }

    // config exists but is not valid
    ConfigManager.log('config is invalid or needs an update. starting migration', LogLevel.WARN)
    this.#runningConfig = Validator.migrateConfig(storedConfig, StaticData.DEFAULT_CONFIG)
    this.#saveConfig()
  }

  #resetConfig() {
    ConfigManager.log('Restoring default config', LogLevel.WARN)
    this.#runningConfig = StaticData.DEFAULT_CONFIG

    this.#saveConfig()
  }

  #saveConfig() {
    StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.USER_CONFIG, this.#runningConfig)
    document.location.reload()
  }

  #updateConfig() {
    Validator.validateConfig(this.#runningConfig)
      ? this.#saveConfig()
      : alert('etzadla iwas stimmd mid deina Gonfig nedd häddix8 ghabd')
  }

  // this method is only used for tests to reset the singleton instance
  // eslint-disable-next-line no-underscore-dangle
  static _resetInstance() {
    ConfigManager.#instance = undefined
  }

  static log(message, level = LogLevel.INFO, error = '') {
    StorageInterface.writeLog(message, level, ConfigManager.#logName, error)
  }
}

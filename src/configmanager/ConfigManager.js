import LogLevel         from '../enum/LogLevel.js'
import StaticData       from '../staticdata/StaticData.js'
import StorageInterface from '../storageinterface/StorageInterface.js'
import Validator        from '../validator/Validator.js'
import CommandLoader    from './CommandLoader.js'
import ConfigLoader     from './ConfigLoader.js'

/**
 * The ConfigManager is a singleton class that manages the config.
 * It loads the config from storage, validates it and provides a callback function to execute commands.
 * The commands are defined in the commandMap.
 * @class
 */
export default class ConfigManager {
  static #instance
  static #logName = 'ConfigManager'
  #runningConfig

  /**
   * Creates a new ConfigManager instance if none exists.
   * Else it returns the existing instance (singleton).
   * @returns {ConfigManager} - The ConfigManager instance
   * @class
   */
  constructor() {
    if (ConfigManager.#instance) { return ConfigManager.#instance }
    ConfigManager.#instance = this

    this.#runningConfig = ConfigLoader.load()

    this.commandMap = CommandLoader.load(
      this.#runningConfig,
      this.#resetConfig.bind(this),
      this.#updateConfig.bind(this)
    )
  }

  /**
   * Executes a command with the given actionType and inputData provided by the invoker.
   * @param  {string} actionType - The command to execute
   * @param  {object} inputData  - The data to pass to the command
   * @public
   */
  actionCallback(actionType, inputData) {
    // check if the command is valid
    if (
      !Object.keys(this.commandMap).includes(actionType)
      || this.commandMap[actionType].class === undefined
    ) {
      ConfigManager.log(`Invalid Command ${ actionType }`, LogLevel.ERROR)
      return
    }

    // execute the command
    this.#executeCommand(actionType, inputData)
  }

  /**
   * Returns a callback function that can be used to execute a command.
   * @returns {Function} - The callback function
   * @public
   */
  getActionCallback() {
    return this.actionCallback.bind(this)
  }

  /**
   * Returns the current config.
   * @returns {object} - The current config
   * @public
   */
  getCurrentConfig() {
    return this.#runningConfig
  }

  /**
   * executes the command with the given actionType and inputData
   * @param  {string} actionType - The command to execute in the commandMap
   * @param  {object} inputData  - The data to pass to the command
   * @private
   */
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

  /**
   * resets the config to the default config and saves it
   * @private
   */
  #resetConfig() {
    ConfigManager.log('Restoring default config', LogLevel.WARN)
    this.#runningConfig = StaticData.DEFAULT_CONFIG

    this.#saveConfig()
  }

  /**
   * saves the config to storage
   * @param  {boolean} reload - If true the page will be reloaded after saving
   * @private
   */
  #saveConfig() {
    StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.USER_CONFIG, this.#runningConfig)
    document.location.reload()
  }

  /**
   * updates the config if it is valid and saves it
   * @private
   */
  #updateConfig() {
    Validator.validateConfig(this.#runningConfig)
      ? this.#saveConfig()
      : alert('etzadla iwas stimmd mid deina Gonfig nedd häddix8 ghabd')
  }

  /**
   * Wrapper for StorageInterface.writeLog
   * @param  {string}   message  - The message to log
   * @param  {LogLevel} level    - The log level
   * @param  {error}    error    - The error to log
   * @public
   * @static
   */
  static log(message, level = LogLevel.INFO, error = '') {
    StorageInterface.writeLog(message, level, ConfigManager.#logName, error)
  }

  /**
   * Resets the singleton instance.
   * this method must only be used during jest tests to reset the singleton instance
   * @private
   */
  // eslint-disable-next-line no-underscore-dangle
  static _resetInstance() {
    ConfigManager.#instance = undefined
  }
}

import LogLevel         from '../enum/LogLevel.js'
import Mindash          from '../mindash/Mindash.js'
import StaticData       from '../staticdata/StaticData.js'
import StorageInterface from '../storageinterface/StorageInterface.js'
import Validator        from '../validator/Validator.js'

/**
 * handles loading the config from the config file and
 * if needed migrating the config to the newest version
 * or creating a new one
 * @class
 */
export default class ConfigLoader {
  static #logName = 'ConfigLoader'

  /**
   * handles loading the config from the config file and
   * if needed migrating the config to the newest version
   * or creating a new one
   * @returns {object} - The config
   */
  static load() {
    const storedConfig = ConfigLoader.#loadfromStorage()

    if (!Mindash.isSomething(storedConfig)) {
      return ConfigLoader.#handleEmptyConfig()
    }

    return Validator.validateConfig(storedConfig)
      ? ConfigLoader.#handleValidConfig(storedConfig)
      : ConfigLoader.#handleInvalidConfig(storedConfig)
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
    StorageInterface.writeLog(message, level, ConfigLoader.#logName, error)
  }

  /**
   * handles loadConfig case where the config is empty
   * @returns {object} - The config
   * @private
   * @static
   */
  static #handleEmptyConfig() {
    ConfigLoader.log('config is empty. loading default config.', LogLevel.WARN)
    const config = StaticData.DEFAULT_CONFIG
    ConfigLoader.#saveConfig(config)
    return config
  }

  /**
   * handles loadConfig case where the config is invalid
   * @param   {object} storedConfig - The config from storage
   * @returns {object}              - The config
   * @private
   * @static
   */
  static #handleInvalidConfig(storedConfig) {
    ConfigLoader.log('config is invalid or needs an update. starting migration', LogLevel.WARN)
    // ask users so we have a chance to prevent reload loops incase the config is invalid
    // eslint-disable-next-line no-restricted-globals
    const response = confirm('Deine Config ist ungültig oder benötigt ein Update und wird daher migriert. Willst du die migrierte Config speichern und neu laden?')
    const config   = Validator.migrateConfig(storedConfig, StaticData.DEFAULT_CONFIG)
    ConfigLoader.#saveConfig(config, response)
    return config
  }

  /**
   * handles loadConfig case where the config is valid
   * @param   {object} storedConfig - The config from storage
   * @returns {object}              - The config
   * @private
   */
  static #handleValidConfig(storedConfig) {
    ConfigLoader.log('using valid config from storage', LogLevel.DEBUG)
    return storedConfig
  }

  /**
   * Loads the config from storage
   * @returns {object} - The config
   * @private
   * @static
   */
  static #loadfromStorage() {
    ConfigLoader.log('loading config from storage', LogLevel.DEBUG)
    const storageKeys = StaticData.STORAGE_KEYS
    return StorageInterface.getStorageItem(storageKeys.USER_CONFIG)
  }

  /**
   * saves the config to storage - ConfigLoader has it's own save method so it can handle new/migrated configs
   * @param  {object}  configToSave - The config to save
   * @param  {boolean} reload       - If true the page will be reloaded after saving
   * @private
   * @static
   */
  static #saveConfig(configToSave, reload = true) {
    StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.USER_CONFIG, configToSave)
    if (reload) { document.location.reload() }
  }
}

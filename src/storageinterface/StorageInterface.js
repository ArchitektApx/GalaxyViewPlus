import LogLevel   from '../enum/LogLevel.js'
import Mindash    from '../mindash/Mindash.js'
import StaticData from '../staticdata/StaticData.js'

/**
 * The StorageInterface class is used to access the storage.
 * It provides static interfaces to access the storage defined in StaticData.STORAGE_TYPE
 * if GM is used methods will hide the fact that these calls are async from the consumer
 * @class
 */
export default class StorageInterface {
  static #logName = 'StorageInterface'

  /**
   * Deletes a key from Storage.
   * @param   {string}  key - The key to delete
   * @returns {boolean}     - True if successful, false if not
   * @public
   * @static
   */
  static deleteStorageItem(key) {
    try {
      localStorage.removeItem(key)

      return true
    } catch (error) {
      StorageInterface.log('Failed to delete a key from Storage', LogLevel.ERROR, error)

      return false
    }
  }

  /**
   * Gets a key from Storage.
   * @param   {string} key - The key to get
   * @returns {object}     - The key value or {} if no key was found
   * @throws  {false}      - Throws an error if storage is not available
   * @public
   * @static
   */
  static getStorageItem(key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch (error) {
      StorageInterface.log('Failed to get a key from Storage', LogLevel.ERROR, error)
      return {}
    }
  }

  /**
   * Wrapper for StorageInterface.writeLog
   * @param {string}   message - The message to log
   * @param {LogLevel} level   - The log level
   * @param {error}    error   - The error to log
   * @public
   * @static
   */
  static log(message, level = LogLevel.INFO, error = '') {
    StorageInterface.writeLog(message, level, StorageInterface.#logName, error)
  }

  /**
   * Sets a key in Storage.
   * @param   {string}  key   - The key to set
   * @param   {*}       value - The value to set
   * @returns {boolean}       - True if successful, false if not
   * @public
   * @static
   */
  static setStorageItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))

      return true
    } catch (error) {
      StorageInterface.log('Failed to save a key from Storage', LogLevel.ERROR, error)

      return false
    }
  }

  /**
   * Logging Method used by all other classes via their static log method wrapper.
   * @param   {string} message     - The message to log
   * @param   {string} level       - The log level
   * @param   {string} module      - The module name
   * @param   {error}  errorObject - The error to log
   * @returns {void}
   * @public
   * @static
   */
  static writeLog(message, level = LogLevel.INFO, module = '', errorObject = '') {
    const logMessage = StorageInterface.#createLogMessage(message, level, module)
    StorageInterface.#outputToConsole(logMessage, level, errorObject)
    StorageInterface.#saveToStorage(logMessage)
  }

  /**
   * Creates a formatted log message string.
   * @param   {string} message - The message to log.
   * @param   {string} level   - The log level.
   * @param   {string} module  - The module name.
   * @returns {string}         - The formatted log message.
   * @private
   * @static
   */
  static #createLogMessage(message, level, module) {
    const timestamp = new Date(Date.now()).toISOString()
    return `[${ __scriptName__ }_${ module } ${ timestamp }] [${ level }]: ${ message }`
  }

  /**
   * Outputs the log message to the console.
   * @param   {string} logMessage  - The formatted log message.
   * @param   {string} level       - The log level.
   * @param   {error}  errorObject - The error to log.
   * @returns {void}
   * @private
   * @static
   */
  static #outputToConsole(logMessage, level, errorObject) {
    if (level === LogLevel.ERROR) {
      console.log(logMessage)
      console.error(errorObject)
    }
  }

  /**
   * Saves the log message to storage.
   * @param   {string} logMessage - The formatted log message.
   * @returns {void}
   * @private
   * @static
   */
  static #saveToStorage(logMessage) {
    try {
      let logMessages = Mindash.defaultTo(
        StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.DEBUG_LOG),
        []
      )

      logMessages.push(logMessage)

      if (logMessages.length > StaticData.DEBUG_LOG_MAX_ENTRIES) {
        // remove oldest entries
        logMessages = logMessages.slice(-StaticData.DEBUG_LOG_MAX_ENTRIES)
      }

      StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.DEBUG_LOG, logMessages)
    } catch (error) {
      console.error('Critical error in saveToStorage:', error)
    }
  }
}

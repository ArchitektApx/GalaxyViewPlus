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

  // static methods
  /**
   * Deletes a key from Storage.
   * @public
   * @param {string} key - The key to delete
   * @returns {boolean} - True if successful, false if not
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
   * @public
   * @param {string} key - The key to get
   * @returns {object} - The key value or {} if no key was found
   * @throws {false} - Throws an error storage is not available
   */
  static getStorageItem(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '{}')
    } catch (error) {
      StorageInterface.log('Failed to get a key from Storage', LogLevel.ERROR, error)

      return false
    }
  }

  /**
   * Wrapper for the logging method.
   * @public
   * @param {string} message - The message to log
   * @param {LogLevel} level - The log level
   * @param {error} error    - The error to log
   */
  static log(message, level = LogLevel.INFO, error = '') {
    StorageInterface.writeLog(message, level, StorageInterface.#logName, error)
  }

  /**
   * Sets a key in Storage.
   * @public
   * @param {string} key - The key to set
   * @param {*} value - The value to set
   * @returns {boolean} - True if successful, false if not
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
   * @public
   * @param {string} message - The message to log
   * @param {LogLevel} level - The log level
   * @param {string} module - The module name
   * @param {error} errorObject - The error to log
   * @returns {void}
   */
  static writeLog(message, level = LogLevel.INFO, module = '', errorObject = '') {
    const timestamp  = new Date(Date.now()).toISOString()
    const logMessage = `[${ __scriptName__ }_${ module } ${ timestamp }] [${ level }]: ${ message }`

    if (level === LogLevel.ERROR) {
      console.log(logMessage)
      console.error(errorObject)
    }

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
      console.error('Critical error in writeLog:', error)
    }
  }
}

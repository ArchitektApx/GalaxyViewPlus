import StaticData from '../staticdata/StaticData.js'

export default class StorageInterface {
  static #logName = 'StorageInterface'
  // provides static interfaces to access the storage defined in StaticData.STORAGE_TYPE
  // if GM is used methods will hide the fact that these calls are async from the consumer
  // StorageType = StaticData.STORAGE_TYPE
  // UPDATE: massive problems with GM and async storage calls -> only localStorage is used and GM.getValue()/GM.SetValue/etc. are dropped.
  // I guess we should still keep the class for possible future changes in the underlying storage system?

  // static methods
  static deleteStorageItem(key) {
    try {
      localStorage.removeItem(key)

      return true
    } catch (error) {
      StorageInterface.#log('Failed to delete a key from Storage', 'error', error)

      return false
    }
  }

  static getStorageItem(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '{}')
    } catch (error) {
      StorageInterface.#log('Failed to get a key from Storage', 'error', error)

      return false
    }
  }

  static setStorageItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))

      return true
    } catch (error) {
      StorageInterface.#log('Failed to save a key from Storage', 'error', error)

      return false
    }
  }

  static writeLog(message, type = 'log', module = '', errorObject = '') {
    const timestamp  = new Date(Date.now()).toISOString()
    const logMessage = `[${ __scriptName__ }_${ module } ${ timestamp }] [${ type }]: ${ message }`

    try {
      let logMessages = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.DEBUG_LOG)

      if (Array.isArray(logMessages) === false) { logMessages = [] }
      logMessages.push(logMessage)

      if (logMessages.length > StaticData.DEBUG_LOG_MAX_ENTRIES) {
        logMessages.shift()
      }

      StorageInterface.setStorageItem(StaticData.STORAGE_KEYS.DEBUG_LOG, logMessages)

      if (type === 'error') {
        console.log(`[${ __scriptName__ }${ module } ${ timestamp }] [${ type }]: ${ message }`)
        console.error(errorObject)
      }
    } catch (error) {
      console.error('Critical error in writeLog:', error)
    }
  }

  // static private methods
  static #log(message, level, error) {
    StorageInterface.writeLog(message, level, StorageInterface.#logName, error)
  }
}

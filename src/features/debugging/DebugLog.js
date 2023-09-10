import StaticData         from '../../staticdata/StaticData.js'
import StorageInterface   from '../../storageinterface/StorageInterface.js'
import MiscElementFactory from '../../userinterface/factories/MiscElementFactory.js'

/**
 * The DebugLog class is used to display debug logs in the settings interface.
 */
export default class DebugLog {
  /**
   * Executes the DebugLog class.
   * @returns {void}
   */
  static execute() {
    const debugLog        = DebugLog.#getDebugLog()
    const debugLogElement = DebugLog.#createDebugLogElement(debugLog)
    const settingsElement = document.querySelector('#settings-interface-details')

    settingsElement.lastChild.after(debugLogElement)
  }

  /**
   * Creates the debug log element.
   * @private
   * @param {object} debugLog - The debug log
   * @returns {object} - The debug log element
   */
  static #createDebugLogElement(debugLog) {
    const debugLogElement = MiscElementFactory.create('div', { id: 'debug-log' })

    debugLog.forEach((log) => {
      debugLogElement.append(MiscElementFactory.create('p', { textContent: `${ log }` }))
    })

    return debugLogElement
  }

  /**
   * Gets the debug log.
   * @private
   * @returns {object} - The debug log
   */
  static #getDebugLog() {
    return StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.DEBUG_LOG)
  }
}

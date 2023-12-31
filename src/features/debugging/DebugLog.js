import StaticData         from '../../staticdata/StaticData.js'
import StorageInterface   from '../../storageinterface/StorageInterface.js'
import HtmlElementFactory from '../../userinterface/factories/HtmlElementFactory.js'

/**
 * The DebugLog class is used to display debug logs in the settings interface.
 * @class
 */
export default class DebugLog {
  /**
   * Executes the DebugLog class.
   * @returns {void}
   * @public
   * @static
   */
  static execute() {
    const debugLog        = DebugLog.#getDebugLog()
    const debugLogElement = DebugLog.#createDebugLogElement(debugLog)
    const settingsElement = document.querySelector('#settings-interface-details')

    settingsElement.lastChild.after(debugLogElement)
  }

  /**
   * Creates the debug log element.
   * @param   {object} debugLog - The debug log
   * @returns {object}          - The debug log element
   * @private
   * @static
   */
  static #createDebugLogElement(debugLog) {
    const debugLogElement = HtmlElementFactory.create('div', { id: 'debug-log' })

    debugLog.reverse().forEach((log) => {
      debugLogElement.append(HtmlElementFactory.create('p', { textContent: `${ log }` }))
    })

    return debugLogElement
  }

  /**
   * Gets the debug log.
   * @returns {object} - The debug log
   * @private
   * @static
   */
  static #getDebugLog() {
    return StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.DEBUG_LOG)
  }
}

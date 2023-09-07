import StaticData         from '../../staticdata/StaticData.js'
import StorageInterface   from '../../storageinterface/StorageInterface.js'
import MiscElementFactory from '../../userinterface/factories/MiscElementFactory.js'

export default class DebugLog {
  static execute() {
    const debugLog        = DebugLog.#getDebugLog()
    const debugLogElement = DebugLog.#createDebugLogElement(debugLog)
    const settingsElement = document.querySelector('#settings-interface-details')

    settingsElement.lastChild.after(debugLogElement)
  }

  static #createDebugLogElement(debugLog) {
    const debugLogElement = MiscElementFactory.create('div', { id: 'debug-log' })

    debugLog.forEach((log) => {
      debugLogElement.append(MiscElementFactory.create('p', { textContent: `${ log }` }))
    })

    return debugLogElement
  }

  static #getDebugLog() {
    return StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.DEBUG_LOG)
  }
}

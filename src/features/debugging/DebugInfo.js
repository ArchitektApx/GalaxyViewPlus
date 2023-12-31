import Mindash            from '../../mindash/Mindash.js'
import StaticData         from '../../staticdata/StaticData.js'
import StorageInterface   from '../../storageinterface/StorageInterface.js'
import HtmlElementFactory from '../../userinterface/factories/HtmlElementFactory.js'

/**
 * The DebugInfo class is used to display debug information in the settings interface.
 * @class
 */
export default class DebugInfo {
  static #getStorageItemOrDefault = key => StorageInterface.getStorageItem(key) ?? {}

  static #returnOrFallback        = value => value ?? 'not available'

  /**
   * Executes the DebugInfo class.
   * @param   {number} startTime - The time the script started
   * @returns {void}
   * @public
   * @static
   */
  static execute(startTime) {
    const elapsed         = (Date.now() - startTime)
    const debugInfoObject = DebugInfo.#getScriptInfoObject(elapsed)

    // find element to attach to
    const debugInfoElement = DebugInfo.#createDebugInfoElement(debugInfoObject)
    const settingsElement  = document.querySelector('#settings-interface-details')

    settingsElement.append(debugInfoElement)
  }

  /**
   * Creates the debug info element.
   * @param   {object} debugInfoObject - The debug info object
   * @returns {object}                 - The debug info element
   * @private
   * @static
   */
  static #createDebugInfoElement(debugInfoObject) {
    const debugInfo = HtmlElementFactory.create('div', { id: 'debug-info' })

    Mindash.forAny(debugInfoObject, ([ key, value ]) => {
      debugInfo.append(HtmlElementFactory.create('p', { textContent: `${ key }: ${ value }` }))
    }, true)

    return debugInfo
  }

  /**
   * Gets the script info object.
   * @param   {number} elapsed - The time the script started
   * @returns {object}         - The script info object
   * @private
   * @static
   */
  static #getScriptInfoObject(elapsed) {
    const status    = DebugInfo.#getStorageItemOrDefault(StaticData.STORAGE_KEYS.UPDATE_STATUS)
    const statsData = DebugInfo.#getStorageItemOrDefault(StaticData.STORAGE_KEYS.STATS_DATA)
    const config    = DebugInfo.#getStorageItemOrDefault(StaticData.STORAGE_KEYS.USER_CONFIG)

    return {
      currentConfigVersion : DebugInfo.#returnOrFallback(config.configVersion),
      defaultConfigVersion : StaticData.DEFAULT_CONFIG.configVersion,
      executionTime        : `${ elapsed }ms`,
      scriptVersion        : GM.info.script.version,
      statsDataCount       : `${ Object.keys(statsData).length } Players`,
      statsUpdateStatus    : DebugInfo.#returnOrFallback(status.status),
      statsUpdateTimestamp : status.timestamp
        ? new Date(status.timestamp).toISOString()
        : 'not available',
    }
  }
}

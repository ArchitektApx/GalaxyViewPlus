import StaticData         from '../../staticdata/StaticData.js'
import StorageInterface   from '../../storageinterface/StorageInterface.js'
import MiscElementFactory from '../../userinterface/factories/MiscElementFactory.js'

export default class DebugInfo {
  static execute(startTime) {
    const elapsed         = (Date.now() - startTime)
    const debugInfoObject = DebugInfo.#getScriptInfoObject(elapsed)

    // find element to attach to
    const debugInfoElement = DebugInfo.#createDebugInfoElement(debugInfoObject)
    const settingsElement  = document.querySelector('#settings-interface-details')

    settingsElement.append(debugInfoElement)
  }

  static #createDebugInfoElement(debugInfoObject) {
    const debugInfo = MiscElementFactory.create('div', { id: 'debug-info' })

    Object.keys(debugInfoObject).forEach((key) => {
      const value = debugInfoObject[key]

      debugInfo.append(MiscElementFactory.create('p', { textContent: `${ key }: ${ value }` }))
    })

    return debugInfo
  }

  static #getScriptInfoObject(elapsed) {
    const statsUpdate = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.UPDATE_STATUS)
    const statsData   = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.STATS_DATA)
    const config      = StorageInterface.getStorageItem(StaticData.STORAGE_KEYS.USER_CONFIG)

    return {
      scriptVersion        : GM.info.script.version,
      defaultConfigVersion : StaticData.DEFAULT_CONFIG.configVersion,
      currentConfigVersion : config.configVersion,
      statsDataCount       : `${ Object.keys(statsData).length } Players`,
      statsUpdateStatus    : statsUpdate.status,
      statsUpdateTimestamp : new Date(statsUpdate.timestamp).toISOString(),
      executionTime        : `${ elapsed }ms`,
    }
  }
}

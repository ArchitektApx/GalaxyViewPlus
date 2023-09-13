import DebugInfo          from './debugging/DebugInfo.js'
import DebugLog           from './debugging/DebugLog.js'
import ConfigOpen         from './shortcuts/ConfigOpen.js'
import SyncButtonShortcut from './shortcuts/SyncButtonShortcut.js'

/**
 * The GeneralSettings class is used to execute the general settings related features.
 * @class
 */
export default class GeneralSettings {
  /**
   * Executes the general settings related features.
   * @param   {object} featureConfig          - The config object for the general settings features
   * @param   {Array}  featureConfig.features - The config of the individual features
   * @param   {number} startTime              - The time the script started
   * @returns {void}
   * @public
   * @static
   */
  static execute({ features: featureConfig }, startTime) {
    const classMap = {
      configOpen : { Class: ConfigOpen,           params: undefined },
      debugInfo  : { Class: DebugInfo,            params: startTime },
      debugLog   : { Class: DebugLog,             params: undefined },
      syncbutton : { Class: SyncButtonShortcut,   params: undefined },
    }

    const settings = featureConfig.find(feature => feature.feature === 'generalsettings')
    if (settings?.data) {
      settings.data.filter(setting => setting.checked)
      .forEach((setting) => {
        classMap[setting.key].Class.execute(classMap[setting.key].params)
      })
    }
  }
}

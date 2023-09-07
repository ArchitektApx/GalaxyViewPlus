import DebugInfo          from './debugging/DebugInfo.js'
import DebugLog           from './debugging/DebugLog.js'
import ConfigOpen         from './shortcuts/ConfigOpen.js'
import SyncButtonShortcut from './shortcuts/SyncButtonShortcut.js'

export default class GeneralSettings {
  static execute({ features: featureConfig }, startTime) {
    const settings = featureConfig.find(feature => feature.feature === 'generalsettings')

    if (!settings) { return } // Return early if the settings are not found

    const classMap = {
      syncbutton : { Class: SyncButtonShortcut,   params: undefined },
      debugInfo  : { Class: DebugInfo,            params: startTime },
      debugLog   : { Class: DebugLog,             params: undefined },
      configOpen : { Class: ConfigOpen,           params: undefined },
    }

    settings.data.forEach((setting) => {
      if (setting.checked) {
        classMap[setting.key].Class.execute(classMap[setting.key].params)
      }
    })
  }
}

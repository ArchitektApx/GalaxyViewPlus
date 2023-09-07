import GeneralSettings    from '../../src/features/GeneralSettings.js'
import DebugInfo          from '../../src/features/debugging/DebugInfo.js'
import DebugLog           from '../../src/features/debugging/DebugLog.js'
import ConfigOpen         from '../../src/features/shortcuts/ConfigOpen.js'
import SyncButtonShortcut from '../../src/features/shortcuts/SyncButtonShortcut.js'

jest.mock('../../src/features/shortcuts/SyncButtonShortcut.js')
jest.mock('../../src/features/debugging/DebugInfo.js')
jest.mock('../../src/features/debugging/DebugLog.js')
jest.mock('../../src/features/shortcuts/ConfigOpen.js')

describe('GeneralSettings', () => {
  beforeEach(() => {
    SyncButtonShortcut.execute.mockClear()
    DebugInfo.execute.mockClear()
    DebugLog.execute.mockClear()
    ConfigOpen.execute.mockClear()
  })

  describe('execute', () => {
    it('should execute SyncButtonShortcut when syncbutton setting is checked', () => {
      const featureConfig = [ {
        feature : 'generalsettings',
        data    : [
          { key: 'syncbutton', checked: true },
        ],
      } ]

      GeneralSettings.execute({ features: featureConfig })

      expect(SyncButtonShortcut.execute).toHaveBeenCalled()
    })

    it('should execute DebugInfo with startTime when debugInfo setting is checked', () => {
      const startTime     = Date.now()
      const featureConfig = [ {
        feature : 'generalsettings',
        data    : [
          { key: 'debugInfo', checked: true },
        ],
      } ]

      GeneralSettings.execute({ features: featureConfig }, startTime)

      expect(DebugInfo.execute).toHaveBeenCalledWith(startTime)
    })

    it('should execute DebugLog when debugLog setting is checked', () => {
      const featureConfig = [ {
        feature : 'generalsettings',
        data    : [
          { key: 'debugLog', checked: true },
        ],
      } ]

      GeneralSettings.execute({ features: featureConfig })

      expect(DebugLog.execute).toHaveBeenCalled()
    })

    it('should execute ConfigOpen when configOpen setting is checked', () => {
      const featureConfig = [ {
        feature : 'generalsettings',
        data    : [
          { key: 'configOpen', checked: true },
        ],
      } ]

      GeneralSettings.execute({ features: featureConfig })

      expect(ConfigOpen.execute).toHaveBeenCalled()
    })

    it('should not execute any classes when setting is not checked', () => {
      const featureConfig = [ {
        feature : 'generalsettings',
        data    : [
          { key: 'syncbutton', checked: false },
        ],
      } ]

      GeneralSettings.execute({ features: featureConfig })

      expect(SyncButtonShortcut.execute).not.toHaveBeenCalled()
    })

    it('should not throw error when "generalsettings" feature is not found', () => {
      const featureConfig = [ {
        feature : 'othersettings',
        data    : [],
      } ]

      expect(() => {
        GeneralSettings.execute({ features: featureConfig })
      }).not.toThrow()
    })
  })
})

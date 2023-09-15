import { SettingsBody, SettingsHeader, HtmlElementFactory } from '../mocks/MockSettingsElementsSetup.js'
import FeatureSettingsFactory                               from '../../../src/userinterface/factories/FeatureSettingsFactory.js'

describe('FeatureSettingsFactory', () => {
  let config
  let configCallback

  beforeEach(() => {
    config         = {
      htmlPrefix: 'test-prefix',
    }
    configCallback = jest.fn()

    // Resetting mocks
    jest.clearAllMocks()
  })

  it('should create a feature settings container with correct ID and class', () => {
    const element = FeatureSettingsFactory.create(config, configCallback)

    expect(HtmlElementFactory.create).toHaveBeenCalledWith('div', {
      classList : 'feature-settings-container',
      id        : 'test-prefixsettings-container',
    })
    expect(element).toBeDefined()
  })

  it('should append HeaderElement and BodyElement to the feature settings container', () => {
    const element = FeatureSettingsFactory.create(config, configCallback)

    expect(SettingsHeader.prototype.getElement).toHaveBeenCalled()
    expect(SettingsBody.prototype.getElement).toHaveBeenCalled()
    expect(element.append).toHaveBeenCalledTimes(2)
  })
})

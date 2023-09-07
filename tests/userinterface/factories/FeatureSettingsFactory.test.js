import SettingsBody           from '../../../src/userinterface/customElements/SettingsBody.js'
import SettingsHeader         from '../../../src/userinterface/customElements/SettingsHeader.js'
import FeatureSettingsFactory from '../../../src/userinterface/factories/FeatureSettingsFactory.js'
import MiscElementFactory     from '../../../src/userinterface/factories/MiscElementFactory.js'

jest.mock('../../../src/userinterface/customElements/SettingsBody.js')
jest.mock('../../../src/userinterface/customElements/SettingsHeader.js')
jest.mock('../../../src/userinterface/factories/MiscElementFactory.js')

describe('FeatureSettingsFactory', () => {
  let config
  let configCallback

  beforeEach(() => {
    config         = {
      htmlPrefix: 'test-prefix',
    }
    configCallback = jest.fn()

    // Mocking document.createElement
    global.document = {
      createElement: jest.fn().mockReturnValue({
        appendChild : jest.fn(),
        classList   : {
          add: jest.fn(),
        },
        append: jest.fn(),
      }),
    }

    // Resetting mocks
    SettingsBody.mockReset()
    SettingsHeader.mockReset()
    MiscElementFactory.create.mockReset()

    // Mocking factories and classes
    MiscElementFactory.create           = jest.fn().mockReturnValue({
      appendChild : jest.fn(),
      classList   : {
        add: jest.fn(),
      },
      append: jest.fn(),
    })
    SettingsBody.prototype.getElement   = jest.fn().mockReturnValue({
      appendChild : jest.fn(),
      classList   : {
        add: jest.fn(),
      },
      append: jest.fn(),
    })
    SettingsHeader.prototype.getElement = jest.fn().mockReturnValue({
      appendChild : jest.fn(),
      classList   : {
        add: jest.fn(),
      },
      append: jest.fn(),
    })
  })

  it('should create a feature settings container with correct ID and class', () => {
    const element = FeatureSettingsFactory.create(config, configCallback)

    expect(MiscElementFactory.create).toHaveBeenCalledWith('div', {
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

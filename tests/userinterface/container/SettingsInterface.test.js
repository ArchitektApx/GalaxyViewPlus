import {
  ButtonElementFactory, HtmlElementFactory, FeatureSettingsFactory,
} from '../mocks/MockFactoriesSetup.js'
import SettingsInterface from '../../../src/userinterface/container/SettingsInterface.js'

describe('SettingsInterface', () => {
  let configManagerInstance

  beforeEach(() => {
    configManagerInstance = {
      getCurrentConfig: jest.fn().mockReturnValue({
        features      : [ {} ],
        userInterface : {
          title: 'Test Title',
        },
      }),
      getActionCallback: jest.fn().mockReturnValue(jest.fn()),
    }

    jest.clearAllMocks()
  })

  it('should create a settings interface with correct elements', () => {
    const instance = new SettingsInterface(configManagerInstance)

    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(1, 'div', {
      id: 'settings-interface-wrapper',
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(2, 'summary', {
      id          : 'settings-interface-summary',
      textContent : 'Test Title',
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(3, 'div', {
      id       : 'settings-interface-footer',
      children : expect.anything(),
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(4, 'details', {
      id: 'settings-interface-details', children: expect.anything(),
    })

    expect(instance.getElement()).toBeDefined()
  })

  it('should append feature settings, save and reset buttons to the details element', () => {
    const instance = new SettingsInterface(configManagerInstance)

    expect(FeatureSettingsFactory.create).toHaveBeenCalled()
    expect(ButtonElementFactory.create).toHaveBeenCalledWith('save', expect.any(Object))
    expect(ButtonElementFactory.create).toHaveBeenCalledWith('reset', expect.any(Object))
  })

  it('should return the created element', () => {
    const instance = new SettingsInterface(configManagerInstance)

    expect(instance.getElement()).toBe(instance.element)
  })
})

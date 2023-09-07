import SettingsInterface      from '../../../src/userinterface/container/SettingsInterface.js'
import ButtonElementFactory   from '../../../src/userinterface/factories/ButtonElementFactory.js'
import CallbackWrapperFactory from '../../../src/userinterface/factories/CallbackWrapperFactory.js'
import FeatureSettingsFactory from '../../../src/userinterface/factories/FeatureSettingsFactory.js'
import MiscElementFactory     from '../../../src/userinterface/factories/MiscElementFactory.js'

jest.mock('../../../src/userinterface/factories/ButtonElementFactory.js')
jest.mock('../../../src/userinterface/factories/CallbackWrapperFactory.js')
jest.mock('../../../src/userinterface/factories/FeatureSettingsFactory.js')
jest.mock('../../../src/userinterface/factories/MiscElementFactory.js')

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
    ButtonElementFactory.create.mockReset()
    CallbackWrapperFactory.create.mockReset()
    FeatureSettingsFactory.create.mockReset()
    MiscElementFactory.create.mockReset()

    // Mocking factories
    MiscElementFactory.create     = jest.fn().mockReturnValue({
      appendChild : jest.fn(),
      classList   : {
        add: jest.fn(),
      },
      append: jest.fn(),
    })
    FeatureSettingsFactory.create = jest.fn().mockReturnValue({
      appendChild : jest.fn(),
      classList   : {
        add: jest.fn(),
      },
      append: jest.fn(),
    })
  })

  it('should create a settings interface with correct elements', () => {
    const instance = new SettingsInterface(configManagerInstance)

    expect(MiscElementFactory.create).toHaveBeenCalledWith('div', { id: 'settings-interface-wrapper' })
    expect(MiscElementFactory.create).toHaveBeenCalledWith('details', { id: 'settings-interface-details' })
    expect(MiscElementFactory.create).toHaveBeenCalledWith('summary', { id: 'settings-interface-summary' })
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

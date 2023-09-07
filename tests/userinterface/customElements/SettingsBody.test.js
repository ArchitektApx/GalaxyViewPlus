import SettingsBody       from '../../../src/userinterface/customElements/SettingsBody.js'
import DataTypeFactory    from '../../../src/userinterface/factories/DataTypeFactory.js'
import MiscElementFactory from '../../../src/userinterface/factories/MiscElementFactory.js'

jest.mock('../../../src/userinterface/factories/DataTypeFactory.js')
jest.mock('../../../src/userinterface/factories/MiscElementFactory.js')

describe('SettingsBody', () => {
  let config
  let configCallback

  beforeEach(() => {
    config         = {
      htmlPrefix : 'test-prefix',
      active     : true,
    }
    configCallback = jest.fn()

    // Mocking document.createElement
    global.document = {
      createElement: jest.fn().mockReturnValue({
        appendChild : jest.fn(),
        classList   : {
          add: jest.fn(),
        },
        append: jest.fn(), // Add this line to mock the append method
      }),
    }

    // Resetting mocks
    DataTypeFactory.create.mockReset()
    MiscElementFactory.create.mockReset()

    // Mocking MiscElementFactory.create
    MiscElementFactory.create = jest.fn().mockReturnValue({
      appendChild : jest.fn(),
      classList   : {
        add: jest.fn(),
      },
      append: jest.fn(),
    })
  })

  it('should create an element with correct ID and class', () => {
    const instance = new SettingsBody(config, configCallback)

    expect(MiscElementFactory.create).toHaveBeenCalledWith('div', {
      id        : 'test-prefix-body-container',
      classList : 'feature-body-container',
    })
    expect(instance.getElement()).toBeDefined()
  })

  it('should add "hidden" class if config.active is false', () => {
    config.active = false

    const instance = new SettingsBody(config, configCallback)

    expect(instance.getElement().classList.add).toHaveBeenCalledWith('hidden')
  })

  it('should call DataTypeFactory.create with correct parameters', () => {
    const instance = new SettingsBody(config, configCallback)

    expect(DataTypeFactory.create).toHaveBeenCalledWith(config, configCallback)
  })

  it('should return the created element', () => {
    const instance = new SettingsBody(config, configCallback)

    expect(instance.getElement()).toBe(instance.element)
  })
})

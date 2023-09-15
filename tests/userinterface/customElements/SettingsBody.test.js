import SettingsBody       from '../../../src/userinterface/customelements/SettingsBody.js'
import DataTypeFactory    from '../../../src/userinterface/factories/DataTypeFactory.js'
import HtmlElementFactory from '../../../src/userinterface/factories/HtmlElementFactory.js'

jest.mock('../../../src/userinterface/factories/DataTypeFactory.js')
jest.mock('../../../src/userinterface/factories/HtmlElementFactory.js')

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
        append: jest.fn(),
      }),
    }

    // Resetting mocks
    DataTypeFactory.create.mockReset()
    HtmlElementFactory.create.mockReset()

    // Mocking HtmlElementFactory.create
    HtmlElementFactory.create = jest.fn().mockReturnValue({
      appendChild : jest.fn(),
      classList   : {
        add: jest.fn(),
      },
      append: jest.fn(),
    })
  })

  it('should create an element with correct ID and class', () => {
    const instance = new SettingsBody(config, configCallback)

    expect(HtmlElementFactory.create).toHaveBeenCalledWith('div', {
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

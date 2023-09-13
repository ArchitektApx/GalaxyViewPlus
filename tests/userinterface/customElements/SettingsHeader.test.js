/* eslint-disable sonarjs/no-duplicate-string */
import SettingsHeader         from '../../../src/userinterface/customelements/SettingsHeader.js'
import CallbackWrapperFactory from '../../../src/userinterface/factories/CallbackWrapperFactory.js'
import HtmlElementFactory     from '../../../src/userinterface/factories/HtmlElementFactory.js'
import InputElementFactory    from '../../../src/userinterface/factories/InputElementFactory.js'

jest.mock('../../../src/userinterface/factories/CallbackWrapperFactory.js')
jest.mock('../../../src/userinterface/factories/InputElementFactory.js')
jest.mock('../../../src/userinterface/factories/HtmlElementFactory.js')

describe('SettingsHeader', () => {
  let config
  let configCallback

  beforeEach(() => {
    config         = {
      htmlPrefix  : 'test-prefix',
      displayName : 'Test Display Name',
      description : 'Test Description',
      active      : true,
      sortData    : true,
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
    CallbackWrapperFactory.create.mockReset()
    InputElementFactory.create.mockReset()
    HtmlElementFactory.create.mockReset()

    // Mocking factories
    HtmlElementFactory.create  = jest.fn().mockReturnValue({
      appendChild : jest.fn(),
      classList   : {
        add: jest.fn(),
      },
      append: jest.fn(),
    })
    InputElementFactory.create = jest.fn().mockReturnValue({
      appendChild : jest.fn(),
      classList   : {
        add: jest.fn(),
      },
      append: jest.fn(),
    })
  })

  it('should create an element with correct ID, class and structure', () => {
    const instance = new SettingsHeader(config, configCallback)

    // children of the div
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(1, 'p', {
      id          : 'test-prefix-header-title',
      textContent : 'Test Display Name',
      classList   : 'feature-header-title',
      attributes  : { title: 'Test Description' },
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(2, 'br', {})
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(3, 'label', {
      forId       : 'test-prefix-header-status-checkbox',
      textContent : 'Aktiv:',
    })

    // 4th is the div
    expect(HtmlElementFactory.create).toHaveBeenCalledTimes(4)
    // once for the checkbox
    expect(InputElementFactory.create).toHaveBeenCalledTimes(1)
  })

  it('should return the created element', () => {
    const instance = new SettingsHeader(config, configCallback)

    expect(instance.getElement()).toBe(instance.element)
  })
})

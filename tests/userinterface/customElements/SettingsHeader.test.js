/* eslint-disable sonarjs/no-duplicate-string */
import SettingsHeader         from '../../../src/userinterface/customElements/SettingsHeader.js'
import CallbackWrapperFactory from '../../../src/userinterface/factories/CallbackWrapperFactory.js'
import InputElementFactory    from '../../../src/userinterface/factories/InputElementFactory.js'
import MiscElementFactory     from '../../../src/userinterface/factories/MiscElementFactory.js'

jest.mock('../../../src/userinterface/factories/CallbackWrapperFactory.js')
jest.mock('../../../src/userinterface/factories/InputElementFactory.js')
jest.mock('../../../src/userinterface/factories/MiscElementFactory.js')

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
    MiscElementFactory.create.mockReset()

    // Mocking factories
    MiscElementFactory.create  = jest.fn().mockReturnValue({
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

  it('should create an element with correct ID and class', () => {
    const instance = new SettingsHeader(config, configCallback)

    expect(MiscElementFactory.create).toHaveBeenCalledWith('div', {
      id        : 'test-prefix-header-container',
      classList : [ 'feature-header-container' ],
    })
    expect(instance.getElement()).toBeDefined()
  })

  it('should append title, status checkbox, and sort checkbox based on config', () => {
    const instance = new SettingsHeader(config, configCallback)

    expect(MiscElementFactory.create).toHaveBeenCalledWith('p', {
      id          : 'test-prefix-header-title',
      textContent : 'Test Display Name',
      classList   : 'feature-header-title',
      attributes  : { title: 'Test Description' },
    })
    expect(InputElementFactory.create).toHaveBeenCalledWith('checkbox', {
      checked        : true,
      name           : 'test-prefix-header-status-checkbox',
      id             : 'test-prefix-header-status-checkbox',
      classList      : [ 'feature-header-statusCheckbox' ],
      attributes     : { 'data-lastvalue': true },
      eventListeners : CallbackWrapperFactory.create('ActiveCheckBoxWrapper', configCallback),
    })
    expect(InputElementFactory.create).toHaveBeenCalledWith('checkbox', {
      checked        : true,
      name           : 'test-prefix-header-sort-checkbox',
      id             : 'test-prefix-header-sort-checkbox',
      classList      : [ 'feature-header-sortCheckbox' ],
      attributes     : { 'data-lastvalue': true },
      eventListeners : CallbackWrapperFactory.create('SortCheckboxWrapper', configCallback),
    })
  })

  it('should not append sort checkbox if config.sortData is false', () => {
    config.sortData = false

    const instance = new SettingsHeader(config, configCallback)

    const sortCheckboxCalls = InputElementFactory.create.mock.calls.filter(call => call[1].id === 'test-prefix-header-sort-checkbox')

    expect(sortCheckboxCalls).toHaveLength(0)
  })

  it('should return the created element', () => {
    const instance = new SettingsHeader(config, configCallback)

    expect(instance.getElement()).toBe(instance.element)
  })
})

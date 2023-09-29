/* eslint-disable import/order */
import {
  HtmlElementFactory, InputElementFactory,
} from '../mocks/MockFactoriesSetup.js'
import SettingsHeader from '../../../src/userinterface/customelements/SettingsHeader.js'

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

    // Resetting mocks
    jest.clearAllMocks()
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
      attributes  : { for: 'test-prefix-header-status-checkbox' },
      textContent : 'Active:',
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

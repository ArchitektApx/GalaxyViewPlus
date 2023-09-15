/* eslint-disable import/order */
import { HtmlElementFactory, DataTypeFactory } from '../mocks/MockFactoriesSetup.js'
import SettingsBody                            from '../../../src/userinterface/customelements/SettingsBody.js'

describe('SettingsBody', () => {
  let config
  let configCallback

  beforeEach(() => {
    config         = {
      htmlPrefix : 'test-prefix',
      active     : true,
    }
    configCallback = jest.fn()

    // Resetting mocks
    jest.clearAllMocks()
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

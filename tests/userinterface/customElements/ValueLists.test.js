/* eslint-disable import/order */
import {
  HtmlElementFactory, InputElementFactory,
} from '../mocks/MockFactoriesSetup.js'
import ValueListElement from '../../../src/userinterface/customelements/ValueLists.js'

describe('ValueListElement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a ValueListElement', () => {
    const config = {
      htmlPrefix : 'test-prefix',
      dataType   : 'ValueList',
      data       : [
        {
          key              : 'testKey',
          displayName      : 'Test Display Name',
          valueDescription : 'Test Value Description',
          inputType        : 'text',
          value            : 'testValue',
          checked          : true,
        },
      ],
    }

    const configCallback = jest.fn()
    const instance       = new ValueListElement(config, configCallback)

    expect(instance).toBeInstanceOf(ValueListElement)
    expect(HtmlElementFactory.create).toHaveBeenCalled()
    expect(instance.getElement).toBeDefined()
  })

  it('should return the created element', () => {
    const config = {
      htmlPrefix : 'test-prefix',
      dataType   : 'ValueList',
      data       : [
        {
          key              : 'testKey',
          displayName      : 'Test Display Name',
          valueDescription : 'Test Value Description',
          inputType        : 'text',
          value            : 'testValue',
          checked          : true,
        },
      ],
    }

    const configCallback  = jest.fn()
    const instance        = new ValueListElement(config, configCallback)
    const returnedElement = instance.getElement()

    expect(returnedElement).toBeDefined()
  })

  it('should build list rows correctly', () => {
    const config = {
      htmlPrefix : 'test-prefix1',
      dataType   : 'ValueList',
      data       : [
        {
          key              : 'testKey',
          displayName      : 'Test Display Name1',
          valueDescription : 'Test Value Description1',
          inputType        : 'text',
          value            : 'testValue',
          checked          : true,
        },
      ],
    }

    const configCallback = jest.fn()
    const instance       = new ValueListElement(config, configCallback)

    expect(instance).toBeInstanceOf(ValueListElement)
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(1, 'label', {
      attributes: {
        for   : 'test-prefix1-input-testKey',
        title : 'Test Value Description1',
      },
      classList   : 'test-prefix1-testKey-label',
      textContent : 'Test Display Name1',
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(2, 'td', expect.anything())
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(3, 'td', expect.anything())
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(4, 'tr', {
      children  : [ expect.anything(), expect.anything() ],
      classList : 'ValueList ValueList-row',
      id        : 'test-prefix1-row',
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(5, 'table', {
      children  : expect.anything(),
      classList : [ 'test-prefix1', 'ValueList' ],
      id        : 'test-prefix1-tablecontainer',
    })
    expect(InputElementFactory.create).toHaveBeenCalledTimes(1)
    expect(instance.getElement).toBeDefined()
  })
})

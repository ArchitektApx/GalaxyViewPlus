/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable arrow-body-style */
import ValueListElement       from '../../../src/userinterface/customelements/ValueLists.js'
import CallbackWrapperFactory from '../../../src/userinterface/factories/CallbackWrapperFactory.js'
import HtmlElementFactory     from '../../../src/userinterface/factories/HtmlElementFactory.js'
import InputElementFactory    from '../../../src/userinterface/factories/InputElementFactory.js'

const mockElement = {}

global.document = {
  createElement: jest.fn().mockReturnValue(mockElement),
}

jest.mock('../../../src/userinterface/factories/CallbackWrapperFactory.js')
jest.mock('../../../src/userinterface/factories/InputElementFactory.js')
jest.mock('../../../src/userinterface/factories/HtmlElementFactory.js', () => ({
  create: jest.fn(() => mockElement), // Return a mock table element
}))

describe('ValueListElement', () => {
  beforeEach(() => {
    HtmlElementFactory.create.mockClear()
    CallbackWrapperFactory.create.mockClear()
    InputElementFactory.create.mockClear()
    HtmlElementFactory.create.mockClear()
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

    expect(HtmlElementFactory.create).toHaveBeenCalledTimes(5)
    expect(InputElementFactory.create).toHaveBeenCalledTimes(1)
  })
})

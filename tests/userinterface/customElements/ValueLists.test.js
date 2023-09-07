/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable arrow-body-style */
import ValueListElement       from '../../../src/userinterface/customElements/ValueLists.js'
import CallbackWrapperFactory from '../../../src/userinterface/factories/CallbackWrapperFactory.js'
import InputElementFactory    from '../../../src/userinterface/factories/InputElementFactory.js'
import MiscElementFactory     from '../../../src/userinterface/factories/MiscElementFactory.js'
import TableElementFactory    from '../../../src/userinterface/factories/TableElementFactory.js'

const mockElement = {}

global.document = {
  createElement: jest.fn().mockReturnValue(mockElement),
}

jest.mock('../../../src/userinterface/factories/MiscElementFactory.js')
jest.mock('../../../src/userinterface/factories/CallbackWrapperFactory.js')
jest.mock('../../../src/userinterface/factories/InputElementFactory.js')
jest.mock('../../../src/userinterface/factories/TableElementFactory.js', () => ({
  create: jest.fn(() => mockElement), // Return a mock table element
}))

describe('ValueListElement', () => {
  beforeEach(() => {
    MiscElementFactory.create.mockClear()
    CallbackWrapperFactory.create.mockClear()
    InputElementFactory.create.mockClear()
    TableElementFactory.create.mockClear()
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
    expect(TableElementFactory.create).toHaveBeenCalled()
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

    expect(TableElementFactory.create).toHaveBeenCalledTimes(4)
    expect(MiscElementFactory.create).toHaveBeenCalledTimes(1)
    expect(InputElementFactory.create).toHaveBeenCalledTimes(1)
  })
})

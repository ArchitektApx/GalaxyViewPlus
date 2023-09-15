import Wrapper                from '../../../src/userinterface/callbackwrappers/Wrapper.js'
import CallbackWrapperFactory from '../../../src/userinterface/factories/CallbackWrapperFactory.js'

const mockEvent = {
  target: {
    parentElement: {
      children: [ null, {} ],  // Mocked children array with a second element
    },
  },
}

describe('CallbackWrapperFactory class', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return a wrapper object for avalid type', () => {
    const mockCallbackFunction = jest.fn()
    const result               = CallbackWrapperFactory.create('AddRowButton', mockCallbackFunction)

    expect(result).toHaveProperty('callback')
    expect(result).toHaveProperty('eventType', 'click')
    expect(typeof result.callback).toBe('function')
  })

  it('should log an error and return undefined for invalid types', () => {
    const mockCallbackFunction = jest.fn()
    console.error              = jest.fn()

    const result = CallbackWrapperFactory.create('InvalidType', mockCallbackFunction)

    expect(console.error).toHaveBeenCalledWith('CallbackWrapperFactory.create: Type InvalidType not found in actionMethodMap')
    expect(result).toBeUndefined()
  })

  it('should not return a wrapper object for types with incomplete actionMethodMap entries', () => {
    const mockCallbackFunction = jest.fn()
    // Mock the actionMethodMap
    const originalActionMethodMap          = CallbackWrapperFactory.actionMethodMap
    CallbackWrapperFactory.actionMethodMap = {
      IncompleteType: {
        actionMethod : null, // or undefined
        evenType     : 'click',
      },
    }

    const result = CallbackWrapperFactory.create('IncompleteType', mockCallbackFunction)
    expect(result).toBeUndefined()

    // Restore the original actionMethodMap after the test
    CallbackWrapperFactory.actionMethodMap = originalActionMethodMap
  })

  it('should handle a function passed as callbackAction for AddRowButton', () => {
    const mockCallbackFunction = jest.fn()
    const mockCallbackAction   = jest.fn()

    const result = CallbackWrapperFactory.create('AddRowButton', mockCallbackFunction, mockCallbackAction)

    // Trigger the callback with the mocked event
    result.callback(mockEvent)
    expect(mockCallbackAction).toHaveBeenCalled()
  })

  it('should use the default callbackAction if none is provided', () => {
    const mockCallbackFunction = jest.fn()
    const result               = CallbackWrapperFactory.create('AddRowButton', mockCallbackFunction)

    // then check how getWrapper was called
    jest.mock('../../../src/userinterface/callbackwrappers/Wrapper.js')
    Wrapper.getWrapper = jest.fn()
    const result2      = CallbackWrapperFactory.create('AddRowButton', mockCallbackFunction)
    expect(Wrapper.getWrapper).toHaveBeenCalledWith('click', expect.anything(), mockCallbackFunction, 'addRow')
  })
})

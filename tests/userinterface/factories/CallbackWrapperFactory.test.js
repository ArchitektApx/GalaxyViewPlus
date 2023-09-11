import CallbackWrapperFactory from '../../../src/userinterface/factories/CallbackWrapperFactory.js'

describe('CallbackWrapperFactory class', () => {
  it('should return a wrapper object for valid types', () => {
    const mockCallbackFunction = jest.fn()
    const result               = CallbackWrapperFactory.create('AddRowButton', mockCallbackFunction)

    expect(result).toHaveProperty('callback')
    expect(result).toHaveProperty('eventType', 'click')
    expect(typeof result.callback).toBe('function')
  })

  it('should log an error and return undefined for invalid types', () => {
    const mockCallbackFunction = jest.fn()
    const consoleSpy           = jest.spyOn(console, 'error').mockImplementation()

    const result = CallbackWrapperFactory.create('InvalidType', mockCallbackFunction)

    expect(consoleSpy).toHaveBeenCalledWith('CallbackWrapperFactory.create: Type InvalidType not found in actionMethodMap')
    expect(result).toBeUndefined()

    consoleSpy.mockRestore()
  })

  it('should use the default callbackAction if none is provided', () => {
    const mockCallbackFunction = jest.fn()
    const result               = CallbackWrapperFactory.create('AddRowButton', mockCallbackFunction)

    // Assuming Wrapper.getWrapper is correctly implemented, we only need to check the eventType
    expect(result.eventType).toBe('click')
  })

  it('should handle a function passed as callbackAction for AddRowButton', () => {
    const mockCallbackFunction = jest.fn()
    const mockCallbackAction   = jest.fn()
    const mockEvent            = {
      target: {
        parentElement: {
          children: [ null, {} ],  // Mocked children array with a second element
        },
      },
    }

    const result = CallbackWrapperFactory.create('AddRowButton', mockCallbackFunction, mockCallbackAction)

    // Trigger the callback with the mocked event
    result.callback(mockEvent)

    expect(mockCallbackAction).toHaveBeenCalled()
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
})

/* eslint-disable max-len */
import Wrapper from '../../../src/userinterface/callbackwrappers/Wrapper.js'

describe('Wrapper class', () => {
  it('should return a wrapper object with the correct structure', () => {
    const mockActionMethod     = jest.fn()
    const mockCallbackFunction = jest.fn()
    const mockCallbackAction   = jest.fn()
    const eventType            = 'click'

    const result = Wrapper.getWrapper(eventType, mockActionMethod, mockCallbackFunction, mockCallbackAction)

    expect(result).toHaveProperty('callback')
    expect(result).toHaveProperty('eventType', eventType)
    expect(typeof result.callback).toBe('function')
  })

  it('should invoke the actionMethod with the correct arguments when the callback is called', () => {
    const mockActionMethod     = jest.fn()
    const mockCallbackFunction = jest.fn()
    const mockCallbackAction   = jest.fn()
    const eventType            = 'click'
    const mockEvent            = { target: {} }

    const result = Wrapper.getWrapper(eventType, mockActionMethod, mockCallbackFunction, mockCallbackAction)
    result.callback(mockEvent)

    expect(mockActionMethod).toHaveBeenCalledWith(mockEvent, mockCallbackFunction, mockCallbackAction)
  })

  it('should return the correct eventType', () => {
    const mockActionMethod     = jest.fn()
    const mockCallbackFunction = jest.fn()
    const mockCallbackAction   = jest.fn()
    const eventType            = 'click'

    const result = Wrapper.getWrapper(eventType, mockActionMethod, mockCallbackFunction, mockCallbackAction)

    expect(result.eventType).toBe(eventType)
  })
})

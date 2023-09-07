import BaseWrapper  from '../../../src/userinterface/callbackwrappers/BaseWrapper.js'
import InputWrapper from '../../../src/userinterface/callbackwrappers/InputWrapper.js'

describe('InputWrapper', () => {
  let wrapper

  beforeEach(() => {
    wrapper = new InputWrapper('someEvent', jest.fn())
  })

  describe('constructor', () => {
    it('should correctly set the eventType', () => {
      expect(wrapper.eventType).toBe('someEvent')
    })

    it('should correctly set the wrapperObject', () => {
      expect(wrapper.getWrapper()).toEqual(expect.objectContaining({
        eventType : 'someEvent',
        callback  : expect.any(Function),
      }))
    })
  })

  const mockEvent = {
    target: {
      checked   : false,
      className : 'inputClass',
      dataset   : { lastvalue: 'lastInputValue' },
      id        : 'inputID',
      name      : 'inputName',
      type      : 'text',
      value     : 'inputValue',
    },
  }

  describe('buildWrapperObject', () => {
    it('should build an object with the correct eventType', () => {
      const result = wrapper.buildWrapperObject(jest.fn())

      expect(result).toHaveProperty('eventType', 'someEvent')
    })

    it('should build an object with a callback function', () => {
      const result = wrapper.buildWrapperObject(jest.fn())

      expect(result).toHaveProperty('callback')
      expect(typeof result.callback).toBe('function')
    })
  })

  describe('callback', () => {
    it("should call the inputCallback with 'changeData' and extracted input data", () => {
      const mockCallback = jest.fn()

      const expectedData = {
        checked   : false,
        className : 'inputClass',
        id        : 'inputID',
        lastvalue : 'lastInputValue',
        name      : 'inputName',
        type      : 'text',
        value     : 'inputValue',
      }

      wrapper = new InputWrapper('someEvent', mockCallback)
      wrapper.getWrapper().callback(mockEvent)

      expect(mockCallback).toHaveBeenCalledWith('changeData', expectedData)
    })

    it('should call BaseWrapper.refreshLastValue to update data-lastvalue attribute', () => {
      // Mock BaseWrapper.refreshLastValue
      const mockRefreshLastValue = jest.spyOn(BaseWrapper, 'refreshLastValue')

      mockRefreshLastValue.mockImplementation(() => {}) // No-op

      const mockInputCallback = jest.fn()

      wrapper = new InputWrapper('input', mockInputCallback)

      const { callback } = wrapper.getWrapper()

      callback(mockEvent)

      // Check if BaseWrapper.refreshLastValue was called
      expect(mockRefreshLastValue).toHaveBeenCalledWith(mockEvent)

      // Clean up mock after test
      mockRefreshLastValue.mockRestore()
    })
  })
})

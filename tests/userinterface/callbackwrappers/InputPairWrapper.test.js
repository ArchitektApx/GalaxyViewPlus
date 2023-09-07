import BaseWrapper      from '../../../src/userinterface/callbackwrappers/BaseWrapper.js'
import InputPairWrapper from '../../../src/userinterface/callbackwrappers/InputPairWrapper.js'

describe('InputPairWrapper', () => {
  let wrapper

  beforeEach(() => {
    wrapper = new InputPairWrapper('someEvent', jest.fn())
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
      parentElement: {
        parentElement: {
          children: [
            {
              firstChild: {
                checked   : false,
                className : 'keyClass',
                dataset   : { lastvalue: 'lastKey' },  // <-- Make sure dataset is present
                id        : 'keyID',
                name      : 'keyName',
                type      : 'text',
                value     : 'keyValue',
              },
            },
            {
              firstChild: {
                checked   : false,
                className : 'valueClass',
                dataset   : { lastvalue: 'lastValue' },
                id        : 'valueID',
                name      : 'valueName',
                type      : 'text',
                value     : 'valueValue',
              },
            },
          ],
        },
      },
      type    : 'text',
      dataset : {},
      value   : 'someValue',
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
    it("should call the inputCallback with 'changeData' and extracted input pair data", () => {
      const mockCallback = jest.fn()

      const expectedData = [
        { checked: false, className: 'keyClass', id: 'keyID', lastvalue: 'lastKey', name: 'keyName', type: 'text', value: 'keyValue' },
        { checked: false, className: 'valueClass', id: 'valueID', lastvalue: 'lastValue', name: 'valueName', type: 'text', value: 'valueValue' },
      ]

      wrapper = new InputPairWrapper('someEvent', mockCallback)
      wrapper.getWrapper().callback(mockEvent)

      expect(mockCallback).toHaveBeenCalledWith('changeData', expectedData)
    })

    it('should call BaseWrapper.refreshLastValue to update data-lastvalue attribute', () => {
    // Mock BaseWrapper.refreshLastValue
      const mockRefreshLastValue = jest.spyOn(BaseWrapper, 'refreshLastValue')

      mockRefreshLastValue.mockImplementation(() => {}) // No-op

      const mockInputCallback = jest.fn()

      wrapper = new InputPairWrapper('input', mockInputCallback)

      const { callback } = wrapper.getWrapper()

      callback(mockEvent)

      // Check if BaseWrapper.refreshLastValue was called
      expect(mockRefreshLastValue).toHaveBeenCalledWith(mockEvent)

      // Clean up mock after test
      mockRefreshLastValue.mockRestore()
    })
  })
})

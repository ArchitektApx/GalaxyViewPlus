import BaseWrapper            from '../../../src/userinterface/callbackwrappers/BaseWrapper.js'
import RemoveRowButtonWrapper from '../../../src/userinterface/callbackwrappers/RemoveRowButtonWrapper.js'

describe('RemoveRowButtonWrapper', () => {
  let wrapper

  beforeEach(() => {
    wrapper = new RemoveRowButtonWrapper('someEvent', jest.fn())
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
                dataset   : { lastvalue: 'lastKey' },
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
          remove: jest.fn(),
        },
      },
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
    it("should call the inputCallback with 'removeRow' and extracted input pair data", () => {
      const mockCallback = jest.fn()

      const expectedData = [
        { checked: false, className: 'keyClass', id: 'keyID', lastvalue: 'lastKey', name: 'keyName', type: 'text', value: 'keyValue' },
        { checked: false, className: 'valueClass', id: 'valueID', lastvalue: 'lastValue', name: 'valueName', type: 'text', value: 'valueValue' },
      ]

      wrapper = new RemoveRowButtonWrapper('someEvent', mockCallback)
      wrapper.getWrapper().callback(mockEvent)

      expect(mockCallback).toHaveBeenCalledWith('removeRow', expectedData)
    })

    it('should remove the row', () => {
      const mockCallback = jest.fn()

      wrapper = new RemoveRowButtonWrapper('someEvent', mockCallback)
      wrapper.getWrapper().callback(mockEvent)

      expect(mockEvent.target.parentElement.parentElement.remove).toHaveBeenCalled()
    })
  })
})

import BaseWrapper from '../../../src/userinterface/callbackwrappers/BaseWrapper.js'

describe('BaseWrapper', () => {
  describe('Constructor', () => {
    it('should create an instance with given eventType', () => {
      const eventType = 'click'
      const instance  = new BaseWrapper(eventType)

      expect(instance.eventType).toBe(eventType)
      expect(instance.wrapperObject).toBeUndefined()
    })
  })

  describe('getWrapper', () => {
    it('should return the wrapperObject of the instance', () => {
      const eventType = 'click'
      const instance  = new BaseWrapper(eventType)

      // Initially, it should be undefined
      expect(instance.getWrapper()).toBeUndefined()

      // Assigning a mock wrapperObject and then checking its retrieval
      const mockWrapperObject = { mockKey: 'mockValue' }

      instance.wrapperObject = mockWrapperObject
      expect(instance.getWrapper()).toBe(mockWrapperObject)
    })
  })

  describe('Static Methods', () => {
    it('should extract input data correctly', () => {
      const inputData = {
        checked   : true,
        className : 'sample-class',
        dataset   : { lastvalue: '5' },
        id        : 'inputID',
        name      : 'inputName',
        type      : 'number',
        value     : '5',
      }

      const expected = {
        checked   : true,
        className : 'sample-class',
        id        : 'inputID',
        lastvalue : 5,
        name      : 'inputName',
        type      : 'number',
        value     : 5,
      }

      const result = BaseWrapper.extractInputData(inputData)

      expect(result).toEqual(expected)
    })

    it('should extract input pair data correctly', () => {
      const mockEvent = {
        target: {
          parentElement: {
            parentElement: {
              children: [
                { firstChild: { type: 'text', value: 'key', dataset: { lastvalue: 'oldKey' } } },
                { firstChild: { type: 'text', value: 'value', dataset: { lastvalue: 'oldValue' } } },
              ],
            },
          },
        },
      }

      const result   = BaseWrapper.extractInputPairData(mockEvent)
      const expected = [
        { className: undefined, checked: undefined, id: undefined, name: undefined, type: 'text', lastvalue: 'oldKey', value: 'key' },
        { className: undefined, checked: undefined, id: undefined, name: undefined, type: 'text', lastvalue: 'oldValue', value: 'value' },
      ]

      expect(result).toEqual(expected)
    })

    it('should extract parent row from cell event', () => {
      const mockEvent = {
        target: {
          parentElement: {
            parentElement: 'mockRow',
          },
        },
      }

      const result = BaseWrapper.extractParentRowFromCellEvent(mockEvent)

      expect(result).toBe('mockRow')
    })

    it('should refresh the last value of an input correctly', () => {
      const mockEvent = {
        target: {
          type    : 'text',
          value   : 'newValue',
          dataset : { lastvalue: 'oldValue' },
        },
      }

      BaseWrapper.refreshLastValue(mockEvent)
      expect(mockEvent.target.dataset.lastvalue).toBe('newValue')
    })
  })
})

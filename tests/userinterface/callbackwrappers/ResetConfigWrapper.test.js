import BaseWrapper        from '../../../src/userinterface/callbackwrappers/BaseWrapper.js'
import ResetConfigWrapper from '../../../src/userinterface/callbackwrappers/ResetConfigWrapper.js'

describe('ResetConfigWrapper', () => {
  let wrapper

  beforeEach(() => {
    wrapper = new ResetConfigWrapper('someEvent', jest.fn())
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
      className : 'configClass',
      dataset   : { lastvalue: 'lastConfig' },
      id        : 'configID',
      name      : 'configName',
      type      : 'text',
      value     : 'configValue',
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
    it("should call the inputCallback with 'resetConfig' and extracted input data", () => {
      const mockCallback = jest.fn()

      const expectedData = {
        checked   : false,
        className : 'configClass',
        id        : 'configID',
        lastvalue : 'lastConfig',
        name      : 'configName',
        type      : 'text',
        value     : 'configValue',
      }

      wrapper = new ResetConfigWrapper('someEvent', mockCallback)
      wrapper.getWrapper().callback(mockEvent)

      expect(mockCallback).toHaveBeenCalledWith('resetConfig', expectedData)
    })
  })
})

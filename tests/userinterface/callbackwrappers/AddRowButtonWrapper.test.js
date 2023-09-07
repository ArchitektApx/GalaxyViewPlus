import AddRowButtonWrapper from '../../../src/userinterface/callbackwrappers/AddRowButtonWrapper.js'

describe('AddRowButtonWrapper', () => {
  let wrapper

  beforeEach(() => {
    wrapper = new AddRowButtonWrapper('someEvent', {
      addRow    : jest.fn(),
      delButton : jest.fn(),
    })
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

  describe('buildWrapperObject', () => {
    it('should build an object with the correct eventType', () => {
      const result = wrapper.buildWrapperObject(jest.fn(), jest.fn())

      expect(result).toHaveProperty('eventType', 'someEvent')
    })

    it('should build an object with a callback function', () => {
      const result = wrapper.buildWrapperObject(jest.fn(), jest.fn())

      expect(result).toHaveProperty('callback')
      expect(typeof result.callback).toBe('function')
    })
  })

  describe('callback', () => {
    it('should call the addRowFunction with the correct arguments when the callback is executed', () => {
      const mockAddRow = jest.fn()
      const mockConfig = jest.fn()

      const mockEvent = {
        target: {
          parentElement: {
            children: [
              {}, // Mocking an array with two children
              'mockTbodyElement',
            ],
          },
        },
      }

      wrapper = new AddRowButtonWrapper('someEvent', {
        addRow    : mockAddRow,
        delButton : mockConfig,
      })

      wrapper.getWrapper().callback(mockEvent)
      expect(mockAddRow).toHaveBeenCalledWith('mockTbodyElement', mockConfig)
    })
  })
})

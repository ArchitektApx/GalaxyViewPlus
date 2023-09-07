/* eslint-disable max-len */
/* eslint-disable jest/no-conditional-expect */
import ActiveCheckBoxWrapper from '../../../src/userinterface/callbackwrappers/ActiveCheckBoxWrapper.js'
import BaseWrapper           from '../../../src/userinterface/callbackwrappers/BaseWrapper.js'

describe('ActiveCheckBoxWrapper', () => {
  let wrapper

  beforeEach(() => {
    wrapper = new ActiveCheckBoxWrapper('someEvent', jest.fn())
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
      checked       : false,
      className     : 'checkBoxClass',
      dataset       : { lastvalue: 'lastCheckBox' },
      id            : 'checkBoxID',
      name          : 'checkBoxName',
      type          : 'checkbox',
      value         : 'checkBoxValue',
      parentElement : {
        nextSibling: {
          classList: {
            remove : jest.fn(),
            add    : jest.fn(),
          },
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
    it("should call the inputCallback with 'changeStatus' and extracted input data", () => {
      const mockCallback = jest.fn()

      const expectedData = {
        checked   : false,
        className : 'checkBoxClass',
        id        : 'checkBoxID',
        lastvalue : 'lastCheckBox',
        name      : 'checkBoxName',
        type      : 'checkbox',
        value     : 'checkBoxValue',
      }

      wrapper = new ActiveCheckBoxWrapper('someEvent', mockCallback)
      wrapper.getWrapper().callback(mockEvent)

      expect(mockCallback).toHaveBeenCalledWith('changeStatus', expectedData)
    })

    it('should update the data-lastvalue attribute', () => {
      const mockCallback = jest.fn()

      wrapper = new ActiveCheckBoxWrapper('someEvent', mockCallback)
      wrapper.getWrapper().callback(mockEvent)

      expect(String(mockEvent.target.dataset.lastvalue)).toBe(String(mockEvent.target.checked))
    })

    it('should manage the visibility of the SettingsBody based on the checked status', () => {
      const mockCallback = jest.fn()

      wrapper = new ActiveCheckBoxWrapper('someEvent', mockCallback)
      wrapper.getWrapper().callback(mockEvent)

      if (mockEvent.target.checked) {
        expect(mockEvent.target.parentElement.nextSibling.classList.remove).toHaveBeenCalledWith('hidden')
      } else {
        expect(mockEvent.target.parentElement.nextSibling.classList.add).toHaveBeenCalledWith('hidden')
      }
    })

    it('should remove the "hidden" class from SettingsBody when data.checked is true', () => {
      const mockCallback = jest.fn()

      const mockEventWithCheckedTrue = {
        ...mockEvent,
        target: {
          ...mockEvent.target,
          checked       : true,
          parentElement : {
            nextSibling: {
              classList: {
                remove : jest.fn(),
                add    : jest.fn(),
              },
            },
          },
        },
      }

      wrapper = new ActiveCheckBoxWrapper('someEvent', mockCallback)
      wrapper.getWrapper().callback(mockEventWithCheckedTrue)

      expect(mockEventWithCheckedTrue.target.parentElement.nextSibling.classList.remove).toHaveBeenCalledWith('hidden')
      expect(mockEventWithCheckedTrue.target.parentElement.nextSibling.classList.add).not.toHaveBeenCalled()
    })

    it('should add the "hidden" class to SettingsBody when data.checked is false', () => {
      const mockCallback = jest.fn()

      wrapper = new ActiveCheckBoxWrapper('someEvent', mockCallback)
      wrapper.getWrapper().callback(mockEvent)

      expect(mockEvent.target.parentElement.nextSibling.classList.add).toHaveBeenCalledWith('hidden')
      expect(mockEvent.target.parentElement.nextSibling.classList.remove).not.toHaveBeenCalled()
    })

    it('should handle event without expected structure', () => {
      const mockCallback = jest.fn()

      // Mock event without the expected nested structure
      const mockEventWithoutStructure = {
        target: {
          checked: true,
          // No parentElement property
        },
      }

      wrapper = new ActiveCheckBoxWrapper('someEvent', mockCallback)

      // This should not throw any errors even though the event structure is not as expected
      expect(() => {
        wrapper.getWrapper().callback(mockEventWithoutStructure)
      }).not.toThrow()
    })
  })
})

import InputElement        from '../../../src/userinterface/elements/InputElements.js'
import InputElementFactory from '../../../src/userinterface/factories/InputElementFactory.js'

// Mocking the document.createElement method
const mockAddEventListener = jest.fn()
const mockInput            = { addEventListener: mockAddEventListener, type: '', name: '', value: '', checked: false }

global.document = {
  createElement: jest.fn().mockReturnValue(mockInput),
}

describe('InputElementFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks()  // Clear all mock data
  })

  it('should create an input element of the given type with provided options', () => {
    const input = InputElementFactory.create('text', { placeholder: 'Enter text', name: 'testInput', value: 'Test Value' })

    expect(mockInput.type).toBe('text')
    expect(mockInput.name).toBe('testInput')
    expect(mockInput.value).toBe('Test Value')
  })

  it('should not override keydown event by default', () => {
    InputElementFactory.create('text')

    expect(mockAddEventListener).not.toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('should override keydown event if overRideKeyDown is true', () => {
    InputElementFactory.create('text', {}, true)

    expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('should stop propagation and immediate propagation for keydown when overRideKeyDown is true', () => {
    const stopPropagation          = jest.fn()
    const stopImmediatePropagation = jest.fn()
    const mockEvent                = {
      stopPropagation,
      stopImmediatePropagation,
    }

    InputElementFactory.create('text', {}, true)

    // Simulate a keydown event by calling the registered event callback directly
    const registeredCallback = mockAddEventListener.mock.calls.find(call => call[0] === 'keydown')[1]

    registeredCallback(mockEvent)

    expect(stopPropagation).toHaveBeenCalled()
    expect(stopImmediatePropagation).toHaveBeenCalled()
  })

  // Add more tests to check other behaviors like checkboxes and radio buttons
})

import InputElementFactory from '../../../src/userinterface/factories/InputElementFactory.js'
import MockHTMLElement     from '../mocks/MockHtmlElement.js'

describe('InputElementFactory', () => {
  let createElementMock

  beforeEach(() => {
    // Mocking document.createElement
    global.HTMLElement = MockHTMLElement
    createElementMock  = jest.fn(tag => new MockHTMLElement(tag))
    global.document    = {
      createElement: createElementMock,
    }
  })

  it('should create an input element of the given type with provided options', () => {
    const input = InputElementFactory.create('text', { placeholder: 'Enter text', name: 'testInput', value: 'Test Value' })

    expect(input.type).toBe('text')
    expect(input.name).toBe('testInput')
    expect(input.value).toBe('Test Value')
  })

  it('should not override keydown event by default', () => {
    const input = InputElementFactory.create('text')

    expect(input.addEventListener).not.toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('should override keydown event if overRideKeyDown is true', () => {
    const input = InputElementFactory.create('text', {}, true)

    expect(input.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('should stop propagation and immediate propagation for keydown when overRideKeyDown is true', () => {
    const stopPropagation          = jest.fn()
    const stopImmediatePropagation = jest.fn()
    const mockEvent                = {
      stopPropagation,
      stopImmediatePropagation,
    }

    const input = InputElementFactory.create('text', {}, true)

    // Simulate a keydown event by calling the registered event callback directly
    const registeredCallback = input.addEventListener.mock.calls.find(call => call[0] === 'keydown')[1]

    registeredCallback(mockEvent)

    expect(stopPropagation).toHaveBeenCalled()
    expect(stopImmediatePropagation).toHaveBeenCalled()
  })
})

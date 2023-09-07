/* eslint-disable object-shorthand */
/* eslint-disable no-new */
import InputElement from '../../../src/userinterface/elements/InputElements.js'

describe('InputElement', () => {
  let mockElement

  beforeEach(() => {
    mockElement = {
      addEventListener : jest.fn(),
      setAttribute     : jest.fn(),
      classList        : { add: jest.fn() },
    }

    global.document = {
      createElement: jest.fn().mockReturnValue(mockElement),
    }
  })

  it('should not set checked property for non-checkbox or radio type inputs', () => {
    const input = new InputElement('text', { checked: true })

    expect(mockElement.checked).toBeUndefined()
  })

  it('should assign given ID to the input', () => {
    const input = new InputElement('text', { id: 'myInput' })

    input.getElement()  // This call ensures the id, classList, etc. are set
    expect(mockElement.id).toBe('myInput')
  })

  it('should add given classes to the input', () => {
    const input = new InputElement('text', { classList: [ 'input-field', 'dark-mode' ] })

    input.getElement()  // This call ensures the id, classList, etc. are set
    expect(mockElement.classList.add).toHaveBeenCalledWith('input-field')
    expect(mockElement.classList.add).toHaveBeenCalledWith('dark-mode')
  })

  it('should set given attributes to the input', () => {
    const input = new InputElement('text', { attributes: { 'data-test': 'testValue' } })

    input.getElement()  // This call ensures the id, classList, etc. are set
    expect(mockElement.setAttribute).toHaveBeenCalledWith('data-test', 'testValue')
  })

  it('should add multiple event listeners to the input', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()

    new InputElement('text', {
      eventListeners: [
        { eventType: 'focus', callback: callback1 },
        { eventType: 'blur', callback: callback2 },
      ],
    })

    expect(mockElement.addEventListener).toHaveBeenCalledWith('focus', callback1)
    expect(mockElement.addEventListener).toHaveBeenCalledWith('blur', callback2)
  })

  it('should not add event listeners if no eventType provided', () => {
    const callback = jest.fn()

    new InputElement('text', { eventListeners: { callback } })

    expect(mockElement.addEventListener).not.toHaveBeenCalled()
  })

  it('should create an input with default properties if no type is provided', () => {
    const input = new InputElement()

    expect(mockElement.type).toBe('text')
  })

  it('should create an input of type text by default', () => {
    const input = new InputElement()

    input.getElement()
    expect(mockElement.type).toBe('text')
  })

  it('should set checked attribute for checkbox and radio type', () => {
    const checkbox = new InputElement('checkbox', { checked: true })

    checkbox.getElement()
    expect(mockElement.checked).toBe(true)

    const radio = new InputElement('radio', { checked: true })

    radio.getElement()
    expect(mockElement.checked).toBe(true)
  })

  it('should not set checked for non-checkbox or radio types', () => {
    const textInput = new InputElement('text', { checked: true })

    textInput.getElement()
    expect(mockElement.checked).toBeFalsy()
  })

  it('should add event listener when both eventType and callback are provided', () => {
    const callback = jest.fn()
    const input    = new InputElement('text', { eventListeners: { eventType: 'focus', callback } })

    input.getElement()
    expect(mockElement.addEventListener).toHaveBeenCalledWith('focus', callback)
  })

  it('should not add event listener if eventType is missing', () => {
    const callback = jest.fn()
    const input    = new InputElement('text', { eventListeners: { callback } })

    input.getElement()
    expect(mockElement.addEventListener).not.toHaveBeenCalled()
  })

  it('should not add event listener if callback is missing', () => {
    const input = new InputElement('text', { eventListeners: { eventType: 'focus' } })

    input.getElement()
    expect(mockElement.addEventListener).not.toHaveBeenCalled()
  })

  it('should add event listeners for multiple events', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const input     = new InputElement('text', {
      eventListeners: [
        { eventType: 'focus', callback: callback1 },
        { eventType: 'blur', callback: callback2 },
      ],
    })

    input.getElement()
    expect(mockElement.addEventListener).toHaveBeenCalledWith('focus', callback1)
    expect(mockElement.addEventListener).toHaveBeenCalledWith('blur', callback2)
  })
})

/* eslint-disable object-shorthand */
/* eslint-disable no-new */
import Element       from '../../../src/userinterface/elements/BaseElement.js'
import ButtonElement from '../../../src/userinterface/elements/ButtonElements.js'

describe('ButtonElement', () => {
  let mockElement

  beforeEach(() => {
    // Mock DOM element
    mockElement = {
      addEventListener : jest.fn(),
      setAttribute     : jest.fn(),
      classList        : { add: jest.fn() },
    }

    // Mock document.createElement
    global.document = {
      createElement: jest.fn().mockReturnValue(mockElement),
    }
  })

  it('should create a button with default properties', () => {
    const button = new ButtonElement()

    expect(document.createElement).toHaveBeenCalledWith('button')
  })

  it('should create a button with provided text content', () => {
    const button = new ButtonElement({ textContent: 'Click me!' })

    expect(mockElement.textContent).toBe('Click me!')
  })

  it('should assign given ID to the button', () => {
    const button = new ButtonElement({ id: 'myButton' })

    button.getElement()
    expect(mockElement.id).toBe('myButton')
  })

  it('should add given classes to the button', () => {
    const button = new ButtonElement({ classList: [ 'btn', 'btn-primary' ] })

    button.getElement()
    expect(mockElement.classList.add).toHaveBeenCalledWith('btn')
    expect(mockElement.classList.add).toHaveBeenCalledWith('btn-primary')
  })

  it('should set given attributes to the button', () => {
    const button = new ButtonElement({ attributes: { 'data-test': 'testValue' } })

    button.getElement()
    expect(mockElement.setAttribute).toHaveBeenCalledWith('data-test', 'testValue')
  })

  it('should add single event listener to the button', () => {
    const callback = jest.fn()

    new ButtonElement({ eventListeners: { eventType: 'click', callback } })
    expect(mockElement.addEventListener).toHaveBeenCalledWith('click', callback)
  })

  it('should add multiple event listeners to the button', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()

    new ButtonElement({
      eventListeners: [
        { eventType: 'click', callback: callback1 },
        { eventType: 'hover', callback: callback2 },
      ],
    })

    expect(mockElement.addEventListener).toHaveBeenCalledWith('click', callback1)
    expect(mockElement.addEventListener).toHaveBeenCalledWith('hover', callback2)
  })

  it('should not add event listeners if empty object provided', () => {
    new ButtonElement({ eventListeners: {} })
    expect(mockElement.addEventListener).not.toHaveBeenCalled()
  })

  it('should not add event listeners if empty array provided', () => {
    new ButtonElement({ eventListeners: [] })
    expect(mockElement.addEventListener).not.toHaveBeenCalled()
  })

  it('should not add event listeners if no eventType provided', () => {
    const callback = jest.fn()

    new ButtonElement({ eventListeners: { callback } })
    expect(mockElement.addEventListener).not.toHaveBeenCalled()
  })

  it('should have empty text content by default', () => {
    const button = new ButtonElement()

    expect(mockElement.textContent).toBe('')
  })

  it('should be able to chain calls correctly', () => {
    const button = new ButtonElement({ id: 'test', classList: [ 'btn' ] })

    button.getElement().addEventListener('click', jest.fn())
    expect(mockElement.id).toBe('test')
    expect(mockElement.classList.add).toHaveBeenCalledWith('btn')
    expect(mockElement.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
  })

  it('should be an instance of Element', () => {
    const button = new ButtonElement()

    expect(button).toBeInstanceOf(Element)
  })
})

/* eslint-disable unicorn/prefer-dom-node-dataset */
import BaseElement from '../../../src/userinterface/htmlelements/BaseElement.js'

class MockHTMLElement {
  constructor(tagName) {
    this.tagName          = tagName.toUpperCase()
    this.classList        = {
      add: jest.fn(),
    }
    this.addEventListener = jest.fn()
    this.setAttribute     = jest.fn()
    this.append           = jest.fn()
    this.after            = jest.fn()
    this.children         = []
    this.style            = {}
  }
}

global.HTMLElement = MockHTMLElement

describe('BaseElement', () => {
  let createElementMock

  beforeEach(() => {
    // Mocking document.createElement
    createElementMock = jest.fn(tag => new MockHTMLElement(tag))
    global.document   = {
      createElement: createElementMock,
    }
  })

  it('should create an element with the given tag', () => {
    const element = new BaseElement('div')
    expect(createElementMock).toHaveBeenCalledWith('div')
    expect(element.getElement().tagName).toBe('DIV')
  })

  it('should add class to the element', () => {
    const element = new BaseElement('div')
    element.addClass('test-class')
    expect(element.getElement().classList.add).toHaveBeenCalledWith('test-class')
  })

  it('should add event listener to the element', () => {
    const element      = new BaseElement('div')
    const mockCallback = jest.fn()
    element.addEventListener('click', mockCallback)
    expect(element.getElement().addEventListener).toHaveBeenCalledWith('click', mockCallback)
  })

  it('should set title for the element', () => {
    const element = new BaseElement('div')
    element.addTitle('test-title')
    expect(element.getElement().title).toBe('test-title')
  })

  it('should append child element', () => {
    const element = new BaseElement('div')
    const child   = new MockHTMLElement('span')
    element.append(child)
    expect(element.getElement().append).toHaveBeenCalledWith(child)
  })

  it('should attach element after the current element', () => {
    const element = new BaseElement('div')
    const child   = new MockHTMLElement('span')
    element.after(child)
    expect(element.getElement().after).toHaveBeenCalledWith(child)
  })

  it('should set a single attribute for the element', () => {
    const element = new BaseElement('div', { attributes: { 'data-test': 'value' } })
    element.getElement()
    expect(element.getElement().setAttribute).toHaveBeenCalledWith('data-test', 'value')
  })

  it('should set attributes for the element', () => {
    const element = new BaseElement('div', { attributes: { 'data-test': 'value' } })
    element.getElement()
    expect(element.getElement().setAttribute).toHaveBeenCalledWith('data-test', 'value')
  })

  it('should set details open property when tag is details', () => {
    const element = new BaseElement('details', { open: true })
    element.getElement()
    expect(element.getElement().open).toBe(true)
  })

  it('should set for attribute when tag is label', () => {
    const element = new BaseElement('label', { forId: 'test-id' })
    element.getElement()
    expect(element.getElement().setAttribute).toHaveBeenCalledWith('for', 'test-id')
  })

  it('should set id for the element', () => {
    const element = new BaseElement('div', { id: 'test-id' })
    element.getElement()
    expect(element.getElement().id).toBe('test-id')
  })

  it('should set color for span element', () => {
    const element = new BaseElement('span', { color: 'red' })
    element.getElement()
    expect(element.getElement().style.color).toBe('red')
  })

  it('should set styles for the element', () => {
    const element = new BaseElement('div', { style: { backgroundColor: 'blue' } })
    element.getElement()
    expect(element.getElement().style.backgroundColor).toBe('blue')
  })

  it('should set textContent for the element without children', () => {
    const element = new BaseElement('div', { textContent: 'test content' })
    element.getElement()
    expect(element.getElement().textContent).toBe('test content')
  })

  it('should add multiple classes from a string', () => {
    const element = new BaseElement('div', { classList: 'class1 class2' })
    element.getElement()
    expect(element.getElement().classList.add).toHaveBeenCalledWith('class1')
    expect(element.getElement().classList.add).toHaveBeenCalledWith('class2')
  })

  it('should add multiple event listeners', () => {
    const mockCallback1 = jest.fn()
    const mockCallback2 = jest.fn()
    const element       = new BaseElement('div', { eventListeners: [ { eventType: 'click', callback: mockCallback1 }, { eventType: 'hover', callback: mockCallback2 } ] })
    element.getElement()
    expect(element.getElement().addEventListener).toHaveBeenCalledWith('click', mockCallback1)
    expect(element.getElement().addEventListener).toHaveBeenCalledWith('hover', mockCallback2)
  })

  it('should log an error for invalid child type', () => {
    console.error = jest.fn() // Mock console.error to suppress expected error messages
    const element = new BaseElement('div')
    element.append('string') // Passing a string instead of an HTMLElement or BaseElement
    expect(console.error).toHaveBeenCalledWith('append expects an instance of BaseElement or HTMLElement')
  })

  it('should set multiple attributes', () => {
    const element = new BaseElement('div', { attributes: { 'data-test1': 'value1', 'data-test2': 'value2' } })
    element.getElement()
    expect(element.getElement().setAttribute).toHaveBeenCalledWith('data-test1', 'value1')
    expect(element.getElement().setAttribute).toHaveBeenCalledWith('data-test2', 'value2')
  })

  it('should not add event listeners if no eventType provided', () => {
    const element = new BaseElement('div', { eventListeners: { callback: jest.fn() } })
    expect(element.getElement().addEventListener).not.toHaveBeenCalled()
  })

  it('should not add event listeners if no callback provided', () => {
    const element = new BaseElement('div', { eventListeners: { eventType: 'click' } })
    expect(element.getElement().addEventListener).not.toHaveBeenCalled()
  })

  it('should handle childelement of type BaseElement', () => {
    const element = new BaseElement('div')
    const child   = new BaseElement('span')
    element.append(child)
    expect(element.getElement().append).toHaveBeenCalledWith(child.getElement())
  })

  it('should handle childelement of type HTMLElement', () => {
    const element = new BaseElement('div')
    const child   = new MockHTMLElement('span')
    element.append(child)
    expect(element.getElement().append).toHaveBeenCalledWith(child)
  })

  it('should handle childelement of type string', () => {
    const element = new BaseElement('div')
    element.append('string')
    expect(element.getElement().append).not.toHaveBeenCalled()
  })

  it('should set an attribute using setAttribute method', () => {
    const element = new BaseElement('div')
    element.setAttribute('data-test', 'value')
    expect(element.getElement().setAttribute).toHaveBeenCalledWith('data-test', 'value')
  })

  it('should set multiple children', () => {
    const element = new BaseElement('div')
    const child1  = new BaseElement('span')
    const child2  = new BaseElement('span')
    element.appendChildren([ child1, child2 ])
    expect(element.getElement().append).toHaveBeenCalledTimes(2)
  })
})

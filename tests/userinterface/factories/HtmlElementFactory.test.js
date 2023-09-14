/* eslint-disable no-underscore-dangle */
import HtmlElementFactory from '../../../src/userinterface/factories/HtmlElementFactory.js'

class MockHTMLElement {
  constructor(tagName) {
    this.tagName     = tagName.toUpperCase()
    this.attributes  = {}
    this._classList  = []  // internal array to store classes
    this.classList   = {
      contains : cls => this._classList.includes(cls),  // check if class exists
      add      : cls => this._classList.push(cls),  // add class to internal array
    }
    this.textContent = ''
    this.title       = ''
    this.id          = ''
    this.children    = []
    this.dataset     = {}
  }

  getAttribute(attribute) {
    return this.attributes[attribute]
  }

  getElement() {
    // Simulate the behavior of BaseElement.getElement
    if (this._textContent && this.children.length === 0) {
      this.textContent = this._textContent
    }
    // ... handle other properties similarly

    return this
  }

  setAttribute(attribute, value) {
    this.attributes[attribute] = value
    if (attribute.startsWith('data-')) {
      const key         = attribute.slice(5)  // remove 'data-' prefix
      this.dataset[key] = value
    } else {
      this[attribute] = value
    }
  }
}

global.HTMLElement = MockHTMLElement

describe('HtmlElementFactory', () => {
  let createElementMock

  beforeEach(() => {
    // Mocking document.createElement
    createElementMock = jest.fn(tag => new MockHTMLElement(tag))
    global.document   = {
      createElement: createElementMock,
    }
  })

  it('should create an element with the given tag', () => {
    const element = HtmlElementFactory.create('div')
    expect(createElementMock).toHaveBeenCalledWith('div')
    expect(element.tagName).toBe('DIV')
  })

  it('should apply provided options to the created element', () => {
    const options = {
      attributes  : { 'data-test': 'value', 'title': 'test title', 'style': 'background-color: blue' },
      classList   : [ 'test-class' ],
      textContent : 'test content',
      id          : 'test-id',
    }

    const element = HtmlElementFactory.create('div', options)
    element.getElement()
    expect(element.dataset.test).toBe('value')
    expect(element.classList.contains('test-class')).toBeTruthy()
    expect(element.textContent).toBe('test content')
    expect(element.title).toBe('test title')
    expect(element.style).toBe('background-color: blue')
    expect(element.id).toBe('test-id')
  })

  // ... Add more tests for other options and edge cases.
})

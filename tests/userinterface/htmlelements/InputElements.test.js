/* eslint-disable func-names */
import InputElement from '../../../src/userinterface/htmlelements/InputElements.js'

global.HTMLElement = function () {}

class MockHTMLElement extends HTMLElement {
  constructor(tagName) {
    super()
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

describe('InputElement', () => {
  let createElementMock

  beforeEach(() => {
    createElementMock = jest.fn(tag => new MockHTMLElement(tag))
    global.document   = {
      createElement: createElementMock,
    }
  })

  it('should create an input element with default properties', () => {
    const input = new InputElement()
    expect(createElementMock).toHaveBeenCalledWith('input')
    expect(input.getElement().type).toBe('text')
    expect(input.getElement().name).toBe('')
    expect(input.getElement().value).toBe('')
  })

  it('should create an input element with provided properties', () => {
    const input = new InputElement('text', {
      name      : 'testName',
      value     : 'testValue',
      classList : [ 'testClass' ],
      id        : 'testId',
      title     : 'testTitle',
    })
    expect(input.getElement().type).toBe('text')
    expect(input.getElement().name).toBe('testName')
    expect(input.getElement().value).toBe('testValue')
    expect(input.getElement().classList.add).toHaveBeenCalledWith('testClass')
    expect(input.getElement().id).toBe('testId')
    expect(input.getElement().title).toBe('testTitle')
  })

  it('should set checked property for checkbox type', () => {
    const input = new InputElement('checkbox', {
      checked: true,
    })
    expect(input.getElement().type).toBe('checkbox')
    expect(input.getElement().checked).toBe(true)
  })

  it('should set checked property for radio type', () => {
    const input = new InputElement('radio', {
      checked: true,
    })
    expect(input.getElement().type).toBe('radio')
    expect(input.getElement().checked).toBe(true)
  })

  it('should not set checked property for non-checkbox/radio types', () => {
    const input = new InputElement('text', {
      checked: true,
    })
    expect(input.getElement().type).toBe('text')
    expect(input.getElement().checked).toBeUndefined()
  })

  // ... Add more tests if needed
})

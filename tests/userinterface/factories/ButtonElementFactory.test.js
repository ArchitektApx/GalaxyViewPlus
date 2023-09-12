/* eslint-disable no-underscore-dangle */
import ButtonElementFactory from '../../../src/userinterface/factories/ButtonElementFactory.js'

class MockHTMLElement {
  constructor(tagName) {
    this.tagName      = tagName.toUpperCase()
    this.children     = []
    this._textContent = ''
    this.classList    = {
      _classes : new Set(),
      contains : function (className) {
        return this._classes.has(className)
      },
      add: function (className) {
        this._classes.add(className)
      },
    }
  }

  append(child) {
    this.children.push(child)
  }

  get textContent() {
    return this._textContent
  }

  set textContent(value) {
    if (this.children.length === 0) {
      this._textContent = value
    }
  }
}

global.HTMLElement = MockHTMLElement

describe('ButtonElementFactory', () => {
  let createElementMock

  beforeEach(() => {
    createElementMock = jest.fn(tag => new MockHTMLElement(tag))
    global.document   = {
      createElement: createElementMock,
    }
  })

  it('should create an addRow button with default properties', () => {
    const button = ButtonElementFactory.create('addRow')
    expect(button.classList.contains('add-row-btn')).toBeTruthy()
    expect(button.textContent).toBe('Hinzufügen')
  })

  it('should create a removeRow button with default properties', () => {
    const button = ButtonElementFactory.create('removeRow')
    expect(button.classList.contains('remove-row-btn')).toBeTruthy()
    expect(button.textContent).toBe('Löschen')
  })

  it('should create a reset button with default properties', () => {
    const button = ButtonElementFactory.create('reset')
    expect(button.classList.contains('reset-config-btn')).toBeTruthy()
    expect(button.textContent).toBe('Zurücksetzen')
  })

  it('should create a save button with default properties', () => {
    const button = ButtonElementFactory.create('save')
    expect(button.classList.contains('save-config-btn')).toBeTruthy()
    expect(button.textContent).toBe('Speichern')
  })

  it('should create a button with overridden properties', () => {
    const button = ButtonElementFactory.create('addRow', { textContent: 'Override' })
    expect(button.classList.contains('add-row-btn')).toBeTruthy()
    expect(button.textContent).toBe('Override')
  })

  it('should log an error for unsupported button type', () => {
    console.error = jest.fn() // Mock console.error to suppress expected error messages
    const button  = ButtonElementFactory.create('unsupportedType')
    expect(console.error).toHaveBeenCalledWith("Button type 'unsupportedType' is not supported.")
    expect(button).toBeUndefined()
  })

  // ... Add more tests if needed
})

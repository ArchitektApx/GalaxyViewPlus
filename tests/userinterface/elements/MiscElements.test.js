/* eslint-disable no-new */
import MiscElement from '../../../src/userinterface/elements/MiscElements.js'

describe('MiscElement', () => {
  let mockElement
  let createElementSpy

  beforeEach(() => {
    mockElement = {
      setAttribute : jest.fn(),
      style        : {},
    }

    global.document = {
      createElement: jest.fn().mockReturnValue(mockElement),
    }

    createElementSpy = jest.spyOn(document, 'createElement')
    createElementSpy.mockImplementation(type => ({
      setAttribute : jest.fn(),
      style        : {},
    }))
  })

  afterEach(() => {
    // Restore the original function after each test
    createElementSpy.mockRestore()
  })

  it('should create an element with default options', () => {
    new MiscElement('div')
    expect(createElementSpy).toHaveBeenCalledWith('div')
  })

  it('should set textContent if provided', () => {
    const element = new MiscElement('div', { textContent: 'Hello' })

    expect(element.element.textContent).toBe('Hello')
  })

  it('should handle label type with forId', () => {
    const element = new MiscElement('label', { forId: 'testId' })

    expect(element.element.setAttribute).toHaveBeenCalledWith('for', 'testId')
  })

  it('should handle label type with title', () => {
    const element = new MiscElement('label', { title: 'testTitle' })

    expect(element.element.setAttribute).toHaveBeenCalledWith('title', 'testTitle')
  })

  it('should handle span type with color', () => {
    const element = new MiscElement('span', { color: 'red' })

    expect(element.element.style.color).toBe('red')
  })

  it('should create an element of the specified type with textContent', () => {
    const misc = new MiscElement('div', { textContent: 'Hello' })

    expect(document.createElement).toHaveBeenCalledWith('div')
    expect(misc.element.textContent).toBe('Hello')
  })
})

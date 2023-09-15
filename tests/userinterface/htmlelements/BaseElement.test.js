import BaseElement          from '../../../src/userinterface/htmlelements/BaseElement.js'
import MockHtmlElementSetup from '../mocks/MockHtmlElementSetup.js'

// Mock HTMLElement Type and document.createElement
const { createElementMock, MockHTMLElement } = MockHtmlElementSetup()
const testcontent                            = 'test content'
const testclass                              = 'test-class'

describe('BaseElement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create an element with the given tag', () => {
    const element = new BaseElement('div')
    expect(createElementMock).toHaveBeenCalledWith('div')
    expect(element.element.tagName).toBe('DIV')
  })

  describe('handling classes', () => {
    it('should add class to the element', () => {
      const element = new BaseElement('div', {
        classList: [ testclass ],
      })

      expect(element.getElement().classList.add).toHaveBeenCalledWith(testclass)
    })

    it('should add multiple classes to the element', () => {
      const element = new BaseElement('div', {
        classList: [ 'test-class1', 'test-class2' ],
      })

      expect(element.getElement().classList.add).toHaveBeenCalledWith('test-class1')
      expect(element.getElement().classList.add).toHaveBeenCalledWith('test-class2')
    })

    it('should add multiple classes from a string', () => {
      const element = new BaseElement('div', { classList: 'class1 class2' })
      element.getElement()
      expect(element.element.classList.add).toHaveBeenCalledWith('class1')
      expect(element.element.classList.add).toHaveBeenCalledWith('class2')
    })
  })

  describe('handling eventListeners', () => {
    it('should add eventListener to the element', () => {
      const element = new BaseElement('div', {
        eventListeners: [ { eventType: 'click', callback: jest.fn() } ],
      })

      expect(element.getElement().addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
    })

    it('should add multiple event listeners to the element', () => {
      const element = new BaseElement('div', {
        eventListeners: [
          { eventType: 'click', callback: jest.fn() },
          { eventType: 'hover', callback: jest.fn() },
        ],
      })

      expect(element.getElement().addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
      expect(element.getElement().addEventListener).toHaveBeenCalledWith('hover', expect.any(Function))
    })

    it('should not add event listeners if no eventType provided', () => {
      const element = new BaseElement('div', { eventListeners: { callback: jest.fn() } })
      expect(element.getElement().addEventListener).not.toHaveBeenCalled()
    })

    it('should not add event listeners if no callback provided', () => {
      const element = new BaseElement('div', { eventListeners: { eventType: 'click' } })
      expect(element.getElement().addEventListener).not.toHaveBeenCalled()
    })
  })

  describe('handling childelements', () => {
    it('should append child element of own type and render child', () => {
      const child   = new BaseElement('span')
      const element = new BaseElement('div', {
        children: [ child ],
      })

      expect(element.getElement().append).toHaveBeenCalledWith(child.getElement())
    })

    it('should append child element of HTMLElement type', () => {
      const child   = new MockHTMLElement('span')
      const element = new BaseElement('div', {
        children: [ child ],
      })

      expect(element.getElement().append).toHaveBeenCalledWith(child)
    })

    it('should append multiple child elements', () => {
      const child1  = new MockHTMLElement('span')
      const child2  = new MockHTMLElement('span')
      const element = new BaseElement('div', {
        children: [
          child1,
          child2,
        ],
      })

      element.getElement()
      expect(element.element.append).toHaveBeenCalledWith(child1)
      expect(element.element.append).toHaveBeenCalledWith(child2)
      expect(element.element.children).toHaveLength(2)
    })

    it('should attach element after the current element when after method is called', () => {
      const sibling = new MockHTMLElement('span')
      const element = new BaseElement('div')

      element.after(sibling)
      expect(element.element.after).toHaveBeenCalledWith(sibling)
    })

    it('should log an error for invalid child type', () => {
      console.error = jest.fn()
      const element = new BaseElement('div')
      element.append('string')
      expect(console.error).toHaveBeenCalledWith('append expects an instance of BaseElement or HTMLElement')
    })
  })

  describe('handling attributes', () => {
    it('should set a single attribute for the element', () => {
      const element = new BaseElement('div', { attributes: { style: 'somecss' } })
      element.getElement()
      expect(element.element.setAttribute).toHaveBeenCalledWith('style', 'somecss')
    })

    it('should set multiple attributes for the element', () => {
      const element = new BaseElement('div', {
        attributes: {
          'href'      : 'value',
          'data-test' : 'value',
        },
      })
      element.getElement()

      expect(element.element.setAttribute).toHaveBeenCalledWith('href', 'value')
      expect(element.element.setAttribute).toHaveBeenCalledWith('data-test', 'value')
    })

    it('should set an attribute using setAttribute method', () => {
      const element = new BaseElement('div')
      // eslint-disable-next-line unicorn/prefer-dom-node-dataset
      element.setAttribute('data-test', 'value')
      expect(element.getElement().setAttribute).toHaveBeenCalledWith('data-test', 'value')
    })
  })

  describe('handling textContent', () => {
    it('should set textContent for elements without children', () => {
      const element = new BaseElement('div', { textContent: testcontent })
      element.getElement()
      expect(element.element.textContent).toBe(testcontent)
    })

    it('should not set textContent for elements with children', () => {
      const child   = new BaseElement('span')
      const element = new BaseElement('div', {
        textContent : testcontent,
        children    : [ child ],
      })

      element.getElement()
      expect(element.element.textContent).toBeUndefined()
    })
  })

  it('should set id for the element', () => {
    const element = new BaseElement('div', { id: 'test-id' })
    element.getElement()
    expect(element.element.id).toBe('test-id')
  })

  it('should return the element', () => {
    const element     = new BaseElement('div', { id: 'test-id' })
    const htmlelement = element.element
    const returned    = element.getElement()
    expect(returned).toBe(htmlelement)
  })
})

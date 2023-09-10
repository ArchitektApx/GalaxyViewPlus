/* eslint-disable unicorn/prefer-dom-node-dataset */
/* eslint-disable sonarjs/no-duplicate-string */
import Element from '../../../src/userinterface/elements/BaseElement.js'

describe('Element', () => {
  let elementInstance
  let mockElement

  global.HTMLElement = jest.fn()

  beforeEach(() => {
    // Mock element
    mockElement = {
      classList: {
        add: jest.fn(),
      },
      addEventListener : jest.fn(),
      after            : jest.fn(),
      append           : jest.fn(),
      setAttribute     : jest.fn(),
      children         : [],
      dataset          : {},
    }

    // Create an instance of the Element class before each test
    elementInstance         = new Element()
    elementInstance.element = mockElement  // Assign the mocked element
  })

  describe('addClass', () => {
    it('should add a class to the element', () => {
      elementInstance.addClass('test-class')
      expect(mockElement.classList.add).toHaveBeenCalledWith('test-class')
    })
  })

  describe('addEventListener', () => {
    it('should add an event listener to the element', () => {
      const mockCallback = jest.fn()

      elementInstance.addEventListener('click', mockCallback)
      expect(mockElement.addEventListener).toHaveBeenCalledWith('click', mockCallback)
    })
  })

  describe('getElement', () => {
    it('should get the element with all its properties set', () => {
      elementInstance.id          = 'test-id'
      elementInstance.classList   = [ 'test-class1', 'test-class2' ]
      elementInstance.attributes  = { 'data-test': 'value' }
      elementInstance.textContent = 'Test Content'

      const resultElement = elementInstance.getElement()

      expect(resultElement.id).toBe('test-id')
      expect(mockElement.classList.add).toHaveBeenCalledWith('test-class1')
      expect(mockElement.classList.add).toHaveBeenCalledWith('test-class2')
      expect(mockElement.setAttribute).toHaveBeenCalledWith('data-test', 'value')
    })

    it('should set the id if provided', () => {
      elementInstance.id = 'test-id'
      elementInstance.getElement()
      expect(mockElement.id).toBe('test-id')
    })

    it('should set attributes if provided', () => {
      elementInstance.attributes = { 'data-test': 'test' }
      elementInstance.getElement()
      expect(mockElement.setAttribute).toHaveBeenCalledWith('data-test', 'test')
    })

    it('should not set attributes if none are provided', () => {
      elementInstance.getElement()
      expect(mockElement.setAttribute).not.toHaveBeenCalled()
    })

    it('should set classes if provided', () => {
      elementInstance.classList = [ 'class1' ]
      elementInstance.getElement()
      expect(mockElement.classList.add).toHaveBeenCalledWith('class1')
    })

    it('should not set classes if none are provided', () => {
      elementInstance.getElement()
      expect(mockElement.classList.add).not.toHaveBeenCalled()
    })

    it('should set the textContent if provided and no children exist', () => {
      elementInstance.textContent = 'Sample Text'
      elementInstance.getElement()

      expect(mockElement.textContent).toBe('Sample Text')
    })

    it('should not set the textContent if not provided', () => {
      elementInstance.getElement()

      expect(mockElement.textContent).toBeUndefined()
    })

    it('should not set the textContent if children exist', () => {
      elementInstance.textContent = 'Sample Text'
      mockElement.children.push({})  // Adding a mock child
      elementInstance.getElement()

      expect(mockElement.textContent).toBeUndefined()
    })
  })

  describe('setTextContent', () => {
    it('should set the text content for the element', () => {
      elementInstance.setTextContent('Test Content')
      expect(mockElement.textContent).toBe('Test Content')
    })

    it('should not set text content if there are child elements', () => {
      mockElement.children.push({})
      elementInstance.setTextContent('Test Content')

      expect(mockElement.textContent).toBeUndefined()
    })
  })

  describe('after', () => {
    it('should add an element after the current element', () => {
      const childElement = new Element()

      childElement.element = {}  // Mock child element

      elementInstance.after(childElement)

      expect(mockElement.after).toHaveBeenCalledWith(childElement.getElement())
    })

    it('should handle HTMLElement child element', () => {
      const childHTMLElement = new global.HTMLElement()

      elementInstance.after(childHTMLElement)

      expect(mockElement.after).toHaveBeenCalledWith(childHTMLElement)
    })

    it('should print an error for unsupported child type in after', () => {
      console.error = jest.fn()

      elementInstance.after({}) // Passing an arbitrary object, not Element or HTMLElement

      expect(console.error).toHaveBeenCalledWith('after expects an instance of Element')
    })
  })

  describe('append', () => {
    it('should append a child to the element', () => {
      const childElement = new Element()

      childElement.element = {}  // Mock child element

      elementInstance.append(childElement)

      expect(mockElement.append).toHaveBeenCalledWith(childElement.getElement())
    })

    it('should handle HTMLElement child element', () => {
      const childHTMLElement = new global.HTMLElement()

      elementInstance.append(childHTMLElement)

      expect(mockElement.append).toHaveBeenCalledWith(childHTMLElement)
    })

    it('should print an error for unsupported child type in append', () => {
      console.error = jest.fn()

      elementInstance.append({}) // Passing an arbitrary object, not Element or HTMLElement

      expect(console.error).toHaveBeenCalledWith('append expects an instance of Element')
    })
  })

  describe('#addClasses', () => {
    it('should add multiple classes from array', () => {
      elementInstance.classList = [ 'class1', 'class2' ]
      elementInstance.getElement()
      expect(mockElement.classList.add).toHaveBeenCalledWith('class1')
      expect(mockElement.classList.add).toHaveBeenCalledWith('class2')
    })

    it('should add multiple classes from a string', () => {
      elementInstance.classList = 'class1 class2'
      elementInstance.getElement()
      expect(mockElement.classList.add).toHaveBeenCalledWith('class1')
      expect(mockElement.classList.add).toHaveBeenCalledWith('class2')
    })
  })

  describe('#setAttributes', () => {
    it('should set multiple attributes', () => {
      elementInstance.attributes = { 'data-test': 'test', 'data-example': 'example' }
      elementInstance.getElement()
      expect(mockElement.setAttribute).toHaveBeenCalledWith('data-test', 'test')
      expect(mockElement.setAttribute).toHaveBeenCalledWith('data-example', 'example')
    })
  })

  describe('setAttribute', () => {
    it('should set the attribute on the element', () => {
      elementInstance.setAttribute('data-test', 'sample-value')
      expect(mockElement.setAttribute).toHaveBeenCalledWith('data-test', 'sample-value')
    })
  })
})

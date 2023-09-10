import Mindash from '../../mindash/Mindash.js'

/**
 * The Element class is used to create a html element.
 * @class
 */
export default class Element {
  /**
   * Creates a new Element instance.
   * @param {string} id - The id
   * @param {Array} classList - The classList
   * @param {object} attributes - The attributes
   * @returns {Element} - The Element instance
   */
  constructor(id = '', classList = [], attributes = {}) {
    this.id         = id
    this.classList  = classList
    this.attributes = attributes
    this.element    = undefined // This will be assigned in derived classes
  }

  // public methods
  /**
   * Adds a class to the element.
   * @param {string} className - The class name
   * @returns {void}
   * @public
   */
  addClass(className) {
    this.element.classList.add(className)
  }

  /**
   * Adds an event listener to the element.
   * @param {string} eventType - The event type
   * @param {Function} callback - The callback
   * @returns {void}
   * @public
   */
  addEventListener(eventType, callback) {
    this.element.addEventListener(eventType, callback)
  }

  /**
   * attaches an element after the current element
   * @param {HTMLElement|Element} childElement - The child element
   * @returns {void}
   * @public
   */
  after(childElement) {
    this.#attachElement(childElement, 'after')
  }

  /**
   * attaches an element as a child to the current element
   * @param {HTMLElement|Element} childElement - The child element
   * @returns {void}
   * @public
   */
  append(childElement) {
    this.#attachElement(childElement, 'append')
  }

  /**
   * "renders" the element and returns the real html object
   * @returns {HTMLElement} - The real html object
   * @public
   */
  getElement() {
    this.element.id = this.id

    // not falsy or empty object/array
    if (Mindash.isSomething(this.classList)) {
      this.#addClasses(this.classList)
    }

    if (!Mindash.isEmptyObject(this.attributes)) {
      this.#setAttributes()
    }

    // set textContent if it exists and is not empty
    if (this.textContent) {
      this.setTextContent(this.textContent)
    }

    // output the final "real" html object
    return this.element
  }

  /**
   * sets an attribute to the element
   * @param {string} attribute - The attribute
   * @param {string} value - The value
   * @returns {void}
   * @public
   */
  setAttribute(attribute, value) {
    this.element.setAttribute(attribute, value)
  }

  /**
   * sets the textContent of the element
   * @param {string} textContent - The textContent
   * @returns {void}
   * @public
   */
  setTextContent(textContent) {
    if (this.element.children.length === 0) {
      this.element.textContent = textContent
    }
  }

  // private methods
  /**
   * adds classes to the element
   * @param {Array|string} classList - The classList
   * @returns {void}
   * @private
   */
  #addClasses(classList) {
    if (Array.isArray(classList)) {
      classList.forEach(className => this.addClass(className))
    }

    if (typeof classList === 'string' && classList.trim() !== '') {
      classList.trim().split(' ').forEach(className => this.addClass(className))
    }
  }

  /**
   * attaches an element to the current element
   * @param {HTMLElement|Element} childElement - The child element
   * @param {string} method - The method to use
   * @returns {void}
   * @private
   */
  #attachElement(childElement, method) {
    if (childElement instanceof Element) {
      this.element[method](childElement.getElement())
      return
    }

    if (childElement instanceof HTMLElement) {
      this.element[method](childElement)
      return
    }

    console.error(`${ method } expects an instance of Element`)
  }

  /**
   * sets attributes to the element
   * @returns {void}
   * @private
   */
  #setAttributes() {
    Mindash.forAny(this.attributes, ([ attribute, value ]) => {
      this.element.setAttribute(attribute, value)
    }, true)
  }
}

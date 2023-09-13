import Mindash from '../../mindash/Mindash.js'

/**
 * The Element class is used to create a html element.
 * @class
 */
export default class BaseElement {
  /**
   * Creates a new Element instance.
   * @param   {string}  tag                    - The type of the element (e.g. div, span, input, etc.)
   * @param   {object}  options                - object containing the options for the element so we can use destructuring
   * @param   {object}  options.attributes     - The attributes of the element
   * @param   {Array}   options.classList      - The classList of the element
   * @param   {Array}   options.children       - The array of child elements to add to the element
   * @param   {string}  options.color          - The color property of the element
   * @param   {object}  options.eventListeners - The eventListeners in the form of an object { <eventType>, <callback> }
   * @param   {string}  options.forId          - The forId property of the element
   * @param   {boolean} options.open           - The open property of the element (details)
   * @param   {string}  options.id             - The id of the html element
   * @param   {object}  options.style          - The style key value pairs
   * @param   {string}  options.textContent    - The textContent of the element
   * @param   {string}  options.title          - The title property of the element
   * @returns {void}                           - The element instance will be returned with getElement()
   * @public
   * @class
   */
  constructor(tag, options = {}) {
    const defaults = {
      attributes     : {},
      children       : [],
      classList      : [],
      color          : '',
      eventListeners : {},
      forId          : '',
      id             : '',
      open           : false,
      style          : {},
      textContent    : '',
      title          : '',
    }

    // Merge options with defaults
    const config = { ...defaults, ...options }
    Object.assign(this, config)
    this.tag = tag

    this.element = document.createElement(tag)
  }

  /**
   * Adds a class to the element.
   * @param   {string} className - The class name
   * @returns {void}
   * @public
   */
  addClass(className) {
    this.element.classList.add(className)
  }

  /**
   * Adds an event listener to the element.
   * @param   {string}   eventType - The event type
   * @param   {Function} callback - The callback
   * @returns {void}
   * @public
   */
  addEventListener(eventType, callback) {
    this.element.addEventListener(eventType, callback)
  }

  /**
   * Adds a title to the element.
   * @param   {string} title - The title
   * @returns {void}
   * @public
   */
  addTitle(title) {
    if (title) {
      this.element.title = title
    }
  }

  /**
   * attaches an element after the current element
   * @param   {HTMLElement|Element} childElement - The child element
   * @returns {void}
   * @public
   */
  after(childElement) {
    this.#attachElement(childElement, 'after')
  }

  /**
   * attaches an element as a child to the current element
   * @param   {HTMLElement|Element} childElement - The child element
   * @returns {void}
   * @public
   */
  append(childElement) {
    this.#attachElement(childElement, 'append')
  }

  /**
   * appends children to the element
   * @param   {Array<Element|HTMLElement>} children - The children
   * @returns {void}
   * @public
   */
  appendChildren(children) {
    Mindash.forAny(children, child => this.append(child))
  }

  /**
   * "renders" the element and returns the real HTMLElement type DOM object
   * @returns {HTMLElement} - The real html object
   * @public
   */
  getElement() {
    // set all properties
    this.#setAttributes(this.attributes)
    this.#addClasses(this.classList)
    this.appendChildren(this.children)
    this.setSpanColor(this.color)
    this.#addEventListeners(this.eventListeners)
    this.setFor(this.forId)
    this.setDetailsOpen(this.open)
    this.setId(this.id)
    this.setStyle(this.style)
    this.setTextContent(this.textContent)
    this.addTitle(this.title)

    // output the final "real" html object
    return this.element
  }

  /**
   * sets an attribute to the element
   * @param   {string} attribute - The attribute
   * @param   {string} value     - The value
   * @returns {void}
   * @public
   */
  setAttribute(attribute, value) {
    this.element.setAttribute(attribute, value)
  }

  /**
   * sets the open property of a details element
   * @param   {boolean} open - The open property of the element (details) i.e. true or false
   * @returns {void}
   * @public
   */
  setDetailsOpen(open) {
    if (this.tag === 'details') {
      this.element.open = open
    }
  }

  /**
   * sets the for attribute of a label element
   * @param   {string} forId - The element id to which this label belongs
   * @returns {void}
   * @public
   */
  setFor(forId) {
    if (this.tag === 'label' && forId) {
      this.element.setAttribute('for', forId)
    }
  }

  /**
   * sets the id of the element
   * @param   {string} id - The id
   * @returns {void}
   * @public
   */
  setId(id) {
    if (id) {
      this.element.id = id
    }
  }

  /**
   * sets the color of a span element
   * @param   {string} color - The color property of the element
   * @returns {void}
   * @public
   */
  setSpanColor(color) {
    if (this.tag === 'span' && color) {
      this.element.style.color = color
    }
  }

  /**
   * sets style attributes to the element
   * @param   {object} style - The style
   * @returns {void}
   * @public
   */
  setStyle(style) {
    Mindash.forAny(style, ([ key, value ]) => {
      this.element.style[key] = value
    }, true)
  }

  /**
   * sets the textContent of the element
   * @param   {string} textContent - The textContent
   * @returns {void}
   * @public
   */
  setTextContent(textContent) {
    // textConent overwrites children so we only set it if there are no children
    if (textContent && this.element.children?.length === 0) {
      this.element.textContent = textContent
    }
  }

  /**
   * adds classes to the element
   * @param   {Array|string} classList - The classList
   * @returns {void}
   * @private
   */
  #addClasses(classList) {
    const toAdd = Array.isArray(classList)
      ? classList
      : Mindash.forceArray(classList.split(' '))

    Mindash.forAny(toAdd, className => this.addClass(className.trim()))
  }

  /**
   * attaches all event listeners to the element
   * @param   {Array<object>} eventListeners - The eventListeners
   * @returns {void}
   * @private
   */
  #addEventListeners(eventListeners) {
    Mindash.forAny(eventListeners, (eventListener) => {
      if (Mindash.hasThisAndThatProp(eventListener, 'eventType', 'callback')) {
        this.addEventListener(eventListener.eventType, eventListener.callback)
      }
    })
  }

  /**
   * attaches an element to the current element
   * @param   {HTMLElement|Element} childElement - The child element
   * @param   {string}              method       - The method to use
   * @returns {void}
   * @private
   */
  #attachElement(childElement, method) {
    if (childElement instanceof BaseElement) {
      this.element[method](childElement.getElement())
      return
    }

    if (childElement instanceof HTMLElement) {
      this.element[method](childElement)
      return
    }

    console.error(`${ method } expects an instance of BaseElement or HTMLElement`)
  }

  /**
   * sets attributes to the element
   * @param   {object} attributes - attribute key value pairs
   * @returns {void}
   * @private
   */
  #setAttributes(attributes) {
    Mindash.forAny(attributes, ([ attribute, value ]) => {
      this.element.setAttribute(attribute, value)
    }, true)
  }
}

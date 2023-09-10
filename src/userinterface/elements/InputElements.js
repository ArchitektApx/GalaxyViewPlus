import Mindash from '../../mindash/Mindash.js'
import Element from './BaseElement.js'

/**
 * The InputElement class is used to create an input element.
 * @class
 */
export default class InputElement extends Element {
  /**
   * Creates a new InputElement instance.
   * @param {string} type - The type
   * @param {object} options - The options
   * @param {object} options.attributes - The attributes
   * @param {boolean} options.checked - The checked
   * @param {Array} options.classList - The classList
   * @param {object} options.eventListeners - The eventListeners
   * @param {string} options.id - The id
   * @param {string} options.name - The name
   * @param {string} options.value - The value
   * @returns {InputElement} - The InputElement instance
   */
  constructor(type = 'text', options = {}) {
    const {
      attributes     = {},
      checked        = false,
      classList      = [],
      eventListeners = {},
      id             = '',
      name           = '',
      value          = '',
    } = options

    super(id, classList, attributes, eventListeners)
    this.element       = document.createElement('input')
    this.element.type  = type
    this.element.name  = name
    this.element.value = value

    if (type === 'checkbox' || type === 'radio') {
      this.element.checked = checked
    }

    // don't accept an empty object but allow object or array of objects
    Mindash.forAny(eventListeners, (eventListener) => {
      if (Mindash.hasThisAndThatProp(eventListener, 'eventType', 'callback')) {
        this.addEventListener(eventListener.eventType, eventListener.callback)
      }
    })
  }
}

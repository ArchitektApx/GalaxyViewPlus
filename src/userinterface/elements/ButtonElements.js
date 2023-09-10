import Mindash from '../../mindash/Mindash.js'
import Element from './BaseElement.js'

/**
 * The ButtonElement class is used to create a button element.
 * @class
 */
export default class ButtonElement extends Element {
  /**
   * Creates a new ButtonElement instance.
   * @param {object} options - The options
   * @param {object} options.attributes - The attributes
   * @param {Array} options.classList - The classList
   * @param {object} options.eventListeners - The eventListeners
   * @param {string} options.id - The id
   * @param {string} options.textContent - The textContent
   * @returns {ButtonElement} - The ButtonElement instance
   */
  constructor(options = {}) {
    const {
      attributes     = {},
      classList      = [],
      eventListeners = {},
      id             = '',
      textContent    = '',
    } = options

    super(id, classList, attributes)
    this.element             = document.createElement('button')
    this.element.textContent = textContent

    // don't accept an empty object but allow object or array of objects
    Mindash.forAny(eventListeners, (eventListener) => {
      if (Mindash.hasThisAndThatProp(eventListener, 'eventType', 'callback')) {
        this.addEventListener(eventListener.eventType, eventListener.callback)
      }
    })
  }
}

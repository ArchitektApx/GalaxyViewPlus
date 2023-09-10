import Element from './BaseElement.js'

/**
 * The MiscElement class is used to create a misc element.
 * @class
 */
export default class MiscElement extends Element {
  /**
   * Creates a new MiscElement instance.
   * @param {string} type - The type
   * @param {object} options - The options
   * @param {object} options.attributes - The attributes
   * @param {Array} options.classList - The classList
   * @param {string} options.color - The color
   * @param {string} options.forId - The forId
   * @param {string} options.id - The id
   * @param {string} options.textContent - The textContent
   * @param {string} options.title - The title
   * @returns {MiscElement} - The MiscElement instance
   */
  constructor(type, options = {}) {
    const {
      attributes  = {},
      classList   = [],
      color       = '',
      forId       = '',
      id          = '',
      textContent = '',
      title       = '',
    } = options

    super(id, classList, attributes)
    this.element             = document.createElement(type)
    this.element.textContent = textContent

    if (type === 'label') {
      this.element.setAttribute('for', forId)
      this.element.setAttribute('title', title)
    }

    if (type === 'span') {
      this.element.style.color = color
    }
  }
}

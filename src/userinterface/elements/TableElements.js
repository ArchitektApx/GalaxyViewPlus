import Mindash from '../../mindash/Mindash.js'
import Element from './BaseElement.js'

/**
 * The TableElement class is used to create a table element.
 * @class
 */
export default class TableElement extends Element {
  /**
   * Creates a new TableElement instance.
   * @param {string} tag - The html tag
   * @param {object} options - The options
   * @param {string} options.id - The id
   * @param {Array} options.classList - The classList
   * @param {object} options.attributes - The attributes
   * @param {Array} options.children - The children
   * @param {string} options.textContent - The textContent
   * @returns {TableElement} - The TableElement instance
   */
  constructor(tag, options = {}) {
    const {
      id          = '',
      classList   = [],
      attributes  = {},
      children    = [],
      textContent = '',
    } = options

    super(id, classList, attributes)
    this.element     = document.createElement(tag)
    this.textContent = textContent

    // accept arrays, objects, whatever
    Mindash.forAny(children, child => this.append(child))
  }
}

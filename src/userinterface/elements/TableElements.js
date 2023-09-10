import Mindash from '../../mindash/Mindash.js'
import Element from './BaseElement.js'

export default class TableElement extends Element {
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

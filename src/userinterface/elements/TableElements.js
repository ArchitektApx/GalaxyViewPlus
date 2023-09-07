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
    this.textContent = textContent; // <-- fuck this

    // make that bitch an array if it wants it or not >:-(
    (Array.isArray(children) ? children : [ children ]).forEach(child => this.append(child))
  }
}

import Element from './BaseElement.js'

export default class MiscElement extends Element {
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

    if (type === 'label' && forId) {
      this.element.setAttribute('for', forId)
    }

    if (type === 'label' && title) {
      this.element.setAttribute('title', title)
    }

    if (type === 'span') {
      this.element.style.color = color
    }
  }
}

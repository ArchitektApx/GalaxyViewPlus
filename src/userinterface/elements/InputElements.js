import Element from './BaseElement.js'

export default class InputElement extends Element {
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

    if (Array.isArray(eventListeners) || Object.keys(eventListeners).length > 0) {
      (Array.isArray(eventListeners) ? eventListeners : [ eventListeners ])
        .forEach((eventListener) => {
          if (eventListener.eventType && eventListener.callback) {
            this.addEventListener(eventListener.eventType, eventListener.callback)
          }
        })
    }
  }
}

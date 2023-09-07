import Element from './BaseElement.js'

export default class ButtonElement extends Element {
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

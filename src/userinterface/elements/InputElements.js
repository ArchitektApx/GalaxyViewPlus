import Mindash from '../../mindash/Mindash.js'
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

    // don't accept an empty object but allow object or array of objects
    Mindash.forAny(eventListeners, (eventListener) => {
      if (Mindash.hasThisAndThatProp(eventListener, 'eventType', 'callback')) {
        this.addEventListener(eventListener.eventType, eventListener.callback)
      }
    })
  }
}

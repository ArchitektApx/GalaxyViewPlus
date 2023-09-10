import Mindash from '../../mindash/Mindash.js'
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
    Mindash.forAny(eventListeners, (eventListener) => {
      if (Mindash.hasThisAndThatProp(eventListener, 'eventType', 'callback')) {
        this.addEventListener(eventListener.eventType, eventListener.callback)
      }
    })
  }
}

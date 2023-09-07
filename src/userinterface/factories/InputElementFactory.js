import InputElement from '../elements/InputElements.js'

export default class InputElementFactory {
  static create(type, options = {}, overRideKeyDown = false) {
    const inputElement = new InputElement(type, options)

    if (overRideKeyDown) {
      inputElement.addEventListener('keydown', (event_) => {
        event_.stopPropagation()
        event_.stopImmediatePropagation()
      })
    }

    return inputElement.getElement()
  }
}

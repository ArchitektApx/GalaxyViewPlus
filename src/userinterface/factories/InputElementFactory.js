import InputElement from '../elements/InputElements.js'

/**
 * The InputElementFactory class is used to create input elements.
 * @class
 */
export default class InputElementFactory {
  /**
   * Creates a new InputElementFactory instance.
   * @param {string} type - The type of the input element
   * @param {object} options - The options of the input element
   * @param {boolean} overRideKeyDown - Whether the keydown event should be overriden
   * @returns {InputElementFactory|undefined} - The InputElementFactory instance
   */
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

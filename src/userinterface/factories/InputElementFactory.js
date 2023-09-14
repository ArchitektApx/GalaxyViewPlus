import InputElement from '../htmlelements/InputElements.js'

/**
 * The InputElementFactory class is used to create input elements.
 * @class
 */
export default class InputElementFactory {
  /**
   * Creates a new InputElementFactory instance.
   * @param   {string}  type                   - The type of the input element
   * @param   {object}  options                - The options object for destructuring
   * @param   {object}  options.attributes     - The attributes of the element
   * @param   {boolean} options.checked        - The checked property of the input
   * @param   {Array}   options.classList      - The classList of the element
   * @param   {object}  options.eventListeners - The eventListeners
   * @param   {string}  options.id             - The id of the html element
   * @param   {string}  options.name           - The name property of the input
   * @param   {string}  options.value          - The value property of the input
   * @param   {boolean} overRideKeyDown        - Whether the keydown event should be overriden
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

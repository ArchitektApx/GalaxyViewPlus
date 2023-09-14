import BaseElement from './BaseElement.js'

/**
 * The InputElement class is used to create an input element.
 * @class
 */
export default class InputElement extends BaseElement {
  /**
   * Creates a new InputElement instance. Adds Input specific
   * properties on top of the BaseElement properties.
   * and exclude properties not needed with inputs like children and textContent
   * @param   {string}  type                   - The type (e.g. text, checkbox, radio, etc.)
   * @param   {object}  options                - The options object for destructuring
   * @param   {object}  options.attributes     - The attributes of the element
   * @param   {boolean} options.checked        - The checked property of the input
   * @param   {Array}   options.classList      - The classList of the element
   * @param   {object}  options.eventListeners - The eventListeners
   * @param   {string}  options.id             - The id of the html element
   * @param   {string}  options.name           - The name property of the input
   * @param   {string}  options.value          - The value property of the input
   * @returns {void}
   */
  constructor(type = 'text', options = {}) {
    // extract input specific options
    const {
      checked        = false,
      name           = '',
      value          = '',
    } = options

    // pass all others to the base class
    super('input', options)

    this.element.type  = type
    this.element.name  = name
    this.element.value = value

    if (type === 'checkbox' || type === 'radio') {
      this.element.checked = checked
    }
  }
}

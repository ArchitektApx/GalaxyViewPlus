import BaseElement from '../htmlelements/BaseElement.js'

/**
 * The ButtonElementFactory class is used to create button elements.
 * @class
 */
export default class ButtonElementFactory {
  /**
   * Creates a new Button Element
   * @param   {string}  type                   - The type of the button element
   * @param   {object}  options                - The options of the button element
   * @param   {object}  options.attributes     - The attributes of the element
   * @param   {Array}   options.classList      - The classList of the element
   * @param   {Array}   options.children       - The array of child elements to add to the element
   * @param   {object}  options.eventListeners - The eventListeners in the form of an object { <eventType>, <callback> }
   * @param   {string}  options.id             - The id of the html element
   * @param   {string}  options.textContent    - The textContent of the element
   * @returns {HTMLElement|undefined}          - The Button Element generated from the type and options
   * @public
   * @static
   */
  static create(type, options = {}) {
    const buttonDefaults = {
      addRow    : { classList: [ 'add-row-btn' ],      textContent: 'Add'   },
      button    : {},
      removeRow : { classList: [ 'remove-row-btn' ],   textContent: 'Delete'      },
      reset     : { classList: [ 'reset-config-btn' ], textContent: 'Reset' },
      save      : { classList: [ 'save-config-btn' ],  textContent: 'Save'    },
    }

    const defaults = buttonDefaults[type]

    if (defaults) {
      const  combinedOptions = { ...defaults, ...options }
      const Element          = new BaseElement('button', combinedOptions)
      return Element.getElement()
    }

    console.error(`Button type '${ type }' is not supported.`)
  }
}

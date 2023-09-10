import ButtonElement from '../elements/ButtonElements.js'

/**
 * The ButtonElementFactory class is used to create button elements.
 * @class
 */
export default class ButtonElementFactory {
  /**
   * Creates a new ButtonElementFactory instance.
   * @param {string} type - The type of the button element
   * @param {object} options - The options of the button element
   * @returns {ButtonElement|undefined} - The ButtonElement generated from the type and options
   */
  static create(type, options = {}) {
    const buttonDefaults = {
      addRow    : { classList: [ 'add-row-btn' ],      textContent: 'Hinzufügen'   },
      button    : {},
      removeRow : { classList: [ 'remove-row-btn' ],   textContent: 'Löschen'      },
      reset     : { classList: [ 'reset-config-btn' ], textContent: 'Zurücksetzen' },
      save      : { classList: [ 'save-config-btn' ],  textContent: 'Speichern'    },
    }

    const defaults = buttonDefaults[type]

    if (defaults) {
      const combinedOptions = { ...defaults, ...options }
      const buttonElement   = new ButtonElement(combinedOptions)
      return buttonElement.getElement()
    }

    console.error(`Button type '${ type }' is not supported.`)
  }
}

import ButtonElement from '../elements/ButtonElements.js'

export default class ButtonElementFactory {
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

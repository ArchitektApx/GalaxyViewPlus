import ButtonElementFactory   from '../factories/ButtonElementFactory.js'
import CallbackWrapperFactory from '../factories/CallbackWrapperFactory.js'
import FeatureSettingsFactory from '../factories/FeatureSettingsFactory.js'
import HtmlElementFactory     from '../factories/HtmlElementFactory.js'

/**
 * The SettingsInterface class is used to display the settings interface.
 * @class
 */
export default class SettingsInterface {
  /**
   * Creates a new SettingsInterface instance.
   * @param   {object}            configManagerInstance - The ConfigManager instance
   * @returns {SettingsInterface}                       - The SettingsInterface instance
   * @class
   */
  constructor(configManagerInstance) {
    const config                                 = configManagerInstance.getCurrentConfig()
    const actionCallback                         = configManagerInstance.getActionCallback()
    const { features, userInterface: { title } } = config
    const prefix                                 = 'settings-interface'

    this.element = HtmlElementFactory.create('div', { id: `${ prefix }-wrapper` })

    const details = HtmlElementFactory.create('details', {
      id       : `${ prefix }-details`,
      children : [
        HtmlElementFactory.create('summary', { id: `${ prefix }-summary`, title: title }),

        ...features.map(feature => FeatureSettingsFactory.create(feature, actionCallback)),

        HtmlElementFactory.create('div', {
          id       : 'settings-interface-footer',
          children : [
            ButtonElementFactory.create('save', {
              classList      : 'settings-save-button',
              eventListeners : CallbackWrapperFactory.create('SaveConfig', actionCallback),
              id             : 'save-button',
              textContent    : 'Speichern',
            }),
            ButtonElementFactory.create('reset', {
              classList      : 'settings-reset-button',
              eventListeners : CallbackWrapperFactory.create('ResetConfig', actionCallback),
              id             : 'reset-button',
              textContent    : 'Zurücksetzen',
            }),
          ],
        }),
      ],
    })

    this.element.append(details)
  }

  /**
   * Gets the SettingsInterface element.
   * @returns {object} - The SettingsInterface element
   * @public
   */
  getElement() {
    return this.element
  }
}

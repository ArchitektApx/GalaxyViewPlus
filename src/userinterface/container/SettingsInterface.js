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

    this.element = HtmlElementFactory.create('div', { id: 'settings-interface-wrapper' })

    const details = HtmlElementFactory.create('details', { id: 'settings-interface-details' })
    const summary = HtmlElementFactory.create('summary', { id: 'settings-interface-summary' })

    summary.textContent = title

    const featureSettings = features.map(
      feature => FeatureSettingsFactory.create(feature, actionCallback)
    )

    details.append(summary)
    featureSettings.map(feature => details.append(feature))

    const footer     = HtmlElementFactory.create('div', { id: 'settings-interface-footer' })
    const SaveButton = ButtonElementFactory.create('save', {
      classList      : 'settings-save-button',
      eventListeners : CallbackWrapperFactory.create('SaveConfig', actionCallback),
      id             : 'save-button',
      textContent    : 'Speichern',
    })

    const ResetButton = ButtonElementFactory.create('reset', {
      classList      : 'settings-reset-button',
      eventListeners : CallbackWrapperFactory.create('ResetConfig', actionCallback),
      id             : 'reset-button',
      textContent    : 'Zurücksetzen',
    })

    footer.append(SaveButton)
    footer.append(ResetButton)
    details.append(footer)

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

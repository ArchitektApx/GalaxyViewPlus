import ButtonElementFactory   from '../factories/ButtonElementFactory.js'
import CallbackWrapperFactory from '../factories/CallbackWrapperFactory.js'
import FeatureSettingsFactory from '../factories/FeatureSettingsFactory.js'
import MiscElementFactory     from '../factories/MiscElementFactory.js'

export default class SettingsInterface {
  constructor(configManagerInstance) {
    const config                                 = configManagerInstance.getCurrentConfig()
    const actionCallback                         = configManagerInstance.getActionCallback()
    const { features, userInterface: { title } } = config

    this.element = MiscElementFactory.create('div', { id: 'settings-interface-wrapper' })

    const details = MiscElementFactory.create('details', { id: 'settings-interface-details' })
    const summary = MiscElementFactory.create('summary', { id: 'settings-interface-summary' })

    summary.textContent = title

    const featureSettings = features.map(
      feature => FeatureSettingsFactory.create(feature, actionCallback)
    )

    details.append(summary)
    featureSettings.map(feature => details.append(feature))

    const footer     = MiscElementFactory.create('div', { id: 'settings-interface-footer' })
    const SaveButton = ButtonElementFactory.create('save', {
      classList      : 'settings-save-button',
      eventListeners : CallbackWrapperFactory.create('SaveConfigWrapper', actionCallback),
      id             : 'save-button',
      textContent    : 'Speichern',
    })

    const ResetButton = ButtonElementFactory.create('reset', {
      classList      : 'settings-reset-button',
      eventListeners : CallbackWrapperFactory.create('ResetConfigWrapper', actionCallback),
      id             : 'reset-button',
      textContent    : 'Zurücksetzen',
    })

    footer.append(SaveButton)
    footer.append(ResetButton)
    details.append(footer)

    this.element.append(details)
  }

  getElement() {
    return this.element
  }
}

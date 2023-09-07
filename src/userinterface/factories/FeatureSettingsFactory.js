import SettingsBody       from '../customElements/SettingsBody.js'
import SettingsHeader     from '../customElements/SettingsHeader.js'
import MiscElementFactory from './MiscElementFactory.js'

// provides a custom html structure based on the content of the feature config
export default class FeatureSettingsFactory {
  static create(config, configCallback) {
    const featureSettingsContainer = MiscElementFactory.create('div',
      {
        classList : 'feature-settings-container',
        id        : `${ config.htmlPrefix }settings-container`,
      })

    const HeaderElement = new SettingsHeader(config, configCallback)
    const BodyElement   = new SettingsBody(config, configCallback)

    featureSettingsContainer.append(HeaderElement.getElement())
    featureSettingsContainer.append(BodyElement.getElement())

    return featureSettingsContainer
  }
}

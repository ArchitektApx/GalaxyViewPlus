import SettingsBody       from '../customElements/SettingsBody.js'
import SettingsHeader     from '../customElements/SettingsHeader.js'
import MiscElementFactory from './MiscElementFactory.js'

/**
 * The FeatureSettingsFactory class is used to create the settings container.
 * provides a custom html structure based on the content of the feature config
 * @class
 */
export default class FeatureSettingsFactory {
  /**
   * Creates a new FeatureSettingsFactory instance.
   * @public
   * @param {object} config - The config
   * @param {Function} configCallback - The config callback
   * @returns {HTMLElement|undefined} - The featureSettingsContainer element
   */
  static create(config, configCallback) {
    const featureSettingsContainer = MiscElementFactory.create(
      'div',
      {
        classList : 'feature-settings-container',
        id        : `${ config.htmlPrefix }settings-container`,
      }
    )

    const HeaderElement = new SettingsHeader(config, configCallback)
    const BodyElement   = new SettingsBody(config, configCallback)

    featureSettingsContainer.append(HeaderElement.getElement())
    featureSettingsContainer.append(BodyElement.getElement())

    return featureSettingsContainer
  }
}

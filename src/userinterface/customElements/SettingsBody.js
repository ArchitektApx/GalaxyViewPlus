import DataTypeFactory    from '../factories/DataTypeFactory.js'
import MiscElementFactory from '../factories/MiscElementFactory.js'

/**
 * The SettingsBody class is used to display the settings body.
 * @class
 */
export default class SettingsBody {
  /**
   * Creates a new SettingsBody instance.
   * @public
   * @param {object} config - The config
   * @param {Function} configCallback - The config callback
   * @returns {SettingsBody} - The SettingsBody instance
   */
  constructor(config, configCallback) {
    this.prefix    = `${ config.htmlPrefix }`
    this.baseClass = 'feature-body'
    this.element   = MiscElementFactory.create(
      'div',
      {
        classList : `${ this.baseClass }-container`,
        id        : `${ this.prefix }-body-container`,
      }
    )

    if (!config.active) { this.element.classList.add('hidden') }

    this.element.append(
      DataTypeFactory.create(config, configCallback)
    )
  }

  /**
   * Gets the SettingsBody element.
   * @public
   * @returns {HTMLElement} - The SettingsBody element
   */
  getElement() {
    return this.element
  }
}

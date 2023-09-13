import CallbackWrapperFactory from '../factories/CallbackWrapperFactory.js'
import HtmlElementFactory     from '../factories/HtmlElementFactory.js'
import InputElementFactory    from '../factories/InputElementFactory.js'

/**
 * The SettingsHeader class is used to display the settings header.
 * @class
 */
export default class SettingsHeader {
  /**
   * Creates a new SettingsHeader instance.
   * @param   {object}         config         - The config
   * @param   {Function}       configCallback - The config callback
   * @returns {SettingsHeader}                - The SettingsHeader instance
   * @class
   */
  constructor(config, configCallback) {
    this.prefix    = `${ config.htmlPrefix }-header-`
    this.baseClass = 'feature-header'

    this.element = HtmlElementFactory.create('div', {
      classList : [ `${ this.baseClass }-container` ],
      id        : `${ this.prefix }container`,
      children  : [
        HtmlElementFactory.create('p', {
          attributes  : { title: config.description },
          classList   : `${ this.baseClass }-title`,
          id          : `${ this.prefix }title`,
          textContent : config.displayName,
        }),
        HtmlElementFactory.create('br', {}),
        HtmlElementFactory.create('label', {
          forId       : `${ this.prefix }status-checkbox`,
          textContent : 'Aktiv:',
        }),
        InputElementFactory.create('checkbox', {
          attributes     : { 'data-lastvalue': config.active },
          checked        : config.active,
          classList      : [ `${ this.baseClass }-statusCheckbox` ],
          eventListeners : CallbackWrapperFactory.create('StatusCheckbox', configCallback),
          id             : `${ this.prefix }status-checkbox`,
          name           : `${ this.prefix }status-checkbox`,
        }),
      ],
    })
  }

  /**
   * Gets the SettingsHeader element.
   * @returns {HTMLElement} - The SettingsHeader element
   * @public
   */
  getElement() {
    return this.element
  }
}

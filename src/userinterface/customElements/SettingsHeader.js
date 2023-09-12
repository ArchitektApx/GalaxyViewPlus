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
   * @public
   * @param {object} config - The config
   * @param {Function} configCallback - The config callback
   * @returns {SettingsHeader} - The SettingsHeader instance
   */
  constructor(config, configCallback) {
    this.prefix    = `${ config.htmlPrefix }-header-`
    this.baseClass = 'feature-header'
    this.element   = HtmlElementFactory.create(
      'div',
      {
        classList : [ `${ this.baseClass }-container` ],
        id        : `${ this.prefix }container`,
      }
    )

    this.element.append(
      HtmlElementFactory.create(
        'p',
        {
          attributes  : { title: config.description },
          classList   : `${ this.baseClass }-title`,
          id          : `${ this.prefix }title`,
          textContent : config.displayName,
        }
      )
    )

    this.element.append(
      HtmlElementFactory.create('br', {})
    )

    this.element.append(
      HtmlElementFactory.create(
        'label',
        {
          forId       : `${ this.prefix }-status-checkbox`,
          textContent : 'Aktiv:',
        }
      )
    )

    this.element.append(
      InputElementFactory.create(
        'checkbox',
        {
          attributes     : { 'data-lastvalue': config.active },
          checked        : config.active,
          classList      : [ `${ this.baseClass }-statusCheckbox` ],
          eventListeners : CallbackWrapperFactory.create('StatusCheckbox', configCallback),
          id             : `${ this.prefix }status-checkbox`,
          name           : `${ this.prefix }status-checkbox`,
        }
      )
    )

    if (config.sortData) {
      this.element.append(
        HtmlElementFactory.create(
          'label',
          {
            forId       : `${ this.prefix }sort-checkbox`,
            textContent : 'Sortieren:',
          }
        )
      )
      this.element.append(
        InputElementFactory.create(
          'checkbox',
          {
            attributes     : { 'data-lastvalue': config.active },
            checked        : config.sortData,
            classList      : [ `${ this.baseClass }-sortCheckbox` ],
            eventListeners : CallbackWrapperFactory.create('SortCheckbox', configCallback),
            id             : `${ this.prefix }sort-checkbox`,
            name           : `${ this.prefix }sort-checkbox`,
          }
        )
      )
    }
  }

  /**
   * Gets the SettingsHeader element.
   * @public
   * @returns {HTMLElement} - The SettingsHeader element
   */
  getElement() {
    return this.element
  }
}

import CallbackWrapperFactory from '../factories/CallbackWrapperFactory.js'
import InputElementFactory    from '../factories/InputElementFactory.js'
import MiscElementFactory     from '../factories/MiscElementFactory.js'

export default class SettingsHeader {
  constructor(config, configCallback) {
    this.prefix    = `${ config.htmlPrefix }-header-`
    this.baseClass = 'feature-header'
    this.element   = MiscElementFactory.create('div',
      {
        id        : `${ this.prefix }container`,
        classList : [ `${ this.baseClass }-container` ],
      })

    this.element.append(
      MiscElementFactory.create('p',
        {
          id          : `${ this.prefix }title`,
          textContent : config.displayName,
          classList   : `${ this.baseClass }-title`,
          attributes  : { title: config.description },
        })
    )

    this.element.append(
      MiscElementFactory.create('br', {})
    )

    this.element.append(
      MiscElementFactory.create('label',
        {
          forId       : `${ this.prefix }-status-checkbox`,
          textContent : 'Aktiv:',
        })
    )

    this.element.append(
      InputElementFactory.create('checkbox',
        {
          checked        : config.active,
          name           : `${ this.prefix }status-checkbox`,
          id             : `${ this.prefix }status-checkbox`,
          classList      : [ `${ this.baseClass }-statusCheckbox` ],
          attributes     : { 'data-lastvalue': config.active },
          eventListeners : CallbackWrapperFactory.create('ActiveCheckBoxWrapper', configCallback),
        })
    )

    if (config.sortData) {
      this.element.append(
        MiscElementFactory.create('label',
          {
            forId       : `${ this.prefix }sort-checkbox`,
            textContent : 'Sortieren:',
          })
      )
      this.element.append(
        InputElementFactory.create('checkbox',
          {
            checked        : config.sortData,
            name           : `${ this.prefix }sort-checkbox`,
            id             : `${ this.prefix }sort-checkbox`,
            classList      : [ `${ this.baseClass }-sortCheckbox` ],
            attributes     : { 'data-lastvalue': config.active },
            eventListeners : CallbackWrapperFactory.create('SortCheckboxWrapper', configCallback),
          })
      )
    }
  }

  getElement() {
    return this.element
  }
}

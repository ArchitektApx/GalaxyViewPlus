import CallbackWrapperFactory from '../factories/CallbackWrapperFactory.js'
import InputElementFactory    from '../factories/InputElementFactory.js'
import MiscElementFactory     from '../factories/MiscElementFactory.js'

export default class SettingsHeader {
  constructor(config, configCallback) {
    this.prefix    = `${ config.htmlPrefix }-header-`
    this.baseClass = 'feature-header'
    this.element   = MiscElementFactory.create('div',
      {
        classList : [ `${ this.baseClass }-container` ],
        id        : `${ this.prefix }container`,
      })

    this.element.append(
      MiscElementFactory.create('p',
        {
          attributes  : { title: config.description },
          classList   : `${ this.baseClass }-title`,
          id          : `${ this.prefix }title`,
          textContent : config.displayName,
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
          attributes     : { 'data-lastvalue': config.active },
          checked        : config.active,
          classList      : [ `${ this.baseClass }-statusCheckbox` ],
          eventListeners : CallbackWrapperFactory.create('ActiveCheckBoxWrapper', configCallback),
          id             : `${ this.prefix }status-checkbox`,
          name           : `${ this.prefix }status-checkbox`,
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
            attributes     : { 'data-lastvalue': config.active },
            checked        : config.sortData,
            classList      : [ `${ this.baseClass }-sortCheckbox` ],
            eventListeners : CallbackWrapperFactory.create('SortCheckboxWrapper', configCallback),
            id             : `${ this.prefix }sort-checkbox`,
            name           : `${ this.prefix }sort-checkbox`,
          })
      )
    }
  }

  getElement() {
    return this.element
  }
}

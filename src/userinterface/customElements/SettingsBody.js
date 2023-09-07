import DataTypeFactory    from '../factories/DataTypeFactory.js'
import MiscElementFactory from '../factories/MiscElementFactory.js'

export default class SettingsBody {
  constructor(config, configCallback) {
    this.prefix    = `${ config.htmlPrefix }`
    this.baseClass = 'feature-body'
    this.element   = MiscElementFactory.create('div',
      {
        id        : `${ this.prefix }-body-container`,
        classList : `${ this.baseClass }-container`,
      })

    if (!config.active) { this.element.classList.add('hidden') }

    this.element.append(
      DataTypeFactory.create(config, configCallback)
    )
  }

  getElement() {
    return this.element
  }
}

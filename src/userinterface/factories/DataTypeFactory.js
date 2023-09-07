import ValueListElement  from '../customElements/ValueLists.js'
import ValueTableElement from '../customElements/ValueTable.js'

export default class DataTypeFactory {
  static create(config, configCallback) {
    switch (config.dataType) {
      case 'ValueTable': {
        return (new ValueTableElement(config, configCallback)).getElement()
      }

      case 'ValueList': {
        return (new ValueListElement(config, configCallback)).getElement()
      }

      default: {
        console.error(`DataType '${ config.dataType }' is not supported.`)
      }
    }
  }
}

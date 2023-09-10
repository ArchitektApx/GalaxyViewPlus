import ValueListElement  from '../customElements/ValueLists.js'
import ValueTableElement from '../customElements/ValueTable.js'

/**
 * The DataTypeFactory class is used to create data type elements.
 * @class
 */
export default class DataTypeFactory {
  /**
   * Creates a new DataTypeFactory instance.
   * @param {object} config - The config
   * @param {Function} configCallback - The config callback
   * @returns {ValueTableElement|ValueListElement|undefined} - the generated element
   */
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

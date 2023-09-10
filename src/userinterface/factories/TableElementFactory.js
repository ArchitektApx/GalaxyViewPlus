import TableElement from '../elements/TableElements.js'

/**
 * The TableElementFactory class is used to create table elements.
 * @class
 */
export default class TableElementFactory {
  /**
   * Creates a new TableElementFactory instance.
   * @param {string} type - The type of the table element
   * @param {object} options - The options of the table element
   * @returns {TableElement|undefined} - The TableElement generated from the type and options
   */
  static create(type, options = {}) {
    const types = [ 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'tfoot' ]

    if (!types.includes(type)) {
      console.error(`TableElement type '${ type }' is not supported.`)
      return
    }

    const tableElement = new TableElement(type, options)

    return tableElement.getElement()
  }
}

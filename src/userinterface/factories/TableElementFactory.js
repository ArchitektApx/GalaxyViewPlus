import TableElement from '../elements/TableElements.js'

export default class TableElementFactory {
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

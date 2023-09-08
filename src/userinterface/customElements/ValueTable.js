import ButtonElementFactory   from '../factories/ButtonElementFactory.js'
import CallbackWrapperFactory from '../factories/CallbackWrapperFactory.js'
import InputElementFactory    from '../factories/InputElementFactory.js'
import TableElementFactory    from '../factories/TableElementFactory.js'

// defines a table for the 'ValueTable' dataType of the feature config
// a table with a header where each row has the input for the key in the first column and the input for the value in the second column
// used to match one user defined value to another
// third column is a delete button to remove the row as this dataType allows custom amounts of rows
export default class ValueTableElement {
  constructor(config, configCallback) {
    this.prefix         = `${ config.htmlPrefix }`
    this.keyInputType   = config.keyInputType
    this.valueInputType = config.valueInputType
    this.keyDefault     = config.keyDefault
    this.valueDefault   = config.valueDefault

    this.element = TableElementFactory.create('table', {
      classList: [
        `${ this.prefix }`,
        `${ config.dataType }`,
      ],
      id       : `${ this.prefix }-tablecontainer`,
      children : [
        this.buildTableHeader('valuetable-header', [
          config.keyDisplayName,
          config.valueDisplayName,
          'Löschen',
        ]),
        this.buildTableBody(config, configCallback),
        ValueTableElement.buildAddRowButton(this.addDefaultTableRow.bind(this), configCallback),
      ],
    })
  }

  addDefaultTableRow(tbodyReference, configCallback) {
    // used by the add button to add a row with default values
    tbodyReference.append(
      ValueTableElement.buildTableRow(
        this.prefix,
        this.keyInputType,
        this.valueInputType,
        this.keyDefault,
        this.valueDefault,
        configCallback
      )
    )
  }

  buildTableBody(config, configCallback) {
    return TableElementFactory.create('tbody', {
      classList : 'valuetable-body',
      id        : `${ this.prefix }-tablebody`,
      children  : config.data.map(row => ValueTableElement.buildTableRow(
        this.prefix,
        config.keyInputType,
        config.valueInputType,
        row.key,
        row.value,
        configCallback
      )),
    })
  }

  buildTableHeader(classList, thNames = [ '', '', '' ], thIds = [ 'key', 'value', 'delete' ]) {
    return TableElementFactory.create('thead', {
      classList : 'valuetable-header',
      id        : `${ this.prefix }-tableheader`,
      children  : TableElementFactory.create('tr', {
        classList : `${ classList } ${ classList }-row`,
        id        : `${ this.prefix }row`,
        children  : [ 0, 1, 2 ].map(index => TableElementFactory.create('th', {
          id          : `${ this.prefix }cell-${ thIds[index] }`,
          textContent : thNames[index],
        })),
      }),
    })
  }

  // public methods
  getElement() {
    return this.element
  }

  static buildAddRowButton(addRowFunction, configCallback) {
    const callbacks = { addRow: addRowFunction, delButton: configCallback }

    return ButtonElementFactory.create('addRow', {
      eventListeners: CallbackWrapperFactory.create('AddRowButtonWrapper', callbacks),
    })
  }

  static buildInputCell(prefix, inputType, keyOrValue, value, configCallback) {
    return TableElementFactory.create('td', {
      children: [
        ValueTableElement.buildInputElement(
          inputType, {
            classList : `${ prefix }-${ keyOrValue }`,
            id        : `${ prefix }-${ keyOrValue }-${ value }`,
            name      : `${ keyOrValue }input`,
            value     : value,
          }, configCallback
        ),
      ],
    })
  }

  static buildInputElement(type, { name, value, id, classList }, configCallback) {
    return InputElementFactory.create(
      type, {
        attributes     : { 'data-lastvalue': value },
        classList      : classList,
        eventListeners : CallbackWrapperFactory.create('InputPairWrapper', configCallback),
        id             : id,
        name           : name,
        value          : value,
      }, true
    )
  }

  static buildRemoveRowButton(configCallback) {
    return ButtonElementFactory.create('removeRow', {
      eventListeners: CallbackWrapperFactory.create('RemoveRowButtonWrapper', configCallback),
    })
  }

  static buildTableRow(prefix, keyInputType, valueInputType, key, value, configCallback) {
    return TableElementFactory.create('tr', {
      children: ValueTableElement.buildTableRowCells(
        prefix, keyInputType, valueInputType, key, value, configCallback
      ),
    })
  }

  static buildTableRowCells(prefix, keyInputType, valueInputType, key, value, configCallback) {
    return [
      ValueTableElement.buildInputCell(prefix, keyInputType, 'key', key, configCallback),
      ValueTableElement.buildInputCell(prefix, valueInputType, 'value', value, configCallback),
      TableElementFactory.create('td', {
        children: [ ValueTableElement.buildRemoveRowButton(configCallback) ],
      }),
    ]
  }
}

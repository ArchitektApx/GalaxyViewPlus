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
      id        : `${ this.prefix }-tablecontainer`,
      classList : [
        `${ this.prefix }`,
        `${ config.dataType }`,
      ],
      children: [
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
      id        : `${ this.prefix }-tablebody`,
      classList : 'valuetable-body',
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
      id        : `${ this.prefix }-tableheader`,
      classList : 'valuetable-header',
      children  : TableElementFactory.create('tr', {
        id        : `${ this.prefix }row`,
        classList : `${ classList } ${ classList }-row`,
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
            id        : `${ prefix }-${ keyOrValue }-${ value }`,
            classList : `${ prefix }-${ keyOrValue }`,
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
        name           : name,
        value          : value,
        id             : id,
        classList      : classList,
        attributes     : { 'data-lastvalue': value },
        eventListeners : CallbackWrapperFactory.create('InputPairWrapper', configCallback),
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

import ButtonElementFactory   from '../factories/ButtonElementFactory.js'
import CallbackWrapperFactory from '../factories/CallbackWrapperFactory.js'
import InputElementFactory    from '../factories/InputElementFactory.js'
import TableElementFactory    from '../factories/TableElementFactory.js'

// defines a table for the 'ValueTable' dataType of the feature config
// a table with a header where each row has the input for the key in the first column and the input for the value in the second column
// used to match one user defined value to another
// third column is a delete button to remove the row as this dataType allows custom amounts of rows

/**
 * The ValueTableElement class is used to display the value table.
 * @class
 */
export default class ValueTableElement {
  /**
   * Creates a new ValueTableElement instance.
   * @public
   * @param {object} config - The config
   * @param {Function} configCallback - The config callback
   * @returns {ValueTableElement} - The ValueTableElement instance
   */
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

  /**
   * Adds a row with default values to the table.
   * @param {HTMLElement} tbodyReference - The tbody reference
   * @param {Function} configCallback - The config callback
   * @returns {void}
   * @public
   */
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

  /**
   * Builds the table body.
   * @param {object} config - The config
   * @param {Function} configCallback - The config callback
   * @returns {HTMLElement} - The table body
   * @public
   */
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

  /**
   * Builds the table header.
   * @param {string} classList - The class list
   * @param {string[]} thNames - The table header names
   * @param {string[]} thIds - The table header ids
   * @returns {HTMLElement} - The table header
   * @public
   */
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

  /**
   * Returns the element.
   * @returns {HTMLElement} - The element
   * @public
   */
  getElement() {
    return this.element
  }

  /**
   * Returns the table body.
   * @param {Function}addRowFunction - The add row function
   * @param {object} configCallback - The config callback
   * @returns {HTMLElement} - The table body
   * @public
   */
  static buildAddRowButton(addRowFunction, configCallback) {
    const callbacks = { addRow: addRowFunction, delButton: configCallback }

    return ButtonElementFactory.create('addRow', {
      eventListeners: CallbackWrapperFactory.create('AddRowButtonWrapper', callbacks),
    })
  }

  /**
   * Returns the table body.
   * @param {string} prefix - The prefix
   * @param {string} inputType - The input type
   * @param {string} keyOrValue - The key or value
   * @param {string} value - The value
   * @param {Function} configCallback - The config callback
   * @returns {HTMLElement} - The table body
   * @public
   * @static
   */
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

  /**
   * Returns the table body.
   * @param {string} type - The type
   * @param {object} options - The options used for creation
   * @param {string} options.name - The name
   * @param {string} options.value - The value
   * @param {string} options.id - The id
   * @param {string} options.classList - The class list
   * @param  {Function} configCallback  - The config callback
   * @returns {HTMLElement} - The table body
   * @public
   * @static
   */
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

  /**
   * Returns the remove row button
   * @param {Function} configCallback - The config callback
   * @returns {HTMLElement} - The remove row button
   * @public
   * @static
   */
  static buildRemoveRowButton(configCallback) {
    return ButtonElementFactory.create('removeRow', {
      eventListeners: CallbackWrapperFactory.create('RemoveRowButtonWrapper', configCallback),
    })
  }

  /**
   * Returns a table row
   * @param {string} prefix - The prefix
   * @param {string} keyInputType - The key input type
   * @param {string} valueInputType - The value input type
   * @param {string} key - The key
   * @param {string} value - The value
   * @param {Function} configCallback - The config callback
   * @returns {HTMLElement} - The table row
   * @public
   * @static
   */
  static buildTableRow(prefix, keyInputType, valueInputType, key, value, configCallback) {
    return TableElementFactory.create('tr', {
      children: ValueTableElement.buildTableRowCells(
        prefix, keyInputType, valueInputType, key, value, configCallback
      ),
    })
  }

  /**
   * Returns a table row cell
   * @param {string} prefix - The prefix
   * @param {string} keyInputType - The key input type
   * @param {string} valueInputType - The value input type
   * @param {string} key - The key
   * @param {string} value - The value
   * @param {Function} configCallback - The config callback
   * @returns {HTMLElement[]} - The table row cells
   * @public
   * @static
   */
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

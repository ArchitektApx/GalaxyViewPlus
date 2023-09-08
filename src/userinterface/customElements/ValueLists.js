import CallbackWrapperFactory from '../factories/CallbackWrapperFactory.js'
import InputElementFactory    from '../factories/InputElementFactory.js'
import MiscElementFactory     from '../factories/MiscElementFactory.js'
import TableElementFactory    from '../factories/TableElementFactory.js'

export default class ValueListElement {
  constructor(config, configCallback) {
    this.prefix = `${ config.htmlPrefix }`

    this.element = TableElementFactory.create('table', {
      classList: [
        `${ this.prefix }`,
        `${ config.dataType }`,
      ],
      id       : `${ this.prefix }-tablecontainer`,
      children : this.#buildListRows(config, config.dataType, configCallback),
    })
  }

  // public methods
  getElement() {
    return this.element
  }

  // private methods
  #buildListRowCells(dataRow, configCallback) {
    return [
      TableElementFactory.create('td', {
        children: MiscElementFactory.create('label', {
          classList   : `${ this.prefix }-${ dataRow.key }-label`,
          forId       : `${ this.prefix }-input-${ dataRow.key }`,
          textContent : dataRow.displayName,
          title       : dataRow.valueDescription,
        }),
      }),
      TableElementFactory.create('td', {
        children: [ InputElementFactory.create(dataRow.inputType, {
          attributes     : { 'data-lastvalue': dataRow.value },
          checked        : dataRow.checked,
          classList      : `${ this.prefix }-${ dataRow.key }-input`,
          eventListeners : CallbackWrapperFactory.create('InputWrapper', configCallback),
          id             : `${ this.prefix }-input-${ dataRow.key }`,
          name           : `${ dataRow.key }`,
          value          : dataRow.value,
        }, true) ],
      }),
    ]
  }

  #buildListRows(config, classList, configCallback) {
    return config.data.map(row => TableElementFactory.create('tr', {
      classList : `${ classList } ${ classList }-row`,
      id        : `${ this.prefix }-row`,
      children  : this.#buildListRowCells(row, configCallback),
    }))
  }
}

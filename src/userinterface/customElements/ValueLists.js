import CallbackWrapperFactory from '../factories/CallbackWrapperFactory.js'
import InputElementFactory    from '../factories/InputElementFactory.js'
import MiscElementFactory     from '../factories/MiscElementFactory.js'
import TableElementFactory    from '../factories/TableElementFactory.js'

export default class ValueListElement {
  constructor(config, configCallback) {
    this.prefix = `${ config.htmlPrefix }`

    this.element = TableElementFactory.create('table', {
      id        : `${ this.prefix }-tablecontainer`,
      classList : [
        `${ this.prefix }`,
        `${ config.dataType }`,
      ],
      children: this.#buildListRows(config, config.dataType, configCallback),
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
          forId       : `${ this.prefix }-input-${ dataRow.key }`,
          textContent : dataRow.displayName,
          title       : dataRow.valueDescription,
          classList   : `${ this.prefix }-${ dataRow.key }-label`,
        }),
      }),
      TableElementFactory.create('td', {
        children: [ InputElementFactory.create(dataRow.inputType, {
          name           : `${ dataRow.key }`,
          id             : `${ this.prefix }-input-${ dataRow.key }`,
          value          : dataRow.value,
          classList      : `${ this.prefix }-${ dataRow.key }-input`,
          attributes     : { 'data-lastvalue': dataRow.value },
          eventListeners : CallbackWrapperFactory.create('InputWrapper', configCallback),
          checked        : dataRow.checked,
        }, true) ],
      }),
    ]
  }

  #buildListRows(config, classList, configCallback) {
    return config.data.map(row => TableElementFactory.create('tr', {
      id        : `${ this.prefix }-row`,
      classList : `${ classList } ${ classList }-row`,
      children  : this.#buildListRowCells(row, configCallback),
    }))
  }
}

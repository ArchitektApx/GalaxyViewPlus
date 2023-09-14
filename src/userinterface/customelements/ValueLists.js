import CallbackWrapperFactory from '../factories/CallbackWrapperFactory.js'
import HtmlElementFactory     from '../factories/HtmlElementFactory.js'
import InputElementFactory    from '../factories/InputElementFactory.js'

// defines a table for the 'ValueList' dataType of the feature config
/**
 * The ValueListElement class is used to display the value list.
 * @class
 */
export default class ValueListElement {
  /**
   * Creates a new ValueListElement instance.
   * @param   {object}           config         - The config
   * @param   {Function}         configCallback - The config callback
   * @returns {ValueListElement}                - The ValueListElement instance
   * @class
   */
  constructor(config, configCallback) {
    this.prefix = `${ config.htmlPrefix }`

    this.element = HtmlElementFactory.create('table', {
      classList: [
        `${ this.prefix }`,
        `${ config.dataType }`,
      ],
      id       : `${ this.prefix }-tablecontainer`,
      children : this.#buildListRows(config, config.dataType, configCallback),
    })
  }

  // public methods
  /**
   * Returns the element.
   * @returns {HTMLElement} - The element
   * @public
   */
  getElement() {
    return this.element
  }

  // private methods
  /**
   * Builds a table row cell
   * @param   {object}      dataRow        - The data row
   * @param   {Function}    configCallback - The config callback
   * @returns {HTMLElement}                - The table row cell
   * @private
   */
  #buildListRowCells(dataRow, configCallback) {
    return [
      HtmlElementFactory.create('td', {
        children: HtmlElementFactory.create('label', {
          attributes: {
            for   : `${ this.prefix }-input-${ dataRow.key }`,
            title : dataRow.valueDescription,
          },
          classList   : `${ this.prefix }-${ dataRow.key }-label`,
          textContent : dataRow.displayName,
        }),
      }),
      HtmlElementFactory.create('td', {
        children: [ InputElementFactory.create(dataRow.inputType, {
          attributes     : { 'data-lastvalue': dataRow.value },
          checked        : dataRow.checked,
          classList      : `${ this.prefix }-${ dataRow.key }-input`,
          eventListeners : CallbackWrapperFactory.create('Input', configCallback),
          id             : `${ this.prefix }-input-${ dataRow.key }`,
          name           : `${ dataRow.key }`,
          value          : dataRow.value,
        }, true) ],
      }),
    ]
  }

  /**
   * Builds the table rows
   * @param   {object}        config         - The config
   * @param   {string}        classList      - The class list
   * @param   {Function}      configCallback - The config callback
   * @returns {HTMLElement[]}                - The table rows
   * @private
   */
  #buildListRows(config, classList, configCallback) {
    return config.data.map(row => HtmlElementFactory.create('tr', {
      classList : `${ classList } ${ classList }-row`,
      id        : `${ this.prefix }-row`,
      children  : this.#buildListRowCells(row, configCallback),
    }))
  }
}

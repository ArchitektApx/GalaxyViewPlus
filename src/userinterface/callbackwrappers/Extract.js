/**
 * Extract Class contains static methods to extract data from event targets used in callback wrappers.
 * @class
 */
export default class Extract {
  /**
   * Extracts the input data from a given input.
   * @param   {object} target - The event target (input) that triggered the callback
   * @returns {object}        - The formatted input data
   * @static
   * @public
   */
  static extractInputData(target) {
    const {
      checked,
      className,
      dataset: { lastvalue: lastvalueIn } = {},
      id,
      name,
      type,
      value: valueIn,
    } = target

    // parse numbers as integers
    const value     = type === 'number' ? Number.parseInt(valueIn, 10) : valueIn
    const lastvalue = type === 'number' ? Number.parseInt(lastvalueIn, 10) : lastvalueIn

    // return the formatted input data
    return { checked, className, id, lastvalue, name, type, value }
  }

  /**
   * Extracts the input data of both inputs (input pair) from a given row.
   * @param   {object}      row - The row element
   * @returns {Array|undefined} - The extracted inputs
   * @static
   * @public
   */
  static extractInputPairData(row) {
    if (row.children && row.children.length === 2) {
      const {
        children: [
          { firstChild: keyInput },
          { firstChild: valueInput },
        ],
      } = row

      return [ keyInput, valueInput ].map(input => Extract.extractInputData(input))
    }
  }

  /**
   * Extracts the parent row from a given input.
   * @param   {object} target - the target (input) that triggered the callback
   * @returns {object}        - The parent row
   * @static
   * @public
   */
  static extractParentRow(target) {
    const { parentElement: { parentElement: row } } = target
    return row
  }

  /**
   * Extracts the tabel body from a given addRowButton.
   * @param   {object} target - the target (input) that triggered the callback
   * @returns {object}        - The table body
   * @static
   * @public
   */
  static extractTableBody(target) {
    const { parentElement: { children: [ , tbody ] } } = target
    return tbody
  }
}

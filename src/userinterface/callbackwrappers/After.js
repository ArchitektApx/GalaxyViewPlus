import Mindash from '../../mindash/Mindash.js'
/**
 * After Class contains static methods to execute after the callback in callback wrappers.
 * @class
 */
export default class After {
  /**
   * ChangeTableVisibility changes the visibility of a table
   * based the input checkbox (event_.target) status
   * @param {object} target - the target (input) that triggered the callback
   * @returns {void}
   * @static
   * @public
   */
  static changeTableVisibility(target) {
    const { checked, parentElement: { nextSibling: tablebody } } = target

    // check if tablebody exists and has a classList just to be sure
    if (tablebody?.classList) {
      checked === true
        ? tablebody.classList.remove('hidden')
        : tablebody.classList.add('hidden')
    }
  }

  /**
   * RefreshLastValue updates the lastvalue dataset of a given input (event_.target).
   * @param {object} target - The event target (input) that triggered the callback
   * @returns {void}
   * @static
   * @public
   */
  static refreshLastValue(target) {
    const { dataset, checked, value, type } = target
    if (dataset) {
      dataset.lastvalue = Mindash.isThisOrThat(type, 'checkbox', 'radio')
        ? checked
        : value
    }
  }

  /**
   * RemoveRow removes a given row from the table.
   * @param {object} row - The row element
   * @returns {void}
   * @static
   * @public
   */
  static removeRow(row) {
    row.remove()
  }
}

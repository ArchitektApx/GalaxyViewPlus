import Mindash from '../../mindash/Mindash.js'

/**
 * The BaseWrapper provides a base class and methods for all callback wrappers.
 * @class
 */
export default class BaseWrapper {
  /**
   * Creates a new BaseWrapper instance.
   * @param {string} eventType - The event type
   * @returns {BaseWrapper} - The BaseWrapper instance
   */
  constructor(eventType) {
    this.eventType     = eventType
    this.wrapperObject = undefined // This will be assigned in derived classes
  }

  // public methods
  /**
   * Gets the wrapper object.
   * @returns {object} - The wrapper object
   * @public
   */
  getWrapper() {
    return this.wrapperObject
  }

  // static methods
  /**
   * Extracts the input data from a given input.
   * @param {object} input - The input element
   * @param {boolean} input.checked - The checked state of the input element
   * @param {string} input.className - The class name of the input element
   * @param {string} input.dataset - The dataset content of the input element
   * @param {string} input.id - The id of the input element
   * @param {string} input.name - The name of the input element
   * @param {string} input.type - The type of the input element
   * @param {string }input.value - The value of the input element
   * @returns {object} - The input data
   * @static
   * @public
   */
  static extractInputData({
    checked, className,
    dataset = {},
    id, name, type, value: valueIn,
  }) {
    const { lastvalue: lastvalueIn } = dataset
    // extract callBackData from a given input
    const value     = type === 'number' ? Number.parseInt(valueIn, 10) : valueIn
    const lastvalue = type === 'number' ? Number.parseInt(lastvalueIn, 10) : lastvalueIn

    return { checked, className, id, lastvalue, name, type, value }
  }

  /**
   * Extracts the input data (pair) from a given event.
   * @param {object} event_ - The event
   * @returns {Array} - The extracted input data for both inputs
   * @static
   * @public
   */
  static extractInputPairData(event_) {
    const row       = BaseWrapper.extractParentRowFromCellEvent(event_)
    const inputPair = BaseWrapper.extractInputPairFromRow(row)

    return inputPair.map(input => BaseWrapper.extractInputData(input))
  }

  /**
   * Extracts the input pair from a given row.
   * @param {object} row - The row element
   * @param {object} row.children - The children of the row element
   * @param {object} row.children.0 - The first child of the row element (left column)
   * @param {object} row.children.1 - The second child of the row element (middle column)
   * @returns {Array} - The input pair extracted from the row
   * @static
   * @public
   */
  static extractInputPairFromRow(
    { children: [ { firstChild: keyInput }, { firstChild: valueInput } ] }
  ) {
    // extract both input elements of a given row
    return [ keyInput, valueInput ]
  }

  /**
   * Extracts the parent row from a given cell event.
   * @param {object} event_ - The event
   * @param {object} event_.target - The target element of the event i.e. the input that triggered the event
   * @param {object} event_.target.parentElement - The parent element of the target element i.e. the cell
   * @param {object} event_.target.parentElement.parentElement - The parent element of the parent element of the target element i.e. the row
   * @returns {object} - The parent row element of the input that triggered the event
   * @static
   * @public
   */
  static extractParentRowFromCellEvent({ target: { parentElement: { parentElement: row } } }) {
    // extract the parent row from a cell click event
    return row
  }

  /**
   * refresh the dataset.lastvalue of a given input.
   * @param {object} event_ - The event
   * @param {object} event_.target - The target element of the event i.e. the input that triggered the event
   * @static
   * @public
   */
  static refreshLastValue({ target }) {
    if (target?.dataset) {
      target.dataset.lastvalue = Mindash.isThisOrThat(target.type, 'checkbox', 'radio')
        ? target.checked
        : target.value
    }
  }
}

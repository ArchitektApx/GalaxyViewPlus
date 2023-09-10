import BaseWrapper from './BaseWrapper.js'

/**
 * The RemoveRowButtonWrapper is a wrapper for remove row buttons.
 * @class
 */
export default class RemoveRowButtonWrapper extends BaseWrapper {
  /**
   * Creates a new RemoveRowButtonWrapper instance.
   * @param {string} eventType - The event type
   * @param {Function} inputCallback - The callback function
   * @returns {RemoveRowButtonWrapper} - The RemoveRowButtonWrapper instance
   */
  constructor(eventType, inputCallback) {
    super(eventType)
    this.wrapperObject = this.buildWrapperObject(inputCallback)
  }

  /**
   * Builds the wrapper object.
   * @param {Function} inputCallback - The callback function
   * @returns {object} - The wrapper object
   */
  buildWrapperObject(inputCallback) {
    return {
      callback: (event_) => {
        const row  = BaseWrapper.extractParentRowFromCellEvent(event_)
        const data = BaseWrapper.extractInputPairData(event_)

        inputCallback('removeRow', data)
        row.remove()
      },
      eventType: this.eventType,
    }
  }
}

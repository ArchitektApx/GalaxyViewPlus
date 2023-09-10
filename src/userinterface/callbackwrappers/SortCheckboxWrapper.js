import BaseWrapper from './BaseWrapper.js'

/**
 * The SortCheckboxWrapper is a wrapper for sort checkboxes.
 * @class
 */
export default class SortCheckboxWrapper extends BaseWrapper {
  /**
   * Creates a new SortCheckboxWrapper instance.
   * @param {string} eventType - The event type
   * @param {Function} inputCallback - The callback function
   * @returns {SortCheckboxWrapper} - The SortCheckboxWrapper instance
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
        const data = BaseWrapper.extractInputData(event_.target)

        inputCallback('changeSorting', data)
        // update data-lastvalue attribute for next callback
        BaseWrapper.refreshLastValue(event_)
      },
      eventType: this.eventType,
    }
  }
}

import BaseWrapper from './BaseWrapper.js'

/**
 * The InputPairWrapper is a wrapper for input pairs.
 * @class
 */
export default class InputPairWrapper extends BaseWrapper {
  /**
   * Creates a new InputPairWrapper instance.
   * @param {string} eventType - The event type
   * @param {Function} inputCallback - The callback function
   * @returns {InputPairWrapper} - The InputPairWrapper instance
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
        const data = BaseWrapper.extractInputPairData(event_)

        inputCallback('changeData', data)
        // update data-lastvalue attribute for next callback
        BaseWrapper.refreshLastValue(event_)
      },
      eventType: this.eventType,
    }
  }
}

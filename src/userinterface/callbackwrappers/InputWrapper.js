import BaseWrapper from './BaseWrapper.js'

/**
 * The InputWrapper is a wrapper for input elements.
 * @class
 */
export default class InputWrapper extends BaseWrapper {
  /**
   * Creates a new InputWrapper instance.
   * @param {string} eventType - The event type
   * @param {Function} inputCallback - The callback function
   * @returns {InputWrapper} - The InputWrapper instance
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

        inputCallback('changeData', data)

        // update data-lastvalue attribute for next callback
        BaseWrapper.refreshLastValue(event_)
      },
      eventType: this.eventType,
    }
  }
}

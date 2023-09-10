import BaseWrapper from './BaseWrapper.js'

/**
 * The ResetConfigWrapper is a wrapper for reset config buttons.
 * @class
 */
export default class ResetConfigWrapper extends BaseWrapper {
  /**
   * Creates a new ResetConfigWrapper instance.
   * @param {string} eventType - The event type
   * @param {Function} inputCallback - The callback function
   * @returns {ResetConfigWrapper} - The ResetConfigWrapper instance
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

        inputCallback('resetConfig', data)
      },
      eventType: this.eventType,
    }
  }
}

import BaseWrapper from './BaseWrapper.js'

/**
 * The SaveConfigWrapper is a wrapper for save config buttons.
 * @class
 */
export default class SaveConfigWrapper extends BaseWrapper {
  /**
   * Creates a new SaveConfigWrapper instance.
   * @param {string} eventType - The event type
   * @param {Function} inputCallback - The callback function
   * @returns {SaveConfigWrapper} - The SaveConfigWrapper instance
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

        inputCallback('saveConfig', data)
      },
      eventType: this.eventType,
    }
  }
}

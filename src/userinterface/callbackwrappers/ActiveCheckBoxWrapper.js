import BaseWrapper from './BaseWrapper.js'

/**
 * The ActiveCheckBoxWrapper is a wrapper for active checkboxes.
 * @class
 * @param {string} eventType - The event type
 * @param {Function} inputCallback - The callback function
 * @returns {ActiveCheckBoxWrapper} - The ActiveCheckBoxWrapper instance
 */
export default class ActiveCheckBoxWrapper extends BaseWrapper {
  /**
   * Creates a new ActiveCheckBoxWrapper instance.
   * @param {string} eventType - The event type
   * @param {Function} inputCallback - The callback function
   * @returns {ActiveCheckBoxWrapper} - The ActiveCheckBoxWrapper instance
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

        inputCallback('changeStatus', data)

        // update data-lastvalue attribute for next callback
        BaseWrapper.refreshLastValue(event_)

        // find related SettingsBody
        const { target: { parentElement: { nextSibling: body } = event_ } } = event_

        if (body && body.classList) {
          data.checked === true
            ? body.classList.remove('hidden')
            : body.classList.add('hidden')
        }
      },
      eventType: this.eventType,
    }
  }
}

import BaseWrapper from './BaseWrapper.js'

/**
 * The AddRowButtonWrapper is a wrapper for add row buttons.
 * @class
 * @param {string} eventType - The event type
 * @param {object} config - The config object
 * @returns {AddRowButtonWrapper} - The AddRowButtonWrapper instance
 */
export default class AddRowButtonWrapper extends BaseWrapper {
  /**
   * Creates a new AddRowButtonWrapper instance.
   * @param {string} eventType - The event type
   * @param {object} config - The config object
   * @param config.addRow - The addRow function
   * @param config.delButton - The configCallback function
   * @returns {AddRowButtonWrapper} - The AddRowButtonWrapper instance
   */
  constructor(eventType, { addRow: addRowFunction, delButton: configCallback }) {
    super(eventType)
    this.wrapperObject = this.buildWrapperObject(addRowFunction, configCallback)
  }

  /**
   * Builds the wrapper object.
   * @param {Function} addRowFunction - The addRow function
   * @param {Function} configCallback - The configCallback function
   * @returns {object} - The wrapper object
   */
  buildWrapperObject(addRowFunction, configCallback) {
    return {
      callback: (event_) => {
        const { target: { parentElement: { children: [ , tbody ] } } } = event_

        addRowFunction(tbody, configCallback)
      },
      eventType: this.eventType,
    }
  }
}

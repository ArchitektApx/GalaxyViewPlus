/**
 * Create the wrapper function for the Callbackfactory class.
 * @class
 */
export default class Wrapper {
  /**
   * Outputs wrapper object for the Callbackfactory class.
   * @param {string} eventType - The event type that triggers the callback
   * @param {Function} actionMethod - The static action method that we want to wrap
   * @param {Function} callbackFunction - The callback function that we want to pass to the action
   * @param {string|Function} callbackAction - The action that we want to pass to the callback
   *  (string) for all actions except (object) for AddRowButton where we have to trick a little bit
   *  so callbackAction is the addRowFunction and callbackFunction is the callback that is passed to
   *  the new delete button
   * @returns {object} - The wrapper object
   * @static
   * @public
   */
  static getWrapper(eventType, actionMethod, callbackFunction, callbackAction) {
    return {
      callback: (event_) => {
        actionMethod(event_, callbackFunction, callbackAction)
      },
      eventType: eventType,
    }
  }
}

import After   from './After.js'
import Extract from './Extract.js'

/**
 * Provides static methods that define the action to be executed in callback wrappers.
 * @class
 */
export default class Action {
  /**
   * Action for AddRowButton that also adds a new row to the table.
   * @param   {object}   event_           - The event
   * @param   {Function} callbackFunction - the callback that is passed to the new delete button
   * @param   {Function} callbackAction   - the add row callback action
   * @returns {void}
   * @static
   * @public
   */
  static AddRowButton(event_, callbackFunction, callbackAction) {
    const tbody = Extract.extractTableBody(event_.target)

    // misuse the callbackAction to pass the callbackFunction to the addRowFunction
    callbackAction(tbody, callbackFunction)
  }

  /**
   * Action for Generic Inputs (SaveButton, ResetButton) that only extract
   * the input data and execute the callback function.
   * @param   {object}   event_           - The event
   * @param   {Function} callbackFunction - The callback function to be executed
   * @param   {string}   callbackAction   - The type of action to be passed to the callback function
   * @returns {void}
   * @static
   * @public
   */
  static GenericInput(event_, callbackFunction, callbackAction) {
    const data = Extract.extractInputData(event_.target)
    callbackFunction(callbackAction, data)
  }

  /**
   * Action for InputPair that also refreshes the lastvalue dataset of both inputs.
   * @param   {object}   event_           - The event
   * @param   {Function} callbackFunction - The callback function to be executed
   * @param   {string}   callbackAction   - The type of action to be passed to the callback function
   * @returns {void}
   * @static
   * @public
   */
  static InputPairWithRefresh(event_, callbackFunction, callbackAction) {
    // get both inputs on the row for the callback
    const row  = Extract.extractParentRow(event_.target)
    const data = Extract.extractInputPairData(row)
    callbackFunction(callbackAction, data)

    // refresh lastvalue dataset of the input that triggered the callback
    After.refreshLastValue(event_.target)
  }

  /**
   * Action for single Inputs that also refresh their lastvalue dataset.
   * @param   {object}   event_ - The event
   * @param   {Function} callbackFunction - The callback function to be executed
   * @param   {string}   callbackAction - The type of action to be passed to the callback function
   * @returns {void}
   * @static
   * @public
   */
  static InputWithRefresh(event_, callbackFunction, callbackAction) {
    Action.GenericInput(event_, callbackFunction, callbackAction)
    // extend it to trigger refreshLastValue
    After.refreshLastValue(event_.target)
  }

  /**
   * Action for RemoveRowButton that also removes the row from the table.
   * @param   {object}   event_           - The event
   * @param   {Function} callbackFunction - The callback function to be executed
   * @param   {string}   callbackAction   - The type of action to be passed to the callback function
   * @returns {void}
   * @static
   * @public
   */
  static RemoveRowButton(event_, callbackFunction, callbackAction) {
    const row  = Extract.extractParentRow(event_.target)
    const data = Extract.extractInputPairData(row)
    callbackFunction(callbackAction, data)
    // extend it to trigger removeRow
    After.removeRow(row)
  }

  /**
   * Action for StatusCheckbox that also changes the visibility of the table.
   * @param   {object}   event_           - The event
   * @param   {Function} callbackFunction - The callback function to be executed
   * @param   {string}   callbackAction   - The type of action to be passed to the callback function
   * @returns {void}
   * @static
   * @public
   */
  static StatusCheckbox(event_, callbackFunction, callbackAction) {
    Action.InputWithRefresh(event_, callbackFunction, callbackAction)
    // extend it to trigger changeTableVisibility
    After.changeTableVisibility(event_.target)
  }
}

import Actions from '../callbackwrappers/Actions.js'
import Wrapper from '../callbackwrappers/Wrapper.js'

/**
 * CallbackWrapperFactory - Factory to create CallbackWrapper instances.
 * @class
 */
export default class CallbackWrapperFactory {
  static actionMethodMap = {
    AddRowButton: {
      actionMethod   : Actions.AddRowButton,
      callbackAction : 'addRow',
      eventType      : 'click',
    },
    Input: {
      actionMethod   : Actions.InputWithRefresh,
      callbackAction : 'changeData',
      eventType      : 'change',
    },
    InputPair: {
      actionMethod   : Actions.InputPairWithRefresh,
      callbackAction : 'changeData',
      eventType      : 'change',
    },
    RemoveRowButton: {
      actionMethod   : Actions.RemoveRowButton,
      callbackAction : 'removeRow',
      eventType      : 'click',
    },
    ResetConfig: {
      actionMethod   : Actions.GenericInput,
      callbackAction : 'resetConfig',
      eventType      : 'click',
    },
    SaveConfig: {
      actionMethod   : Actions.GenericInput,
      callbackAction : 'saveConfig',
      eventType      : 'click',
    },
    SortCheckbox: {
      actionMethod   : Actions.GenericInput,
      callbackAction : 'changeSorting',
      eventType      : 'click',
    },
    StatusCheckbox: {
      actionMethod   : Actions.StatusCheckbox,
      callbackAction : 'changeStatus',
      eventType      : 'click',
    },
  }

  /**
   * Creates a new CallbackWrapper instance.
   * @public
   * @param {string} type - The type of the CallbackWrapper
   * @param {Function} callbackFunction - The callback function
   * @param {string|Function} callbackAction - The callback action
   * @returns {object|undefined} - The CallbackWrapper object generated from the type and inputCallback
   */
  static create(type, callbackFunction, callbackAction = '') {
    const actionMethodDetails = CallbackWrapperFactory.actionMethodMap[type]
    if (!actionMethodDetails) {
      console.error(`CallbackWrapperFactory.create: Type ${ type } not found in actionMethodMap`)
      return
    }
    const { actionMethod, eventType } = actionMethodDetails  // Corrected typo here

    // if callbackAction is not passed, use the default one (mainly only used for AddRowButton)
    const action = callbackAction || CallbackWrapperFactory.actionMethodMap[type].callbackAction
    if (actionMethod && eventType) {
      return Wrapper.getWrapper(eventType, actionMethod, callbackFunction, action)
    }
  }
}

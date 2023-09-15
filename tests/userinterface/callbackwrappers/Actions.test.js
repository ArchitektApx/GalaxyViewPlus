/* eslint-disable no-underscore-dangle */
import Action  from '../../../src/userinterface/callbackwrappers/Actions.js'
import After   from '../../../src/userinterface/callbackwrappers/After.js'
import Extract from '../../../src/userinterface/callbackwrappers/Extract.js'

describe('Action class', () => {
  let event_
  let callbackFunction
  let callbackAction

  beforeEach(() => {
    // Mock event target
    event_           = {
      target: {
        parentElement: {
          children      : [ {}, {} ],
          parentElement : {},
        },
      },
    }
    callbackFunction = jest.fn()
    callbackAction   = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('AddRowButton method', () => {
    jest.spyOn(Extract, 'extractTableBody').mockReturnValue({})

    Action.AddRowButton(event_, callbackFunction, callbackAction)

    expect(Extract.extractTableBody).toHaveBeenCalledWith(event_.target)
    expect(callbackAction).toHaveBeenCalled()
  })

  it('GenericInput method', () => {
    jest.spyOn(Extract, 'extractInputData').mockReturnValue({})

    Action.GenericInput(event_, callbackFunction, callbackAction)

    expect(Extract.extractInputData).toHaveBeenCalledWith(event_.target)
    expect(callbackFunction).toHaveBeenCalledWith(callbackAction, {})
  })

  it('InputPairWithRefresh method', () => {
    jest.spyOn(Extract, 'extractParentRow').mockReturnValue({})
    jest.spyOn(Extract, 'extractInputPairData').mockReturnValue([])
    jest.spyOn(After, 'refreshLastValue')

    Action.InputPairWithRefresh(event_, callbackFunction, callbackAction)

    expect(Extract.extractParentRow).toHaveBeenCalledWith(event_.target)
    expect(Extract.extractInputPairData).toHaveBeenCalled()
    expect(callbackFunction).toHaveBeenCalledWith(callbackAction, [])
    expect(After.refreshLastValue).toHaveBeenCalledWith(event_.target)
  })

  it('InputWithRefresh method', () => {
    jest.spyOn(After, 'refreshLastValue')

    Action.InputWithRefresh(event_, callbackFunction, callbackAction)

    expect(After.refreshLastValue).toHaveBeenCalledWith(event_.target)
  })

  it('RemoveRowButton method', () => {
    const mockRow = { remove: jest.fn() }
    jest.spyOn(Extract, 'extractParentRow').mockReturnValueOnce(mockRow)

    Action.RemoveRowButton(event_, callbackFunction, callbackAction)

    expect(mockRow.remove).toHaveBeenCalled()
  })

  it('StatusCheckbox method', () => {
    jest.spyOn(After, 'changeTableVisibility')

    Action.StatusCheckbox(event_, callbackFunction, callbackAction)

    expect(After.changeTableVisibility).toHaveBeenCalledWith(event_.target)
  })

  it('AddRowButton method - no tbody', () => {
    jest.spyOn(Extract, 'extractTableBody').mockReturnValueOnce(null)

    Action.AddRowButton(event_, callbackFunction, callbackAction)

    expect(callbackAction).toHaveBeenCalledWith(null, callbackFunction)
  })

  it('GenericInput method - no data', () => {
    jest.spyOn(Extract, 'extractInputData').mockReturnValue(null)

    Action.GenericInput(event_, callbackFunction, callbackAction)

    expect(callbackFunction).toHaveBeenCalledWith(callbackAction, null)
  })

  it('InputPairWithRefresh method - no row', () => {
    jest.spyOn(Extract, 'extractParentRow').mockReturnValueOnce(null)

    Action.InputPairWithRefresh(event_, callbackFunction, callbackAction)

    expect(callbackFunction).toHaveBeenCalledWith(callbackAction, [])
  })

  it('RemoveRowButton method - no row', () => {
    const mockRow = { remove: jest.fn() }
    jest.spyOn(Extract, 'extractParentRow').mockReturnValueOnce(mockRow)

    Action.RemoveRowButton(event_, callbackFunction, callbackAction)

    expect(mockRow.remove).toHaveBeenCalled()
  })
})

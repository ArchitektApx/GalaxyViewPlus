import event_  from '../mocks/MockCallbackEventSetup.js'
import Action  from '../../../src/userinterface/callbackwrappers/Actions.js'
import After   from '../../../src/userinterface/callbackwrappers/After.js'
import Extract from '../../../src/userinterface/callbackwrappers/Extract.js'

describe('Action class', () => {
  let callbackFunction
  let callbackAction

  beforeEach(() => {
    // Mock event target
    callbackFunction = jest.fn()
    callbackAction   = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should run AddRowButton method as expected', () => {
    jest.spyOn(Extract, 'extractTableBody').mockReturnValue({})

    Action.AddRowButton(event_, callbackFunction, callbackAction)

    expect(Extract.extractTableBody).toHaveBeenCalledWith(event_.target)
    expect(callbackAction).toHaveBeenCalled()
  })

  it('should run GenericInput method as expected', () => {
    jest.spyOn(Extract, 'extractInputData').mockReturnValue({})

    Action.GenericInput(event_, callbackFunction, callbackAction)

    expect(Extract.extractInputData).toHaveBeenCalledWith(event_.target)
    expect(callbackFunction).toHaveBeenCalledWith(callbackAction, {})
  })

  it('should run InputPairWithRefresh method as expected', () => {
    jest.spyOn(Extract, 'extractParentRow').mockReturnValue({})
    jest.spyOn(Extract, 'extractInputPairData').mockReturnValue([])
    jest.spyOn(After, 'refreshLastValue')

    Action.InputPairWithRefresh(event_, callbackFunction, callbackAction)

    expect(Extract.extractParentRow).toHaveBeenCalledWith(event_.target)
    expect(Extract.extractInputPairData).toHaveBeenCalled()
    expect(callbackFunction).toHaveBeenCalledWith(callbackAction, [])
    expect(After.refreshLastValue).toHaveBeenCalledWith(event_.target)
  })

  it('should run RemoveRowButton method as expected', () => {
    const mockRow = { remove: jest.fn() }
    jest.spyOn(Extract, 'extractParentRow').mockReturnValueOnce(mockRow)

    Action.RemoveRowButton(event_, callbackFunction, callbackAction)

    expect(mockRow.remove).toHaveBeenCalled()
  })

  it('should StatusCheckbox method as expected', () => {
    jest.spyOn(After, 'changeTableVisibility')

    Action.StatusCheckbox(event_, callbackFunction, callbackAction)

    expect(After.changeTableVisibility).toHaveBeenCalledWith(event_.target)
  })

  it('should hande no tablebody classlist in StatusCheckbox method', () => {
    jest.spyOn(After, 'changeTableVisibility')

    Action.StatusCheckbox(event_, callbackFunction, callbackAction)

    expect(After.changeTableVisibility).toHaveBeenCalledWith(event_.target)
    expect(After.changeTableVisibility).not.toThrow()
  })

  it('should handle no tbody in AddRowButton method', () => {
    jest.spyOn(Extract, 'extractTableBody').mockReturnValueOnce(null)

    Action.AddRowButton(event_, callbackFunction, callbackAction)

    expect(callbackAction).toHaveBeenCalledWith(null, callbackFunction)
  })

  it('should handle no data in GenericInput method', () => {
    jest.spyOn(Extract, 'extractInputData').mockReturnValue(null)

    Action.GenericInput(event_, callbackFunction, callbackAction)

    expect(callbackFunction).toHaveBeenCalledWith(callbackAction, null)
  })

  it('should handle no row in RemoveRowButton method', () => {
    const mockRow = { remove: jest.fn() }
    jest.spyOn(Extract, 'extractParentRow').mockReturnValueOnce(mockRow)

    Action.RemoveRowButton(event_, callbackFunction, callbackAction)

    expect(mockRow.remove).toHaveBeenCalled()
  })
})

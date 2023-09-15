import event_  from '../mocks/MockCallbackEventSetup.js'
import Mindash from '../../../src/mindash/Mindash.js'
import After   from '../../../src/userinterface/callbackwrappers/After.js'

describe('After class', () => {
  let target

  beforeEach(() => {
    target = event_.target
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('changeTableVisibility method', () => {
    After.changeTableVisibility(target)
    expect(target.parentElement.nextSibling.classList.remove).toHaveBeenCalledWith('hidden')
    target.checked = false
    After.changeTableVisibility(target)
    expect(target.parentElement.nextSibling.classList.add).toHaveBeenCalledWith('hidden')
  })

  it('refreshLastValue method', () => {
    jest.spyOn(Mindash, 'isThisOrThat').mockReturnValue(false)
    After.refreshLastValue(target)
    expect(target.dataset.lastvalue).toBe('test')
  })

  it('removeRow method', () => {
    const row = {
      remove: jest.fn(),
    }
    After.removeRow(row)
    expect(row.remove).toHaveBeenCalled()
  })

  it('refreshLastValue method - checkbox type', () => {
    target = { type: 'checkbox', checked: false, dataset: { lastvalue: 'true' } }
    jest.spyOn(Mindash, 'isThisOrThat').mockReturnValue(true)
    After.refreshLastValue(target)
    expect(target.dataset.lastvalue).toBe(false)
  })
})

import Mindash from '../../../src/mindash/Mindash.js'
import After   from '../../../src/userinterface/callbackwrappers/After.js'

describe('After class', () => {
  let target

  beforeEach(() => {
    target = {
      checked       : true,
      parentElement : {
        nextSibling: {
          classList: {
            add    : jest.fn(),
            remove : jest.fn(),
          },
        },
      },
      dataset : {},
      type    : 'text',
      value   : 'test',
    }
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

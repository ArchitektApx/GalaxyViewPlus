import event_ from '../mocks/MockCallbackEventSetup.js'
import After  from '../../../src/userinterface/callbackwrappers/After.js'

describe('After class', () => {
  let target

  beforeEach(() => {
    target = event_.target
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('changeTableVisibility', () => {
    it('should hide or show table depending on targets checked state', () => {
      After.changeTableVisibility(target)
      expect(target.parentElement.nextSibling.classList.remove).toHaveBeenCalledWith('hidden')
      target.checked = false
      After.changeTableVisibility(target)
      expect(target.parentElement.nextSibling.classList.add).toHaveBeenCalledWith('hidden')
    })

    it('should not throw an error if classList is undefined', () => {
      const targetnoclasslist                               = target
      targetnoclasslist.parentElement.nextSibling.classList = undefined

      expect(() => After.changeTableVisibility(targetnoclasslist)).not.toThrow()
    })

    it('should not throw an error if tablebody is undefined', () => {
      const targetnonextsibling         = target
      targetnonextsibling.parentElement = { nextSibling: undefined }
      expect(() => After.changeTableVisibility(targetnonextsibling)).not.toThrow()
    })

    it('should not throw an error if target is undefined', () => {
      expect(() => After.changeTableVisibility()).not.toThrow()
    })
  })

  describe('refreshLastValue', () => {
    it('should update the lastvalue dataset of a given input', () => {
      After.refreshLastValue(target)
      expect(target.dataset.lastvalue).toBe('test')
    })

    it('should update the lastvalue dataset of a given input - checkbox type', () => {
      target = { type: 'checkbox', checked: false, dataset: { lastvalue: 'true' } }
      After.refreshLastValue(target)
      expect(target.dataset.lastvalue).toBe(false)
    })

    it('should not throw an error if dataset is undefined', () => {
      target.dataset = undefined
      expect(() => After.refreshLastValue(target)).not.toThrow()
    })

    it('should not throw an error if target is undefined', () => {
      expect(() => After.refreshLastValue()).not.toThrow()
    })
  })

  it('removeRow method', () => {
    const row = {
      remove: jest.fn(),
    }
    After.removeRow(row)
    expect(row.remove).toHaveBeenCalled()
  })
})

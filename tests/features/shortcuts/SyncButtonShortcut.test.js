/* eslint-disable no-script-url */
import SyncButtonShortcut from '../../../src/features/shortcuts/SyncButtonShortcut.js'

describe('SyncButtonShortcut', () => {
  let mockListener
  let locationAssignMock
  let galaSyncElement

  // Mock the global document and location objects
  beforeEach(() => {
    mockListener = jest.fn()

    global.document = {
      addEventListener: jest.fn((event, callback) => {
        if (event === 'keydown') {
          mockListener = callback
        }
      }),
      querySelector: jest.fn().mockImplementation((selector) => {
        if (selector === '#gala_sync') {
          return galaSyncElement
        }

        return null
      }),
    }

    locationAssignMock = jest.fn()
    global.location    = {
      assign: locationAssignMock,
    }

    galaSyncElement = { value: '' }
  })

  it('should register a keydown event listener', () => {
    SyncButtonShortcut.execute()

    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('should handle "e" key press', () => {
    SyncButtonShortcut.execute()

    mockListener({ key: 'e' })

    expect(locationAssignMock).toHaveBeenCalledWith('javascript:syncsys()')
    expect(galaSyncElement.value).toBe('Synced')
  })

  it('should not handle other key presses', () => {
    SyncButtonShortcut.execute()

    mockListener({ key: 'a' })

    expect(locationAssignMock).not.toHaveBeenCalled()
    expect(galaSyncElement.value).not.toBe('Synced')
  })
})

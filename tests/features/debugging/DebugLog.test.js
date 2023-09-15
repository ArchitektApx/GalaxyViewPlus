import { HtmlElementFactory } from '../../userinterface/mocks/MockFactoriesSetup.js'
import DebugLog               from '../../../src/features/debugging/DebugLog.js'
import StaticData             from '../../../src/staticdata/StaticData.js'
import StorageInterface       from '../../../src/storageinterface/StorageInterface.js'

// Mock the imported modules
jest.mock('../../../src/staticdata/StaticData.js')
jest.mock('../../../src/storageinterface/StorageInterface.js')

describe('DebugLog', () => {
  // Mocked element representing '#settings-interface-details'
  const mockSettingsElement     = HtmlElementFactory.create('div', { id: 'settings-interface-details' })
  mockSettingsElement.lastChild = HtmlElementFactory.create('div', { id: 'debug-info' })

  // Set up mock global document
  global.document = {
    querySelector: jest.fn().mockImplementation((selector) => {
      if (selector === '#settings-interface-details') {
        return mockSettingsElement
      }

      return null
    }),
  }

  StaticData.STORAGE_KEYS = {
    DEBUG_LOG: 'mockDebugLogKey',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    // Clean up the global object
    delete global.document
  })

  it('should get debug log and show them in reverse order', () => {
    const mockDebugLog = [ 'log1', 'log2', 'log3' ]

    StorageInterface.getStorageItem.mockReturnValue(mockDebugLog)

    DebugLog.execute()

    // Check that the debug log element was created
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(1, 'div', { id: 'debug-log' })
    // Loglines should be in reverse order due to side effect of Array.reverse()
    expect(mockDebugLog[0]).toBe('log3')
    expect(mockDebugLog[1]).toBe('log2')
    expect(mockDebugLog[2]).toBe('log1')

    mockDebugLog.forEach((log, index) => {
      expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(
        index + 2,
        'p',
        { textContent: `${ log }` }
      )
    })

    // Check that the debug log element was attached after the debug info element
    expect(mockSettingsElement.lastChild.after).toHaveBeenCalledTimes(1)
  })

  it('should handle an empty debug log', () => {
    StorageInterface.getStorageItem.mockReturnValue([])

    DebugLog.execute()

    // Check that the debug log element was created
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(1, 'div', { id: 'debug-log' })
    // was only called for the div but no lines
    expect(HtmlElementFactory.create).toHaveBeenCalledTimes(1)
  })
})

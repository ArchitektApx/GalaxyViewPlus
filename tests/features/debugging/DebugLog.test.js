/* eslint-disable complexity */
/* eslint-disable object-shorthand */
import DebugLog           from '../../../src/features/debugging/DebugLog.js'
import StaticData         from '../../../src/staticdata/StaticData.js'
import StorageInterface   from '../../../src/storageinterface/StorageInterface.js'
import HtmlElementFactory from '../../../src/userinterface/factories/HtmlElementFactory.js'

// Mock the imported modules
jest.mock('../../../src/staticdata/StaticData.js')
jest.mock('../../../src/storageinterface/StorageInterface.js')
jest.mock('../../../src/userinterface/factories/HtmlElementFactory.js')

describe('DebugLog', () => {
  // Create mock factory
  const allMockElements = []

  HtmlElementFactory.create.mockImplementation((tag, properties) => ({
    tag,
    props       : properties,
    children    : [],
    parent      : null,
    nextSibling : null,
    append(child) {
      this.children.push(child)
      child.parent = this
    },
    after(child) {
      if (this.parent) {
        const siblingIndex = this.parent.children.indexOf(this)

        if (siblingIndex !== -1 && siblingIndex < this.parent.children.length - 1) {
          this.parent.children.splice(siblingIndex + 1, 0, child)
        } else {
          this.parent.children.push(child)
        }
      }

      child.parent     = this.parent
      this.nextSibling = child
    },
  }))

  // Mocked element representing '#settings-interface-details'
  const mockSettingsElement = HtmlElementFactory.create('div', { id: 'settings-interface-details' })

  mockSettingsElement.lastChild = HtmlElementFactory.create('div')

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

  afterAll(() => {
    // Clean up the global object
    delete global.document
  })

  it('should get debug log and show them in reverse order', () => {
    const mockDebugLog = [ 'log1', 'log2', 'log3' ]

    StorageInterface.getStorageItem.mockReturnValue(mockDebugLog)

    DebugLog.execute()

    const debugLogElement = mockSettingsElement.lastChild.nextSibling

    expect(debugLogElement.props.id).toBe('debug-log')
    expect(debugLogElement.children).toHaveLength(mockDebugLog.length)
    mockDebugLog.toReversed().forEach((log, index) => {
      expect(debugLogElement.children[index].props.textContent).toBe(log)
    })
  })

  it('should handle an empty debug log', () => {
    StorageInterface.getStorageItem.mockReturnValue([])

    DebugLog.execute()

    expect(mockSettingsElement.nextSibling).toBeNull()
  })
})

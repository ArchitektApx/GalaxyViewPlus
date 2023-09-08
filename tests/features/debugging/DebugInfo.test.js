/* eslint-disable object-shorthand */
/* eslint-disable sonarjs/no-unused-collection */
import DebugInfo          from '../../../src/features/debugging/DebugInfo.js'
import StaticData         from '../../../src/staticdata/StaticData.js'
import StorageInterface   from '../../../src/storageinterface/StorageInterface.js'
import MiscElementFactory from '../../../src/userinterface/factories/MiscElementFactory.js'

// Mock dependencies
jest.mock('../../../src/staticdata/StaticData.js')
jest.mock('../../../src/storageinterface/StorageInterface.js')
jest.mock('../../../src/userinterface/factories/MiscElementFactory.js')

describe('DebugInfo', () => {
  // Create global mock elements for the test environment
  let mockSettingsElement
  let allMockElements = []

  beforeAll(() => {
    // Mock the global GM.info object
    global.GM = {
      info: {
        script: {
          version: '1.0.0',
        },
      },
    }

    global.document = {
      querySelector: jest.fn((selector) => {
        if (selector === '#settings-interface-details') {
          return mockSettingsElement
        }

        return null
      }),
    }

    jest.spyOn(Date, 'now').mockImplementation(() => 1000 + 1000)

    MiscElementFactory.create.mockImplementation((tag, properties) => {
      const element = {
        tag,
        props    : properties,
        children : [],
        append(child) {
          this.children.push(child)
        },
      }

      allMockElements.push(element)

      return element
    })
  })

  beforeEach(() => {
    mockSettingsElement = MiscElementFactory.create('div', { id: 'settings-interface-details' })
    allMockElements     = [ mockSettingsElement ]
  })

  it('should create and append debug info', () => {
    const mockStartTime   = 1000
    const mockElapsedTime = 1000

    const mockData = {
      GalaxyViewPlus_UpdateStatus: {
        status    : 'success',
        timestamp : Date.now(),
      },
      GalaxyViewPlus_StatsData: {
        player1 : {},
        player2 : {},
      },
      GalaxyViewPlus_Config: {
        configVersion: '2.0.0',
      },
    }

    StorageInterface.getStorageItem.mockImplementation(key => mockData[key])

    StaticData.DEFAULT_CONFIG = {
      configVersion: '1.0.0',
    }

    DebugInfo.execute(mockStartTime)

    const debugInfoElement = mockSettingsElement.children[0]

    expect(debugInfoElement.props.id).toBe('debug-info')

    const expectedInfo = {
      currentConfigVersion : '2.0.0',
      defaultConfigVersion : '1.0.0',
      executionTime        : `${ mockElapsedTime }ms`,
      scriptVersion        : '1.0.0',
      statsDataCount       : '2 Players',
      statsUpdateStatus    : 'success',
      statsUpdateTimestamp : new Date(mockData.GalaxyViewPlus_UpdateStatus.timestamp).toISOString(),
    }

    Object.keys(expectedInfo).forEach((key, index) => {
      const infoParagraph = debugInfoElement.children[index]

      expect(infoParagraph.props.textContent).toBe(`${ key }: ${ expectedInfo[key] }`)
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
})

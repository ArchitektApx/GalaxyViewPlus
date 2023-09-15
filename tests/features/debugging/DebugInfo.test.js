import { HtmlElementFactory } from '../../userinterface/mocks/MockFactoriesSetup.js'
import DebugInfo              from '../../../src/features/debugging/DebugInfo.js'
import StaticData             from '../../../src/staticdata/StaticData.js'
import StorageInterface       from '../../../src/storageinterface/StorageInterface.js'

// Mock dependencies
jest.mock('../../../src/staticdata/StaticData.js')
jest.mock('../../../src/storageinterface/StorageInterface.js')

describe('DebugInfo', () => {
  // Create global mock elements for the test environment
  let mockSettingsElement

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
      querySelector: jest.fn(selector => (
        selector === '#settings-interface-details'
          ? mockSettingsElement
          : null
      )),
    }

    jest.spyOn(Date, 'now').mockImplementation(() => 1000 + 1000)
  })

  beforeEach(() => {
    mockSettingsElement = HtmlElementFactory.create('div', { id: 'settings-interface-details' })
    jest.clearAllMocks()
  })

  it('should create and append debug info', () => {
    // setup mock data
    const mockStartTime   = 1000
    const mockElapsedTime = 1000
    const mockData        = {
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

    // start the method
    DebugInfo.execute(mockStartTime)

    // the first call to create should be the debug info element
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(
      1,
      'div',
      { id: 'debug-info' }
    )

    // the values we expect to be in the debug info element
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
      expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(
        index + 2, // index 0 is the second call to create and so on
        'p',
        { textContent: `${ key }: ${ expectedInfo[key] }` }
      )
    })

    // the debug info element should be appended to the settings element
    expect(mockSettingsElement.append).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
})

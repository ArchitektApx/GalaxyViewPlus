import GalaxyViewPlus      from '../src/GalaxyViewPlus.js'
import ConfigManager       from '../src/configmanager/ConfigManager.js'
import LogLevel            from '../src/enum/LogLevel.js'
import GeneralSettings     from '../src/features/GeneralSettings.js'
import Iterator            from '../src/features/Iterator.js'
import StatisticsInterface from '../src/statisticsinterface/StatisticsInterface.js'
import StorageInterface    from '../src/storageinterface/StorageInterface.js'
import UserInterface       from '../src/userinterface/UserInterface.js'

// Mock all the modules
jest.mock('../src/configmanager/ConfigManager.js')
jest.mock('../src/features/GeneralSettings.js')
jest.mock('../src/features/Iterator.js')
jest.mock('../src/statisticsinterface/StatisticsInterface.js')
jest.mock('../src/storageinterface/StorageInterface.js')
jest.mock('../src/userinterface/UserInterface.js')

describe('GalaxyViewPlus Script Execution', () => {
  // This will be useful to reset the state of all mocks to their initial state
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should execute the GalaxyViewPlus script correctly', async () => {
    await GalaxyViewPlus.run()

    // Assuming you've imported the mock instances or the mocked modules at the top
    expect(StorageInterface.writeLog).toHaveBeenNthCalledWith(1, 'Starting script', LogLevel.INFO, 'Main')
    expect(StatisticsInterface.prototype.initialize).toHaveBeenCalledTimes(1)
    expect(ConfigManager).toHaveBeenCalledTimes(1)
    expect(UserInterface).toHaveBeenCalledTimes(1)
    expect(Iterator).toHaveBeenCalledTimes(1)
    expect(GeneralSettings.execute).toHaveBeenCalledTimes(1)
    expect(StorageInterface.writeLog).toHaveBeenNthCalledWith(2, 'Finished script', LogLevel.INFO, 'Main')
  })
})

import ConfigManager       from './configmanager/ConfigManager.js'
import LogLevel            from './enum/LogLevel.js'
import GeneralSettings     from './features/GeneralSettings.js'
import Iterator            from './features/Iterator.js'
import StatisticsInterface from './statisticsinterface/StatisticsInterface.js'
import StorageInterface    from './storageinterface/StorageInterface.js'
import UserInterface       from './userinterface/UserInterface.js'

export default class GalaxyViewPlus {
  static async run() {
    const startTime = Date.now()

    StorageInterface.writeLog('Starting script', LogLevel.INFO, 'Main')

    const configManager       = new ConfigManager()
    const statisticsInterface = new StatisticsInterface()

    await statisticsInterface.initialize()

    const userInterface    = new UserInterface(configManager)
    const iteratorInstance = new Iterator(configManager.getCurrentConfig(), statisticsInterface)

    GeneralSettings.execute(configManager.getCurrentConfig(), startTime)

    StorageInterface.writeLog('Finished script', LogLevel.INFO, 'Main')
  }
}

// invoke if not in test environment
if (
  typeof process === 'undefined'
  || (
    process.env.JEST_WORKER_ID === undefined
    && process.env.NODE_ENV !== 'test'
  )
) {
  GalaxyViewPlus.run()
}

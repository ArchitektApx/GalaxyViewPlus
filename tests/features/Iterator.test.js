/* eslint-disable no-new */
import LogLevel            from '../../src/enum/LogLevel.js'
import Iterator            from '../../src/features/Iterator.js'
import InactiveRecolor     from '../../src/features/inactiverecolor/InactiveRecolor.js'
import RangeInfo           from '../../src/features/rangeinfo/RangeInfo.js'
import RankRecolor         from '../../src/features/rankrecolor/RankRecolor.js'
import UsernameRecolor     from '../../src/features/usernameRecolor/UsernameRecolor.js'
import StatisticsInterface from '../../src/statisticsinterface/StatisticsInterface.js'
import StorageInterface    from '../../src/storageinterface/StorageInterface.js'

jest.mock('../../src/storageinterface/StorageInterface.js')
jest.mock('../../src/features/inactiverecolor/InactiveRecolor.js')
jest.mock('../../src/features/rangeinfo/RangeInfo.js')
jest.mock('../../src/features/rankrecolor/RankRecolor.js')
jest.mock('../../src/features/usernameRecolor/UsernameRecolor.js')

describe('Iterator', () => {
  // Mock the global document object
  const positionsMock = [ {}, {} ]

  global.document = {
    querySelectorAll: jest.fn(() => positionsMock.map(() => ({ parentNode: {} }))),
  }

  beforeEach(() => {
    StorageInterface.writeLog.mockClear()
    InactiveRecolor.mockClear()
    RangeInfo.mockClear()
    RankRecolor.mockClear()
    UsernameRecolor.mockClear()
  })

  describe('initialization and execution', () => {
    it('should initialize and invoke features correctly', () => {
      const featureConfig = [
        { feature: 'rangeInfo', active: true, data: {} },
        { feature: 'inactiveRecolor', active: true, data: {} },
        { feature: 'userRecolor', active: false, data: {} },
        { feature: 'rankRecolor', active: true, data: {} },
      ]

      new Iterator({ features: featureConfig }, {})

      // Assert that the features were instantiated and executed
      expect(InactiveRecolor).toHaveBeenCalledTimes(1)
      expect(RangeInfo).toHaveBeenCalledTimes(1)
      expect(UsernameRecolor).toHaveBeenCalledTimes(0) // Not active
      expect(RankRecolor).toHaveBeenCalledTimes(1)

      // Verify the execute method was called on each feature for each position
      expect(InactiveRecolor.mock.instances[0].execute).toHaveBeenCalledTimes(positionsMock.length)
      expect(RangeInfo.mock.instances[0].execute).toHaveBeenCalledTimes(positionsMock.length)
      expect(RankRecolor.mock.instances[0].execute).toHaveBeenCalledTimes(positionsMock.length)
    })
  })

  describe('logging', () => {
    it('should log when constructor and invokeFeatures are called', () => {
      const featureConfig = []

      new Iterator({ features: featureConfig }, {})

      expect(StorageInterface.writeLog).toHaveBeenCalledTimes(2)
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('Starting feature iterator ', LogLevel.DEBUG, 'IteratorModule', '')
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('Finished running feature iterator', LogLevel.DEBUG, 'IteratorModule', '')
    })

    it('should have static log method that calls StorageInterface.writeLog', () => {
      Iterator.log('test', LogLevel.DEBUG)
      expect(StorageInterface.writeLog).toHaveBeenCalled()
    })

    it('should use Loglevel enum as default', () => {
      Iterator.log('test')
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('test', 'info', 'IteratorModule', '')
    })

    it('should use its own class name for logging', () => {
      Iterator.log('test', LogLevel.ERROR)
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('test', 'error', 'IteratorModule', '')
    })

    it('should use the provided error object for logging', () => {
      const error = new Error('test error')
      Iterator.log('test', LogLevel.ERROR, error)
      expect(StorageInterface.writeLog).toHaveBeenCalledWith('test', 'error', 'IteratorModule', error)
    })
  })
})

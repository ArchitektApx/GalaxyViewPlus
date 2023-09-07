/* eslint-disable no-new */
import Iterator         from '../../src/features/Iterator.js'
import InactiveRecolor  from '../../src/features/inactiverecolor/InactiveRecolor.js'
import RangeInfo        from '../../src/features/rangeinfo/RangeInfo.js'
import RankRecolor      from '../../src/features/rankrecolor/RankRecolor.js'
import UsernameRecolor  from '../../src/features/usernameRecolor/UsernameRecolor.js'
import StorageInterface from '../../src/storageinterface/StorageInterface.js'

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

  it('should log when constructor and invokeFeatures are called', () => {
    const featureConfig = []

    new Iterator({ features: featureConfig }, {})

    expect(StorageInterface.writeLog).toHaveBeenCalledTimes(2)
    expect(StorageInterface.writeLog).toHaveBeenCalledWith('Starting feature iterator ', 'debug', 'IteratorModule', undefined)
    expect(StorageInterface.writeLog).toHaveBeenCalledWith('Finished running feature iterator', 'debug', 'IteratorModule', undefined)
  })
})

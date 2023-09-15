import StatsDataFetcherMock from '../../../src/statisticsinterface/StatsDataFetcher.js'
import StatsDataLoaderMock  from '../../../src/statisticsinterface/StatsDataLoader.js'
import StorageInterfaceMock from '../../../src/storageinterface/StorageInterface.js'

jest.mock('../../../src/storageinterface/StorageInterface.js', () => ({
  getStorageItem : jest.fn(),
  setStorageItem : jest.fn(),
  writeLog       : jest.fn(),
}))

jest.mock('../../../src/statisticsinterface/StatsDataFetcher.js', () => ({
  fetchStatsJson: jest.fn(),
}))

jest.mock('../../../src/statisticsinterface/StatsDataLoader.js', () => ({
  fromStorage: jest.fn(),
}))

export { default as StorageInterfaceMock } from '../../../src/storageinterface/StorageInterface.js'
export { default as StatsDataFetcherMock } from '../../../src/statisticsinterface/StatsDataFetcher.js'
export { default as StatsDataLoaderMock } from '../../../src/statisticsinterface/StatsDataLoader.js'

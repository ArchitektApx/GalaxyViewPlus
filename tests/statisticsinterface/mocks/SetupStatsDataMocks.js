jest.mock('../../../src/storageinterface/StorageInterface.js', () => ({
  getStorageItem : jest.fn(),
  setStorageItem : jest.fn(),
  writeLog       : jest.fn(),
}))

jest.mock('../../../src/statsdata/StatsDataFetcher.js', () => ({
  fetchStatsJson: jest.fn(),
}))

jest.mock('../../../src/statsdata/StatsDataLoader.js', () => ({
  fromStorage: jest.fn(),
}))

export { default as StorageInterfaceMock } from '../../../src/storageinterface/StorageInterface.js'
export { default as StatsDataFetcherMock } from '../../../src/statsdata/StatsDataFetcher.js'
export { default as StatsDataLoaderMock } from '../../../src/statsdata/StatsDataLoader.js'

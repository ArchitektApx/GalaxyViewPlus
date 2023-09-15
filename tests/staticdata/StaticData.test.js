import StaticData from '../../src/staticdata/StaticData.js'

describe('StaticData', () => {
  it('should have required static properties', () => {
    expect(StaticData.CLEANUP_INTERVAL).toBeDefined()
    expect(StaticData.DEBUG_LOG_MAX_ENTRIES).toBeDefined()
    expect(StaticData.DEFAULT_CONFIG).toBeDefined()
    expect(StaticData.STORAGE_KEYS).toBeDefined()
    expect(StaticData.STORAGE_TYPE).toBeDefined()
    expect(StaticData.UPDATE_INTERVAL).toBeDefined()
    expect(StaticData.UPDATE_INTERVAL_DELAY).toBeDefined()
    expect(StaticData.JSON_PATCH_USERDATA).toBeDefined()
  })

  it('should have the correct keys for STORAGE_KEYS', () => {
    const expectedKeys = [
      'CLEANUP_STATUS',
      'DEBUG_LOG',
      'STATS_DATA',
      'UPDATE_STATUS',
      'USER_CONFIG',
    ]

    expect(Object.keys(StaticData.STORAGE_KEYS)).toEqual(expectedKeys)
  })

  it('should have correct properties for DEFAULT_CONFIG', () => {
    const expectedKeys = [
      'configVersion',
      'features',
      'userInterface',
    ]

    expect(Object.keys(StaticData.DEFAULT_CONFIG)).toEqual(expectedKeys)
  })
})

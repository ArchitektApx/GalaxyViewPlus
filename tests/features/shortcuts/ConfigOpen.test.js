import ConfigOpen from '../../../src/features/shortcuts/ConfigOpen.js'

describe('ConfigOpen', () => {
  // Mock the global document object
  let configDetailsMock

  beforeEach(() => {
    configDetailsMock = { open: false }
    global.document   = {
      querySelector: jest.fn().mockReturnValue(configDetailsMock),
    }
  })

  it('should open the settings interface details', () => {
    ConfigOpen.execute()

    // Assert that querySelector was called with the correct selector
    expect(document.querySelector).toHaveBeenCalledWith('#settings-interface-details')

    // Verify the open property was set to true
    expect(configDetailsMock.open).toBe(true)
  })
})

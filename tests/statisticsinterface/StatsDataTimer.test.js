import StatsDataTimer from '../../src/statisticsinterface/StatsDataTimer.js' // Adjust the import path as needed

describe('StatsDataTimer', () => {
  describe('calculate', () => {
    // Test case 1: Calculate last interval time with a current time of 00:00
    it('calculates last interval time for 00:00', () => {
      // Mock the current time to be 00:00
      const currentTime  = new Date('2023-01-01T00:00:00')
      const originalDate = global.Date
      global.Date        = jest.fn(() => currentTime)

      // Calculate last interval time
      const result = StatsDataTimer.calculate()

      // Expected last interval time is 18:00
      const expectedTime = new Date('2023-01-01T18:00:00')

      expect(result).toEqual(expectedTime)

      // Restore the original Date object
      global.Date = originalDate
    })

    // Test case 2: Calculate last interval time for 08:30
    it('calculates last interval time for 08:30', () => {
      // Mock the current time to be 08:30
      const currentTime  = new Date('2023-01-01T08:30:00')
      const originalDate = global.Date
      global.Date        = jest.fn(() => currentTime)

      // Calculate last interval time
      const result = StatsDataTimer.calculate()

      // Expected last interval time is 06:00
      const expectedTime = new Date('2023-01-01T06:00:00')

      expect(result).toEqual(expectedTime)

      // Restore the original Date object
      global.Date = originalDate
    })

    // Test case 3: Calculate last interval time for 14:45
    it('calculates last interval time for 14:45', () => {
      // Mock the current time to be 14:45
      const currentTime  = new Date('2023-01-01T14:45:00')
      const originalDate = global.Date
      global.Date        = jest.fn(() => currentTime)

      // Calculate last interval time
      const result = StatsDataTimer.calculate()

      // Expected last interval time is 12:00
      const expectedTime = new Date('2023-01-01T12:00:00')

      expect(result).toEqual(expectedTime)

      // Restore the original Date object
      global.Date = originalDate
    })
  })
})

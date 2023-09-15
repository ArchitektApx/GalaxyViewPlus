/* eslint-disable sonarjs/no-duplicate-string */
import LogLevel         from '../../src/enum/LogLevel.js'
import StaticData       from '../../src/staticdata/StaticData.js'
import StatsDataParser  from '../../src/statisticsinterface/StatsDataParser.js' // Adjust the import path as needed
import StorageInterface from '../../src/storageinterface/StorageInterface.js'
import Validator        from '../../src/validator/Validator.js'

jest.mock('../../src/storageinterface/StorageInterface.js')
jest.mock('../../src/validator/Validator.js')

describe('StatsDataParser', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('extractFromStatsObject', () => {
    it('correctly extracts and stores stats data', () => {
      const statsObject = [
        {
          playerId      : 1,
          playerName    : 'Player 1',
          allianceId    : 101,
          allianceName  : 'Alliance 1',
          rank          : 3,
          researchRank  : 2,
          buildingRank  : 4,
          fleetRank     : 5,
          defensiveRank : 1,
        },
      ]

      // Mock Validator.getTimestamp to return a specific value
      Validator.getTimestamp.mockReturnValue(1_234_567_890)

      // Mock StorageInterface.setStorageItem to capture the calls
      const storageCalls = []
      StorageInterface.setStorageItem.mockImplementation((key, value) => {
        storageCalls.push({ key, value })
      })

      // Call the method
      const result = StatsDataParser.extractFromStatsObject(statsObject)

      // Assertions
      expect(result).toEqual({
        1: {
          allianceId    : 101,
          allianceName  : 'Alliance 1',
          buildingRank  : 4,
          defensiveRank : 1,
          fleetRank     : 5,
          playerName    : 'Player 1',
          rank          : 3,
          researchRank  : 2,
        },
      })

      // Verify the storage calls
      expect(storageCalls).toEqual([
        {
          key   : StaticData.STORAGE_KEYS.UPDATE_STATUS,
          value : {
            status    : StatsDataParser.STATUS_IN_PROGRESS, // Initial status
            timestamp : 1_234_567_890,
          },
        },
        {
          key   : StaticData.STORAGE_KEYS.STATS_DATA,
          value : result,
        },
        {
          key   : StaticData.STORAGE_KEYS.UPDATE_STATUS,
          value : {
            status    : StatsDataParser.STATUS_FINISHED, // Updated status
            timestamp : 1_234_567_890,
          },
        },
      ])
    })
  })

  describe('log', () => {
    it('calls StorageInterface.writeLog with the correct parameters', () => {
      const message = 'Test log message'
      const level   = LogLevel.DEBUG
      const error   = 'Test error message'

      StatsDataParser.log(message, level, error)

      expect(StorageInterface.writeLog).toHaveBeenCalledWith(message, level, 'StatsDataParser', error)
    })

    it('calls StorageInterface.writeLog with default LogLevel.INFO and empty error', () => {
      const message = 'Test log message'

      StatsDataParser.log(message)

      expect(StorageInterface.writeLog).toHaveBeenCalledWith(message, LogLevel.INFO, 'StatsDataParser', '')
    })
  })

  describe('processStatsData', () => {
    it('correctly processes stats data from a response', () => {
      const response = {
        responseText: JSON.stringify([
          {
            playerId      : 1,
            playerName    : 'Player 1',
            allianceId    : 101,
            allianceName  : 'Alliance 1',
            rank          : 3,
            researchRank  : 2,
            buildingRank  : 4,
            fleetRank     : 5,
            defensiveRank : 1,
          },
        ]),
      }

      Validator.getTimestamp.mockReturnValue(1_234_567_890)

      const result = StatsDataParser.processStatsData(response)

      expect(result).toEqual({
        1: {
          allianceId    : 101,
          allianceName  : 'Alliance 1',
          buildingRank  : 4,
          defensiveRank : 1,
          fleetRank     : 5,
          playerName    : 'Player 1',
          rank          : 3,
          researchRank  : 2,
        },
      })

      expect(Validator.getTimestamp).toHaveBeenCalled()
    })
  })
})

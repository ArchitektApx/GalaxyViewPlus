import ChangeSortingCommand from '../../../src/configmanager/commands/ChangeSortingCommand.js'

describe('ChangeSortingCommand', () => {
  describe('Constructor', () => {
    it('should initialize the properties', () => {
      const config    = { features: [] }
      const inputData = {}

      const command = new ChangeSortingCommand(config, inputData)

      expect(command.config).toBe(config)
      expect(command.inputData).toBe(inputData)
    })
  })

  describe('execute', () => {
    let config

    beforeEach(() => {
      config = {
        features: [
          { htmlPrefix: 'test', sortData: false },
          { htmlPrefix: 'demo', sortData: false },
        ],
      }
    })

    it('should update sortData for the matched feature', () => {
      const inputData = { id: 'test-123', checked: true }
      const command   = new ChangeSortingCommand(config, inputData)

      command.execute()

      expect(config.features[0].sortData).toBe(true)
      expect(config.features[1].sortData).toBe(false)
    })

    it('should not update sortData for non-matched features', () => {
      const inputData = { id: 'unknown-123', checked: true }
      const command   = new ChangeSortingCommand(config, inputData)

      command.execute()

      expect(config.features[0].sortData).toBe(false)
      expect(config.features[1].sortData).toBe(false)
    })
  })
})

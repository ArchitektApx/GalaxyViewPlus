import ChangeStatusCommand from '../../../src/configmanager/commands/ChangeStatusCommand.js'

describe('ChangeStatusCommand', () => {
  describe('Constructor', () => {
    it('should initialize the properties', () => {
      const config    = { features: [] }
      const inputData = {}

      const command = new ChangeStatusCommand(config, inputData)

      expect(command.config).toBe(config)
      expect(command.inputData).toBe(inputData)
    })
  })

  describe('execute', () => {
    let config

    beforeEach(() => {
      config = {
        features: [
          { htmlPrefix: 'test', active: false },
          { htmlPrefix: 'demo', active: false },
        ],
      }
    })

    it('should update active status for the matched feature', () => {
      const inputData = { id: 'test-123', checked: true }
      const command   = new ChangeStatusCommand(config, inputData)

      command.execute()

      expect(config.features[0].active).toBe(true)
      expect(config.features[1].active).toBe(false)
    })

    it('should not update active status for non-matched features', () => {
      const inputData = { id: 'unknown-123', checked: true }
      const command   = new ChangeStatusCommand(config, inputData)

      command.execute()

      expect(config.features[0].active).toBe(false)
      expect(config.features[1].active).toBe(false)
    })
  })
})

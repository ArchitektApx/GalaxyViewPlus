import ResetConfigCommand from '../../../src/configmanager/commands/ResetConfigCommand.js'

describe('ResetConfigCommand', () => {
  describe('Constructor', () => {
    it('should initialize with the provided reset function', () => {
      const mockResetFunction = jest.fn()

      const command = new ResetConfigCommand(mockResetFunction)

      expect(command.resetFunction).toBe(mockResetFunction)
    })
  })

  describe('execute', () => {
    it('should call the provided reset function', () => {
      const mockResetFunction = jest.fn()
      const command           = new ResetConfigCommand(mockResetFunction)

      command.execute()

      expect(mockResetFunction).toHaveBeenCalledTimes(1)
    })
  })
})

import SaveConfigCommand from '../../../src/configmanager/commands/SaveConfigCommand.js'

describe('SaveConfigCommand', () => {
  describe('Constructor', () => {
    it('should initialize with the provided save function', () => {
      const mockSaveFunction = jest.fn()

      const command = new SaveConfigCommand(mockSaveFunction)

      expect(command.saveFunction).toBe(mockSaveFunction)
    })
  })

  describe('execute', () => {
    it('should call the provided save function', () => {
      const mockSaveFunction = jest.fn()
      const command          = new SaveConfigCommand(mockSaveFunction)

      command.execute()

      expect(mockSaveFunction).toHaveBeenCalledTimes(1)
    })
  })
})

import RemoveRowCommand from '../../../src/configmanager/commands/RemoveRowCommand.js'

describe('RemoveRowCommand', () => {
  describe('Constructor', () => {
    it('should initialize the properties', () => {
      const config     = { features: [] }
      const removeData = []

      const command = new RemoveRowCommand(config, removeData)

      expect(command.config).toBe(config)
      expect(command.removeData).toEqual(removeData)
    })
  })

  describe('execute', () => {
    let config

    beforeEach(() => {
      config = {
        features: [
          { htmlPrefix: 'test', data: [ { key: 'k1', value: 'v1' }, { key: 'k2', value: 'v2' } ] },
          { htmlPrefix: 'demo', data: [ { key: 'kA', value: 'vA' } ] },
        ],
      }
    })

    it('should remove the matching row from feature data', () => {
      const removeData = [ { id: 'test-123', value: 'k1' }, { id: 'test-456', value: 'v1' } ]
      const command    = new RemoveRowCommand(config, removeData)

      command.execute()

      expect(config.features[0].data).toEqual([ { key: 'k2', value: 'v2' } ])
      expect(config.features[1].data).toEqual([ { key: 'kA', value: 'vA' } ])
    })

    it('should not remove rows for non-matched data', () => {
      const removeData = [ { id: 'test-789', value: 'k3' }, { id: 'test-1011', value: 'v3' } ]
      const command    = new RemoveRowCommand(config, removeData)

      command.execute()

      expect(config.features[0].data).toEqual([ { key: 'k1', value: 'v1' }, { key: 'k2', value: 'v2' } ])
      expect(config.features[1].data).toEqual([ { key: 'kA', value: 'vA' } ])
    })

    it('should not proceed if removeData is not an array of length 2', () => {
      const removeData = [ { id: 'test-123', value: 'k1' } ]
      const command    = new RemoveRowCommand(config, removeData)

      command.execute()

      expect(config.features[0].data).toEqual([ { key: 'k1', value: 'v1' }, { key: 'k2', value: 'v2' } ])
      expect(config.features[1].data).toEqual([ { key: 'kA', value: 'vA' } ])
    })
  })
})

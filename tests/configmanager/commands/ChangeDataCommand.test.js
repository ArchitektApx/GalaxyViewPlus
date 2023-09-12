import ChangeDataCommand from '../../../src/configmanager/commands/ChangeDataCommand.js'

describe('ChangeDataCommand', () => {
  describe('Constructor', () => {
    it('should initialize the properties', () => {
      const config    = { features: [] }
      const inputData = {}

      const command = new ChangeDataCommand(config, inputData)

      expect(command.config).toBe(config)
      expect(command.inputData).toBe(inputData)
    })
  })

  describe('execute', () => {
    let config

    beforeEach(() => {
      config = {
        features: [
          { htmlPrefix: 'test', data: [ { key: 'test-123', value: '' } ] },
        ],
      }
    })

    it('should call updateKeyValueData for an array input', () => {
      const inputData = [ { id: 'test-123' }, {} ]
      const command   = new ChangeDataCommand(config, inputData)
      const spy       = jest.spyOn(ChangeDataCommand, 'updateKeyValueData')

      command.execute()

      expect(spy).toHaveBeenCalled()
    })

    it('should call updateValueData for a non-array input', () => {
      const inputData = { id: 'test-123', name: 'test-123', value: 'newValue' }
      const command   = new ChangeDataCommand(config, inputData)
      const spy       = jest.spyOn(ChangeDataCommand, 'updateValueData')

      command.execute()

      expect(spy).toHaveBeenCalled()
    })
  })

  describe('updateKeyValueData', () => {
    it('should update existing data', () => {
      const data = [ { key: 'old', value: 'value1' } ]

      ChangeDataCommand.updateKeyValueData(data, { lastvalue: 'old', value: 'new' }, { lastvalue: 'value1', value: 'value2' })

      expect(data).toEqual([ { key: 'new', value: 'value2' } ])
    })

    it('should add new data', () => {
      const data = [ { key: 'old', value: 'value1' } ]

      ChangeDataCommand.updateKeyValueData(data, { lastvalue: 'new', value: 'new' }, { lastvalue: 'value2', value: 'value2' })

      expect(data).toEqual([ { key: 'old', value: 'value1' }, { key: 'new', value: 'value2' } ])
    })
  })

  describe('updateValueData', () => {
    let data

    beforeEach(() => {
      data = [
        { key: 'test', value: '' },
        { key: 'checkbox', checked: false },
        { key: 'radio1', value: '1', checked: false },
        { key: 'radio2', value: '2', checked: true },
      ]
    })

    it('should update value', () => {
      ChangeDataCommand.updateValueData(data, { name: 'test', value: 'newValue' })
      expect(data[0].value).toBe('newValue')
    })

    it('should update checkbox', () => {
      ChangeDataCommand.updateValueData(data, { name: 'checkbox', type: 'checkbox', checked: true, value: 'newValue' })
      expect(data[1].checked).toBe(true)
    })

    it('should update radio', () => {
      ChangeDataCommand.updateValueData(data, { type: 'radio', value: '1' })
      expect(data[2].checked).toBe(true)
      expect(data[3].checked).toBe(false)
    })
  })
})

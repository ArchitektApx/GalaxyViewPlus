import Mindash from '../../mindash/Mindash.js'

export default class ChangeDataCommand {
  constructor(config, inputData) {
    this.config    = config
    this.inputData = inputData
  }

  execute() {
    // refactor sometime in the future?
    const htmlPrefix = Array.isArray(this.inputData)
      ? this.inputData[0].id.split('-')[0]
      : this.inputData.id.split('-')[0]

    const { data } = this.config.features.find(feature => feature.htmlPrefix === htmlPrefix)

    Array.isArray(this.inputData)
      ? ChangeDataCommand.updateKeyValueData(data, this.inputData[0], this.inputData[1])
      : ChangeDataCommand.updateValueData(data, this.inputData)
  }

  static updateKeyValueData(data, key, value) {
    // check if there is a line were both key and value match the lastvalue of the input,
    // if not we can push it and return, even if it might be a copy
    if (!(data.some(row => row.key === key.lastvalue && row.value === value.lastvalue))) {
      data.push({ key: key.value, value: value.value })

      return
    }

    // get the row that is matching
    const row = data.find(
      datarow => datarow.key === key.lastvalue
      && datarow.value === value.lastvalue
    )

    // update the row with the new values, we don't need to know exactly which one was changed
    row.key   = key.value
    row.value = value.value
  }

  static updateValueData(data, value) {
    if (!Mindash.isThisOrThat(value.type, 'checkbox', 'radio')) {
      const valueRow = data.find(datarow => datarow.key === value.name)

      valueRow.value = value.value
    }

    if (value.type === 'checkbox') {
      const valueRow = data.find(datarow => datarow.key === value.name)

      valueRow.checked = value.checked
    }

    if (value.type === 'radio') {
      data.forEach((datarow) => {
        datarow.checked = datarow.value === value.value
      })
    }
  }
}

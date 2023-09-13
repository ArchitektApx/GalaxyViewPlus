/**
 * The ChangeDataCommand is used to change the data of the config.
 * It is used in the actionCallback of the ConfigManager.
 * @class
 */
export default class ChangeDataCommand {
  /**
   * Creates a new ChangeDataCommand instance.
   * @param   {object}            config    - The config object
   * @param   {object | Array}    inputData - The data to change
   * @returns {ChangeDataCommand}           - The ChangeDataCommand instance
   * @class
   */
  constructor(config, inputData) {
    this.config    = config
    this.inputData = inputData
  }

  /**
   * Executes the command.
   * @returns {void}
   * @public
   */
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

  /**
   * Updates the data of the config.
   * @param   {Array}  data  - The data to update
   * @param   {object} key   - The key to update
   * @param   {object} value - The value to update
   * @returns {void}
   * @public
   * @static
   */
  static updateKeyValueData(data, key, value) {
    const matchingRow = data.find(row => row.key === key.lastvalue && row.value === value.lastvalue)

    if (matchingRow) {
      matchingRow.key   = key.value
      matchingRow.value = value.value
    } else {
      data.push({ key: key.value, value: value.value })
    }
  }

  /**
   * Updates the data of the config.
   * @param   {Array}  data  - The data to update
   * @param   {object} value - The value to update
   * @returns {void}
   * @public
   * @static
   */
  static updateValueData(data, value) {
    if (value.type === 'radio') {
      ChangeDataCommand.updateValueDataRadio(data, value)
      return
    }

    const valueRow = data.find(datarow => datarow.key === value.name)
    value.type === 'checkbox'
      ? valueRow.checked = value.checked
      : valueRow.value   = value.value
  }

  /**
   * Updates the data of the config for edge case of radio buttons.
   * @param   {Array}  data  - The data to update
   * @param   {object} value - The value to update
   * @returns {void}
   * @public
   * @static
   */
  static updateValueDataRadio(data, value) {
    data.forEach((datarow) => { datarow.checked = datarow.value === value.value })
  }
}

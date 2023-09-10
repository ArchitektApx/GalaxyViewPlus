/**
 * ChangeStatusCommand - The command to change the sorting of a feature.
 * It is used in the actionCallback of the ConfigManager.
 * @class
 * @param {object} config - The config object
 * @param {object} inputData - The data to change
 * @returns {ChangeStatusCommand} - The ChangeStatusCommand instance
 */
export default class ChangeStatusCommand {
  /**
   * Creates a new ChangeStatusCommand instance.
   * @param {object} config - The config object
   * @param {object} inputData - The data to change
   * @returns {ChangeStatusCommand} - The ChangeStatusCommand instance
   */
  constructor(config, inputData) {
    this.config    = config
    this.inputData = inputData
  }

  /**
   * Executes the command.
   * @returns {void}
   */
  execute() {
    const htmlPrefix      = this.inputData.id.split('-')[0]
    const featureSettings = this.config.features.find(feature => feature.htmlPrefix === htmlPrefix)

    if (featureSettings) {
      featureSettings.active = this.inputData.checked
    }
  }
}

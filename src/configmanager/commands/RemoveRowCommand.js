/**
 * RemoveRowCommand - The command to change the sorting of a feature.
 * It is used in the actionCallback of the ConfigManager.
 * @class
 * @param {object} config - The config object
 * @param {object} removeData - The data row to remove
 * @returns {RemoveRowCommand} - The RemoveRowCommand instance
 */
export default class RemoveRowCommand {
  /**
   * Creates a new RemoveRowCommand instance.
   * @param {object} config - The config object
   * @param {object} removeData - The data row to remove
   * @returns {RemoveRowCommand} - The RemoveRowCommand instance
   */
  constructor(config, removeData) {
    this.config     = config
    this.removeData = removeData
  }

  /**
   * Executes the command.
   * @returns {void}
   */
  execute() {
    // Only Key Value Pairs can be removed so return if that's not the case
    if (!Array.isArray(this.removeData) || this.removeData.length !== 2) {
      return
    }

    const prefix  = this.removeData[0].id.split('-')[0]
    const feature = this.config.features.find(
      featureSettings => featureSettings.htmlPrefix === prefix
    )

    const filtered = feature.data.filter(
      row => !(
        row.key === this.removeData[0].value
        && row.value === this.removeData[1].value
      )
    )

    feature.data = filtered
  }
}

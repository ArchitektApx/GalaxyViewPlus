/**
 * RemoveRowCommand - The command to change the sorting of a feature.
 * It is used in the actionCallback of the ConfigManager.
 * @class
 */
export default class RemoveRowCommand {
  /**
   * Creates a new RemoveRowCommand instance.
   * @param   {object}           config     - The config object
   * @param   {object}           removeData - The data row to remove
   * @returns {RemoveRowCommand}            - The RemoveRowCommand instance
   * @class
   */
  constructor(config, removeData) {
    this.config     = config
    this.removeData = removeData
  }

  /**
   * Executes the command.
   * @returns {void}
   * @public
   */
  execute() {
    // Only Key Value Pairs can be removed so return if that's not the case
    if (Array.isArray(this.removeData) && this.removeData.length === 2) {
      const prefix  = this.removeData[0].id.split('-')[0]
      const feature = this.config.features.find(
        featureSettings => featureSettings.htmlPrefix === prefix
      )

      feature.data = this.#filterData(feature.data)
    }
  }

  /**
   * Filters the data of the feature (= removes matching rows).
   * @param   {Array} featuredata - The data of the feature
   * @returns {Array}             - The filtered data
   * @private
   */
  #filterData(featuredata) {
    return featuredata.filter(
      row => !(row.key === this.removeData[0].value && row.value === this.removeData[1].value)
    )
  }
}

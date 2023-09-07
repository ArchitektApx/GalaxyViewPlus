export default class RemoveRowCommand {
  constructor(config, removeData) {
    this.config     = config
    this.removeData = removeData
  }

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

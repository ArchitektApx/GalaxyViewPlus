export default class ChangeSortingCommand {
  constructor(config, inputData) {
    this.config    = config
    this.inputData = inputData
  }

  execute() {
    const htmlPrefix      = this.inputData.id.split('-')[0]
    const featureSettings = this.config.features.find(feature => feature.htmlPrefix === htmlPrefix)

    if (featureSettings) {
      featureSettings.sortData = this.inputData.checked
    }
  }
}

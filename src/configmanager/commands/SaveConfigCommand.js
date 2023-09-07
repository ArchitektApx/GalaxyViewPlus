export default class SaveConfigCommand {
  constructor(saveFunction) {
    this.saveFunction = saveFunction
  }

  execute() {
    this.saveFunction()
  }
}

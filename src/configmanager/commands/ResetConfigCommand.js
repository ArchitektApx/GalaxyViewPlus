export default class ResetConfigCommand {
  constructor(resetFunction) {
    this.resetFunction = resetFunction
  }

  execute() {
    this.resetFunction()
  }
}

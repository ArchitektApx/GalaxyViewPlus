/**
 * SaveConfigCommand is a command that saves the config
 * @class
 */
export default class SaveConfigCommand {
  /**
   * Creates a new SaveConfigCommand instance.
   * @param   {Function}          saveFunction - The function that saves the config
   * @returns {SaveConfigCommand}              - The SaveConfigCommand instance
   * @class
   */
  constructor(saveFunction) {
    this.saveFunction = saveFunction
  }

  /**
   * Executes the command.
   * @returns {void}
   * @public
   */
  execute() {
    this.saveFunction()
  }
}

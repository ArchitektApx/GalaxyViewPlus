/**
 * SaveConfigCommand is a command that saves the config
 * @class
 * @param {Function} saveFunction - The function that saves the config
 * @returns {SaveConfigCommand} - The SaveConfigCommand instance
 */
export default class SaveConfigCommand {
  /**
   * Creates a new SaveConfigCommand instance.
   * @param {Function} saveFunction - The function that saves the config
   * @returns {SaveConfigCommand} - The SaveConfigCommand instance
   */
  constructor(saveFunction) {
    this.saveFunction = saveFunction
  }

  /**
   * Executes the command.
   * @returns {void}
   */
  execute() {
    this.saveFunction()
  }
}

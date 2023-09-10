/**
 * ResetConfigCommand is a command that resets the config to the default config
 * @class
 * @param {Function} resetFunction - The function that resets the config
 * @returns {ResetConfigCommand} - The ResetConfigCommand instance
 */
export default class ResetConfigCommand {
  /**
   * Creates a new ResetConfigCommand instance.
   * @param {Function} resetFunction - The function that resets the config
   * @returns {ResetConfigCommand} - The ResetConfigCommand instance
   */
  constructor(resetFunction) {
    this.resetFunction = resetFunction
  }

  /**
   * Executes the command.
   * @returns {void}
   */
  execute() {
    this.resetFunction()
  }
}

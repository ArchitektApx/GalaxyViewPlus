/**
 * ResetConfigCommand is a command that resets the config to the default config
 * @class
 */
export default class ResetConfigCommand {
  /**
   * Creates a new ResetConfigCommand instance.
   * @param   {Function}           resetFunction - The function that resets the config
   * @returns {ResetConfigCommand}               - The ResetConfigCommand instance
   * @class
   */
  constructor(resetFunction) {
    this.resetFunction = resetFunction
  }

  /**
   * Executes the command.
   * @returns {void}
   * @public
   */
  execute() {
    this.resetFunction()
  }
}

/**
 * Sets the config details open property to true.
 * @class
 */
export default class ConfigOpen {
  /**
   * Executes the command.
   * @returns {void}
   * @public
   * @static
   */
  static execute() {
    const configDetails = document.querySelector('#settings-interface-details')

    configDetails.open = true
  }
}

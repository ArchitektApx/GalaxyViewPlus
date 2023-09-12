/**
 * SyncButtonShortcut feature - adds a event listener to the document which executes the syncsys function when the e key is pressed.
 * @class
 */
export default class SyncButtonShortcut {
  /**
   * adds a event listener to the document which executes the syncsys function when the e key is pressed.
   * @returns {void}
   * @public
   * @static
   */
  static execute() {
    document.addEventListener('keydown', (event_) => {
      if (event_.key !== 'e') { return }

      // eslint-disable-next-line no-restricted-globals, no-script-url
      location.assign('javascript:syncsys()')
      document.querySelector('#gala_sync').value = 'Synced'
    })
  }
}

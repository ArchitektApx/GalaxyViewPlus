export default class SyncButtonShortcut {
  static execute() {
    document.addEventListener('keydown', (event_) => {
      if (event_.key !== 'e') { return }

      // eslint-disable-next-line no-restricted-globals, no-script-url
      location.assign('javascript:syncsys()')
      document.querySelector('#gala_sync').value = 'Synced'
    })
  }
}

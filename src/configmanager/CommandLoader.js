import ChangeDataCommand   from './commands/ChangeDataCommand.js'
import ChangeStatusCommand from './commands/ChangeStatusCommand.js'
import RemoveRowCommand    from './commands/RemoveRowCommand.js'
import ResetConfigCommand  from './commands/ResetConfigCommand.js'
import SaveConfigCommand   from './commands/SaveConfigCommand.js'

/**
 * loads command classes and builds the command map from them
 */
export default class CommandLoader {
  /**
   * loads command classes and builds the command map from them
   * @param   {object}   runningConfig - reference to the running config
   * @param   {Function} resetConfig   - bound function to reset the config
   * @param   {Function} saveConfig    - bound function to save the config
   * @returns {object}                 - The command map
   */
  static load(runningConfig, resetConfig, saveConfig) {
    return {
      changeData   : { class: ChangeDataCommand,    systemInput: runningConfig },
      changeStatus : { class: ChangeStatusCommand,  systemInput: runningConfig },
      removeRow    : { class: RemoveRowCommand,     systemInput: runningConfig },
      resetConfig  : { class: ResetConfigCommand,   systemInput: resetConfig   },
      saveConfig   : { class: SaveConfigCommand,    systemInput: saveConfig    },
    }
  }
}

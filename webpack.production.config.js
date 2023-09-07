import path                 from 'node:path'
import TerserPlugin         from 'terser-webpack-plugin'
import webpack              from 'webpack'
import { UserscriptPlugin } from 'webpack-userscript'
import packagejson          from './package.json' assert { type: 'json' }

const isDevelopment = false
const mode          = isDevelopment ? 'development' : 'production'

const scriptName         = 'GalaxyViewPlus'
const pathOut            = path.resolve('./')
const entryPoint         = path.resolve('./', 'src', `${ scriptName }.js`)
const tamperMonkeyHeader = {
  name        : scriptName,
  version     : packagejson.version,
  description : packagejson.description,
  author      : packagejson.author,
  homepage    : packagejson.homepage,
  match       : 'https://pr0game.com/*/game.php?*page=galaxy*',
  grant       : [
    'GM_addStyle',
    'GM.xmlHttpRequest',
  ],
  connect: 'pr0game.com',
}

export default {
  mode   : mode,
  entry  : entryPoint,
  output : {
    path     : pathOut,
    filename : `${ scriptName }.user.js`,
  },
  plugins: [
    new UserscriptPlugin({
      updateBaseURL   : 'https://raw.githubusercontent.com/ArchitektApx/GalaxyViewPlus/master/',
      downloadBaseURL : 'https://raw.githubusercontent.com/ArchitektApx/GalaxyViewPlus/master/',
      headers         : tamperMonkeyHeader,
      metajs          : false,
      pretty          : true,
    }),
    new webpack.DefinePlugin({
      __buildMode__  : JSON.stringify(mode),
      __isDevBuild__ : JSON.stringify(isDevelopment),
      __scriptName__ : JSON.stringify(scriptName),
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
}

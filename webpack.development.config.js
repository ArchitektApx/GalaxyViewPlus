import path                 from 'node:path'
import webpack              from 'webpack' // eslint-disable-line import/no-extraneous-dependencies
import { UserscriptPlugin } from 'webpack-userscript' // eslint-disable-line import/no-extraneous-dependencies
import packagejson          from './package.json' assert { type: 'json' }

const isDevelopment = true
const mode          = isDevelopment ? 'development' : 'production'

const scriptName         = 'GalaxyViewPlus'
const pathOut            = path.resolve('./', 'dist')
const entryPoint         = path.resolve('./', 'src', `${ scriptName }.js`)
const tamperMonkeyHeader = {
  name        : scriptName,
  version     : packagejson.version,
  description : packagejson.description,
  author      : packagejson.author,
  match       : 'https://pr0game.com/*/game.php?*page=galaxy*',
  grant       : [
    'GM_addStyle',
    'GM.xmlHttpRequest',
  ],
  connect: 'pr0game.com',
}

tamperMonkeyHeader.version += '-build.[buildTime]'

export default {
  mode   : mode,
  entry  : entryPoint,
  output : {
    path     : pathOut,
    filename : `${ scriptName }.user.js`,
  },
  devtool   : false,
  devServer : {
    hot             : false,
    client          : false,
    webSocketServer : false,
    devMiddleware   : {
      writeToDisk: true,
    },
  },
  plugins: [
    new UserscriptPlugin({
      headers     : tamperMonkeyHeader,
      proxyScript : {
        baseUrl  : `file://${ pathOut }`,
        filename : '[basename].proxy.user.js',
        enable   : isDevelopment,
      },
    }),
    new webpack.DefinePlugin({
      __buildMode__  : JSON.stringify(mode),
      __isDevBuild__ : JSON.stringify(isDevelopment),
      __scriptName__ : JSON.stringify(scriptName),
    }),
  ],
}

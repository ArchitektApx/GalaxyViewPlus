import StaticData from '../staticdata/StaticData.js'

export default class StatsDataFetcher {
  static async fetchStatsJson() {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method  : StaticData.HTTP_METHOD,
        onerror : reject,
        onload  : resolve,
        timeout : StaticData.HTTP_REQUEST_TIMEOUT,
        url     : StaticData.STATS_URL,
      })
    })
  }
}

/**
 * The StatsDataFetcher class is used to fetch the stats data from the server.
 * @class
 */
export default class StatsDataFetcher {
  static HTTP_METHOD           = 'GET'
  static HTTP_REQUEST_TIMEOUT  = 5000
  static STATS_URL = 'https://pr0game.com/stats_Universe_2.json'

  /**
   * Fetches the stats data from the server.
   * @returns {Promise} - The promise that resolves with the stats data
   * @throws {Error} - Throws an error if the request fails
   * @async
   * @public
   * @static
   */
  static async fetchStatsJson() {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method  : StatsDataFetcher.HTTP_METHOD,
        onerror : reject,
        onload  : resolve,
        timeout : StatsDataFetcher.HTTP_REQUEST_TIMEOUT,
        url     : StatsDataFetcher.STATS_URL,
      })
    })
  }
}

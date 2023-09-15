/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
/* eslint-disable jsdoc/require-jsdoc */
/**
 * This reporter will print out the slowest jest tests
 * slightly modified version of https://stackoverflow.com/a/69201981
 * @class
 */
export default class JestSlowTestReporter {
  #globalConfig
  #options
  #slowTests

  constructor(globalConfig, options) {
    this.#globalConfig = globalConfig
    this.#options      = options
    this.#slowTests    = []
  }

  /**
   * Called when the test run finishes
   * @public
   */
  onRunComplete() {
    console.log()

    this.#slowTests.sort((a, b) => b.duration - a.duration)

    const rootPathRegex = new RegExp(`^${ process.cwd() }`)
    const slowestTests  = this.#slowTests.slice(0, (this.#options.numTests || 10))
    const slowTestTime  = this.#slowTestTime(slowestTests)
    const allTestTime   = this.#allTestTime()
    const percentTime   = (slowTestTime / allTestTime) * 100

    console.log(`Top ${ slowestTests.length } slowest examples (${ slowTestTime / 1000 } seconds,`
                    + ` ${ percentTime.toFixed(1) }% of total time):`)

    slowestTests.forEach((element) => {
      const {
        duration,
        fullName,
        headerName,
      } = element
      const filePath      = element.filePath.replace(rootPathRegex, '.')
      const coloredstring = duration > 150
        ? `\u001B[37;1;41m${ duration / 1000 }\u001B[0m`
        : `\u001B[30;1;43m${ duration / 1000 }\u001B[0m`
      const boldheader    = `\u001B[1m${ headerName }\u001B[0m:`

      console.log(`  ${ boldheader }`)
      console.log(`    ${ fullName }`)
      console.log(`    ${ coloredstring }sec. ${ filePath }`)
      console.log('')
    })
  }

  onTestResult(test, testResult) {
    testResult.testResults.forEach((element) => {
      this.#slowTests.push({
        duration   : element.duration,
        filePath   : testResult.testFilePath,
        fullName   : element.fullName,
        headerName : element.ancestorTitles.join(' => '),
      })

      if (this.#options.warnOnSlowerThan && element.duration > this.#options.warnOnSlowerThan) {
        let warnString = `${ element.fullName } ran in ${ element.duration }ms`
        if (this.#options.color) {
          warnString = `\u001B[31m${ warnString }\u001B[0m`
        }
        console.log(warnString)
      }
    })
  }

  #allTestTime() {
    let allTestTime = 0
    this.#slowTests.forEach((element) => {
      allTestTime += element.duration
    })
    return allTestTime
  }

  #slowTestTime(slowestTests) {
    let slowTestTime = 0
    slowestTests.forEach((element) => {
      slowTestTime += element.duration
    })

    return slowTestTime
  }
}

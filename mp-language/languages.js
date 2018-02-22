/* Language Controller */

// *The language controller is opinionated. 
// *Translations should be stored in the root directory in the 'languages' folder. 
// *The folder should have a directory for each language. 
// *Within each directory, a file for the strings must be made for each page. 
// *The filename *must* correspond to the path and name of the page.

class MPLang {

  constructor() {
    this.stringsRoot = '/languages'
  }

  getOptions () {
    try {
      return require('../../languages/options').options
    } catch (e) {
      throw new Error('options path not found at /languages/options.js')
    }
  }

  getLanguage () {
    try {
      return wx.getStorageSync('language')
    } catch (e) {
      console.log('could not get language from data', e)
    }
  }

  getPageStrings (Page, includeCommon = false) {
    const currentPage = Page.route
    // formattedPage cuts off page/ prefix then joins paths by a dot. 
    // Example: Page location is /pages/index/index, will return index.index
    // Example2: Page location is /pages/store/index/index, will return store.index.index
    // Meaning files should be named accordingly
    const formattedPage = (() => {
      let pathArr = currentPage.split('/')
      pathArr.shift()
      let path = pathArr.join('.')
      return path
    })()
    let currentLang = this.getLanguage()
    // if (!currentLang) {
    //   this.setLanguage()
    // }
    const pathToStringsRoot = (() => {
      let pathArr = currentPage.split('/')
      pathArr.shift()
      let relPath = []
      for(var x in pathArr) {
        relPath.push('..')
      }
      relPath = relPath.join('/')
      return relPath + this.stringsRoot
    })()
    const pathToPageStrings = [pathToStringsRoot, currentLang, formattedPage].join('/')
    try {
      const strings = require(pathToPageStrings)
      if (includeCommon) {
        strings.common = require(`${pathToStringsRoot}/${currentLang}/common`)
      }
      Page.setData({strings})
    } catch (e) {
      console.log('language strings not found at ' + pathToPageStrings)
      // throw new Error('language strings not found at ' + pathToPageStrings)
    }
  }

  getPhoneLanguage () {
    let language = wx.getSystemInfoSync().language
    return language.split('_')[0]
  }

  isActiveLanguage (language) {
    const options = this.getOptions()
    const {activeLanguages} = options
    console.log(activeLanguages.indexOf(language))
    if (-1 === activeLanguages.indexOf(language)) {
      return false
    }
    return true
  }

  setLanguage (language = '') {
    const options = this.getOptions()
    if (!language) {
      if (options.usePhoneLanguage && this.isActiveLanguage(this.getPhoneLanguage())) {
        language = this.getPhoneLanguage()
      } else {
        // fallback to default
        language = options.defaultLanguage
      }
    }
    wx.setStorageSync('language', language)
    return true
  }

}

module.exports = new MPLang
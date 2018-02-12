# MP Language

A laravel-esque way of managing translations in WeChat Mini Programs

This tool was built to be smart, loading the strings on a by-page basis, which are defined in their own files.

## Installation

1. Clone repo
2. Copy both the mp-language (library) folder, and the languages (sample) folder into your Mini Program  root directory

## Configuration

Define your configuration settings in /languages/options.js Configuration settings are as follows:

`defaultLanguage` (String): Language to fall back to when not loading phone language. Must also be defined in activeLanguages.

`activeLanguages` (Array): Array of language strings to use in your MP. To properly load the strings for your activeLanguage on a certain page, they must be located in a folder within the /languages folder with the same name. For example, the strings for English language ('en') must be in /languages/en/

`usePhoneLanguage` (Boolean): Whether or not to auto set language to use language set by user's phone. If false, uses defaultLanguage setting.



## Usage

First, define your language strings in the /languages folder.

Set the user's language on app launch with the following code in app.js

```javascript
const Lang = require('/libraries/mp-language/languages')

App({

  onLaunch: function (options) {
    ...
    if (!Lang.getLanguage()) {
      Lang.setLanguage()
    }
    ...
  }

})
```

To load strings on a page, you must first load the library:

```javascript
// index/index.js
const Lang = require('path-to-libraries/libraries/mp-language/languages')
```

Then get your strings by placing the getStrings() method in Page.onLoad()

```javascript
// index/index.js

onLoad: function (options) {
  Lang.getPageStrings(this)
}
```

The library will automatically load the strings for the activeLanguage on the page you are on and then set them in Page.data.strings:

```javascript
Page({

  data: {

    strings: {

      helloWorld: "Hello!"

    }

  }

})
```

## Get / Set Language:
Simply use the language library's functions to manually get / set language:
```javascript
// mypage.js
const Lang = require('/libraries/mp-language/languages')
const language = Lang.getLanguage()

Page({
  data: {
    language,
    ...
  },
  // Below method would be an event from a button / dialog on your Page WXML
  userChooseLanguage: function (e) {
    const language = e.currentTarget.dataset.chosenLanguage
    // Set Language
    Lang.setLanguage(language)
    // Reload Strings on Page (Might need to promisify this)
    Lang.getPageStrings()
  }
})
```

## What About Global Strings?
No problem - define your common strings in `/languages/{language}/common.js`
Then on your page, pass a second parameter to the `getPageStrings` function:
`Lang.getPageStrings(this, true)`

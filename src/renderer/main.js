import {
  ipcRenderer as ipc,
  remote
} from 'electron'
import Vue from 'vue'
import Mousetrap from 'mousetrap'
// Vendor CSS
import '../../static/vendor/fonts/fonts.css'
// import '../../static/vendor/fontawesome/css/fontawesome-all.min.css'
import App from './App.vue'
// templates
import * as htmlTemplates from './templates/html-templates'
import * as cssTemplates from './templates/css-templates'
import { defaultValues, renderHtml } from './utils'
// window.ELECTRON_DISABLE_SECURITY_WARNINGS = true

// https://github.com/ccampbell/mousetrap/tree/master/plugins/global-bind

(function (a) { let c = {}; let d = a.prototype.stopCallback; a.prototype.stopCallback = function (e, b, a, f) { return this.paused ? !0 : c[a] || c[f] ? !1 : d.call(this, e, b, a) }; a.prototype.bindGlobal = function (a, b, d) { this.bind(a, b, d); if (a instanceof Array) for (b = 0; b < a.length; b++)c[a[b]] = !0; else c[a] = !0 }; a.init() })(Mousetrap)

// const appConfig = remote.getGlobal('config')
// console.log(remote.getGlobal('config'))
let outputStyle = {
  mainFont: defaultValues.mainFont,
  baseFontSize: defaultValues.baseFontSize,
  fontColor: defaultValues.fontColor,
  backgroundColor: defaultValues.backgroundColor
}
function genStyle (fontFamily) {
  const s = outputStyle
  let style = ''
  style += `font-family:${s.mainFont === 'Auto' ? fontFamily : s.mainFont + ',' + fontFamily};`
  style += `font-size:${parseInt(s.baseFontSize)}px;`
  style += `color:${s.fontColor};`
  style += `background-color:${s.backgroundColor};`
  return style
}

let newFileName = 'testhtml'
let newFileContents = '<h1>hiya</h1>'
let newFileFontFamily = 'BlinkMacSystemFont,Helvetica Neue,sans-serif'
let outputHtml = renderHtml(htmlTemplates.base, {
  title: newFileName,
  styleBase: cssTemplates.base,
  styleMain: cssTemplates.main,
  styleExtra: `body{${genStyle(newFileFontFamily)}}`,
  contents: newFileContents
})
// console.log(outputHtml)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.Mousetrap = Vue.prototype.$Mousetrap = Mousetrap
Vue.config.productionTip = false

// const vApp = new Vue({
//   components: { App },
//   // router,
//   // store,
//   template: '<App/>'
// })
const vApp = new Vue(App)
vApp.$mount('#app')
vApp.text = 'Electron Forge with Vue.js!'

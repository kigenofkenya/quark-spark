<template>
  <div id="app">
    <h2>{{title}}</h2>
    <p>Hello from {{text}}</p>
  </div>
</template>

<script>
  import { remote, ipcRenderer as ipc } from 'electron'
  let self
  export default {
    name: 'app',
    data () {
      return {
        mainWindow: remote.getCurrentWindow(),
        title: 'quark spark',
        text: 'App.vue'
      }
    },
    created () {
      self = this
      // preinit process
      // this.$store.dispatch('loadAppConfig')
    },
    methods: {
      async closeApp (beforeFunc) {
        // await this.$store.dispatch('saveAppConfig')
        this.mainWindow.allowClose = true
        this.mainWindow.close()
      }
    },
    mounted () {
      // ********** Global event listeners **********

      // Shortcut handlers
      // if (typeof ) {}
      // console.log('mousetrap check')

      this.$Mousetrap.bindGlobal('command+shift+k', () => {
        console.log('command shift k global bind')
      })
      this.$Mousetrap.bindGlobal('command+shift+l', () => {
        console.log('command shift l global bind')
        console.log(`allowClose:${self.mainWindow.allowClose}`)
        this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
      })
      // Prevent dropped file from opening in window
      document.addEventListener('dragover', function (event) {
        event.preventDefault()
        return false
      }, false)
      document.addEventListener('drop', function (event) {
        console.log('drop!')
        event.preventDefault()
        return false
      }, false)

      ipc.on('request-close-app', () => {
        // final guard before app close
        this.closeApp()
      })
    }
  }
</script>

<style>
  /********** imported styles **********/
  @import './assets/styles/vars.css';

  h2 {
    color:var(--main-text-color);
  }
  /********** Main global styles **********/

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: system-ui;
  }

  /********** Additional global styles **********/

  .markedText {
    background-color: aquamarine;
    font-style: inherit;
  }
</style>

/* global FB */

import { EventEmitter } from 'events'

class Auth {
  constructor() {
    this.eventEmitter = new EventEmitter()
    this.userID = null
    this.accessToken = null
    this.isReady = false
  }

  get pictureUrl() {
    return `https://graph.facebook.com/${this.userID}/picture`
  }

  fbInit() {
    (function(d, s, id){
      let fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      let js = d.createElement(s)
      js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))

    window.fbAsyncInit = () => {
      FB.init({
        appId      : this.getConfig('app-id'),
        xfbml      : false,
        cookie     : false,
        version    : 'v2.5'
      })

      FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
          this.onFBLogin(response)
        }
        else {
          FB.login((response) => {
            this.onFBLogin(response)
          }, { scope: 'user_friends, email' })
        }
      })
    }
  }

  whenReady(callback) {
    if (this.isReady) {
      callback()
    }
    else {
      this.eventEmitter.once('ready', callback)
    }
  }

  onFBLogin(response) {
    if (response.status === 'connected' && response.authResponse) {
      this.accessToken = response.authResponse.accessToken
      this.userID = response.authResponse.userID

      const xhr = new XMLHttpRequest()
      const body = JSON.stringify({
        userID: this.userID,
        accessToken: this.accessToken
      })

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // let profile = JSON.parse(xhr.responseText)
          this.isReady = true
          this.eventEmitter.emit('ready')
        }
      }

      xhr.open('POST', '/auth/fb', true)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(body)
    }
  }

  getConfig(name) {
    const element = document.head.querySelector("meta[name='fb-" + name + "']")
    if (element) {
      const content = element.getAttribute('content')
      if (content) {
        return content
      }
    }

    console.log(`Cannot find the value for meta property '${name}'`) // eslint-disable-line no-console
  }
}

const instance = new Auth()
export default instance

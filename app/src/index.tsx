import { AppRegistry } from 'react-native'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

AppRegistry.registerComponent('App', () => App)
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register({
  onSuccess: () => console.log('service worker loaded successfully'),
  onUpdate: () => console.log('service worker is updated'),
})

function removeWechatGuidance() {
  const guidanceNode = window.document.getElementById('wechat-guidance')
  if (guidanceNode) {
    const parentNode = guidanceNode.parentNode
    if (parentNode) {
      parentNode.removeChild(guidanceNode)
    }
  }
}

removeWechatGuidance()

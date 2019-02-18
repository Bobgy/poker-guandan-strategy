import React from 'react'
import ReactDOM from 'react-dom'
import { AppRegistry } from 'react-native'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { loadCppModule } from './loadCppModule'

AppRegistry.registerComponent('App', () => App)
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
})

loadCppModule().then(cppModule => {
  console.log(
    cppModule.calc(
      'BJADKDJH0S0C0CAH8D7S7H4H4D4H3D3C2H9C7CAH6C5CKSQSJS0S9S',
      'A',
    ),
  )
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

/* eslint global-require: off */
import React from 'react'
import { Font } from 'expo'
import { Provider } from 'react-redux'

import App from './App'
import store from './redux'


export default class Entry extends React.Component {
  state = {
    loading: true,
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    })

    this.setState({ loading: false })
  }

  render() {
    const { loading } = this.state

    if (loading) {
      return null
    }

    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

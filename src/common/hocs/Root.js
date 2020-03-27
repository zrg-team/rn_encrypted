import React, { Component } from 'react'
import { connect } from 'react-redux'
import initialize from '../utils/initialize'
import database from '../../libraries/Database'
import MainPage from './MainPage'
import firebase from '../../libraries/firebase'
import commonHandler from '../handlers/common'
import { defaultTheme } from '../../styles/common'
import { Colors, Typography, Spacings } from 'react-native-ui-lib'

class Root extends Component {
  constructor (props) {
    super(props)
    this.handleLoadingDone = this.handleLoadingDone.bind(this)
  }

  handleLoadingDone () {
  }

  shouldComponentUpdate (nextProps) {
    return false
  }

  async handleFirebase (nextProps, operatorInformations) {
    try {
      const {
        setDeviceToken
      } = nextProps

      firebase.init({})
      const token = await firebase.checkPermission()
      if (token) {
        setDeviceToken(token)
      }
    } catch (err) {
    }
  }

  async componentDidMount () {
    const { dispatch, language } = this.props

    this.handleFirebase(this.props)

    // TODO: Do something cool with style and theme also
    Colors.loadColors(defaultTheme.colors)

    Typography.loadTypographies(defaultTheme.typography)

    Spacings.loadSpacings(defaultTheme.spacings)

    try {
      await database.init()
    } catch (err) {
      console.debug('[ROOT] Cannot Initialize database ', err)
    }
    try {
      await initialize(dispatch, language || undefined)
    } catch (error) {
      console.debug('[ROOT] Cannot Initialize ', error)
    }
  }

  render () {
    const { dispatch, loginKey, language } = this.props
    return (
      <MainPage
        dispatch={dispatch}
        loginKey={loginKey}
        language={language}
        onLoadingDone={this.handleLoadingDone}
      />)
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  ...commonHandler(dispatch, props)
})

const mapStateToProps = state => {
  return {
    loginKey: state.common.token,
    language: state.common.language
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)

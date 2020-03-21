import React, { Component } from 'react'
import { connect } from 'react-redux'
import initialize from '../utils/initialize'
import database from '../../libraries/Database'
import MainPage from './MainPage'
import firebase from '../../libraries/firebase'
import commonHandler from '../handlers/common'
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
    Colors.loadColors({
      primaryColor: '#2364AA',
      secondaryColor: '#81C3D7',
      textColor: '##221D23',
      errorColor: '#E63B2E',
      successColor: '#ADC76F',
      warnColor: '##FF963C'
    })

    Typography.loadTypographies({
      heading: { fontSize: 36, fontWeight: '600' },
      subheading: { fontSize: 28, fontWeight: '500' },
      body: { fontSize: 18, fontWeight: '400' }
    })

    Spacings.loadSpacings({
      page: 20,
      card: 12,
      gridGutter: 16
    })

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

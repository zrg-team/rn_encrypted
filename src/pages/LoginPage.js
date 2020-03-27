import React, { Component } from 'react'
import DefaultPage from '../common/hocs/DefaultPage'
import LoginForm from '../modules/user/containers/LoginForm'

export default class LoginPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  render () {
    const { navigation } = this.props
    return (
      <DefaultPage>
        <LoginForm navigation={navigation} />
      </DefaultPage>
    )
  }
}

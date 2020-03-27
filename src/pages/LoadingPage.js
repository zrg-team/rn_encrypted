import React, { PureComponent } from 'react'
import { SCREENS } from '../common/routes'
import FadeLoading from '../common/components/Widgets/FadeLoading'
import DefaultPage from '../common/hocs/DefaultPage'

class LoadingPage extends PureComponent {
  constructor (props) {
    super(props)
    const { route = {} } = props
    const params = route.params || {}
    this.state = {
      ready: false,
      screen: params.page || SCREENS.Debug
    }
  }

  render () {
    const { screen } = this.state
    const { navigation, time } = this.props
    return (
      <DefaultPage containerStyle={{ backgroundColor: '#051C3F' }}>
        <FadeLoading
          init
          time={time}
          mainPage={screen}
          navigation={navigation}
        />
      </DefaultPage>
    )
  }
}

export default LoadingPage

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { SCREENS } from '../common/routes'
import FadeLoading from '../common/components/Widgets/FadeLoading'
import DefaultPage from '../common/hocs/DefaultPage'

class LoadingPage extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      screen: props.page || SCREENS.Debug
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

const mapDispatchToProps = (dispatch, props) => ({
  dispatch
})

const mapStateToProps = state => ({
  rehydrated: state._persist.rehydrated
})

export default connect(mapStateToProps, mapDispatchToProps)(LoadingPage)

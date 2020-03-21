import Collapsible from 'react-native-collapsible'
import Ion from 'react-native-vector-icons/Ionicons'
import Markdown from 'react-native-easy-markdown'
import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native'
import { View, Text } from 'react-native-ui-lib'
import commonStyles from '../../../styles/common'

export default class CollapsibleComp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeSection: false,
      collapsed: props.collapsed,
      rotateAnimation: new Animated.Value(0)

    }
    this.handleExpanded = this.handleExpanded.bind(this)
    this.markdownStyles = {
      text: commonStyles.txt_primary,
      h1: commonStyles.h2,
      h2: commonStyles.h3,
      h3: commonStyles.h4,
      h4: commonStyles.h5,
      h5: commonStyles.h6
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ collapsed: nextProps.collapsed })
  }

  handleExpanded () {
    this.props.updateCurentCollapsed(this.props.index)
    this.setState({ collapsed: !this.state.collapsed })
  }

  render () {
    const { collapsed } = this.state
    const rotate = collapsed ? 1 : 0

    Animated.timing(this.state.rotateAnimation, {
      toValue: rotate,
      duration: 300,
      easing: Easing.linear
    }).start()

    const spin = this.state.rotateAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    })

    return (
      <View style={[styles.container]}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.header}
          onPress={this.handleExpanded}
        >
          <Text style={styles.headerText}>
            {this.props.title}
          </Text>
          <Animated.View style={{ transform: [{ rotate: spin }], flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: -7 }}>
            <Ion
              name='md-arrow-dropdown'
              color='#AEBCC6'
              size={25}
            />
          </Animated.View>
        </TouchableOpacity>
        <Collapsible collapsed={!this.state.collapsed} align='center'>
          <View style={[styles.detailText]}>
            <Markdown
              markdownStyles={this.markdownStyles}
            >
              {this.props.detail}
            </Markdown>
          </View>
        </Collapsible>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    borderBottomWidth: 1,
    borderColor: 'rgba(151,151,151,0.14)',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    flex: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#35474E',
    paddingRight: 10
  }
})

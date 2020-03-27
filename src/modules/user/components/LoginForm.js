import React, { Component } from 'react'
import i18n from 'i18n-js'
import { StyleSheet } from 'react-native'
import * as Animatable from 'react-native-animatable'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { KeyboardAwareScrollView, View, TextArea, TextField, Text, Button } from 'react-native-ui-lib'
import { isValidEmail } from '../../../common/utils/validate'
import Camera from '../../../common/components/Widgets/Camera'

export default class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      email: '',
      error: '',
      step: 1,
      lastStep: 0,
      seed: ''
    }
    this.handleNext = this.handleNext.bind(this)
    this.renderSteps = this.renderSteps.bind(this)
    this.handleInputEmail = this.handleInputEmail.bind(this)
    this.handleOpenCamera = this.handleOpenCamera.bind(this)
    this.handleInputPassphrase = this.handleInputPassphrase.bind(this)
  }

  handleOpenCamera () {
    Camera.showQrcode((response) => {
      Camera.hide()
      this.setState({
        seed: response.data
      })
    })
  }

  handleNext () {
    const { step, email, seed } = this.state
    let error
    switch (step) {
      case 1:
        if (!email || !`${email}`.trim()) {
          error = i18n.t('errors.email_required')
        } else if (!isValidEmail(email)) {
          error = i18n.t('errors.invalid_email_format')
        }

        if (error) {
          return this.setState({
            error
          })
        }
        return this.setState({
          lastStep: 1,
          step: 2,
          error: ''
        })
      case 2:
        if (!seed || !`${seed}`.trim()) {
          error = i18n.t('errors.passphrase_required')
        } else if (!isValidEmail(email)) {
          error = i18n.t('errors.invalid_email_format')
        }

        if (error) {
          return this.setState({
            error
          })
        }
        return this.setState({
          lastStep: 2,
          step: 3
        })
    }
  }

  handleInputEmail (email) {
    this.setState({
      email,
      error: ''
    })
  }

  handleInputPassphrase (seed) {
    this.setState({
      seed,
      error: ''
    })
  }

  renderSteps () {
    const { step, lastStep, email, error, seed } = this.state
    const animation = lastStep < step ? 'fadeInRight' : 'fadeInLeft'
    switch (step) {
      case 1:
        return (
          <Animatable.View key='step-1' useNativeDriver animation={animation}>
            <View br10 bg-dark70 marginT-50 style={styles.email_container}>
              <AntIcon name='mail' style={styles.email_icon} />
              <View style={styles.divider} bg-dark60 />
              <View style={styles.email_input}>
                <TextField
                  value={email}
                  hideUnderline
                  placeholder={i18n.t('login_page.email')}
                  onChangeText={this.handleInputEmail}
                  error={error}
                />
              </View>
            </View>
          </Animatable.View>
        )
      case 2:
        return (
          <Animatable.View key='step-2' useNativeDriver animation={animation}>
            <View marginT-50 marginB-30 style={[styles.vertical_container]}>
              <View style={styles.qrcode_container}>
                <Text style={styles.passphrase_title} black text70 marginB-15>{i18n.t('login_page.input_passphrase')}</Text>
                <AntIcon onPress={this.handleOpenCamera} name='qrcode' style={styles.qrcode_icon} />
              </View>
              <View br10 bg-dark70 style={styles.passphrase_container}>
                <TextArea
                  value={seed}
                  hideUnderline
                  multiline
                  numberOfLines={4}
                  placeholder={i18n.t('login_page.enter_your_passphrase')}
                  onChangeText={this.handleInputPassphrase}
                />
              </View>
            </View>
          </Animatable.View>
        )
    }
  }

  render () {
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <Animatable.View useNativeDriver animation='zoomInUp' duration={1400}>
          <View style={styles.title_container}>
            <Text orange30 h4>{i18n.t('login_page.login_form_title')}</Text>
          </View>
          <Text grey30>{i18n.t('login_page.login_form_subtitle')}</Text>
          {this.renderSteps()}
          <View marginT-40>
            <Button
              enableShadow
              onPress={this.handleNext}
              background-orange30
              borderRadius={20}
              label={i18n.t('common.next')}
            />
          </View>
        </Animatable.View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 100
  },
  email_input: {
    flex: 1,
    height: '100%',
    paddingTop: 7,
    paddingLeft: 20
  },
  divider: {
    width: 1,
    height: 30
  },
  email_container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 38
  },
  vertical_container: {
    display: 'flex',
    flexDirection: 'column'
  },
  qrcode_container: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
  email_icon: {
    fontSize: 26,
    paddingTop: 2,
    paddingHorizontal: 10
  },
  qrcode_icon: {
    fontSize: 32
  },
  title_container: {
    display: 'flex',
    flexDirection: 'row'
  },
  title_icon: {
    fontSize: 30,
    paddingRight: 12,
    color: 'orange'
  },
  passphrase_container: { height: 100, width: '100%' },
  passphrase_title: {
    fontWeight: 'bold'
  }
})

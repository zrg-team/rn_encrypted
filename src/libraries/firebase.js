import firebase from 'react-native-firebase'
import { Linking } from 'react-native'
import storeAccessible from '../common/utils/storeAccessible'
import { setNotificationTopics } from '../common/actions/common'

class FireBase {
  constructor () {
    this.analyticsInstance = firebase.analytics()
    this.messagingInstance = firebase.messaging()
    this.crashlyticsInstance = firebase.crashlytics()
    this.notificationInstance = firebase.notifications()
    this.handleNotificationOpenned = null
    this.handleNotification = null
  }

  handleDefaultTopic () {
    const loginID = storeAccessible.getState('common').userId

    const topics = { all: 'common' }
    this.messagingInstance.subscribeToTopic('all')
    if (loginID) {
      topics[loginID] = 'common'
      this.messagingInstance.subscribeToTopic(loginID)
    }
    return topics
  }

  handleTopics (options = {}) {
    try {
      let { topics, topicOperators } = options
      const lastTopics = storeAccessible.getState('common').notificationTopics || {}
      const loginID = storeAccessible.getState('common').loginID

      // First attemps
      if (options.forceClear) {
        Object.keys(lastTopics)
          .forEach((topic) => {
            this.messagingInstance.unsubscribeFromTopic(topic)
          })
        console.info('[FIREBASE] Subscribed topics (forceClear)', topics)
        topics = this.handleDefaultTopic()
        return storeAccessible.dispatch(setNotificationTopics(topics))
      } if ((!topics || !Object.keys(topics).length) && (!lastTopics || !Object.keys(lastTopics).length)) {
        topics = this.handleDefaultTopic()
        console.info('[FIREBASE] Subscribed topics', topics)
        return storeAccessible.dispatch(setNotificationTopics(topics))
      } else if (!topics || !Object.keys(topics).length) {
        console.info('[FIREBASE] Subscribed topics', lastTopics)
        return
      }

      topics.all = 'common'
      if (loginID) {
        topics[loginID] = 'common'
      }

      const removed = []
      const newSubscribes = []
      const lastSubscribed = {}
      // TODO: Checking it out
      Object.keys(lastTopics)
        .forEach((topic) => {
          const operator = lastTopics[topic]
          if (!topics[topic] && topicOperators[operator]) {
            removed.push(topic)
            this.messagingInstance.unsubscribeFromTopic(topic)
          } else {
            lastSubscribed[topic] = true
          }
        })
      const topicArr = Object.keys(topics)
      topicArr.forEach((topic) => {
        if (!lastSubscribed[topic]) {
          newSubscribes.push(topic)
          this.messagingInstance.subscribeToTopic(topic)
        }
      })
      storeAccessible.dispatch(setNotificationTopics(topics))
      console.info('[FIREBASE] Removed topics', removed)
      console.info('[FIREBASE] New subscribe topics', newSubscribes)
      console.info('[FIREBASE] Subscribed topics', topicArr)
    } catch (err) {
      console.debug('[FIREBASE] handleTopics ', err)
    }
  }

  onNotification (handleNotification) {
    this.handleNotification = handleNotification
    return this.notificationListener
  }

  init ({
    handleNotificationOpenned,
    notificationOptions = {}
  }) {
    try {
      this.handleNotificationOpenned = handleNotificationOpenned
      this.analyticsInstance.setAnalyticsCollectionEnabled(true)
      this.createChannel()
      this.handleTopics(notificationOptions)
      if (this.notificationListener) {
        this.notificationListener()
      }
      this.notificationListener = this.notificationInstance.onNotification((notification) => {
        if (this.handleNotification) {
          this.handleNotification(notification)
        }
        // Process your notification as required
        notification
          .android.setSmallIcon('ic_launcher')
          .android.setLargeIcon('ic_launcher')
          .android.setChannelId('QiksaPublicHeadups')
        firebase.notifications()
          .displayNotification(notification)
      })
      if (this.notificationOpenedListener) {
        this.notificationOpenedListener()
      }
      this.notificationOpenedListener = this.notificationInstance.onNotificationOpened((notificationOpen) => {
        // Get the action triggered by the notification being opened
        // Get information about the notification that was opened
        this.handleNotificationAction(notificationOpen)
      })
      firebase.notifications().getInitialNotification()
        .then((notificationOpen) => {
          if (notificationOpen) {
            this.handleNotificationAction(notificationOpen)
          }
        })
    } catch (err) {
    }
  }

  handleNotificationAction (notificationOpen) {
    const notification = notificationOpen.notification
    const action = notification.data || {}
    switch (action.action) {
      case 'OPEN_URL':
        Linking
          .openURL(action.url)
          .catch(() => {})
        break
      default:
        if (this.handleNotificationOpenned) {
          this.handleNotificationOpenned(notificationOpen)
        }
        break
    }
  }

  onTokenRefreshListener (callback) {
    if (this.onTokenRefreshListener) {
      this.onTokenRefreshListener()
    }
    this.onTokenRefreshListener = this.messagingInstance.onTokenRefresh(callback)
    return this.onTokenRefreshListener
  }

  createChannel () {
    const channelQiksaHeadups = new firebase.notifications.Android.Channel('QiksaChannel', 'QiksaChannel', firebase.notifications.Android.Importance.High)
      .setDescription('Qiksa channel')
    this.notificationInstance.android.createChannel(channelQiksaHeadups)
    const channelQiksaPublicHeadups = new firebase.notifications.Android.Channel('QiksaPublicHeadups', 'QiksaPublicHeadups', firebase.notifications.Android.Importance.High)
      .setDescription('Qiksa channel')
    this.notificationInstance.android.createChannel(channelQiksaPublicHeadups)
  }

  async getToken () {
    try {
      const fcmToken = await this.messagingInstance.getToken()
      return fcmToken
    } catch (err) {
      return undefined
    }
  }

  async checkPermission () {
    const enabled = await this.messagingInstance.hasPermission()
    if (enabled) {
      return this.getToken()
    } else {
      return this.requestPermission()
    }
  }

  async requestPermission () {
    try {
      await this.messagingInstance.requestPermission()
      return this.getToken()
    } catch (error) {
      return undefined
    }
  }
}

export default new FireBase()

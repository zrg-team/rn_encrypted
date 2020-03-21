import { setDeviceToken, setNotificationTopics } from '../actions/common'

export default (dispatch, props) => ({
  setDeviceToken: (token) => {
    dispatch(setDeviceToken(token))
  },
  setNotificationTopics: (topics = {}) => {
    dispatch(setNotificationTopics(Object.keys(topics)))
  }
})

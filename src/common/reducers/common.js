import { handleActions } from 'redux-actions'
import * as actions from '../actions/common'

const defaultState = {
  language: 'en',
  currentPage: '',
  previousPage: '',
  deviceToken: null,
  notificationTopics: {}
}

const handlers = {
  [actions.clearAll]: (state, action) => {
    return {
      ...defaultState
    }
  },
  [actions.setUserLanguage]: (state, action) => {
    return {
      ...state,
      language: action.payload
    }
  },
  [actions.setNavigationPage]: (state, action) => {
    return {
      ...state,
      currentPage: action.payload.currentPage,
      previousPage: action.payload.previousPage
    }
  },
  [actions.setDeviceToken]: (state, action) => {
    return {
      ...state,
      deviceToken: action.payload
    }
  },
  [actions.setNotificationTopics]: (state, action) => {
    return {
      ...state,
      notificationTopics: action.payload
    }
  }
}

export default handleActions(handlers, defaultState)

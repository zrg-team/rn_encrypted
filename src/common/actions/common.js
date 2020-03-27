import { createAction } from 'redux-actions'

export const loadStart = createAction('LOADING_START')
export const loadEnd = createAction('LOADING_END')

export const clearAll = createAction('CLEAR_ALL')
export const setApplicationState = createAction('SET_APPLICATION_STATE')
export const setNavigationPage = createAction('SET_NAVIGATION_PAGE')
export const setNetworkStatus = createAction('SET_NETWORK_STATUS')
export const setDeviceToken = createAction('SET_DEVICE_TOKEN')
export const setNotificationTopics = createAction('SET_NOTIFICATION_TOPICS')
export const setUserLanguage = createAction('SET_USER_LANGUAGE')

export const fetchStart = createAction('API_FETCH_START')
export const fetchSuccess = createAction('API_FETCH_SUCCESS')
export const fetchFailure = createAction('API_FETCH_FAILURE')

export const setSession = createAction('SET_SESSION')
export const addSession = createAction('ADD_SESSION')
export const clearSession = createAction('CLEAR_SESSION')
export const setSessionKey = createAction('SET_SESSION_KEY')
export const setNavigationTimes = createAction('SET_NAVIGATION_TIME')
export const setNetworkTime = createAction('SET_NETWORK_TIME')
export const setApplicationStateTime = createAction('SET_APPLICATION_STATE_TIME')

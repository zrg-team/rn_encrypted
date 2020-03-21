import axios from 'axios'
import { TIMEOUT } from '../configs'
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  loadStart,
  loadEnd
} from './actions/common'
import storeAccessible from './utils/storeAccessible'
import ProgressBar from './components/Widgets/ProgressBar'
import CommonLoading from './components/Widgets/CommonLoading'

export async function overlay (overlayProcess) {
  CommonLoading.show(true, { showLoadingIcon: false })
  try {
    const ret = await overlayProcess()
    CommonLoading.hide()
    return ret
  } catch (error) {
    CommonLoading.hide()
    console.debug('[EFFECT] OVERLAY', error)
    throw error
  }
}

export async function splash (splashProcess) {
  CommonLoading.show(true, {
    overlayStyles: {
      opacity: 1
    },
    showLoadingIcon: true,
    animationIconOnly: false
  })
  try {
    const ret = await splashProcess()
    CommonLoading.hide()
    return ret
  } catch (error) {
    CommonLoading.hide()
    console.debug('[EFFECT] SPLASH', error)
    throw error
  }
}

export async function loading (fetchingProcess, done = undefined) {
  const dispatch = storeAccessible.dispatch ? storeAccessible.dispatch : (item) => { }
  dispatch(loadStart({ config: { key: 'loading' } }))
  try {
    const ret = await fetchingProcess()
    dispatch(loadEnd({ config: { key: 'loading' } }))
    if (done) {
      await done()
    }
    return ret
  } catch (error) {
    dispatch(loadEnd({ config: { key: 'loading' } }))
    console.debug('[EFFECT] Loading Process', error)
    throw error
  }
}

export async function fetchLoading (fetchingProcess, done = undefined) {
  ProgressBar.show(false)
  try {
    const ret = await fetchingProcess()
    ProgressBar.hide()
    if (done) {
      await done()
    }
    return ret
  } catch (error) {
    ProgressBar.hide()
    console.debug('[EFFECT] Fetch loading', error)
    throw error
  }
}

export function requestAuthentication ({ url, headers, ...options }) {
  // const user = storeAccessible.getState(MODULE_USER)
  // if (!user || !user.userToken) {
  //   throw new Error('MISSING_USER_TOKEN')
  // }
  const time = parseInt(new Date().getTime() / 1000, 0)
  return axios({
    timeout: TIMEOUT,
    url,
    headers: {
      // authorization: `Bearer ${user.userToken}`,
      timeStamp: time,
      ...headers
    },
    ...options
  }).catch(error => {
    throw error
  })
}

export function request ({ url, headers, ...options }) {
  return axios({
    timeout: TIMEOUT,
    url,
    headers: {
      'api-key': 'qvi',
      ...headers
    },
    ...options
  }).catch(error => {
    throw error
  })
}

export function requestAuth ({ url, headers, ...options }) {
  return axios({
    timeout: TIMEOUT,
    url,
    headers: {
      // authorization: `Bearer ${user.userToken}`,
      'api-key': 'qvi',
      ...headers
    },
    ...options
  }).catch(error => {
    throw error
  })
}

export function requestLoading ({ url, ...options }) {
  if (!url) {
    return false
  }
  const dispatch = storeAccessible.dispatch
    ? storeAccessible.dispatch : (item) => { }
  dispatch && dispatch(fetchStart({ config: { key: url } }))
  return axios({
    timeout: TIMEOUT,
    url,
    ...options
  }).then((response) => {
    dispatch && dispatch(fetchSuccess({ config: { key: url } }))
    return response
  }).catch((err) => {
    dispatch && dispatch(fetchFailure({ config: { key: url } }))
    throw err
  })
}

export function requestAuthenticationLoading ({ url, headers, ...options }) {
  // const user = storeAccessible.getState(MODULE_USER)
  // if (!user || !user.userToken) {
  //   throw new Error('MISSING_USER_TOKEN')
  // }
  const dispatch = storeAccessible.dispatch
    ? storeAccessible.dispatch : (item) => { }
  dispatch && dispatch(fetchStart({ config: { key: url } }))
  const time = parseInt(new Date().getTime() / 1000, 0)
  return axios({
    timeout: TIMEOUT,
    url,
    headers: {
      // authorization: `Bearer ${user.userToken}`,
      timeStamp: time,
      ...headers
    },
    ...options
  }).then((response) => {
    dispatch && dispatch(fetchSuccess({ config: { key: url } }))
    return response
  }).catch(error => {
    dispatch && dispatch(fetchSuccess({ config: { key: url } }))
    throw error
  })
}

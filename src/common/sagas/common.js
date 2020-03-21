
import {
  put,
  select,
  takeLatest
} from 'redux-saga/effects'
import {
  setNetworkTime,
  setNetworkStatus,
  setNavigationPage,
  setNavigationTimes,
  setApplicationState,
  setApplicationStateTime
} from '../actions/common'
import firebase from '../../libraries/firebase'

function * onPageChanged ({ payload }) {
  try {
    const network = yield select(state => state.session.network)
    const navigationTimes = yield select(state => state.session.navigationTimes)
    firebase.analyticsInstance.setCurrentScreen(payload.currentPage, payload.currentPage)
    if (!network || (navigationTimes[payload.currentPage] && Date.now() - navigationTimes[payload.currentPage] < 200000)) {
      return
    }
    // TODO: Do something usefull
    switch (payload.currentPage) {
      default:
    }
    yield put(setNavigationTimes({ key: payload.currentPage, time: Date.now() }))
  } catch (err) {
    console.debug('[SAGA] onPageChanged ', err)
  }
}

function * appStateChanged ({ payload }) {
  try {
    const applicationStateTime = yield select(state => state.session.applicationStateTime)

    if ((applicationStateTime && Date.now() - applicationStateTime < 200000) || payload !== 'active') {
      return
    }
    // TODO: Do something usefull
    yield put(setApplicationStateTime(Date.now()))
  } catch (err) {
  }
}

function * onNetworkChanged ({ payload }) {
  try {
    const networkTime = yield select(state => state.session.networkTime)

    if ((networkTime && Date.now() - networkTime < 5000) || !payload) {
      return
    }

    yield put(setNetworkTime(Date.now()))
  } catch (err) {
    console.debug('[SAGA] onNetworkChanged', err)
  }
}

function * watchPageChange () {
  yield takeLatest(setNavigationPage.toString(), onPageChanged)
}

function * watchNetworkChange () {
  yield takeLatest(setNetworkStatus.toString(), onNetworkChanged)
}

function * watchAppState () {
  yield takeLatest(setApplicationState.toString(), appStateChanged)
}

export default [
  watchPageChange(),
  watchNetworkChange(),
  watchAppState()
]

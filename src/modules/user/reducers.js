import { handleActions } from 'redux-actions'

import { clearAll } from '../../common/actions/common'

const defaultState = {
  news: []
}

const handlers = {
  [clearAll]: (state, action) => ({ ...defaultState })
}

export default handleActions(handlers, defaultState)

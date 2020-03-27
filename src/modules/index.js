import { MODULE_NAME as MODULE_OPTION } from './option/models'
import reducerOption from './option/reducers'

import { MODULE_NAME as MODULE_USER } from './user/models'
import reducerUser from './user/reducers'

export const moduleReducers = {
  [MODULE_USER]: reducerUser,
  [MODULE_OPTION]: reducerOption
}

export const moduleSagas = [
]

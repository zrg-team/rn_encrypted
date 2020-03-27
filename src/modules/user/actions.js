import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const setToken = createAction(`${MODULE_NAME}/SET_TOKEN`)

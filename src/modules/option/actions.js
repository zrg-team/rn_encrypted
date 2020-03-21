import { createAction } from 'redux-actions'
import { MODULE_NAME } from './models'

export const setLanguage = createAction(`${MODULE_NAME}/SET_LANGUAGE`)

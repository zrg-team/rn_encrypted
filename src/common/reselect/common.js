import { createSelector } from 'reselect'
import { MODULE_NAME as MODULE_ASSET } from '../../modules/asset/models'
import { icons } from '../../assets/elements'

const assetSelector = state => state[MODULE_ASSET].assets

export const getAssetIcons = createSelector(
  assetSelector,
  (items = {}) => Object.keys(items).reduce((all, key) => {
    const data = items[key]
    const icon = icons[data.operator]
      ? icons[data.operator]
      : icons.icon_default_coin
    return { ...all, [key]: icon }
  }, {})
)

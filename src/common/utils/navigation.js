import { StackActions } from '@react-navigation/native'
import { SCREENS } from '../routes'

let navigator
export function setTopLevelNavigator (navigatorRef) {
  navigator = navigatorRef
}

export function screens () {
  return SCREENS
}

export function navigationReset (navigation = navigator, page, params = {}, key = new Date().getTime()) {
  const resetAction = StackActions.reset({
    index: 0,
    params,
    actions: [StackActions.navigate({ routeName: page })]
  })
  navigation.dispatch(resetAction)
}

export function navigationReplace (navigation = navigator, page, params = {}, key = new Date().getTime()) {
  const resetAction = StackActions.replace({
    params,
    routeName: page,
    newKey: key || page
  })
  navigation.dispatch(resetAction)
}

export function navigationPush (navigation = navigator, page, params = {}, key) {
  const navigateAction = StackActions.navigate({
    routeName: page,
    params,
    key,
    action: StackActions.navigate({ routeName: page })
  })

  navigation.dispatch(navigateAction)
}

export function navigationPop (navigation = navigator, number = 1) {
  const popAction = StackActions.pop({
    n: number
  })
  navigation.dispatch(popAction)
}

export function navigationPopToTop (navigation = navigator, options = {}) {
  navigation.dispatch(StackActions.popToTop(options))
}

export function navigate (navigation = navigator, page) {
  navigation.navigate(page)
}

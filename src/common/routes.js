import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import DebugPage from '../pages/DebugPage'
import LoadingPage from '../pages/LoadingPage'

export const SCREENS = {
  Loading: 'Loading',
  Home: 'Home',
  Debug: 'Debug'
}

const customProps = {
  tabDefault: {},
  tabScreenDefault: {},
  stackDefault: {},
  stackScreenDefault: {}
}

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
export default ({
  persistor = undefined,
  dispatch = null,
  loginKey,
  setTopLevelNavigator,
  onNavigationStateChange
}) => {
  let MainStack = null
  if (loginKey) {
    MainStack = (
      <Tab.Navigator
        initialRouteName={SCREENS.Home}
        {...customProps.tabDefault}
      >
        <Tab.Screen name={SCREENS.Home} component={DebugPage} {...customProps.tabScreenDefault} />
        <Tab.Screen name={SCREENS.Debug} component={DebugPage} {...customProps.tabScreenDefault} />
      </Tab.Navigator>
    )
  } else {
    MainStack = (
      <Stack.Navigator
        initialRouteName={SCREENS.Home}
        headerMode=''
        {...customProps.stackDefault}
      >
        <Stack.Screen
          name={SCREENS.Loading}
          component={LoadingPage}
          initialParams={{ page: SCREENS.Home }}
          {...customProps.stackScreenDefault}
        />
        <Stack.Screen name={SCREENS.Home} component={DebugPage} {...customProps.stackScreenDefault} />
      </Stack.Navigator>
    )
  }
  return (
    <NavigationContainer ref={setTopLevelNavigator} onStateChange={onNavigationStateChange}>
      {MainStack}
    </NavigationContainer>
  )
}

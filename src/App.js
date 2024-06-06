import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainPage from './pages/MainPage'; // Imported MainPage as per the patch
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Assuming HomeScreen is defined somewhere else in the project
// import HomeScreen from './path_to_HomeScreen';

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="MainPage"
          component={MainPage}
        />
        {/* other routes */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
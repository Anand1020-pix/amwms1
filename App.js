import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/Screens/Home';
import Profile from './src/Screens/Profile';
import Login from './src/Screens/Login';
import Shrimp from './src/Screens/Shrimp';
import Alertpage  from './src/Screens/Alerts';
import Signup from './src/Screens/Signup';
import PasswordReset from './src/Screens/PasswordReset';
import BottomNav from './src/components/Bottomnav';
import { ActiveIndexProvider } from './src/components/ActiveIndexContext';

const Stack = createStackNavigator();

function App() {
  return (
    <ActiveIndexProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Shrimp" component={Shrimp} />
          <Stack.Screen name="Alertpage" component={Alertpage} />
          <Stack.Screen name="BottomNav" component={BottomNav} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="PasswordReset" component={PasswordReset} />
        </Stack.Navigator>
      </NavigationContainer>
    </ActiveIndexProvider>
  );
}

export default App;
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import LandingScreen from './screens/LandingScreen';
import UserLoginScreen from './screens/UserLoginScreen';
import UserRegisterScreen from './screens/UserRegisterScreen';
import UserHomeScreen from './screens/UserHomeScreen';
import PredictScreen from './screens/PredictScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminHomeScreen from './screens/AdminHomeScreen';
import ViewUsersScreen from './screens/ViewUsersScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0D0D1A' },
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 280 } },
            close: { animation: 'timing', config: { duration: 220 } },
          },
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="UserLogin" component={UserLoginScreen} />
        <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
        <Stack.Screen name="UserHome" component={UserHomeScreen} />
        <Stack.Screen name="Predict" component={PredictScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
        <Stack.Screen name="ViewUsers" component={ViewUsersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

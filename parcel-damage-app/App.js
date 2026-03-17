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

import { useEffect } from 'react';
import { Platform } from 'react-native';

const Stack = createStackNavigator();

function WebNoZoom() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // 1. Inject Viewport Meta (Standard)
      let meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        document.head.appendChild(meta);
      }
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0';

      // 2. Inject CSS (Hardware-level touch locking)
      const style = document.createElement('style');
      style.textContent = `
        html, body { 
          touch-action: pan-x pan-y; 
          overscroll-behavior-y: contain; 
          -webkit-text-size-adjust: 100%;
          user-select: none;
          position: fixed;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }
        #root {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        input, textarea { 
          font-size: 16px !important; 
          user-select: text;
        }
      `;
      document.head.appendChild(style);

      // 3. Prevent Multi-touch (Pinch Zoom)
      document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });

      // 4. Prevent Double-tap to Zoom
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      }, false);

      // 5. iOS Specific Gesture Blocking
      document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
      });
    }
  }, []);
  return null;
}

export default function App() {
  return (
    <NavigationContainer>
      <WebNoZoom />
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

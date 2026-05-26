import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import ConnectionScreen from '../screens/ConnectionScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import FeedScreen from '../screens/FeedScreen';
import LoadingScreen from "../screens/LoadingScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      id="Root"
      initialRouteName="Loading"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
    
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />

      <Stack.Screen
        name="Connection"
        component={ConnectionScreen}
      />

      <Stack.Screen
        name="Feed"
        component={FeedScreen}
      />

      <Stack.Screen
        name="CreateProfile"
        component={CreateProfileScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
        }}
      />

      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
      />

    </Stack.Navigator>
  );
}
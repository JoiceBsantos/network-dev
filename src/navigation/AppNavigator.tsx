import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LoginScreen from '../screens/LoginScreen';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import ConnectionScreen from '../screens/ConnectionScreen';
import ConnectionsScreen from '../screens/ConnectionsScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import FeedScreen from '../screens/FeedScreen';
import LoadingScreen from '../screens/LoadingScreen';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  Main: undefined;
  Connection: { name: string; stack: string; match: string; image: string; userId?: number };
  CreateProfile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Feed: undefined;
  Connections: undefined;
  MyProfile: undefined;
};

// ─── Configuração das abas ────────────────────────────────────────────────────

const TAB_CONFIG: Record<
  keyof MainTabParamList,
  { label: string; icon: string; iconActive: string }
> = {
  Home:        { label: 'Início',   icon: 'radio-outline',         iconActive: 'radio'         },
  Feed:        { label: 'Feed',     icon: 'images-outline',        iconActive: 'images'        },
  Connections: { label: 'Conexões', icon: 'people-outline',        iconActive: 'people'        },
  MyProfile:   { label: 'Perfil',   icon: 'person-circle-outline', iconActive: 'person-circle' },
};

// ─── Tab Navigator ────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  // Altura da tab bar respeitando a safe area do dispositivo
  const tabBarHeight = 58 + insets.bottom;

  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={({ route }) => {
        const config = TAB_CONFIG[route.name as keyof MainTabParamList];

        return {
          headerShown: false,

          tabBarIcon: ({ focused, color, size }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons
                name={(focused ? config.iconActive : config.icon) as any}
                size={focused ? size + 2 : size}
                color={color}
              />
            </View>
          ),

          tabBarLabel: config.label,

          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#4A5568',

          tabBarStyle: {
            ...styles.tabBar,
            height: tabBarHeight,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          },

          tabBarLabelStyle: styles.tabBarLabel,
          tabBarItemStyle: styles.tabBarItem,
        };
      }}
    >
      <Tab.Screen name="Home"        component={HomeScreen}        />
      <Tab.Screen name="Feed"        component={FeedScreen}        />
      <Tab.Screen name="Connections" component={ConnectionsScreen} />
      <Tab.Screen name="MyProfile"   component={MyProfileScreen}   />
    </Tab.Navigator>
  );
}

// ─── Stack Navigator (raiz) ───────────────────────────────────────────────────

const Stack = createNativeStackNavigator<RootStackParamList>();

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
      {/* Fluxo de autenticação */}
      <Stack.Screen name="Loading"       component={LoadingScreen}    />
      <Stack.Screen name="Login"         component={LoginScreen}      />

      {/* App principal — contém as 4 abas */}
      <Stack.Screen name="Main"          component={MainTabNavigator} />

      {/* Telas fora das tabs (detalhes / modais) */}
      <Stack.Screen name="Connection"    component={ConnectionScreen} />
      <Stack.Screen
        name="CreateProfile"
        component={CreateProfileScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}

// ─── Estilos da tab bar ───────────────────────────────────────────────────────

const styles = StyleSheet.create({

  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#06101F',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.15)',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 20,
  },

  tabBarItem: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  iconWrapper: {
    width: 44,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconWrapperActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },

});

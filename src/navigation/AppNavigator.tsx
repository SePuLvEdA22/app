import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { MaterialIcons } from '@expo/vector-icons';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ServiceListScreen from '../screens/ServiceListScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';
import CreateServiceScreen from '../screens/CreateServiceScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs: React.FC = () => {
  const { user } = useAuth();

  const getTabScreens = () => {
    const baseScreens = [
      {
        name: 'Dashboard',
        component: DashboardScreen,
        options: {
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        },
      },
      {
        name: 'Services',
        component: ServiceListScreen,
        options: {
          tabBarLabel: 'Services',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialIcons name="list" size={size} color={color} />
          ),
        },
      },
    ];

    if (user?.role === 'coordinator') {
      baseScreens.push(
        {
          name: 'CreateService',
          component: CreateServiceScreen,
          options: {
            tabBarLabel: 'Create',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="add-circle" size={size} color={color} />
            ),
          },
        },
        {
          name: 'Reports',
          component: ReportsScreen,
          options: {
            tabBarLabel: 'Reports',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="assessment" size={size} color={color} />
            ),
          },
        }
      );
    } else if (user?.role === 'doctor') {
      baseScreens.push({
        name: 'Vitals',
        component: ServiceListScreen,
        options: {
          tabBarLabel: 'Vitals',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialIcons name="favorite" size={size} color={color} />
          ),
        },
      });
    }

    baseScreens.push({
      name: 'Profile',
      component: ProfileScreen,
      options: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <MaterialIcons name="person" size={size} color={color} />
        ),
      },
    });

    return baseScreens;
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
      }}
    >
      {getTabScreens().map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
    </Tab.Navigator>
  );
};

const AuthNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const AppNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={AppTabs} />
    <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
  </Stack.Navigator>
);

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You can add a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default App;
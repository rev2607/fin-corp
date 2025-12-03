import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '../theme';
import { RootStackParamList } from '../types';

// Screens
import { DashboardScreen } from '../screens/DashboardScreen';
import { ClientListScreen } from '../screens/ClientListScreen';
import { NewClientScreen } from '../screens/NewClientScreen';
import { EditClientScreen } from '../screens/EditClientScreen';
import { ClientDetailScreen } from '../screens/ClientDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background.secondary,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.default,
          },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            ...theme.typography.h3,
            fontWeight: '600',
          },
          headerBackTitleVisible: false,
          cardStyle: {
            backgroundColor: theme.colors.background.primary,
          },
          animationEnabled: true,
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ClientList"
          component={ClientListScreen}
          options={{ title: 'All Clients' }}
        />
        <Stack.Screen
          name="NewClient"
          component={NewClientScreen}
          options={{ title: 'New Client' }}
        />
        <Stack.Screen
          name="EditClient"
          component={EditClientScreen}
          options={{ title: 'Edit Client' }}
        />
        <Stack.Screen
          name="ClientDetail"
          component={ClientDetailScreen}
          options={{ title: 'Client Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


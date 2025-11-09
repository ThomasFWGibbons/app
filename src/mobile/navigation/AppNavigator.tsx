// FILE: src/mobile/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookingNavigator from './BookingNavigator';
import { Home, Calendar, User, PlusCircle } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Dashboard') {
              return <Home color={color} size={size} />;
            } else if (route.name === 'Book') {
              return <PlusCircle color={color} size={size} />;
            } else if (route.name === 'MyBookings') {
              return <Calendar color={color} size={size} />;
            } else if (route.name === 'Profile') {
              return <User color={color} size={size} />;
            }
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Book" component={BookingNavigator} options={{ title: 'New Booking' }}/>
      <Tab.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'My Bookings', headerShown: true }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true }}/>
    </Tab.Navigator>
  );
}


// FILE: src/mobile/navigation/BookingNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChooseServiceScreen from '../screens/booking/ChooseServiceScreen';

// FIX: Define a param list for the stack navigator to improve type safety and resolve potential type inference issues.
export type BookingStackParamList = {
  ChooseService: undefined;
};

const Stack = createNativeStackNavigator<BookingStackParamList>();

export default function BookingNavigator() {
  return (
    <React.Fragment>
      <Stack.Navigator>
        <Stack.Screen 
          name="ChooseService" 
          component={ChooseServiceScreen}
          options={{ title: 'Choose a Service' }}
        />
        {/* Add other screens in the booking flow here e.g. choose time, confirmation */}
      </Stack.Navigator>
    </React.Fragment>
  );
}

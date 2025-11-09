// FILE: src/mobile/screens/DashboardScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <Text>Welcome, {user?.email}!</Text>
        <View style={{marginTop: 20}}>
            <Button title="Log out" onPress={logout} />
        </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

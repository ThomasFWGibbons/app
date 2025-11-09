// FILE: src/mobile/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { api } = useAuth();
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password.length < 8) {
        Alert.alert('Error', 'Password must be at least 8 characters long.');
        return;
    }
    setLoading(true);
    const { response, error } = await api.POST('/auth/register', {
        body: { email, password }
    });
    setLoading(false);

    if (error) {
      Alert.alert('Registration Failed', (error as any).message || 'An error occurred.');
    } else if (response.ok) {
      Alert.alert('Success', 'Registration successful! Please log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login' as never) },
      ]);
    } else {
        Alert.alert('Registration Failed', 'An unknown error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Create Account</Text>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Sign Up" onPress={handleRegister} loading={loading} />
        <Button title="Back to Login" onPress={() => navigation.navigate('Login' as never)} variant="link" />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
});

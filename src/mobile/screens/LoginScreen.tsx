// FILE: src/mobile/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, api } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    const { response, error } = await api.POST('/auth/login', {
      body: { email, password },
    });

    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', (error as any).message || 'Please check your credentials.');
      return;
    }

    if (response.ok && response.data?.access_token) {
      await login(response.data.access_token);
    } else {
        Alert.alert('Login Failed', 'An unknown error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Login</Text>
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
        <Button title="Sign In" onPress={handleLogin} loading={loading} />
        <Button title="Create Account" onPress={() => navigation.navigate('Register' as never)} variant="link" />
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

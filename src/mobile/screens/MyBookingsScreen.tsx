// FILE: src/mobile/screens/MyBookingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyBookingsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Bookings</Text>
            <Text>You have no upcoming bookings.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    }
});

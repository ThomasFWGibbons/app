// FILE: src/mobile/screens/booking/ChooseServiceScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { components } from '../../../lib/api-schema';

type Service = components["schemas"]["ServiceRes"];

export default function ChooseServiceScreen() {
    const { api, user } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchServices() {
            if (!user?.tenantId) {
                Alert.alert("Error", "No tenant associated with your account.");
                setLoading(false);
                return;
            };

            const { data, error } = await api.GET("/tenants/{tenantId}/services", {
                params: { path: { tenantId: user.tenantId } }
            });

            if (data) {
                setServices(data.filter(s => s.active));
            } else if (error) {
                console.error("Failed to fetch services", error);
                Alert.alert("Error", "Could not load services.");
            }
            setLoading(false);
        }
        fetchServices();
    }, [api, user]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <FlatList
                data={services}
                keyExtractor={(item) => item.id!}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.itemContainer}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text>{item.duration_minutes} min</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No services available.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    itemContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
    }
});

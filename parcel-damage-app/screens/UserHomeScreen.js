import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    StatusBar, ScrollView, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme';

export default function UserHomeScreen({ navigation, route }) {
    const user = route.params?.user || {};

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout', style: 'destructive',
                onPress: async () => {
                    await AsyncStorage.removeItem('user');
                    navigation.replace('Landing');
                },
            },
        ]);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}>Hello, {user.name || 'User'} 👋</Text>
                    <Text style={styles.subtitle}>What would you like to do today?</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Stats Card */}
            <View style={styles.statsCard}>
                <View style={styles.statItem}>
                    <Text style={styles.statIcon}>📦</Text>
                    <Text style={styles.statLabel}>Login ID</Text>
                    <Text style={styles.statValue}>{user.loginid || '—'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statIcon}>✉️</Text>
                    <Text style={styles.statLabel}>Email</Text>
                    <Text style={styles.statValue} numberOfLines={1}>{user.email || '—'}</Text>
                </View>
            </View>

            {/* Main Action */}
            <TouchableOpacity
                style={styles.predictCard}
                onPress={() => navigation.navigate('Predict', { user })}
            >
                <View style={styles.predictIconCircle}>
                    <Text style={{ fontSize: 48 }}>🔍</Text>
                </View>
                <Text style={styles.predictTitle}>Scan Parcel</Text>
                <Text style={styles.predictSubtitle}>Upload or take a photo to check for damage</Text>
                <View style={styles.predictBtn}>
                    <Text style={styles.predictBtnText}>Start Prediction  →</Text>
                </View>
            </TouchableOpacity>

            {/* Info Cards */}
            <View style={styles.infoRow}>
                <View style={styles.infoCard}>
                    <Text style={{ fontSize: 28, marginBottom: 8 }}>🤖</Text>
                    <Text style={styles.infoTitle}>AI Powered</Text>
                    <Text style={styles.infoText}>ResNet34 deep learning model</Text>
                </View>
                <View style={styles.infoCard}>
                    <Text style={{ fontSize: 28, marginBottom: 8 }}>⚡</Text>
                    <Text style={styles.infoTitle}>Fast Results</Text>
                    <Text style={styles.infoText}>Instant damage assessment</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: COLORS.bg, padding: 24, paddingTop: 50 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
    welcome: { fontSize: 24, fontWeight: '800', color: COLORS.text },
    subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
    logoutBtn: { backgroundColor: COLORS.card2, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14, borderColor: COLORS.border, borderWidth: 1 },
    logoutText: { color: COLORS.danger, fontSize: 13, fontWeight: '700' },
    statsCard: { backgroundColor: COLORS.card, borderRadius: 18, padding: 20, flexDirection: 'row', marginBottom: 24, borderColor: COLORS.border, borderWidth: 1 },
    statItem: { flex: 1, alignItems: 'center' },
    statIcon: { fontSize: 24, marginBottom: 6 },
    statLabel: { fontSize: 12, color: COLORS.muted, marginBottom: 4 },
    statValue: { fontSize: 13, fontWeight: '700', color: COLORS.text },
    divider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: 10 },
    predictCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 30, alignItems: 'center', marginBottom: 24, borderColor: COLORS.primary, borderWidth: 1.5, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12 },
    predictIconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.primary + '22', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    predictTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
    predictSubtitle: { fontSize: 14, color: COLORS.muted, textAlign: 'center', marginBottom: 20 },
    predictBtn: { backgroundColor: COLORS.primary, paddingVertical: 13, paddingHorizontal: 32, borderRadius: 12, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8 },
    predictBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
    infoRow: { flexDirection: 'row', gap: 14 },
    infoCard: { flex: 1, backgroundColor: COLORS.card2, borderRadius: 16, padding: 18, borderColor: COLORS.border, borderWidth: 1 },
    infoTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
    infoText: { fontSize: 12, color: COLORS.muted },
});

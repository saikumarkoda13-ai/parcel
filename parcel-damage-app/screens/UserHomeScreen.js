import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Image,
    StatusBar, ScrollView, Alert, SafeAreaView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme';

export default function UserHomeScreen({ navigation, route }) {
    const user = route.params?.user || {};

    const handleLogout = async () => {
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to logout?')) {
                await AsyncStorage.removeItem('user');
                navigation.replace('Landing');
            }
            return;
        }
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
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTitleRow}>
                        <Image source={require('../assets/icon.png')} style={styles.headerLogo} resizeMode="contain" />
                        <View>
                            <Text style={styles.welcome}>Hello, {user.name || 'User'}</Text>
                            <Text style={styles.subtitle}>Dashboard access active</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                        <Text style={styles.logoutText}>LOGOUT</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Card */}
                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Login ID</Text>
                        <Text style={styles.statValue}>{user.loginid || '—'}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Email</Text>
                        <Text style={styles.statValue} numberOfLines={1}>{user.email || '—'}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Predict', { user })}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={[COLORS.primary, '#6366f1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.predictCardGradient}
                    >
                        <View style={styles.predictIconCircle}>
                            <Image source={require('../assets/icon.png')} style={styles.predictLogo} resizeMode="contain" />
                        </View>
                        <Text style={styles.predictTitle}>Open Scanning Portal</Text>
                        <Text style={styles.predictSubtitle}>Real-time parcel classification and damage detection</Text>
                        <View style={styles.predictBtn}>
                            <Text style={styles.predictBtnText}>LAUNCH SCANNER</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Info Cards */}
                <View style={styles.infoRow}>
                    <View style={styles.infoCard}>
                        <View style={styles.miniBadge} />
                        <Text style={styles.infoTitle}>System Status</Text>
                        <Text style={styles.infoText}>Encrypted & Active</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <View style={[styles.miniBadge, { backgroundColor: COLORS.success + '40' }]} />
                        <Text style={styles.infoTitle}>App Version</Text>
                        <Text style={styles.infoText}>v4.2.0 (Stable)</Text>
                    </View>
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.bg },
    container: { flexGrow: 1, padding: 24, paddingVertical: 20 },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerLogo: { width: 44, height: 44, borderRadius: 10, backgroundColor: COLORS.card2, borderColor: COLORS.border, borderWidth: 1 },
    welcome: { fontSize: 24, fontWeight: '900', color: COLORS.text },
    subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2, fontWeight: '600' },
    logoutBtn: { backgroundColor: COLORS.card2 + '80', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, borderColor: COLORS.border, borderWidth: 1 },
    logoutText: { color: COLORS.danger, fontSize: 13, fontWeight: '800' },
    statsCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 24, flexDirection: 'row', marginBottom: 24, borderColor: COLORS.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
    statItem: { flex: 1, alignItems: 'center' },
    statLabel: { fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    statValue: { fontSize: 15, fontWeight: '800', color: COLORS.text },
    divider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: 15, opacity: 0.5 },
    predictCardGradient: { borderRadius: 32, padding: 32, alignItems: 'center', marginBottom: 28, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.4, shadowRadius: 25, elevation: 15 },
    predictIconCircle: { width: 100, height: 100, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1 },
    predictLogo: { width: '80%', height: '80%' },
    predictTitle: { fontSize: 26, fontWeight: '900', color: COLORS.white, marginBottom: 8, letterSpacing: -0.5 },
    predictSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 24, lineHeight: 20, paddingHorizontal: 10 },
    predictBtn: { backgroundColor: COLORS.white, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
    predictBtnText: { color: COLORS.primary, fontWeight: '900', fontSize: 16, letterSpacing: 1 },
    infoRow: { flexDirection: 'row', gap: 14 },
    infoCard: { flex: 1, backgroundColor: COLORS.card2, borderRadius: 20, padding: 20, borderColor: COLORS.border, borderWidth: 1 },
    miniBadge: { width: 24, height: 4, borderRadius: 2, backgroundColor: COLORS.primaryLight + '40', marginBottom: 12 },
    infoTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
    infoText: { fontSize: 12, color: COLORS.muted, fontWeight: '600' },
});

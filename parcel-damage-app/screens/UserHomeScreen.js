import React from 'react';
import {
    Image, StatusBar, ScrollView, Alert, SafeAreaView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.welcome}>Hello, {user.name || 'User'}</Text>
                        <Text style={styles.subtitle}>Dashboard access active</Text>
                    </View>
                    <View style={styles.headerLogoContainer}>
                        <Image 
                            source={require('../assets/icon.png')} 
                            style={styles.headerLogo}
                            resizeMode="contain"
                        />
                        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                            <Text style={styles.logoutText}>LOGOUT</Text>
                        </TouchableOpacity>
                    </View>
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

                {/* Main Action */}
                <TouchableOpacity
                    style={styles.predictCard}
                    onPress={() => navigation.navigate('Predict', { user })}
                >
                    <View style={styles.predictIconCircle}>
                        <View style={styles.scanBadge} />
                    </View>
                    <Text style={styles.predictTitle}>Open Scanning Portal</Text>
                    <Text style={styles.predictSubtitle}>Real-time parcel classification and damage detection</Text>
                    <View style={styles.predictBtn}>
                        <Text style={styles.predictBtnText}>LAUNCH SCANNER</Text>
                    </View>
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
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
    headerTextContainer: { flex: 1 },
    headerLogoContainer: { alignItems: 'flex-end', gap: 8 },
    headerLogo: { width: 50, height: 50, borderRadius: 10 },
    welcome: { fontSize: 26, fontWeight: '900', color: COLORS.text },
    subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4, fontWeight: '600' },
    logoutBtn: { backgroundColor: COLORS.card2 + '80', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, borderColor: COLORS.border, borderWidth: 1 },
    logoutText: { color: COLORS.danger, fontSize: 13, fontWeight: '800' },
    statsCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 24, flexDirection: 'row', marginBottom: 24, borderColor: COLORS.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
    statItem: { flex: 1, alignItems: 'center' },
    statLabel: { fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    statValue: { fontSize: 15, fontWeight: '800', color: COLORS.text },
    divider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: 15, opacity: 0.5 },
    predictCard: { backgroundColor: COLORS.card, borderRadius: 28, padding: 30, alignItems: 'center', marginBottom: 24, borderColor: COLORS.primary, borderWidth: 1.5, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 15 },
    predictIconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    scanBadge: { width: 40, height: 40, borderRadius: 8, backgroundColor: COLORS.primary + '40', borderWidth: 2, borderColor: COLORS.primary },
    predictTitle: { fontSize: 24, fontWeight: '900', color: COLORS.text, marginBottom: 8 },
    predictSubtitle: { fontSize: 14, color: COLORS.muted, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
    predictBtn: { backgroundColor: COLORS.primary, paddingVertical: 18, paddingHorizontal: 40, borderRadius: 20, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 12 },
    predictBtnText: { color: COLORS.white, fontWeight: '900', fontSize: 16, letterSpacing: 1 },
    infoRow: { flexDirection: 'row', gap: 14 },
    infoCard: { flex: 1, backgroundColor: COLORS.card2, borderRadius: 20, padding: 20, borderColor: COLORS.border, borderWidth: 1 },
    miniBadge: { width: 24, height: 4, borderRadius: 2, backgroundColor: COLORS.primaryLight + '40', marginBottom: 12 },
    infoTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
    infoText: { fontSize: 12, color: COLORS.muted, fontWeight: '600' },
});

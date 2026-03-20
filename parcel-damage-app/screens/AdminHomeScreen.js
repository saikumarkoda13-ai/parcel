import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Image,
    StatusBar, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme';
import { getStats } from '../services/api';

export default function AdminHomeScreen({ navigation }) {
    const [stats, setStats] = useState({ total: 0, damaged: 0, intact: 0, damaged_percent: 0, intact_percent: 0 });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = useCallback(async () => {
        try {
            const res = await getStats();
            if (res.success) {
                setStats(res.stats);
            }
        } catch (e) {
            console.error("Failed to fetch dashboard stats:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchStats();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            <ScrollView 
                contentContainerStyle={styles.container} 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primaryLight} />}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <LinearGradient
                            colors={[COLORS.warning, COLORS.danger]}
                            style={styles.logoBadgeGradient}
                        >
                            <Image source={require('../assets/icon.png')} style={styles.adminLogo} resizeMode="contain" />
                        </LinearGradient>
                        <TouchableOpacity style={styles.badge} onPress={() => navigation.replace('Landing')}>
                            <Text style={styles.badgeText}>LOGOUT</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>System Control</Text>
                    <View style={styles.subRow}>
                        <View style={styles.liveIndicator} />
                        <Text style={styles.subtitle}>Real-time Analytics Dashboard</Text>
                    </View>
                </View>

                {/* Powerful Stats Section */}
                <View style={styles.dashboardCard}>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
                        style={styles.dashboardGradient}
                    >
                        <Text style={styles.cardLabel}>PARCEL SCAN OVERVIEW</Text>
                        
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{stats.total}</Text>
                                <Text style={styles.statLabel}>Total Parcels</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: COLORS.danger }]}>{stats.damaged}</Text>
                                <Text style={styles.statLabel}>Damaged</Text>
                            </View>
                        </View>

                        {/* Visual Graph Area */}
                        <View style={styles.graphContainer}>
                            <View style={styles.graphHeader}>
                                <Text style={styles.graphTitle}>Damage Intensity Ratio</Text>
                                <Text style={styles.graphValue}>{stats.damaged_percent}%</Text>
                            </View>
                            
                            {/* Custom Bar Graph */}
                            <View style={styles.barWrapper}>
                                <View style={styles.barBg}>
                                    <View style={[styles.barFill, { width: `${stats.damaged_percent}%`, backgroundColor: COLORS.danger }]} />
                                </View>
                                <View style={styles.barLabels}>
                                    <Text style={styles.barLabelText}>Severe/Damaged Cases</Text>
                                    <Text style={styles.barLabelText}>{stats.damaged} units</Text>
                                </View>
                            </View>

                            <View style={[styles.barWrapper, { marginTop: 12 }]}>
                                <View style={styles.barBg}>
                                    <View style={[styles.barFill, { width: `${stats.intact_percent}%`, backgroundColor: COLORS.success }]} />
                                </View>
                                <View style={styles.barLabels}>
                                    <Text style={styles.barLabelText}>Intact/Safe Deliveries</Text>
                                    <Text style={styles.barLabelText}>{stats.intact} units</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Management Section */}
                <Text style={styles.sectionTitle}>Management Console</Text>
                
                <View style={styles.grid}>
                    <TouchableOpacity style={styles.menuCard} onPress={() => navigation.navigate('ViewUsers')}>
                        <View style={styles.menuTop}>
                            <View style={[styles.iconCircle, { backgroundColor: COLORS.accent + '15' }]}>
                                <View style={styles.badgeLine} />
                            </View>
                            <View style={styles.arrowIcon} />
                        </View>
                        <Text style={styles.menuTitle}>User Directory</Text>
                        <Text style={styles.menuSub}>Manage active accounts</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuCard} onPress={() => navigation.navigate('ViewUsers')}>
                        <View style={styles.menuTop}>
                            <View style={[styles.iconCircle, { backgroundColor: COLORS.success + '15' }]}>
                                <View style={[styles.badgeLine, { backgroundColor: COLORS.success }]} />
                            </View>
                            <View style={styles.arrowIcon} />
                        </View>
                        <Text style={styles.menuTitle}>Activation Queue</Text>
                        <Text style={styles.menuSub}>Approve new requests</Text>
                    </TouchableOpacity>
                </View>

                {/* System Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>SYSTEM INTEGRITY</Text>
                    <View style={styles.infoRow}>
                        <View style={styles.infoDot} />
                        <Text style={styles.infoText}>ResNet34 Quantized (8-bit)</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoDot} />
                        <Text style={styles.infoText}>Render Deployment (Active)</Text>
                    </View>
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.bg },
    container: { flexGrow: 1, padding: 20 },
    header: { marginBottom: 28, marginTop: 10 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    logoBadgeGradient: { width: 54, height: 54, borderRadius: 18, padding: 10, alignItems: 'center', justifyContent: 'center' },
    adminLogo: { width: '100%', height: '100%' },
    badge: { backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    badgeText: { fontSize: 11, color: COLORS.danger, fontWeight: '900', letterSpacing: 0.5 },
    title: { fontSize: 34, fontWeight: '900', color: COLORS.text, marginBottom: 4, letterSpacing: -0.5 },
    subRow: { flexDirection: 'row', alignItems: 'center' },
    liveIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, marginRight: 8 },
    subtitle: { fontSize: 14, color: COLORS.muted, fontWeight: '600', letterSpacing: 0.2 },
    
    // Dashboard Card
    dashboardCard: { borderRadius: 32, overflow: 'hidden', marginBottom: 26, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: COLORS.card },
    dashboardGradient: { padding: 24 },
    cardLabel: { fontSize: 11, fontWeight: '900', color: COLORS.primaryLight, letterSpacing: 1.5, marginBottom: 16, opacity: 0.8 },
    statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    statItem: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: 36, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
    statLabel: { fontSize: 12, fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase' },
    statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' },
    
    // Graph Area
    graphContainer: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 20 },
    graphHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    graphTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text, opacity: 0.9 },
    graphValue: { fontSize: 18, fontWeight: '900', color: COLORS.danger },
    barWrapper: { width: '100%' },
    barBg: { height: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 5, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 5 },
    barLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
    barLabelText: { fontSize: 10, color: COLORS.muted, fontWeight: '600' },

    sectionTitle: { fontSize: 18, fontWeight: '900', color: COLORS.text, marginBottom: 16, letterSpacing: 0.5 },
    grid: { flexDirection: 'row', gap: 14, marginBottom: 24 },
    menuCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: COLORS.border },
    menuTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    iconCircle: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    badgeLine: { width: 16, height: 3, borderRadius: 1.5, backgroundColor: COLORS.accent },
    arrowIcon: { width: 8, height: 8, borderTopWidth: 2, borderRightWidth: 2, borderColor: COLORS.muted, transform: [{ rotate: '45deg' }], marginTop: 6 },
    menuTitle: { fontSize: 15, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
    menuSub: { fontSize: 11, color: COLORS.muted, fontWeight: '600' },

    infoCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
    infoTitle: { fontSize: 11, fontWeight: '900', color: COLORS.muted, marginBottom: 12, letterSpacing: 1 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    infoDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.warning, marginRight: 8 },
    infoText: { fontSize: 12, color: COLORS.text, fontWeight: '600', opacity: 0.7 },
});

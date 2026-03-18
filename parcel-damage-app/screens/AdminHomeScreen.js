import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    StatusBar, ScrollView, SafeAreaView, Platform
} from 'react-native';
import { COLORS } from '../theme';

export default function AdminHomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.badge}>Root Admin</Text>
                    <Text style={styles.title}>System Control</Text>
                    <Text style={styles.subtitle}>Administrative Dashboard</Text>
                </View>

                <View style={styles.grid}>
                    <TouchableOpacity style={styles.menuCard} onPress={() => navigation.navigate('ViewUsers')}>
                        <View style={[styles.iconCircle, { backgroundColor: COLORS.accent + '15' }]}>
                            <View style={styles.badgeLine} />
                        </View>
                        <Text style={styles.menuTitle}>User Directory</Text>
                        <Text style={styles.menuSub}>Manage active and pending registered accounts</Text>
                        <View style={styles.menuBtn}>
                            <Text style={{ color: COLORS.accent, fontWeight: '800', fontSize: 13 }}>MANAGE</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuCard} onPress={() => navigation.navigate('ViewUsers')}>
                        <View style={[styles.iconCircle, { backgroundColor: COLORS.success + '15' }]}>
                            <View style={[styles.badgeLine, { backgroundColor: COLORS.success }]} />
                        </View>
                        <Text style={styles.menuTitle}>Activation Queue</Text>
                        <Text style={styles.menuSub}>Review and approve new system access requests</Text>
                        <View style={[styles.menuBtn, { borderColor: COLORS.success }]}>
                            <Text style={{ color: COLORS.success, fontWeight: '800', fontSize: 13 }}>REVIEW</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.statusIndicator} />
                    <Text style={styles.infoTitle}>System Integrity</Text>
                    <Text style={styles.infoText}>Backend: Damage-4 Model (Render)</Text>
                    <Text style={styles.infoText}>Registry: Secure SQLite DB</Text>
                    <Text style={styles.infoText}>Inference: ResNet34 Quantized</Text>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Landing')}>
                    <Text style={styles.logoutText}>Terminate Session</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.bg },
    container: { flexGrow: 1, padding: 24, paddingVertical: 20 },
    header: { marginBottom: 32 },
    badge: { fontSize: 12, color: COLORS.warning, fontWeight: '800', backgroundColor: COLORS.warning + '18', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 14, letterSpacing: 0.5 },
    title: { fontSize: 32, fontWeight: '900', color: COLORS.text, marginBottom: 6 },
    subtitle: { fontSize: 15, color: COLORS.muted, fontWeight: '600' },
    grid: { gap: 18, marginBottom: 24 },
    menuCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 26, borderColor: COLORS.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 18, elevation: 10 },
    iconCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    badgeLine: { width: 20, height: 4, borderRadius: 2, backgroundColor: COLORS.accent },
    menuTitle: { fontSize: 20, fontWeight: '900', color: COLORS.text, marginBottom: 6 },
    menuSub: { fontSize: 14, color: COLORS.muted, marginBottom: 20, lineHeight: 20 },
    menuBtn: { alignSelf: 'flex-start', borderColor: COLORS.accent, borderWidth: 2, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
    infoCard: { backgroundColor: COLORS.card2, borderRadius: 20, padding: 24, borderColor: COLORS.border, borderWidth: 1, marginBottom: 28 },
    statusIndicator: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.warning, marginBottom: 16 },
    infoTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
    infoText: { fontSize: 13, color: COLORS.muted, marginBottom: 6, fontWeight: '600' },
    logoutBtn: { backgroundColor: COLORS.card2, borderRadius: 16, padding: 18, alignItems: 'center', borderColor: COLORS.border, borderWidth: 1 },
    logoutText: { color: COLORS.muted, fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
});

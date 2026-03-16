import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    StatusBar, ScrollView,
} from 'react-native';
import { COLORS } from '../theme';

export default function AdminHomeScreen({ navigation }) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            <View style={styles.header}>
                <Text style={styles.badge}>Admin</Text>
                <Text style={styles.title}>Admin Dashboard</Text>
                <Text style={styles.subtitle}>Manage users and system</Text>
            </View>

            <View style={styles.grid}>
                <TouchableOpacity style={styles.menuCard} onPress={() => navigation.navigate('ViewUsers')}>
                    <View style={[styles.iconCircle, { backgroundColor: COLORS.accent + '22' }]}>
                        <Text style={{ fontSize: 36 }}>👥</Text>
                    </View>
                    <Text style={styles.menuTitle}>Registered Users</Text>
                    <Text style={styles.menuSub}>View and manage all users</Text>
                    <View style={styles.menuBtn}><Text style={{ color: COLORS.accent, fontWeight: '700', fontSize: 13 }}>Open  →</Text></View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuCard} onPress={() => navigation.navigate('ViewUsers')}>
                    <View style={[styles.iconCircle, { backgroundColor: COLORS.success + '22' }]}>
                        <Text style={{ fontSize: 36 }}>✅</Text>
                    </View>
                    <Text style={styles.menuTitle}>Activate Users</Text>
                    <Text style={styles.menuSub}>Approve pending accounts</Text>
                    <View style={[styles.menuBtn, { borderColor: COLORS.success }]}>
                        <Text style={{ color: COLORS.success, fontWeight: '700', fontSize: 13 }}>Manage  →</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.infoCard}>
                <Text style={{ color: COLORS.warning, fontSize: 22, marginBottom: 10 }}>⚡</Text>
                <Text style={styles.infoTitle}>System Info</Text>
                <Text style={styles.infoText}>Django backend connected</Text>
                <Text style={styles.infoText}>ResNet34 model active</Text>
                <Text style={styles.infoText}>SQLite database running</Text>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Landing')}>
                <Text style={styles.logoutText}>🚪  Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: COLORS.bg, padding: 24, paddingTop: 60 },
    header: { marginBottom: 30 },
    badge: { fontSize: 13, color: COLORS.warning, fontWeight: '700', backgroundColor: COLORS.warning + '18', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 },
    title: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
    subtitle: { fontSize: 14, color: COLORS.muted },
    grid: { gap: 16, marginBottom: 20 },
    menuCard: { backgroundColor: COLORS.card, borderRadius: 20, padding: 24, borderColor: COLORS.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 8 },
    iconCircle: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    menuTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
    menuSub: { fontSize: 13, color: COLORS.muted, marginBottom: 16 },
    menuBtn: { alignSelf: 'flex-start', borderColor: COLORS.accent, borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
    infoCard: { backgroundColor: COLORS.card2, borderRadius: 16, padding: 20, borderColor: COLORS.border, borderWidth: 1, marginBottom: 24 },
    infoTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
    infoText: { fontSize: 13, color: COLORS.muted, marginBottom: 4 },
    logoutBtn: { backgroundColor: COLORS.card2, borderRadius: 14, padding: 16, alignItems: 'center', borderColor: COLORS.border, borderWidth: 1 },
    logoutText: { color: COLORS.muted, fontWeight: '700', fontSize: 15 },
});

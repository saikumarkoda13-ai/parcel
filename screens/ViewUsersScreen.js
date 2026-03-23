import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    StatusBar, FlatList, ActivityIndicator, Alert, RefreshControl, Platform, SafeAreaView
} from 'react-native';
import { getUsers, activateUser } from '../services/api';
import { COLORS } from '../theme';

export default function ViewUsersScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await getUsers();
            if (res.success) setUsers(res.users);
            else {
                if (Platform.OS === 'web') window.alert(res.message);
                else Alert.alert('Error', res.message);
            }
        } catch (e) {
            if (Platform.OS === 'web') window.alert('Network Error: ' + e.message);
            else Alert.alert('Network Error', e.message || 'Could not fetch users.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, []);

    const handleActivate = async (uid, name) => {
        const performActivation = async () => {
            try {
                const res = await activateUser(uid);
                if (res.success) {
                    if (Platform.OS === 'web') window.alert(res.message);
                    else Alert.alert('Success', res.message);
                    fetchUsers();
                } else {
                    if (Platform.OS === 'web') window.alert('Error: ' + res.message);
                    else Alert.alert('Error', res.message);
                }
            } catch (e) {
                const errMsg = e.response?.data?.message || e.message || 'Unknown network error';
                if (Platform.OS === 'web') window.alert('Connection Error: ' + errMsg);
                else Alert.alert('Error', 'Connection Error: ' + errMsg);
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm(`Activate account for "${name}"?`)) {
                performActivation();
            }
        } else {
            Alert.alert('Activate User?', `Activate account for "${name}"?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Activate', style: 'default', onPress: performActivation },
            ]);
        }
    };

    const renderUser = ({ item }) => (
        <View style={styles.userCard}>
            <View style={styles.avatarRow}>
                <View style={[styles.avatar, { backgroundColor: item.status === 'activated' ? COLORS.success + '20' : COLORS.warning + '20' }]}>
                    <Text style={[styles.avatarText, { color: item.status === 'activated' ? COLORS.success : COLORS.warning }]}>
                        {item.name?.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userLoginId}>ID: {item.loginid}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'activated' ? COLORS.success + '15' : COLORS.warning + '15', borderColor: item.status === 'activated' ? COLORS.success : COLORS.warning }]}>
                    <Text style={{ fontSize: 10, color: item.status === 'activated' ? COLORS.success : COLORS.warning, fontWeight: '800', textTransform: 'uppercase' }}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.detailBox}>
                <View style={styles.detailLine}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{item.email}</Text>
                </View>
                <View style={styles.detailLine}>
                    <Text style={styles.detailLabel}>Mobile:</Text>
                    <Text style={styles.detailValue}>{item.mobile}</Text>
                </View>
                {item.city ? (
                    <View style={styles.detailLine}>
                        <Text style={styles.detailLabel}>Location:</Text>
                        <Text style={styles.detailValue}>{item.city}, {item.state}</Text>
                    </View>
                ) : null}
            </View>

            {item.status !== 'activated' && (
                <TouchableOpacity style={styles.activateBtn} onPress={() => handleActivate(item.id, item.name)}>
                    <Text style={styles.activateBtnText}>Activate Account</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: COLORS.primaryLight, fontSize: 15, fontWeight: '600' }}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Directory</Text>
                <View style={styles.countBadge}>
                    <Text style={{ color: COLORS.accent, fontWeight: '900', fontSize: 13 }}>{users.length}</Text>
                </View>
            </View>

            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={{ color: COLORS.muted, marginTop: 12, fontWeight: '600' }}>Loading directory...</Text>
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderUser}
                    contentContainerStyle={{ padding: 18, paddingTop: 10 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchUsers(); }} tintColor={COLORS.primary} />}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 80 }}>
                            <View style={styles.emptyIcon} />
                            <Text style={{ color: COLORS.muted, marginTop: 16, fontSize: 15, fontWeight: '600' }}>No users found.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.bg },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 18, borderBottomColor: COLORS.border, borderBottomWidth: 1 },
    title: { fontSize: 20, fontWeight: '900', color: COLORS.text, letterSpacing: 0.5 },
    countBadge: { backgroundColor: COLORS.accent + '15', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderColor: COLORS.accent + '30', borderWidth: 1 },
    userCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 22, marginBottom: 16, borderColor: COLORS.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 6 },
    avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
    avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 20, fontWeight: '900' },
    userName: { fontSize: 18, fontWeight: '900', color: COLORS.text, marginBottom: 2 },
    userLoginId: { fontSize: 12, color: COLORS.muted, fontWeight: '700' },
    statusBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1.5 },
    detailBox: { backgroundColor: COLORS.card2 + '50', borderRadius: 16, padding: 16, gap: 10, marginBottom: 18 },
    detailLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    detailLabel: { fontSize: 12, color: COLORS.muted, fontWeight: '700' },
    detailValue: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
    activateBtn: { backgroundColor: COLORS.success, borderRadius: 14, padding: 16, alignItems: 'center', shadowColor: COLORS.success, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
    activateBtnText: { color: COLORS.white, fontWeight: '900', fontSize: 15, letterSpacing: 1 },
    emptyIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.card2, borderColor: COLORS.border, borderWidth: 2 },
});

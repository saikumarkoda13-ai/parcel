import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    StatusBar, FlatList, ActivityIndicator, Alert, RefreshControl,
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
            else Alert.alert('Error', res.message);
        } catch (e) {
            Alert.alert('Network Error', e.message || 'Could not fetch users.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, []);

    const handleActivate = async (uid, name) => {
        Alert.alert('Activate User?', `Activate account for "${name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Activate', style: 'default',
                onPress: async () => {
                    try {
                        const res = await activateUser(uid);
                        if (res.success) {
                            Alert.alert('Success', res.message);
                            fetchUsers();
                        } else {
                            Alert.alert('Error', res.message);
                        }
                    } catch (e) {
                        Alert.alert('Error', e.message || '');
                    }
                },
            },
        ]);
    };

    const renderUser = ({ item }) => (
        <View style={styles.userCard}>
            <View style={styles.avatarRow}>
                <View style={[styles.avatar, { backgroundColor: item.status === 'activated' ? COLORS.success + '30' : COLORS.warning + '30' }]}>
                    <Text style={{ fontSize: 22 }}>{item.status === 'activated' ? '✅' : '⏳'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userLoginId}>@{item.loginid}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'activated' ? COLORS.success + '20' : COLORS.warning + '20', borderColor: item.status === 'activated' ? COLORS.success : COLORS.warning }]}>
                    <Text style={{ fontSize: 11, color: item.status === 'activated' ? COLORS.success : COLORS.warning, fontWeight: '700' }}>
                        {item.status?.toUpperCase()}
                    </Text>
                </View>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detail}>📧 {item.email}</Text>
                <Text style={styles.detail}>📱 {item.mobile}</Text>
                {item.city ? <Text style={styles.detail}>🏙️ {item.city}, {item.state}</Text> : null}
            </View>

            {item.status !== 'activated' && (
                <TouchableOpacity style={styles.activateBtn} onPress={() => handleActivate(item.id, item.name)}>
                    <Text style={styles.activateBtnText}>✅  Activate User</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: COLORS.primaryLight, fontSize: 15, fontWeight: '600' }}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Registered Users</Text>
                <View style={styles.countBadge}>
                    <Text style={{ color: COLORS.accent, fontWeight: '800', fontSize: 14 }}>{users.length}</Text>
                </View>
            </View>

            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={{ color: COLORS.muted, marginTop: 12 }}>Loading users...</Text>
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderUser}
                    contentContainerStyle={{ padding: 16, paddingTop: 8 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchUsers(); }} tintColor={COLORS.primary} />}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 60 }}>
                            <Text style={{ fontSize: 40 }}>👤</Text>
                            <Text style={{ color: COLORS.muted, marginTop: 12, fontSize: 15 }}>No users registered yet.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, borderBottomColor: COLORS.border, borderBottomWidth: 1 },
    title: { fontSize: 18, fontWeight: '800', color: COLORS.text },
    countBadge: { backgroundColor: COLORS.accent + '20', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, borderColor: COLORS.accent + '50', borderWidth: 1 },
    userCard: { backgroundColor: COLORS.card, borderRadius: 18, padding: 18, marginBottom: 14, borderColor: COLORS.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6 },
    avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
    avatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
    userName: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
    userLoginId: { fontSize: 12, color: COLORS.muted },
    statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
    detailRow: { gap: 4, marginBottom: 14 },
    detail: { fontSize: 13, color: COLORS.muted },
    activateBtn: { backgroundColor: COLORS.success, borderRadius: 12, padding: 14, alignItems: 'center', shadowColor: COLORS.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    activateBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 14, letterSpacing: 0.5 },
});

import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { loginAdmin } from '../services/api';
import { COLORS } from '../theme';

export default function AdminLoginScreen({ navigation }) {
    const [loginid, setLoginid] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!loginid.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter admin credentials.');
            return;
        }
        setLoading(true);
        try {
            const res = await loginAdmin(loginid.trim(), password.trim());
            if (res.success) {
                navigation.replace('AdminHome');
            } else {
                Alert.alert('Login Failed', res.message);
            }
        } catch (e) {
            Alert.alert('Network Error', 'Cannot connect to server.\n\n' + (e.message || ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            <View style={styles.header}>
                <View style={styles.adminBadge}><Text style={{ fontSize: 40 }}>🛡️</Text></View>
                <Text style={styles.title}>Admin Portal</Text>
                <Text style={styles.subtitle}>Restricted Access Only</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.hint}>
                    <Text style={{ color: COLORS.warning, fontSize: 13 }}>
                        💡 Default credentials: admin / admin
                    </Text>
                </View>

                <Text style={styles.label}>Admin ID</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter admin ID"
                    placeholderTextColor={COLORS.border}
                    value={loginid}
                    onChangeText={setLoginid}
                    autoCapitalize="none"
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    placeholderTextColor={COLORS.border}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Admin Login  →</Text>}
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
                <Text style={{ color: COLORS.muted, fontSize: 13 }}>← Back to Home</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: COLORS.bg, alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24 },
    header: { alignItems: 'center', marginBottom: 36 },
    adminBadge: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.warning + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderColor: COLORS.warning + '60', borderWidth: 2 },
    title: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
    subtitle: { fontSize: 14, color: COLORS.muted },
    card: { width: '100%', backgroundColor: COLORS.card, borderRadius: 20, padding: 24, borderColor: COLORS.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 12 },
    hint: { backgroundColor: COLORS.warning + '18', borderRadius: 10, padding: 12, marginBottom: 16, borderColor: COLORS.warning + '40', borderWidth: 1 },
    label: { fontSize: 13, fontWeight: '700', color: COLORS.muted, marginBottom: 8, marginTop: 12 },
    input: { backgroundColor: COLORS.card2, color: COLORS.text, borderColor: COLORS.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, fontSize: 15 },
    loginBtn: { backgroundColor: COLORS.warning, paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 24, shadowColor: COLORS.warning, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 10 },
    loginBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
});

import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, StatusBar, ScrollView, ActivityIndicator, Alert,
    KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import { loginAdmin } from '../services/api';
import { COLORS } from '../theme';

export default function AdminLoginScreen({ navigation }) {
    const [loginid, setLoginid] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!loginid.trim() || !password.trim()) {
            if (Platform.OS === 'web') window.alert('Please enter admin credentials.');
            else Alert.alert('Error', 'Please enter admin credentials.');
            return;
        }
        setLoading(true);
        try {
            const res = await loginAdmin(loginid.trim(), password.trim());
            if (res.success) {
                navigation.replace('AdminHome');
            } else {
                if (Platform.OS === 'web') window.alert('Login Failed: ' + res.message);
                else Alert.alert('Login Failed', res.message);
            }
        } catch (e) {
            const errMsg = e.response?.data?.message || e.message || 'Unknown network error';
            if (Platform.OS === 'web') window.alert('Network Error: ' + errMsg);
            else Alert.alert('Network Error', 'Cannot connect to server.\n\n' + errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Text style={styles.backText}>← Back</Text>
                        </TouchableOpacity>
                        <View style={styles.adminBadge}>
                            <Text style={styles.adminBadgeText}>ADMIN</Text>
                        </View>
                        <Text style={styles.title}>Admin Portal</Text>
                        <Text style={styles.subtitle}>Secure access for administrators</Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.hint}>
                            <Text style={{ color: COLORS.warning, fontSize: 13, fontWeight: '600' }}>
                                Default Access: admin / admin
                            </Text>
                        </View>

                        <Text style={styles.label}>Admin ID</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter admin ID"
                                placeholderTextColor={COLORS.muted}
                                value={loginid}
                                onChangeText={setLoginid}
                                autoCapitalize="none"
                            />
                        </View>

                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter password"
                                placeholderTextColor={COLORS.muted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity 
                            style={[styles.loginBtn, loading && { opacity: 0.7 }]} 
                            onPress={handleLogin} 
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text style={styles.loginBtnText}>AUTHORIZE ACCESS</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.bg },
    container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 40 },
    header: { alignItems: 'center', marginBottom: 32, width: '100%' },
    backBtn: { position: 'absolute', top: -10, left: 0, padding: 8 },
    backText: { color: COLORS.muted, fontSize: 14, fontWeight: '600' },
    adminBadge: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.warning + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderColor: COLORS.warning + '40', borderWidth: 2 },
    adminBadgeText: { color: COLORS.warning, fontWeight: '900', fontSize: 16 },
    title: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginBottom: 8 },
    subtitle: { fontSize: 15, color: COLORS.muted, opacity: 0.8 },
    card: { width: '100%', backgroundColor: COLORS.card, borderRadius: 24, padding: 26, borderColor: COLORS.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 12 },
    hint: { backgroundColor: COLORS.warning + '12', borderRadius: 12, padding: 14, marginBottom: 20, borderColor: COLORS.warning + '30', borderWidth: 1 },
    label: { fontSize: 12, fontWeight: '800', color: COLORS.muted, marginBottom: 10, marginTop: 12, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card2, borderRadius: 14, borderColor: COLORS.border, borderWidth: 1, paddingHorizontal: 16, marginBottom: 4 },
    inputIcon: { display: 'none' },
    input: { flex: 1, color: COLORS.text, paddingVertical: 15, fontSize: 16 },
    loginBtn: { backgroundColor: COLORS.warning, paddingVertical: 20, borderRadius: 20, alignItems: 'center', marginTop: 28, shadowColor: COLORS.warning, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 18, elevation: 12 },
    loginBtnText: { color: '#000', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
});

import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../services/api';
import { COLORS } from '../theme';

export default function UserLoginScreen({ navigation }) {
    const [loginid, setLoginid] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!loginid.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter Login ID and Password.');
            return;
        }
        setLoading(true);
        try {
            const res = await loginUser(loginid.trim(), password.trim());
            if (res.success) {
                await AsyncStorage.setItem('user', JSON.stringify(res.user));
                navigation.replace('UserHome', { user: res.user });
            } else {
                Alert.alert('Login Failed', res.message);
            }
        } catch (e) {
            Alert.alert('Network Error', 'Cannot connect to server. Make sure Django is running.\n\n' + (e.message || ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            <View style={styles.header}>
                <Text style={styles.headerIcon}>🔑</Text>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Login ID</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your login ID"
                    placeholderTextColor={COLORS.border}
                    value={loginid}
                    onChangeText={setLoginid}
                    autoCapitalize="none"
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={COLORS.border}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />

                <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Login  →</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('UserRegister')} style={{ marginTop: 16, alignItems: 'center' }}>
                    <Text style={{ color: COLORS.muted, fontSize: 14 }}>
                        Don't have an account? <Text style={{ color: COLORS.primaryLight, fontWeight: '700' }}>Register</Text>
                    </Text>
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
    headerIcon: { fontSize: 48, marginBottom: 12 },
    title: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
    subtitle: { fontSize: 15, color: COLORS.muted },
    card: { width: '100%', backgroundColor: COLORS.card, borderRadius: 20, padding: 24, borderColor: COLORS.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 12 },
    label: { fontSize: 13, fontWeight: '700', color: COLORS.muted, marginBottom: 8, marginTop: 12 },
    input: { backgroundColor: COLORS.card2, color: COLORS.text, borderColor: COLORS.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, fontSize: 15 },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    loginBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 24, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 10 },
    loginBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
});

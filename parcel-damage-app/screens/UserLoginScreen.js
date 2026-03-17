import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, StatusBar, ScrollView, ActivityIndicator, Alert,
    KeyboardAvoidingView, Platform, SafeAreaView
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
            if (Platform.OS === 'web') window.alert('Please enter Login ID and Password.');
            else Alert.alert('Error', 'Please enter Login ID and Password.');
            return;
        }
        setLoading(true);
        try {
            const res = await loginUser(loginid.trim(), password.trim());
            if (res.success) {
                await AsyncStorage.setItem('user', JSON.stringify(res.user));
                navigation.replace('UserHome', { user: res.user });
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
                            <Text style={styles.backText}>← Home</Text>
                        </TouchableOpacity>
                        <View style={styles.logoCircle}>
                            <Text style={styles.loginShort}>LOGIN</Text>
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.label}>Login ID</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your login ID"
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
                                placeholder="Enter your password"
                                placeholderTextColor={COLORS.muted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                            />
                        </View>

                        <TouchableOpacity 
                            style={[styles.loginBtn, loading && { opacity: 0.7 }]} 
                            onPress={handleLogin} 
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.loginBtnText}>Secure Login  →</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('UserRegister')} style={styles.registerLink}>
                            <Text style={styles.registerLinkText}>
                                Don't have an account? <Text style={styles.registerLinkAction}>Register</Text>
                            </Text>
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
    logoCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.card2, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderColor: COLORS.border, borderWidth: 1 },
    loginShort: { color: COLORS.primaryLight, fontSize: 18, fontWeight: '900' },
    headerIcon: { display: 'none' },
    title: { fontSize: 30, fontWeight: '900', color: COLORS.text, marginBottom: 8 },
    subtitle: { fontSize: 16, color: COLORS.muted, opacity: 0.8 },
    card: { width: '100%', backgroundColor: COLORS.card, borderRadius: 24, padding: 26, borderColor: COLORS.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 12 },
    label: { fontSize: 13, fontWeight: '800', color: COLORS.muted, marginBottom: 10, marginTop: 12, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card2, borderRadius: 14, borderColor: COLORS.border, borderWidth: 1, paddingHorizontal: 16, marginBottom: 4 },
    inputIcon: { display: 'none' },
    input: { flex: 1, color: COLORS.text, paddingVertical: 15, fontSize: 16 },
    loginBtn: { backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 28, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 15, elevation: 10 },
    loginBtnText: { color: COLORS.white, fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
    registerLink: { marginTop: 22, alignItems: 'center' },
    registerLinkText: { color: COLORS.muted, fontSize: 14 },
    registerLinkAction: { color: COLORS.primaryLight, fontWeight: '800' },
});

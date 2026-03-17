import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, StatusBar, ScrollView, ActivityIndicator, Alert,
    KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import { registerUser } from '../services/api';
import { COLORS } from '../theme';

const Field = ({ label, value, onChange, placeholder, secure, keyboard }) => {
    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder || `Enter ${label.replace(' *', '')}`}
                    placeholderTextColor={COLORS.muted}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={secure}
                    keyboardType={keyboard || 'default'}
                    autoCapitalize="none"
                />
            </View>
        </View>
    );
};

export default function UserRegisterScreen({ navigation }) {
    const [form, setForm] = useState({ name: '', loginid: '', password: '', mobile: '', email: '' });
    const [loading, setLoading] = useState(false);

    const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

    const handleRegister = async () => {
        const { name, loginid, password, mobile, email } = form;
        if (!name || !loginid || !password || !mobile || !email) {
            if (Platform.OS === 'web') window.alert('Please fill all required fields (*).');
            else Alert.alert('Error', 'Please fill all required fields (*).');
            return;
        }
        setLoading(true);
        try {
            const res = await registerUser(form);
            if (res.success) {
                if (Platform.OS === 'web') {
                    window.alert('Success: Registration successful.');
                    navigation.navigate('UserLogin');
                } else {
                    Alert.alert('Success', res.message, [{ text: 'Login Now', onPress: () => navigation.navigate('UserLogin') }]);
                }
            } else {
                if (Platform.OS === 'web') window.alert('Registration Failed: ' + res.message);
                else Alert.alert('Registration Failed', res.message);
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
                <ScrollView 
                    contentContainerStyle={styles.container} 
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Text style={styles.backText}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join the parcel health network</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Required Information</Text>
                        <Field label="Full Name *" value={form.name} onChange={set('name')} />
                        <Field label="Login ID *" value={form.loginid} onChange={set('loginid')} />
                        <Field label="Password *" value={form.password} onChange={set('password')} secure />
                        <Field label="Mobile *" value={form.mobile} onChange={set('mobile')} keyboard="phone-pad" />
                        <Field label="Email *" value={form.email} onChange={set('email')} keyboard="email-address" />
                        

                        <TouchableOpacity 
                            style={[styles.registerBtn, loading && { opacity: 0.7 }]} 
                            onPress={handleRegister} 
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.registerBtnText}>REGISTER ACCOUNT</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('UserLogin')} style={styles.loginLink}>
                            <Text style={styles.loginLinkText}>
                                Already have an account? <Text style={styles.loginLinkAction}>Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.bg },
    container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20 },
    header: { alignItems: 'center', marginBottom: 24, width: '100%' },
    backBtn: { alignSelf: 'flex-start', padding: 8, marginBottom: 5 },
    backText: { color: COLORS.muted, fontSize: 14, fontWeight: '600' },
    headerIcon: { fontSize: 48, marginBottom: 8 },
    title: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
    subtitle: { fontSize: 14, color: COLORS.muted, opacity: 0.8 },
    card: { width: '100%', backgroundColor: COLORS.card, borderRadius: 24, padding: 24, borderColor: COLORS.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12 },
    sectionTitle: { fontSize: 13, fontWeight: '800', color: COLORS.primaryLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 4 },
    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 20, opacity: 0.5 },
    fieldContainer: { marginBottom: 16 },
    label: { fontSize: 12, fontWeight: '700', color: COLORS.muted, marginBottom: 8, marginLeft: 4 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card2, borderRadius: 14, borderColor: COLORS.border, borderWidth: 1, paddingHorizontal: 16 },
    inputIcon: { display: 'none' },
    input: { flex: 1, color: COLORS.text, paddingVertical: 14, fontSize: 16 },
    registerBtn: { backgroundColor: COLORS.primary, paddingVertical: 20, borderRadius: 20, alignItems: 'center', marginTop: 24, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 18, elevation: 12 },
    registerBtnText: { color: COLORS.white, fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
    loginLink: { marginTop: 20, alignItems: 'center' },
    loginLinkText: { color: COLORS.muted, fontSize: 14 },
    loginLinkAction: { color: COLORS.primaryLight, fontWeight: '800' },
});

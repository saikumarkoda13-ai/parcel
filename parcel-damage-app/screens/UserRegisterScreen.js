import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { registerUser } from '../services/api';
import { COLORS } from '../theme';

const Field = ({ label, value, onChange, placeholder, secure, keyboard }) => {
    return (
        <View style={{ marginBottom: 4 }}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder || `Enter ${label}`}
                placeholderTextColor={COLORS.border}
                value={value}
                onChangeText={onChange}
                secureTextEntry={secure}
                keyboardType={keyboard || 'default'}
                autoCapitalize="none"
            />
        </View>
    );
};

export default function UserRegisterScreen({ navigation }) {
    const [form, setForm] = useState({ name: '', loginid: '', password: '', mobile: '', email: '', locality: '', address: '', city: '', state: '' });
    const [loading, setLoading] = useState(false);

    const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

    const handleRegister = async () => {
        const { name, loginid, password, mobile, email } = form;
        if (!name || !loginid || !password || !mobile || !email) {
            Alert.alert('Error', 'Please fill all required fields (*).');
            return;
        }
        setLoading(true);
        try {
            const res = await registerUser(form);
            if (res.success) {
                Alert.alert('Success! 🎉', res.message, [{ text: 'Login Now', onPress: () => navigation.navigate('UserLogin') }]);
            } else {
                Alert.alert('Registration Failed', res.message);
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
                <Text style={styles.headerIcon}>📝</Text>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Fill in the details below</Text>
            </View>

            <View style={styles.card}>
                <Field label="Full Name *" value={form.name} onChange={set('name')} />
                <Field label="Login ID *" value={form.loginid} onChange={set('loginid')} />
                <Field label="Password *" value={form.password} onChange={set('password')} secure />
                <Field label="Mobile *" value={form.mobile} onChange={set('mobile')} keyboard="phone-pad" />
                <Field label="Email *" value={form.email} onChange={set('email')} keyboard="email-address" />
                <Field label="Locality" value={form.locality} onChange={set('locality')} />
                <Field label="Address" value={form.address} onChange={set('address')} />
                <Field label="City" value={form.city} onChange={set('city')} />
                <Field label="State" value={form.state} onChange={set('state')} />

                <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerBtnText}>Register  →</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('UserLogin')} style={{ marginTop: 16, alignItems: 'center' }}>
                    <Text style={{ color: COLORS.muted, fontSize: 14 }}>Already have an account? <Text style={{ color: COLORS.primaryLight, fontWeight: '700' }}>Login</Text></Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
                <Text style={{ color: COLORS.muted, fontSize: 13 }}>← Back</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: COLORS.bg, alignItems: 'center', paddingVertical: 50, paddingHorizontal: 24 },
    header: { alignItems: 'center', marginBottom: 28 },
    headerIcon: { fontSize: 42, marginBottom: 10 },
    title: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
    subtitle: { fontSize: 14, color: COLORS.muted },
    card: { width: '100%', backgroundColor: COLORS.card, borderRadius: 20, padding: 22, borderColor: COLORS.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 12 },
    label: { fontSize: 13, fontWeight: '700', color: COLORS.muted, marginBottom: 6, marginTop: 10 },
    input: { backgroundColor: COLORS.card2, color: COLORS.text, borderColor: COLORS.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, fontSize: 14 },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    registerBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 24, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 10 },
    registerBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});

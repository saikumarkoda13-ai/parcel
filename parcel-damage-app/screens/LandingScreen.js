import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, StatusBar,
    Image, Animated, Easing, SafeAreaView, Platform
} from 'react-native';
import { useEffect, useRef } from 'react';
import { COLORS, FONTS } from '../theme';

export default function LandingScreen({ navigation }) {
    const scale = useRef(new Animated.Value(0.8)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scale, { toValue: 1, duration: 700, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            <View style={styles.container}>
                <View style={styles.mainContent}>
                    <Animated.View style={[styles.heroSection, { transform: [{ scale }], opacity }]}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoIcon}>📦</Text>
                        </View>
                        <Text style={styles.title}>Parcel Damage Classification</Text>
                        <Text style={styles.subtitle}>AI-Powered Package Health Monitoring</Text>
                    </Animated.View>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('UserLogin')}>
                            <Text style={styles.primaryBtnText}>User Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate('UserRegister')}>
                            <Text style={styles.outlineBtnText}>Create Account</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('AdminLogin')}>
                            <Text style={styles.adminBtnText}>Admin Access</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.footer}>Powered by ResNet34 Deep Learning</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.bg },
    container: { flex: 1, alignItems: 'center', paddingVertical: Platform.OS === 'ios' ? 10 : 30, paddingHorizontal: 28 },
    mainContent: { flex: 1, width: '100%', justifyContent: 'space-between' },
    heroSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    logoCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.6, shadowRadius: 20, elevation: 15 },
    logoIcon: { fontSize: 56 },
    title: { fontSize: 32, fontWeight: '900', color: COLORS.text, letterSpacing: 1, marginBottom: 12, textAlign: 'center', lineHeight: 40 },
    subtitle: { fontSize: 16, color: COLORS.muted, textAlign: 'center', maxWidth: '80%', opacity: 0.8 },
    buttonGroup: { width: '100%', gap: 16, marginBottom: 20 },
    primaryBtn: { backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 15, elevation: 10 },
    primaryBtnText: { color: COLORS.white, fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
    outlineBtn: { borderColor: COLORS.border, borderWidth: 2, paddingVertical: 18, borderRadius: 16, alignItems: 'center', backgroundColor: 'transparent' },
    outlineBtnText: { color: COLORS.primaryLight, fontSize: 17, fontWeight: '800' },
    adminBtn: { backgroundColor: COLORS.card2, paddingVertical: 15, borderRadius: 16, alignItems: 'center', borderColor: COLORS.border, borderWidth: 1 },
    adminBtnText: { color: COLORS.muted, fontSize: 14, fontWeight: '700' },
    footer: { fontSize: 12, color: COLORS.border, marginTop: 15, opacity: 0.5 },
});

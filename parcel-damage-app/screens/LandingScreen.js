import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, StatusBar,
    Image, Animated, Easing,
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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            
            <View style={styles.mainContent}>
                <Animated.View style={[styles.heroSection, { transform: [{ scale }], opacity }]}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoIcon}>📦</Text>
                    </View>
                    <Text style={styles.title}>Parcel Damage Classification</Text>
                    <Text style={styles.subtitle}></Text>
                </Animated.View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('UserLogin')}>
                        <Text style={styles.primaryBtnText}>User Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate('UserRegister')}>
                        <Text style={styles.outlineBtnText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('AdminLogin')}>
                        <Text style={styles.adminBtnText}>Admin Login</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.footer}>Powered by ResNet34 Deep Learning</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
    mainContent: { flex: 1, width: '100%', justifyContent: 'space-between' },
    heroSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    logoCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 18, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.7, shadowRadius: 20, elevation: 14 },
    logoIcon: { fontSize: 52 },
    title: { fontSize: 34, fontWeight: '900', color: COLORS.text, letterSpacing: 1.2, marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 15, color: COLORS.muted, textAlign: 'center' },
    buttonGroup: { width: '100%', gap: 14, marginBottom: 20 },
    primaryBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 14, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 10 },
    primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
    outlineBtn: { borderColor: COLORS.primary, borderWidth: 2, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
    outlineBtnText: { color: COLORS.primaryLight, fontSize: 16, fontWeight: '700' },
    adminBtn: { backgroundColor: COLORS.card2, paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderColor: COLORS.border, borderWidth: 1 },
    adminBtnText: { color: COLORS.muted, fontSize: 15, fontWeight: '600' },
    footer: { fontSize: 12, color: COLORS.border, marginTop: 10 },
});

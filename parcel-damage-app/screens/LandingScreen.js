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
                            <View style={styles.parcelBox}>
                                <View style={styles.parcelFront} />
                                <View style={styles.parcelSide} />
                                <View style={styles.parcelTop} />
                                <View style={styles.parcelTape} />
                            </View>
                        </View>
                        <Text style={styles.title}>Parcel Damage Classification</Text>
                    </Animated.View>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('UserLogin')}>
                            <Text style={styles.primaryBtnText}>SIGN IN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate('UserRegister')}>
                            <Text style={styles.outlineBtnText}>REGISTER</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('AdminLogin')}>
                            <Text style={styles.adminBtnText}>ADMIN PORTAL</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.footer}>Standard Secure Protocol v4.2.0</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.bg },
    container: { flex: 1, alignItems: 'center', paddingVertical: Platform.OS === 'ios' ? 10 : 30, paddingHorizontal: 28 },
    mainContent: { flex: 1, width: '100%', justifyContent: 'space-between' },
    heroSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    logoCircle: { width: 140, height: 140, borderRadius: 35, backgroundColor: COLORS.card2, alignItems: 'center', justifyContent: 'center', marginBottom: 30, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.3, shadowRadius: 25, elevation: 20, borderColor: COLORS.border, borderWidth: 1 },
    parcelBox: { width: 60, height: 60, position: 'relative' },
    parcelFront: { position: 'absolute', width: 45, height: 45, backgroundColor: '#D2B48C', bottom: 0, left: 0, borderRadius: 4, zIndex: 2, borderWidth: 1, borderColor: '#B8860B' },
    parcelSide: { position: 'absolute', width: 30, height: 45, backgroundColor: '#BC8F8F', bottom: 5, left: 35, transform: [{ skewY: '-30deg' }], borderRadius: 2, zIndex: 1, borderWidth: 1, borderColor: '#B8860B' },
    parcelTop: { position: 'absolute', width: 45, height: 30, backgroundColor: '#DEB887', top: 0, left: 5, transform: [{ skewX: '-45deg' }], borderRadius: 2, zIndex: 1, borderWidth: 1, borderColor: '#B8860B' },
    parcelTape: { position: 'absolute', width: 12, height: '100%', backgroundColor: '#8B4513', left: 16, opacity: 0.6, zIndex: 3 },
    title: { fontSize: 34, fontWeight: '900', color: COLORS.text, letterSpacing: -0.5, marginBottom: 12, textAlign: 'center', lineHeight: 42, paddingHorizontal: 10 },
    buttonGroup: { width: '100%', gap: 16, marginBottom: 20 },
    primaryBtn: { backgroundColor: COLORS.primary, paddingVertical: 20, borderRadius: 20, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 18, elevation: 12 },
    primaryBtnText: { color: COLORS.white, fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
    outlineBtn: { borderColor: COLORS.border, borderWidth: 2, paddingVertical: 20, borderRadius: 20, alignItems: 'center', backgroundColor: 'transparent' },
    outlineBtnText: { color: COLORS.primaryLight, fontSize: 18, fontWeight: '900' },
    adminBtn: { backgroundColor: COLORS.card2, paddingVertical: 18, borderRadius: 20, alignItems: 'center', borderColor: COLORS.border, borderWidth: 1 },
    adminBtnText: { color: COLORS.muted, fontSize: 15, fontWeight: '800' },
    footer: { fontSize: 12, color: COLORS.border, marginTop: 15, opacity: 0.5 },
});

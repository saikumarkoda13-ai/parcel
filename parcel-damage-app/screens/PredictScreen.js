import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    StatusBar, ScrollView, Image, ActivityIndicator, Alert, SafeAreaView, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { predictImage } from '../services/api';
import { COLORS } from '../theme';

export default function PredictScreen({ navigation }) {
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const pickFromGallery = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) { Alert.alert('Permission needed', 'Allow gallery access to upload parcel images.'); return; }
        const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9 });
        if (!res.canceled) { setImageUri(res.assets[0].uri); setResult(null); }
    };

    const pickFromCamera = async () => {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) { Alert.alert('Permission needed', 'Allow camera access to take photos.'); return; }
        const res = await ImagePicker.launchCameraAsync({ quality: 0.9 });
        if (!res.canceled) { setImageUri(res.assets[0].uri); setResult(null); }
    };

    const handlePredict = async () => {
        if (!imageUri) {
            if (Platform.OS === 'web') window.alert('Please select or take a photo first.');
            else Alert.alert('No Image', 'Please select or take a photo first.');
            return;
        }
        console.log(`[PredictScreen] Starting prediction for: ${imageUri}`);
        setLoading(true);
        setResult(null);
        try {
            const res = await predictImage(imageUri);
            console.log(`[PredictScreen] Prediction API Response:`, res);
            if (res.success) {
                setResult(res);
            } else {
                console.error(`[PredictScreen] Prediction Failed:`, res.message);
                if (Platform.OS === 'web') window.alert('Prediction Failed: ' + res.message);
                else Alert.alert('Prediction Failed', res.message);
            }
        } catch (e) {
            console.error(`[PredictScreen] Prediction Error:`, e);
            const errMsg = e.response?.data?.message || e.message || 'Unknown network error';
            if (Platform.OS === 'web') window.alert('Error: ' + errMsg);
            else Alert.alert('Error', 'Cannot reach server. Details:\n\n' + errMsg);
        } finally {
            setLoading(false);
        }
    };

    const getResultColor = (prediction) => {
        if (prediction === 'Damaged') return COLORS.danger;
        if (prediction === 'Intact') return COLORS.success;
        return COLORS.warning;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Top bar */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={{ color: COLORS.primaryLight, fontSize: 15, fontWeight: '600' }}>← Back</Text>
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.screenTitle}>Scanner</Text>
                        <Text style={{ color: COLORS.primaryLight, fontSize: 11, fontWeight: '700', marginTop: 2, textTransform: 'uppercase' }}>ResNet34 Model</Text>
                    </View>
                    <View style={{ width: 50 }} />
                </View>

                {/* Image Preview */}
                <View style={styles.imageBox}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <View style={styles.placeholderIcon} />
                            <Text style={{ color: COLORS.muted, marginTop: 12, fontSize: 14 }}>No image selected</Text>
                        </View>
                    )}
                </View>

                {/* Pick buttons */}
                <View style={styles.pickRow}>
                    <TouchableOpacity style={styles.pickBtn} onPress={pickFromGallery}>
                        <Text style={styles.pickBtnText}>GALLERY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pickBtn} onPress={pickFromCamera}>
                        <Text style={styles.pickBtnText}>CAMERA</Text>
                    </TouchableOpacity>
                </View>

                {/* Predict button */}
                <TouchableOpacity
                    style={[styles.predictBtn, (!imageUri || loading) && { opacity: 0.5 }]}
                    onPress={handlePredict}
                    disabled={!imageUri || loading}
                >
                    {loading
                        ? <><ActivityIndicator color="#fff" style={{ marginRight: 10 }} /><Text style={styles.predictBtnText}>ANALYZING...</Text></>
                        : <Text style={styles.predictBtnText}>START CLASSIFICATION</Text>
                    }
                </TouchableOpacity>

                {/* Result Card */}
                {result && (
                    <View style={[styles.resultCard, { borderColor: result.color || getResultColor(result.prediction) }]}>
                        <Text style={styles.statusLabel}>Classification Result</Text>
                        <Text style={[styles.resultLabel, { color: result.color || getResultColor(result.prediction) }]}>
                            {result.prediction?.toUpperCase()}
                        </Text>
                        
                        {/* Severity & Decision */}
                        <View style={styles.detailsBox}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailTitle}>Injury / Severity Stage:</Text>
                                <View style={[styles.badge, { backgroundColor: result.color ? (result.color + '20') : COLORS.bg, borderColor: result.color || COLORS.border }]}>
                                    <View style={[styles.dot, { backgroundColor: result.color || COLORS.warning, shadowColor: result.color, shadowOpacity: 0.8, shadowRadius: 5 }]} />
                                    <Text style={[styles.badgeText, { color: result.color || COLORS.text }]}>
                                        {result.severity === 'Safe' ? '🟢 ' : result.severity === 'Moderate' ? '🟡 ' : result.severity === 'Severe' ? '🔴 ' : ''}
                                        {result.severity || (result.prediction === 'Intact' ? 'Safe' : 'Unknown')}
                                    </Text>
                                </View>
                            </View>
                            
                            <View style={[styles.decisionBox, { backgroundColor: (result.color || COLORS.primary) + '10', borderColor: result.color || COLORS.border }]}>
                                <Text style={[styles.decisionLabel, { color: result.color || COLORS.muted }]}>RECOMMENDED DECISION:</Text>
                                <Text style={[styles.decisionText, { color: result.color || COLORS.text }]}>
                                    “{result.decision || (result.prediction === 'Intact' ? 'Deliver normally' : 'N/A')}”
                                </Text>
                            </View>
                        </View>

                        <View style={styles.confidenceRow}>
                            <Text style={styles.confidenceLabel}>Confidence Score</Text>
                            <Text style={[styles.confidenceValue, { color: result.color || getResultColor(result.prediction) }]}>
                                {result.confidence}%
                            </Text>
                        </View>
                        {/* Confidence bar */}
                        <View style={styles.barBg}>
                            <View style={[styles.barFill, { width: `${Math.min(result.confidence, 100)}%`, backgroundColor: result.color || getResultColor(result.prediction) }]} />
                        </View>
                        <TouchableOpacity
                            style={styles.resetBtn}
                            onPress={() => { setImageUri(null); setResult(null); }}
                        >
                            <Text style={styles.resetBtnText}>Scan New Parcel</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.bg },
    container: { flexGrow: 1, padding: 24, paddingVertical: 20 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    screenTitle: { fontSize: 22, fontWeight: '900', color: COLORS.text },
    imageBox: { width: '100%', height: 260, borderRadius: 24, overflow: 'hidden', marginBottom: 20, borderColor: COLORS.border, borderWidth: 1.5, backgroundColor: COLORS.card, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15 },
    image: { width: '100%', height: '100%' },
    imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    placeholderIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.card2, borderColor: COLORS.border, borderWidth: 2 },
    pickRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
    pickBtn: { flex: 1, backgroundColor: COLORS.card2, borderRadius: 20, padding: 20, alignItems: 'center', borderColor: COLORS.border, borderWidth: 1 },
    pickBtnText: { color: COLORS.text, fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
    predictBtn: { backgroundColor: COLORS.primary, paddingVertical: 20, borderRadius: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 18, elevation: 12, marginBottom: 24 },
    predictBtnText: { color: COLORS.white, fontSize: 18, fontWeight: '900', letterSpacing: 1 },
    resultCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 28, borderWidth: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12 },
    statusLabel: { fontSize: 12, fontWeight: '800', color: COLORS.muted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
    resultLabel: { fontSize: 36, fontWeight: '900', textAlign: 'center', marginVertical: 12, letterSpacing: 1.5 },
    confidenceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    confidenceLabel: { fontSize: 14, color: COLORS.muted, fontWeight: '600' },
    confidenceValue: { fontSize: 20, fontWeight: '800' },
    barBg: { height: 12, backgroundColor: COLORS.card2, borderRadius: 6, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 6 },
    resetBtn: { marginTop: 24, paddingVertical: 15, borderRadius: 14, backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
    resetBtnText: { color: COLORS.primaryLight, fontWeight: '800', fontSize: 15 },
    detailsBox: { marginVertical: 20, backgroundColor: COLORS.card2, borderRadius: 20, padding: 20, borderWidth: 1.5, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    detailTitle: { fontSize: 16, color: COLORS.muted, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 2 },
    dot: { width: 12, height: 12, borderRadius: 6, marginRight: 10, elevation: 5 },
    badgeText: { fontSize: 18, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
    decisionBox: { marginTop: 6, padding: 18, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
    decisionLabel: { fontSize: 12, fontWeight: '900', marginBottom: 8, letterSpacing: 1, opacity: 0.8 },
    decisionText: { fontSize: 22, fontWeight: '900', textAlign: 'center', fontStyle: 'italic', letterSpacing: 0.5 },
});

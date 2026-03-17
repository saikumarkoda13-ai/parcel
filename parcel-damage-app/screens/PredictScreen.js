import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    StatusBar, ScrollView, Image, ActivityIndicator, Alert,
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
            Alert.alert('No Image', 'Please select or take a photo first.'); 
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
                Alert.alert('Prediction Failed', res.message);
            }
        } catch (e) {
            console.error(`[PredictScreen] Prediction Error:`, e);
            const errMsg = e.response?.data?.message || e.message || 'Unknown network error';
            Alert.alert('Error', 'Cannot reach server. Details:\n\n' + errMsg);
        } finally {
            setLoading(false);
        }
    };

    const getResultColor = (prediction) => {
        if (prediction === 'Damaged') return COLORS.danger;
        if (prediction === 'Intact') return COLORS.success;
        return COLORS.warning;
    };

    const getResultEmoji = (prediction) => {
        if (prediction === 'Damaged') return '⚠️';
        if (prediction === 'Intact') return '✅';
        return '❓';
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

            {/* Top bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: COLORS.primaryLight, fontSize: 15, fontWeight: '600' }}>← Back</Text>
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.screenTitle}>Parcel Scanner</Text>
                    <Text style={{ color: COLORS.primaryLight, fontSize: 11, fontWeight: '700', marginTop: 2 }}>Powered by ResNet34</Text>
                </View>
                <View style={{ width: 50 }} />
            </View>

            {/* Image Preview */}
            <View style={styles.imageBox}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={{ fontSize: 60 }}>📷</Text>
                        <Text style={{ color: COLORS.muted, marginTop: 12, fontSize: 14 }}>No image selected</Text>
                    </View>
                )}
            </View>

            {/* Pick buttons */}
            <View style={styles.pickRow}>
                <TouchableOpacity style={styles.pickBtn} onPress={pickFromGallery}>
                    <Text style={{ fontSize: 22 }}>🖼️</Text>
                    <Text style={styles.pickBtnText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pickBtn} onPress={pickFromCamera}>
                    <Text style={{ fontSize: 22 }}>📸</Text>
                    <Text style={styles.pickBtnText}>Camera</Text>
                </TouchableOpacity>
            </View>

            {/* Predict button */}
            <TouchableOpacity
                style={[styles.predictBtn, (!imageUri || loading) && { opacity: 0.5 }]}
                onPress={handlePredict}
                disabled={!imageUri || loading}
            >
                {loading
                    ? <><ActivityIndicator color="#fff" style={{ marginRight: 10 }} /><Text style={styles.predictBtnText}>Analyzing with ResNet34...</Text></>
                    : <Text style={styles.predictBtnText}>🔍  Analyze with ResNet34</Text>
                }
            </TouchableOpacity>

            {/* Result Card */}
            {result && (
                <View style={[styles.resultCard, { borderColor: getResultColor(result.prediction) }]}>
                    <Text style={{ fontSize: 52, textAlign: 'center' }}>{getResultEmoji(result.prediction)}</Text>
                    <Text style={[styles.resultLabel, { color: getResultColor(result.prediction) }]}>
                        {result.prediction}
                    </Text>
                    <View style={styles.confidenceRow}>
                        <Text style={styles.confidenceLabel}>Confidence</Text>
                        <Text style={[styles.confidenceValue, { color: getResultColor(result.prediction) }]}>
                            {result.confidence}%
                        </Text>
                    </View>
                    {/* Confidence bar */}
                    <View style={styles.barBg}>
                        <View style={[styles.barFill, { width: `${Math.min(result.confidence, 100)}%`, backgroundColor: getResultColor(result.prediction) }]} />
                    </View>
                    <TouchableOpacity 
                        style={styles.resetBtn} 
                        onPress={() => { setImageUri(null); setResult(null); }}
                    >
                        <Text style={styles.resetBtnText}>🔄  Scan Another</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: COLORS.bg, padding: 24, paddingTop: 50 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    screenTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
    imageBox: { width: '100%', height: 260, borderRadius: 20, overflow: 'hidden', marginBottom: 20, borderColor: COLORS.border, borderWidth: 1.5, backgroundColor: COLORS.card },
    image: { width: '100%', height: '100%' },
    imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    pickRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
    pickBtn: { flex: 1, backgroundColor: COLORS.card2, borderRadius: 16, padding: 18, alignItems: 'center', borderColor: COLORS.border, borderWidth: 1, gap: 6 },
    pickBtnText: { color: COLORS.text, fontWeight: '700', fontSize: 14 },
    predictBtn: { backgroundColor: COLORS.primary, paddingVertical: 17, borderRadius: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 10, marginBottom: 24 },
    predictBtnText: { color: COLORS.white, fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
    resultCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 28, borderWidth: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
    resultLabel: { fontSize: 32, fontWeight: '900', textAlign: 'center', marginVertical: 12, letterSpacing: 1 },
    confidenceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    confidenceLabel: { fontSize: 14, color: COLORS.muted, fontWeight: '600' },
    confidenceValue: { fontSize: 20, fontWeight: '800' },
    barBg: { height: 12, backgroundColor: COLORS.card2, borderRadius: 6, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 6 },
    resetBtn: { marginTop: 24, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
    resetBtnText: { color: COLORS.primaryLight, fontWeight: '700', fontSize: 14 },
});

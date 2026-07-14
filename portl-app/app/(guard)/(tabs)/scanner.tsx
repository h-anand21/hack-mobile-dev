import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../services/api/client';
import { CheckCircle, XCircle } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function QRScannerTab() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [visitorName, setVisitorName] = useState('');

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setLoading(true);
    setResult(null);

    try {
      const response = await apiClient.post('/api/qr/validate', { token: data });
      
      if (response.data.success) {
        setResult('success');
        setVisitorName(response.data.visitor.name);
        setTimeout(() => resetScanner(), 3000);
      }
    } catch (error: any) {
      setResult('error');
      Alert.alert('Invalid Pass', error.response?.data?.error || 'Failed to scan QR code');
      setTimeout(() => resetScanner(), 3000);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setResult(null);
    setVisitorName('');
  };

  if (!permission?.granted) {
    return <View className="flex-1 bg-dark" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      
      {/* Overlay */}
      <View className="flex-1">
        <View className="flex-1 bg-black/60 pt-10 items-center">
          <Text className="text-white text-2xl font-bold">Scan Guest Pass</Text>
          <Text className="text-white/70 mt-2 text-center px-8">Point the camera at the resident-generated QR pass</Text>
        </View>
        
        <View className="flex-row">
          <View className="flex-1 bg-black/60" />
          <View style={{ width: width * 0.7, height: width * 0.7 }} className="border-2 border-accent bg-transparent relative">
            <View className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-accent -mt-1 -ml-1" />
            <View className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-accent -mt-1 -mr-1" />
            <View className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-accent -mb-1 -ml-1" />
            <View className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-accent -mb-1 -mr-1" />
          </View>
          <View className="flex-1 bg-black/60" />
        </View>

        <View className="flex-1 bg-black/60 justify-center items-center pb-20">
          {loading && (
            <Animated.View entering={FadeIn} exiting={FadeOut} className="bg-dark/90 p-6 rounded-3xl items-center flex-row">
              <ActivityIndicator color="#E7FF45" className="mr-3" />
              <Text className="text-white font-bold">Verifying...</Text>
            </Animated.View>
          )}

          {result === 'success' && (
            <Animated.View entering={FadeIn} exiting={FadeOut} className="bg-green-500/20 p-6 rounded-3xl border border-green-500/30 items-center">
              <CheckCircle color="#22c55e" size={40} className="mb-2" />
              <Text className="text-white font-bold text-xl">Verified!</Text>
              <Text className="text-green-400 mt-1">{visitorName} logged as entered.</Text>
            </Animated.View>
          )}

          {result === 'error' && (
            <Animated.View entering={FadeIn} exiting={FadeOut} className="bg-red-500/20 p-6 rounded-3xl border border-red-500/30 items-center">
              <XCircle color="#ef4444" size={40} className="mb-2" />
              <Text className="text-white font-bold text-xl">Invalid Pass</Text>
            </Animated.View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

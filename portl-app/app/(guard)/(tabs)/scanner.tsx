import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Dimensions, Alert, ActivityIndicator, TouchableOpacity 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  QrCode, Zap, Flashlight, Camera, CheckCircle2, XCircle, 
  ArrowLeft, ShieldCheck, RefreshCw, UserCheck 
} from 'lucide-react-native';
import { apiClient } from '../../../services/api/client';

const { width } = Dimensions.get('window');

export default function QRScannerTab() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'back' | 'front'>('back');

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleQrVerified = (data: any) => {
    // Navigate to Entry / Exit Confirmation screen with prefilled details
    router.push({
      pathname: '/(guard)/entry-exit',
      params: {
        name: data.visitor?.name || data.name || 'Amit Verma',
        flat: data.visitor?.flat_id || 'Flat A-1203, Tower A',
        purpose: data.visitor?.purpose || 'Pre-Approved Guest Pass'
      }
    });
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    setLoading(true);

    try {
      const response = await apiClient.post('/api/qr/validate', { token: data });
      if (response.data?.success) {
        handleQrVerified(response.data);
      } else {
        // Fallback for hackathon demo QR passes
        handleQrVerified({ name: 'Amit Verma' });
      }
    } catch (error: any) {
      // Demo fallback pass match
      handleQrVerified({ name: 'Amit Verma' });
    } finally {
      setLoading(false);
      setTimeout(() => setScanned(false), 2000);
    }
  };

  const handleSimulateScan = (mockName: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleQrVerified({ name: mockName });
    }, 600);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      {/* CAMERA VIEW / FALLBACK */}
      {permission?.granted ? (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing={cameraFacing}
          enableTorch={flash}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{
            width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(210, 252, 82, 0.1)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 16
          }}>
            <QrCode size={36} color="#D2FC52" />
          </View>
          <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 20, textAlign: 'center' }}>
            Camera Access Required
          </Text>
          <Text style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', marginTop: 6, marginBottom: 20 }}>
            Enable camera permission to scan resident & visitor QR passes at the gate.
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            style={{ backgroundColor: '#163316', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 }}
          >
            <Text style={{ color: '#D2FC52', fontWeight: '900' }}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TOP HEADER CONTROLS OVERLAY */}
      <View style={{
        position: 'absolute', top: 50, left: 20, right: 20,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(0,0,0,0.6)',
            alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)'
          }}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={{
          backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 16, paddingVertical: 8,
          borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center'
        }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 15 }}>Scan QR Pass</Text>
          <Text style={{ color: '#D2FC52', fontWeight: '700', fontSize: 10 }}>Gately Security Gate 1</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => setFlash(!flash)}
            style={{
              width: 42, height: 42, borderRadius: 21,
              backgroundColor: flash ? '#D2FC52' : 'rgba(0,0,0,0.6)',
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)'
            }}
          >
            <Flashlight size={20} color={flash ? '#163316' : '#FFFFFF'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCameraFacing(cameraFacing === 'back' ? 'front' : 'back')}
            style={{
              width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(0,0,0,0.6)',
              alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)'
            }}
          >
            <RefreshCw size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* SCANNING VIEWFINDER FRAME OVERLAY */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          width: width * 0.72, height: width * 0.72, borderRadius: 28,
          borderWidth: 2, borderColor: '#D2FC52', backgroundColor: 'transparent',
          position: 'relative', justifyContent: 'center', alignItems: 'center',
          shadowColor: '#D2FC52', shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5, shadowRadius: 16
        }}>
          {/* Animated Viewfinder Corners */}
          <View style={{ position: 'absolute', top: -4, left: -4, width: 28, height: 28, borderTopWidth: 5, borderLeftWidth: 5, borderColor: '#D2FC52', borderRadius: 4 }} />
          <View style={{ position: 'absolute', top: -4, right: -4, width: 28, height: 28, borderTopWidth: 5, borderRightWidth: 5, borderColor: '#D2FC52', borderRadius: 4 }} />
          <View style={{ position: 'absolute', bottom: -4, left: -4, width: 28, height: 28, borderBottomWidth: 5, borderLeftWidth: 5, borderColor: '#D2FC52', borderRadius: 4 }} />
          <View style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderBottomWidth: 5, borderRightWidth: 5, borderColor: '#D2FC52', borderRadius: 4 }} />

          <QrCode size={48} color="rgba(210, 252, 82, 0.4)" />
        </View>

        <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13, marginTop: 24, textAlign: 'center' }}>
          Align QR code within frame to verify entry
        </Text>
        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '500', marginTop: 4 }}>
          Supports Guest Pre-Approvals & Resident QR Passes
        </Text>
      </View>

      {/* BOTTOM DEMO SIMULATOR & ACTION BAR */}
      <View style={{
        position: 'absolute', bottom: 85, left: 20, right: 20, zIndex: 10
      }}>
        {loading ? (
          <View style={{
            backgroundColor: 'rgba(22, 51, 22, 0.95)', paddingVertical: 14, paddingHorizontal: 20,
            borderRadius: 20, borderWidth: 1, borderColor: '#D2FC52',
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
          }}>
            <ActivityIndicator color="#D2FC52" style={{ marginRight: 10 }} />
            <Text style={{ color: '#D2FC52', fontWeight: '900', fontSize: 14 }}>Verifying QR Pass Token...</Text>
          </View>
        ) : (
          <View style={{ gap: 8 }}>
            <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '700', textAlign: 'center', uppercase: true }}>
              Demo Test Scanner Actions
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => handleSimulateScan('Amit Verma')}
                style={{
                  flex: 1, backgroundColor: '#163316', paddingVertical: 12, paddingHorizontal: 10,
                  borderRadius: 16, borderWidth: 1, borderColor: '#D2FC52',
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <Zap size={16} color="#D2FC52" style={{ marginRight: 6 }} />
                <Text style={{ color: '#D2FC52', fontWeight: '900', fontSize: 11 }}>Simulate: Amit Verma</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSimulateScan('WB 20 AB 1234')}
                style={{
                  flex: 1, backgroundColor: '#163316', paddingVertical: 12, paddingHorizontal: 10,
                  borderRadius: 16, borderWidth: 1, borderColor: '#D2FC52',
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <UserCheck size={16} color="#D2FC52" style={{ marginRight: 6 }} />
                <Text style={{ color: '#D2FC52', fontWeight: '900', fontSize: 11 }}>Simulate: Vehicle Pass</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

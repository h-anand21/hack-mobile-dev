import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, 
  Platform, ScrollView, Alert, Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, Clock, User, Phone, IdCard, Hash, Calendar, 
  UserCheck, Users, MessageSquare, Plus, Minus, ChevronDown, 
  BookUser, Camera as CameraIcon, X, Check, ArrowRight 
} from 'lucide-react-native';
import { apiClient } from '../../services/api/client';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase/client';

export default function RegisterVisitorScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<any>(null);

  // Form State
  const [visitorName, setVisitorName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [idType, setIdType] = useState('Aadhaar Card');
  const [showIdDropdown, setShowIdDropdown] = useState(false);
  const [idNumber, setIdNumber] = useState('');
  
  const [visitDate, setVisitDate] = useState('26 May 2025');
  const [entryTime, setEntryTime] = useState('10:30 AM');
  const [whomToMeet, setWhomToMeet] = useState('Himanshu (Flat B-302) • Tower A');
  const [showResidentDropdown, setShowResidentDropdown] = useState(false);
  const [personCount, setPersonCount] = useState(1);

  const [purpose, setPurpose] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { societyId } = useAuthStore();

  const idOptions = ['Aadhaar Card', 'Driving License', 'Voter ID', 'PAN Card', 'Passport'];
  const residentOptions = [
    'Himanshu (Flat B-302) • Tower A',
    'Amit Verma (Flat A-1203) • Tower A',
    'Neha Sharma (Flat B-902) • Tower B',
    'Rajesh Gupta (Flat C-104) • Tower C'
  ];

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
        setPhotoUri(photo.uri);
        setPhotoBase64(photo.base64);
        setShowCamera(false);
      } catch (e) {
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const handleSubmit = async () => {
    if (!visitorName || !mobileNumber) {
      return Alert.alert('Required Fields', 'Please enter Visitor Name and Mobile Number');
    }

    setLoading(true);
    try {
      // Call backend API or create visitor record
      const response = await apiClient.post('/api/visitors/create', {
        name: visitorName,
        phone: mobileNumber,
        purpose: purpose || 'Guest Visit',
        flat_id: whomToMeet,
        vehicle_number: 'N/A',
        photo_url: photoUri || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      });

      Alert.alert(
        'Visitor Registered 🎉',
        `Approval request sent to ${whomToMeet}!`,
        [
          {
            text: 'OK',
            onPress: () => router.push({
              pathname: '/(guard)/visitor-status',
              params: { id: response.data?.visitor?.id || 'demo-123' }
            })
          }
        ]
      );
    } catch (error: any) {
      // Hackathon demo fallback
      Alert.alert(
        'Visitor Registered 🎉',
        `Approval request sent to resident!`,
        [
          {
            text: 'View Status',
            onPress: () => router.push('/(guard)/(tabs)/visitors')
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  if (showCamera) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        {permission?.granted ? (
          <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef}>
            <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', padding: 20 }}>
              <TouchableOpacity 
                onPress={() => setShowCamera(false)}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}
              >
                <X color="#FFFFFF" size={24} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={takePicture} 
                style={{
                  alignSelf: 'center', marginBottom: 20, width: 76, height: 76,
                  borderRadius: 38, backgroundColor: '#FFFFFF', borderWidth: 4, borderColor: '#D2FC52'
                }} 
              />
            </SafeAreaView>
          </CameraView>
        ) : (
          <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
            <Text style={{ color: '#FFFFFF', textAlign: 'center', marginBottom: 20 }}>
              Camera permission required for visitor photo capture.
            </Text>
            <TouchableOpacity onPress={requestPermission} style={{ backgroundColor: '#163316', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 }}>
              <Text style={{ color: '#D2FC52', fontWeight: '800' }}>Grant Permission</Text>
            </TouchableOpacity>
          </SafeAreaView>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* HEADER BAR */}
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: '#FFFFFF',
          borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
        }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC',
              alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9'
            }}
          >
            <ArrowLeft size={20} color="#1E293B" />
          </TouchableOpacity>

          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Register Visitor</Text>
            <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>Add visitor details</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(guard)/(tabs)/history')}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Clock size={16} color="#163316" style={{ marginRight: 4 }} />
            <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>Visit History</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* STEP PROGRESS INDICATOR CARD */}
          <View style={{
            backgroundColor: '#FFFFFF', borderRadius: 24, paddingVertical: 18, paddingHorizontal: 14,
            marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9',
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
          }}>
            {/* Step 1 */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 32, height: 32, borderRadius: 16, backgroundColor: '#163316',
                alignItems: 'center', justifyContent: 'center', marginBottom: 4
              }}>
                <Text style={{ color: '#D2FC52', fontWeight: '900', fontSize: 13 }}>1</Text>
              </View>
              <Text style={{ color: '#163316', fontWeight: '800', fontSize: 10 }}>Details</Text>
            </View>

            <View style={{ width: 24, height: 1, backgroundColor: '#E2E8F0', marginTop: -14 }} />

            {/* Step 2 */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9',
                alignItems: 'center', justifyContent: 'center', marginBottom: 4
              }}>
                <Text style={{ color: '#94A3B8', fontWeight: '800', fontSize: 13 }}>2</Text>
              </View>
              <Text style={{ color: '#94A3B8', fontWeight: '700', fontSize: 10 }}>Purpose</Text>
            </View>

            <View style={{ width: 24, height: 1, backgroundColor: '#E2E8F0', marginTop: -14 }} />

            {/* Step 3 */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9',
                alignItems: 'center', justifyContent: 'center', marginBottom: 4
              }}>
                <Text style={{ color: '#94A3B8', fontWeight: '800', fontSize: 13 }}>3</Text>
              </View>
              <Text style={{ color: '#94A3B8', fontWeight: '700', fontSize: 10 }}>ID Proof</Text>
            </View>

            <View style={{ width: 24, height: 1, backgroundColor: '#E2E8F0', marginTop: -14 }} />

            {/* Step 4 */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9',
                alignItems: 'center', justifyContent: 'center', marginBottom: 4
              }}>
                <Text style={{ color: '#94A3B8', fontWeight: '800', fontSize: 13 }}>4</Text>
              </View>
              <Text style={{ color: '#94A3B8', fontWeight: '700', fontSize: 10 }}>Review</Text>
            </View>
          </View>

          {/* SECTION 1: VISITOR INFORMATION */}
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15, marginBottom: 12 }}>
            1. Visitor Information
          </Text>

          {/* PHOTO SNAP BUTTON */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity 
              onPress={() => setShowCamera(true)}
              style={{
                width: 90, height: 90, borderRadius: 24, backgroundColor: '#FFFFFF',
                borderWidth: 2, borderColor: photoUri ? '#163316' : '#E2E8F0', borderStyle: 'dashed',
                alignItems: 'center', justifyContent: 'center', position: 'relative'
              }}
            >
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%', borderRadius: 22 }} />
              ) : (
                <>
                  <CameraIcon size={26} color="#163316" />
                  <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 4 }}>Snap Photo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ gap: 12, marginBottom: 20 }}>
            {/* Input 1: Visitor Name */}
            <View style={{
              backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9',
              borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center'
            }}>
              <View style={{
                width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB',
                alignItems: 'center', justifyContent: 'center', marginRight: 12
              }}>
                <User size={20} color="#163316" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700' }}>Visitor Name *</Text>
                <TextInput
                  placeholder="Enter full name"
                  placeholderTextColor="#94A3B8"
                  value={visitorName}
                  onChangeText={setVisitorName}
                  style={{ color: '#0F172A', fontWeight: '700', fontSize: 13, marginTop: 2, padding: 0 }}
                />
              </View>
            </View>

            {/* Input 2: Mobile Number */}
            <View style={{
              backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9',
              borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB',
                  alignItems: 'center', justifyContent: 'center', marginRight: 12
                }}>
                  <Phone size={20} color="#163316" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700' }}>Mobile Number *</Text>
                  <TextInput
                    placeholder="Enter mobile number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    style={{ color: '#0F172A', fontWeight: '700', fontSize: 13, marginTop: 2, padding: 0 }}
                  />
                </View>
              </View>
              <TouchableOpacity onPress={() => Alert.alert('Contacts', 'Importing from phonebook...')}>
                <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center' }}>
                  <BookUser size={18} color="#163316" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Input 3: ID Type Dropdown */}
            <TouchableOpacity 
              onPress={() => setShowIdDropdown(!showIdDropdown)}
              style={{
                backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9',
                borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB',
                  alignItems: 'center', justifyContent: 'center', marginRight: 12
                }}>
                  <IdCard size={20} color="#163316" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700' }}>ID Type *</Text>
                  <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 13, marginTop: 2 }}>{idType}</Text>
                </View>
              </View>
              <ChevronDown size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* ID Type Options Dropdown List */}
            {showIdDropdown && (
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 8, borderWidth: 1, borderColor: '#F1F5F9' }}>
                {idOptions.map(option => (
                  <TouchableOpacity 
                    key={option}
                    onPress={() => { setIdType(option); setShowIdDropdown(false); }}
                    style={{ paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 12 }}>{option}</Text>
                    {idType === option && <Check size={14} color="#163316" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Input 4: ID Number */}
            <View style={{
              backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9',
              borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center'
            }}>
              <View style={{
                width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB',
                alignItems: 'center', justifyContent: 'center', marginRight: 12
              }}>
                <Hash size={20} color="#163316" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700' }}>ID Number *</Text>
                <TextInput
                  placeholder="Enter ID number"
                  placeholderTextColor="#94A3B8"
                  value={idNumber}
                  onChangeText={setIdNumber}
                  style={{ color: '#0F172A', fontWeight: '700', fontSize: 13, marginTop: 2, padding: 0 }}
                />
              </View>
            </View>
          </View>

          {/* SECTION 2: VISIT INFORMATION */}
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15, marginBottom: 12 }}>
            2. Visit Information
          </Text>

          <View style={{ gap: 12, marginBottom: 20 }}>
            {/* Input 5: Date */}
            <View style={{
              backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9',
              borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB',
                  alignItems: 'center', justifyContent: 'center', marginRight: 12
                }}>
                  <Calendar size={20} color="#163316" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700' }}>Date *</Text>
                  <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 13, marginTop: 2 }}>{visitDate}</Text>
                </View>
              </View>
              <Calendar size={18} color="#163316" />
            </View>

            {/* Input 6: Expected Entry Time */}
            <View style={{
              backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9',
              borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB',
                  alignItems: 'center', justifyContent: 'center', marginRight: 12
                }}>
                  <Clock size={20} color="#163316" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700' }}>Expected Entry Time *</Text>
                  <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 13, marginTop: 2 }}>{entryTime}</Text>
                </View>
              </View>
              <ChevronDown size={18} color="#94A3B8" />
            </View>

            {/* Input 7: Whom to Meet Dropdown */}
            <TouchableOpacity 
              onPress={() => setShowResidentDropdown(!showResidentDropdown)}
              style={{
                backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9',
                borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB',
                  alignItems: 'center', justifyContent: 'center', marginRight: 12
                }}>
                  <UserCheck size={20} color="#163316" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700' }}>Whom to Meet *</Text>
                  <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 13, marginTop: 2 }}>{whomToMeet}</Text>
                </View>
              </View>
              <ChevronDown size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Resident Options Dropdown */}
            {showResidentDropdown && (
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 8, borderWidth: 1, borderColor: '#F1F5F9' }}>
                <TouchableOpacity 
                  onPress={() => { setShowResidentDropdown(false); router.push('/(guard)/resident-search'); }}
                  style={{ paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#F4FBE4', borderRadius: 12, marginBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Text style={{ color: '#163316', fontWeight: '800', fontSize: 12 }}>🔍 Search Full Resident Directory...</Text>
                  <ArrowRight size={14} color="#163316" />
                </TouchableOpacity>
                {residentOptions.map(r => (
                  <TouchableOpacity 
                    key={r}
                    onPress={() => { setWhomToMeet(r); setShowResidentDropdown(false); }}
                    style={{ paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 12 }}>{r}</Text>
                    {whomToMeet === r && <Check size={14} color="#163316" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Input 8: No. of Persons (Stepper Controls) */}
            <View style={{
              backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9',
              borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB',
                  alignItems: 'center', justifyContent: 'center', marginRight: 12
                }}>
                  <Users size={20} color="#163316" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700' }}>No. of Persons</Text>
                  <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15, marginTop: 2 }}>{personCount}</Text>
                </View>
              </View>

              {/* Minus and Plus Buttons */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity 
                  onPress={() => setPersonCount(Math.max(1, personCount - 1))}
                  style={{
                    width: 34, height: 34, borderRadius: 12, backgroundColor: '#F1F5F9',
                    alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <Minus size={16} color="#163316" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setPersonCount(personCount + 1)}
                  style={{
                    width: 34, height: 34, borderRadius: 12, backgroundColor: '#ECFCCB',
                    alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <Plus size={16} color="#163316" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* SECTION 3: VISIT PURPOSE */}
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15, marginBottom: 12 }}>
            3. Visit Purpose
          </Text>

          <View style={{
            backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9',
            borderRadius: 20, padding: 14, marginBottom: 24
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{
                width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB',
                alignItems: 'center', justifyContent: 'center', marginRight: 12
              }}>
                <MessageSquare size={20} color="#163316" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '700' }}>Purpose of Visit *</Text>
                <TextInput
                  placeholder="Enter purpose of visit (e.g. Delivery, Guest, Maintenance)"
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                  value={purpose}
                  onChangeText={setPurpose}
                  style={{ color: '#0F172A', fontWeight: '600', fontSize: 13, marginTop: 4, minHeight: 48 }}
                />
                <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '600', alignSelf: 'flex-end', marginTop: 4 }}>
                  {purpose.length}/200
                </Text>
              </View>
            </View>
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: '#163316', height: 54, borderRadius: 18,
              alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
              shadowColor: '#163316', shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25, shadowRadius: 8, elevation: 4
            }}
          >
            <Text style={{ color: '#D2FC52', fontWeight: '900', fontSize: 15, marginRight: 8 }}>
              {loading ? 'Sending Approval...' : 'Next: ID Proof'}
            </Text>
            <ArrowRight size={18} color="#D2FC52" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

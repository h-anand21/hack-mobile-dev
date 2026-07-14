import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, Zap, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    title: 'Welcome to Portl',
    description: 'The smart, seamless society management platform for modern communities.',
    icon: <Users size={80} color="#E7FF45" />,
  },
  {
    title: 'Lightning Fast Approvals',
    description: 'Approve guests, deliveries, and cabs in seconds right from your phone.',
    icon: <Zap size={80} color="#E7FF45" />,
  },
  {
    title: 'Secure & Transparent',
    description: 'Keep your society safe with real-time logs and verified entry passes.',
    icon: <ShieldCheck size={80} color="#E7FF45" />,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const skip = () => {
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="flex-1 justify-center items-center px-6">
        <Animated.View
          key={`icon-${step}`}
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(300)}
          className="w-40 h-40 bg-white/5 rounded-full items-center justify-center mb-10"
        >
          {ONBOARDING_STEPS[step].icon}
        </Animated.View>

        <Animated.View
          key={`text-${step}`}
          entering={FadeInDown.duration(500).delay(200)}
          exiting={FadeOut.duration(300)}
          className="items-center"
        >
          <Text className="text-white text-3xl font-bold mb-4 text-center">
            {ONBOARDING_STEPS[step].title}
          </Text>
          <Text className="text-textSecondary text-base text-center leading-6">
            {ONBOARDING_STEPS[step].description}
          </Text>
        </Animated.View>
      </View>

      {/* Pagination & Controls */}
      <View className="px-6 pb-12">
        <View className="flex-row justify-center mb-10">
          {ONBOARDING_STEPS.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 transition-all duration-300 ${
                index === step ? 'w-8 bg-accent' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </View>

        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={skip} className="p-4">
            <Text className="text-textSecondary font-semibold">Skip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={nextStep}
            className="bg-accent px-8 py-4 rounded-full shadow-card"
          >
            <Text className="text-dark font-bold text-lg">
              {step === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

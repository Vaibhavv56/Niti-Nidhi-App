import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens
import { AuthChoiceScreen, SignInScreen, SignUpScreen } from './AuthScreens';
import { DashboardScreen } from './(tabs)/index';

// --- ONBOARDING DATA ---
const onboardingData = [
  {
    id: 1,
    title: "One App,\nMany Services",
    description: "Access government schemes, jobs, complaints, news, and helplines easily from one simple app.",
    icon: "cellphone-text", 
    iconLib: MaterialCommunityIcons,
    decorIcons: [
      { name: "bell-outline", top: 10, left: 20 },
      { name: "email-outline", top: 40, right: 20 },
      { name: "map-marker-outline", bottom: 20, left: 30 }
    ]
  },
  {
    id: 2,
    title: "Speak, Listen, and\nUnderstand",
    description: "Use Hindi or English with voice guidance and audio support.",
    icon: "account-voice", 
    iconLib: MaterialCommunityIcons,
    decorIcons: [
      { name: "microphone-outline", top: 10, right: 30 },
      { name: "translate", bottom: 30, left: 20 }
    ]
  },
  {
    id: 3,
    title: "Track, Store, and Stay\nInformed",
    description: "Apply for schemes, track complaint status, and safely store your important documents.",
    icon: "chart-timeline-variant", 
    iconLib: MaterialCommunityIcons,
    decorIcons: [
      { name: "file-document-outline", top: 20, left: 20 },
      { name: "folder-lock-outline", top: 50, right: 20 }
    ]
  }
];

// Helper Component for Illustrations
const Illustration = ({ item }) => {
  return (
    <View style={styles.illustrationContainer}>
      <View style={styles.illustrationCircle}>
        <item.iconLib name={item.icon} size={100} color="#1E3A8A" />
      </View>
      {item.decorIcons.map((d, i) => (
        <View key={i} style={[styles.decorIcon, { top: d.top, left: d.left, right: d.right, bottom: d.bottom }]}>
          <MaterialCommunityIcons name={d.name} size={24} color="#8194F2" />
        </View>
      ))}
      <View style={styles.phoneFrame} />
    </View>
  );
};

// --- ROOT APP ---
export default function App() {
  // Debug: log imported screens to ensure they are defined
  console.log('App imports check', {
    AuthChoiceScreen: typeof AuthChoiceScreen,
    SignInScreen: typeof SignInScreen,
    SignUpScreen: typeof SignUpScreen,
    DashboardScreen: typeof DashboardScreen,
  });
  const [screen, setScreen] = useState('splash');
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => {
        setScreen('onboarding');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  useEffect(() => {
    if (screen === 'onboarding' && step === 0) {
      const timer = setTimeout(() => {
        setStep(1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const handleNext = () => {
    if (step < onboardingData.length - 1) {
      setStep(step + 1);
    } else {
      setScreen('authChoice');
    }
  };

  const handleSkip = () => {
    setScreen('authChoice');
  };

  // SPLASH SCREEN
  if (screen === 'splash') {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#879BF0" />
        <View style={styles.splashLogoBox}>
          <MaterialCommunityIcons name="bank" size={40} color="#1E3A8A" />
          <View style={{ width: 10 }} />
          <View>
            <Text style={styles.splashLogoText}>Niti Nidhi</Text>
          </View>
        </View>
        <Text style={styles.splashDescription}>
          Niti Nidhi brings government services closer to you.
          Access schemes, jobs, complaints, and support easily in one place.
        </Text>
      </View>
    );
  }

  // AUTH CHOICE SCREEN
  if (screen === 'authChoice') {
    return (
      <AuthChoiceScreen 
        onSignIn={() => setScreen('signIn')} 
        onCreateAccount={() => setScreen('signUp')} 
      />
    );
  }

  // SIGN IN SCREEN - After clicking "Sign in" button, goes to 'main' (Dashboard)
  if (screen === 'signIn') {
    return (
      <SignInScreen 
        onBack={() => setScreen('authChoice')} 
        onSubmit={() => setScreen('main')} 
      />
    );
  }

  // SIGN UP SCREEN
  if (screen === 'signUp') {
    return (
      <SignUpScreen 
        onBack={() => setScreen('authChoice')} 
        onSubmit={() => setScreen('main')} 
      />
    );
  }

  // DASHBOARD SCREEN (Main App)
  if (screen === 'main') {
    return <DashboardScreen onLogout={() => setScreen('splash')} />;
  }

  // ONBOARDING SCREENS
  const currentItem = onboardingData[step];

  return (
    <View style={styles.onboardingContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.onboardingImageSection}>
        <Illustration item={currentItem} />
      </View>

      <View style={styles.onboardingContent}>
        <Text style={styles.onboardingTitle}>{currentItem.title}</Text>
        <Text style={styles.onboardingDesc}>{currentItem.description}</Text>

        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                step === index ? styles.dotActive : styles.dotInactive
              ]} 
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#879BF0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  splashLogoBox: {
    flexDirection: 'row',
    backgroundColor: '#E0E7FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  splashLogoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  splashDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  onboardingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  onboardingImageSection: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  illustrationContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  illustrationCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  phoneFrame: {
    position: 'absolute',
    width: 200,
    height: 350,
    borderWidth: 8,
    borderColor: '#1E3A8A',
    borderRadius: 30,
    opacity: 0.05,
    zIndex: 1,
  },
  decorIcon: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 3,
  },
  onboardingContent: {
    flex: 0.45,
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 40,
  },
  onboardingTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 16,
  },
  onboardingDesc: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#3B5998',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#D1D5DB',
  },
  nextButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#1F2937',
    fontWeight: '600',
    fontSize: 16,
  },
});

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// --- AUTH CHOICE SCREEN ---
export function AuthChoiceScreen({ onSignIn, onCreateAccount }) {
  return (
    <SafeAreaView style={styles.authContainer}>
      <View style={styles.authContentCentered}>
        {/* Isometric City Illustration Placeholder */}
        <View style={styles.illustrationContainer}>
           <View style={{ position: 'relative', width: 280, height: 250, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name="city-variant-outline" size={180} color="#E0E7FF" style={{ opacity: 0.8 }} />
              <MaterialCommunityIcons name="bank" size={80} color="#1E3A8A" style={{ position: 'absolute', bottom: 40 }} />
              <MaterialCommunityIcons name="cube-outline" size={40} color="#E0E7FF" style={{ position: 'absolute', top: 20, right: 30 }} />
              <MaterialCommunityIcons name="cube-outline" size={30} color="#E0E7FF" style={{ position: 'absolute', top: 80, left: 20 }} />
              <MaterialCommunityIcons name="shield-check-outline" size={40} color="#E0E7FF" style={{ position: 'absolute', top: 10, left: 60 }} />
           </View>
        </View>

        <View style={styles.logoRow}>
          <MaterialCommunityIcons name="bank" size={36} color="#1E3A8A" />
          <Text style={styles.logoTextLarge}>Niti Nidhi</Text>
        </View>

        <Text style={styles.taglineText}>
          Governance that{'\n'}reaches everyone
        </Text>

 <View style={styles.bottomAuthSection}>
  <TouchableOpacity
    style={styles.primaryAuthButton}
    onPress={onSignIn}
  >
    <Text style={styles.primaryAuthButtonText}>Sign in</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={onCreateAccount}
    style={{ marginTop: 20 }}
  >
    <Text style={styles.linkText}>Create a new account</Text>
  </TouchableOpacity>
</View>

      </View>
    </SafeAreaView>
  );
}

// --- SIGN IN SCREEN ---
export function SignInScreen({ onBack, onSubmit }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.authScreenContainer}>
      {/* Back Button Header */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
        </TouchableOpacity>
      </View>

      <View style={styles.authHeader}>
        <View style={styles.logoRowCentered}>
           <MaterialCommunityIcons name="bank" size={42} color="#1E3A8A" />
           <Text style={styles.logoTextLarge}>Niti Nidhi</Text>
        </View>
      </View>
      
      <View style={styles.authFormContainer}>
        <Text style={styles.authPageTitle}>Sign in{'\n'}to Account</Text>
        
        <TextInput 
          style={styles.authInput} 
          placeholder="Enter Username" 
          placeholderTextColor="#9CA3AF"
          value={mobile}
          onChangeText={setMobile}
        />
        
        <TextInput 
          style={styles.authInput} 
          placeholder="Password" 
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity
  style={styles.primaryAuthButton}
  onPress={() => onSubmit(mobile, password)}
>

          <Text style={styles.primaryAuthButtonText}>Sign in</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ marginTop: 20, alignSelf: 'center' }}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- CREATE ACCOUNT SCREEN ---
export function SignUpScreen({ onBack, onSubmit }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  return (
    <SafeAreaView style={styles.authScreenContainer}>
      {/* Back Button Header */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
        </TouchableOpacity>
      </View>

      <View style={styles.authHeader}>
        <View style={styles.logoRowCentered}>
           <MaterialCommunityIcons name="bank" size={42} color="#1E3A8A" />
           <Text style={styles.logoTextLarge}>Niti Nidhi</Text>
        </View>
      </View>
      
      <View style={styles.authFormContainer}>
        <Text style={styles.authPageTitle}>Create a{'\n'}new account</Text>
        
        <TextInput 
          style={styles.authInput} 
          placeholder="Name" 
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput 
          style={styles.authInput} 
          placeholder="Enter Mobile No" 
          placeholderTextColor="#9CA3AF"
          value={mobile}
          onChangeText={setMobile}
          autoCapitalize="none"  // ← ADD THIS
          keyboardType="default"  // ← AND THIS
        />
        
        <TouchableOpacity style={styles.primaryAuthButton} onPress={onSubmit}>
          <Text style={styles.primaryAuthButtonText}>Send OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- AUTH STYLES ---
  authContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  authContentCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  illustrationContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 30,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  logoRowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoTextLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  taglineText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
    textAlign: 'center',
    marginBottom: 50,
  },
  bottomAuthSection: {
    width: '100%',
    alignItems: 'center',
  },
  primaryAuthButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryAuthButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Auth Form Screens
  authScreenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  authHeader: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authFormContainer: {
    flex: 0.75,
    paddingHorizontal: 30,
  },
  authPageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 30,
    lineHeight: 40,
  },
  authInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#4B5563',
    fontWeight: '500',
    fontSize: 14,
  },
});

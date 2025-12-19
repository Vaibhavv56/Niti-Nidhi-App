import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
  Switch,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ComplaintFormScreen = ({ onBack, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categoryLabel, setCategoryLabel] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [locationLabel, setLocationLabel] = useState('');
  const [isUrban, setIsUrban] = useState(false);

  // Dropdown states
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Voice guidance states
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [language, setLanguage] = useState('english'); // 'english' or 'hindi'
  const [isSpeaking, setIsSpeaking] = useState(false);

  const USER_ID = '372e2695-79ad-4547-8627-3e95898938b4';

  // Category options
  const CATEGORIES = [
    { value: 'water_supply', label: 'Water Supply' },
    { value: 'sanitation', label: 'Sanitation' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'roads', label: 'Roads & Infrastructure' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'public_safety', label: 'Public Safety' },
    { value: 'welfare_schemes', label: 'Welfare Schemes' },
    { value: 'land_disputes', label: 'Land Disputes' },
  ];

  // Location options
  const LOCATIONS = [
    { id: 'a4a7c926-440b-452a-b14f-90602555117b', name: 'Ambegaon' },
    { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Baramati' },
    { id: 'd4b567f8-4ec4-4332-8d16-91a89cdae82e', name: 'Bhor' },
    { id: 'e54ffd2b-a5eb-4c43-bba9-6cce694f034a', name: 'Daund' },
    { id: '8b9e0ada-585f-4706-abd8-ba71bbc58dc2', name: 'Haveli' },
    { id: '9d309ddd-9bd1-476b-b6a8-44ccecb7cda0', name: 'Indapur' },
    { id: 'bb5ee307-05c5-41eb-9c4c-f2b75475495c', name: 'Junnar' },
    { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Khed' },
    { id: 'a4d6b520-0d8c-4646-bbde-4131accfcad0', name: 'Malegaon' },
    { id: '7cc11935-1954-4b1e-81b2-5a50f4f6f68b', name: 'Maval' },
    { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Mulshi' },
    { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Pune City' },
    { id: '42c89214-b48d-4893-86d1-ac868b24c5a0', name: 'Purandhar' },
    { id: '88af3126-7492-4c6d-941d-24876fbd97ab', name: 'Rajgurunagar' },
    { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Shirur' },
    { id: '69b00002-26fb-4e6b-8510-6bda902299ca', name: 'Velhe' },
  ];

  useEffect(() => {
    fetchUserData();
    
    // Cleanup function
    return () => {
      Speech.stop();
    };
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get the access token from AsyncStorage
      const token = await AsyncStorage.getItem('@access_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      console.log('Fetching user data with token...');

      const response = await fetch(
        `https://7e3777787c19.ngrok-free.app/api/users/${USER_ID}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          },
        }
      );

      console.log('User data response status:', response.status);

      // Get raw response text first
      const rawText = await response.text();
      console.log('User data raw response:', rawText);

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error(`Server error: ${rawText.substring(0, 100)}`);
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data?.message || data?.detail || 'Failed to fetch user data');
      }

      console.log('User data fetched successfully:', data);
      setUserData(data);
      
      // Play welcome voice guidance after a short delay
      setTimeout(() => {
        if (voiceEnabled) {
          playVoiceGuidance('welcome');
        }
      }, 500);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to load your profile information. Please try again.',
        [{ text: 'OK', onPress: onBack }]
      );
    } finally {
      setLoading(false);
    }
  };

  const playVoiceGuidance = async (type) => {
    if (!voiceEnabled) return;

    const messages = {
      english: {
        welcome: 'Welcome to the complaint form. Please fill in all required fields to submit your complaint.',
        title: 'Enter a brief title that summarizes your complaint.',
        category: 'Select the category that best matches your complaint from the dropdown list.',
        location: 'Select your location from the dropdown list.',
        description: 'Provide a detailed description of your complaint. Write at least 20 characters.',
        submit: 'Please review your complaint carefully before submitting. Make sure all required fields are filled.',
        categorySelected: 'Category selected.',
        locationSelected: 'Location selected.',
      },
      hindi: {
        welcome: 'शिकायत फॉर्म में आपका स्वागत है। कृपया अपनी शिकायत सबमिट करने के लिए सभी आवश्यक फ़ील्ड भरें।',
        title: 'एक संक्षिप्त शीर्षक दर्ज करें जो आपकी शिकायत का सारांश देता है।',
        category: 'ड्रॉपडाउन सूची से वह श्रेणी चुनें जो आपकी शिकायत से सबसे अच्छी तरह मेल खाती है।',
        location: 'ड्रॉपडाउन सूची से अपना स्थान चुनें।',
        description: 'अपनी शिकायत का विस्तृत विवरण प्रदान करें। कम से कम 20 अक्षर लिखें।',
        submit: 'कृपया जमा करने से पहले अपनी शिकायत की सावधानीपूर्वक समीक्षा करें। सुनिश्चित करें कि सभी आवश्यक फ़ील्ड भरे गए हैं।',
        categorySelected: 'श्रेणी चयनित।',
        locationSelected: 'स्थान चयनित।',
      },
    };

    try {
      // Stop any ongoing speech
      await Speech.stop();
      
      const message = messages[language][type];
      const languageCode = language === 'hindi' ? 'hi-IN' : 'en-US';
      
      console.log('Playing voice guidance:', message);
      
      setIsSpeaking(true);
      
      await Speech.speak(message, {
        language: languageCode,
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Error playing voice guidance:', error);
      setIsSpeaking(false);
    }
  };

  const stopVoiceGuidance = async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error stopping voice guidance:', error);
    }
  };

  const handleCategorySelect = (value, label) => {
    setCategory(value);
    setCategoryLabel(label);
    setShowCategoryDropdown(false);
    if (voiceEnabled) {
      playVoiceGuidance('categorySelected');
    }
  };

  const handleLocationSelect = (id, name) => {
    setLocation(id);
    setLocationLabel(name);
    setShowLocationDropdown(false);
    
    // Determine if location is urban (Pune City is urban)
    setIsUrban(id === '550e8400-e29b-41d4-a716-446655440001');
    
    if (voiceEnabled) {
      playVoiceGuidance('locationSelected');
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a complaint title.');
      return false;
    }

    if (!category) {
      Alert.alert('Validation Error', 'Please select a category.');
      return false;
    }

    if (!location) {
      Alert.alert('Validation Error', 'Please select a location.');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description.');
      return false;
    }

    if (description.trim().length < 20) {
      Alert.alert('Validation Error', 'Description should be at least 20 characters long.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (voiceEnabled) {
      playVoiceGuidance('submit');
    }

    Alert.alert(
      'Submit Complaint',
      'Are you sure you want to submit your complaint?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: submitComplaint,
        },
      ]
    );
  };

  const submitComplaint = async () => {
    try {
      setSubmitting(true);

      // Get the access token from AsyncStorage
      const token = await AsyncStorage.getItem('@access_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const complaintData = {
        title: title.trim(),
        description: description.trim(),
        category: category,
        location: location,
        citizen_name: userData.username,
        citizen_phone: userData.phone_number,
        is_urban: isUrban,
      };

      console.log('Submitting complaint:', complaintData);

      const response = await fetch(
        'https://7e3777787c19.ngrok-free.app/api/complaints/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify(complaintData),
        }
      );

      console.log('Complaint response status:', response.status);

      // Get raw response text first
      const rawText = await response.text();
      console.log('Complaint raw response:', rawText);

      // Try to parse JSON
      let result;
      try {
        result = JSON.parse(rawText);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        if (response.ok) {
          // If response is OK but not JSON, consider it success
          result = { message: 'Complaint submitted successfully' };
        } else {
          throw new Error(`Server error: ${rawText.substring(0, 100)}`);
        }
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(result?.message || result?.detail || 'Failed to submit complaint');
      }
      
      Alert.alert(
        'Success',
        'Your complaint has been submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              if (onSuccess) onSuccess();
              onBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting complaint:', error);
      Alert.alert(
        'Submission Failed',
        error.message || 'Failed to submit your complaint. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Loading your information...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>File a Complaint</Text>

          <TouchableOpacity 
            onPress={isSpeaking ? stopVoiceGuidance : null}
            style={styles.headerActions}
          >
            {isSpeaking && (
              <MaterialCommunityIcons name="volume-high" size={24} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Form Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>File a new Complaint</Text>

        {/* Voice Guidance Controls */}
        <View style={styles.voiceControlsContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-voice" size={20} color="#1E3A8A" />
            <Text style={styles.sectionTitle}>Voice Guidance</Text>
          </View>
          
          <View style={styles.voiceControls}>
            {/* Voice On/Off */}
            <View style={styles.controlRow}>
              <View style={styles.controlLabel}>
                <MaterialCommunityIcons 
                  name={voiceEnabled ? "volume-high" : "volume-off"} 
                  size={20} 
                  color="#1E3A8A" 
                />
                <Text style={styles.controlText}>Enable Voice</Text>
              </View>
              <Switch
                value={voiceEnabled}
                onValueChange={(value) => {
                  setVoiceEnabled(value);
                  if (!value) {
                    stopVoiceGuidance();
                  }
                }}
                trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                thumbColor={voiceEnabled ? '#1E3A8A' : '#64748B'}
              />
            </View>

            {/* Language Selection */}
            <View style={styles.controlRow}>
              <View style={styles.controlLabel}>
                <MaterialCommunityIcons name="translate" size={20} color="#1E3A8A" />
                <Text style={styles.controlText}>Language</Text>
              </View>
              <View style={styles.languageButtons}>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    language === 'english' && styles.languageButtonActive
                  ]}
                  onPress={() => {
                    setLanguage('english');
                    stopVoiceGuidance();
                  }}
                >
                  <Text style={[
                    styles.languageButtonText,
                    language === 'english' && styles.languageButtonTextActive
                  ]}>
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    language === 'hindi' && styles.languageButtonActive
                  ]}
                  onPress={() => {
                    setLanguage('hindi');
                    stopVoiceGuidance();
                  }}
                >
                  <Text style={[
                    styles.languageButtonText,
                    language === 'hindi' && styles.languageButtonTextActive
                  ]}>
                    हिंदी
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {isSpeaking && (
            <TouchableOpacity 
              style={styles.stopSpeakingButton}
              onPress={stopVoiceGuidance}
            >
              <MaterialCommunityIcons name="stop-circle" size={20} color="#EF4444" />
              <Text style={styles.stopSpeakingText}>Stop Voice</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Personal Information (Non-editable) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account" size={20} color="#1E3A8A" />
            <Text style={styles.sectionTitle}>Your Information</Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{userData.username}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{userData.phone_number}</Text>
            </View>
          </View>
          <Text style={styles.helperText}>
            This information cannot be edited
          </Text>
        </View>

        <View style={styles.formCard}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title: *</Text>
            <TouchableOpacity
              style={styles.voiceHintButton}
              onPress={() => playVoiceGuidance('title')}
              disabled={!voiceEnabled}
            >
              <MaterialCommunityIcons 
                name="help-circle" 
                size={16} 
                color={voiceEnabled ? "#1E3A8A" : "#CBD5E1"} 
              />
              <Text style={[
                styles.voiceHintText,
                !voiceEnabled && styles.voiceHintTextDisabled
              ]}>
                Tap for voice guidance
              </Text>
            </TouchableOpacity>
            <TextInput 
              style={styles.input} 
              placeholderTextColor="#9CA3AF"
              placeholder="Enter complaint title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Category Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category: *</Text>
            <TouchableOpacity
              style={styles.voiceHintButton}
              onPress={() => playVoiceGuidance('category')}
              disabled={!voiceEnabled}
            >
              <MaterialCommunityIcons 
                name="help-circle" 
                size={16} 
                color={voiceEnabled ? "#1E3A8A" : "#CBD5E1"} 
              />
              <Text style={[
                styles.voiceHintText,
                !voiceEnabled && styles.voiceHintTextDisabled
              ]}>
                Tap for voice guidance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownInput}
              onPress={() => setShowCategoryDropdown(true)}
            >
              <Text style={categoryLabel ? styles.dropdownText : styles.dropdownPlaceholder}>
                {categoryLabel || 'Select category'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Location Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location: *</Text>
            <TouchableOpacity
              style={styles.voiceHintButton}
              onPress={() => playVoiceGuidance('location')}
              disabled={!voiceEnabled}
            >
              <MaterialCommunityIcons 
                name="help-circle" 
                size={16} 
                color={voiceEnabled ? "#1E3A8A" : "#CBD5E1"} 
              />
              <Text style={[
                styles.voiceHintText,
                !voiceEnabled && styles.voiceHintTextDisabled
              ]}>
                Tap for voice guidance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownInput}
              onPress={() => setShowLocationDropdown(true)}
            >
              <Text style={locationLabel ? styles.dropdownText : styles.dropdownPlaceholder}>
                {locationLabel || 'Select location'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description: *</Text>
            <TouchableOpacity
              style={styles.voiceHintButton}
              onPress={() => playVoiceGuidance('description')}
              disabled={!voiceEnabled}
            >
              <MaterialCommunityIcons 
                name="help-circle" 
                size={16} 
                color={voiceEnabled ? "#1E3A8A" : "#CBD5E1"} 
              />
              <Text style={[
                styles.voiceHintText,
                !voiceEnabled && styles.voiceHintTextDisabled
              ]}>
                Tap for voice guidance
              </Text>
            </TouchableOpacity>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              multiline 
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
              placeholder="Describe your complaint in detail..."
              value={description}
              onChangeText={setDescription}
            />
            <Text style={styles.characterCount}>
              {description.length} characters (minimum 20)
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitBtn,
            submitting && styles.submitBtnDisabled
          ]}
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <ActivityIndicator size="small" color="#FFF" />
              <Text style={styles.submitBtnText}>Submitting...</Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons name="send" size={20} color="#FFF" />
              <Text style={styles.submitBtnText}>Submit</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{height: 40}} />
      </ScrollView>

      {/* Category Dropdown Modal */}
      <Modal
        visible={showCategoryDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryDropdown(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryDropdown(false)}>
                <Ionicons name="close" size={24} color="#1E3A8A" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.modalItem,
                    category === cat.value && styles.modalItemSelected
                  ]}
                  onPress={() => handleCategorySelect(cat.value, cat.label)}
                >
                  <Text style={[
                    styles.modalItemText,
                    category === cat.value && styles.modalItemTextSelected
                  ]}>
                    {cat.label}
                  </Text>
                  {category === cat.value && (
                    <Ionicons name="checkmark" size={20} color="#1E3A8A" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Location Dropdown Modal */}
      <Modal
        visible={showLocationDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLocationDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLocationDropdown(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setShowLocationDropdown(false)}>
                <Ionicons name="close" size={24} color="#1E3A8A" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {LOCATIONS.map((loc) => (
                <TouchableOpacity
                  key={loc.id}
                  style={[
                    styles.modalItem,
                    location === loc.id && styles.modalItemSelected
                  ]}
                  onPress={() => handleLocationSelect(loc.id, loc.name)}
                >
                  <Text style={[
                    styles.modalItemText,
                    location === loc.id && styles.modalItemTextSelected
                  ]}>
                    {loc.name}
                  </Text>
                  {location === loc.id && (
                    <Ionicons name="checkmark" size={20} color="#1E3A8A" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Static AI Button */}
      <View style={styles.fab}>
        <View style={styles.fabInner}>
          <Text style={styles.fabAiText}>AI</Text>
          <MaterialCommunityIcons name="message-text-outline" size={22} color="#1E3A8A" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  voiceControlsContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  voiceControls: {
    gap: 16,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  languageButtonActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  languageButtonTextActive: {
    color: '#FFF',
  },
  stopSpeakingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  stopSpeakingText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  infoCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    fontStyle: 'italic',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
    marginLeft: 4,
  },
  voiceHintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#DBEAFE',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  voiceHintText: {
    fontSize: 12,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  voiceHintTextDisabled: {
    color: '#CBD5E1',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
    flex: 1,
  },
  textArea: {
    height: 112,
    paddingTop: 12,
  },
  characterCount: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'right',
  },
  submitBtn: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  submitBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemSelected: {
    backgroundColor: '#DBEAFE',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  modalItemTextSelected: {
    color: '#1E3A8A',
    fontWeight: '600',
  },
  fab: { 
    position: 'absolute', 
    bottom: 20, 
    right: 20, 
    backgroundColor: '#fde047', 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowOpacity: 0.3, 
    shadowRadius: 5, 
    elevation: 8 
  },
  fabInner: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  fabAiText: { 
    fontSize: 10, 
    fontWeight: '900', 
    color: '#1E3A8A', 
    marginBottom: -2 
  },
});

export default ComplaintFormScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SchemeDetailsScreen = ({ scheme, onBack, onApplyNow }) => {
  const [fullSchemeData, setFullSchemeData] = useState(scheme);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we need to fetch full details, uncomment this
    // fetchFullSchemeDetails();
  }, []);

  const fetchFullSchemeDetails = async () => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('@access_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `https://675c206341f0.ngrok-free.app/api/schemes/${scheme.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      console.log('Scheme details response status:', response.status);

      const rawText = await response.text();
      console.log('Scheme details raw response:', rawText);

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
        throw new Error(data?.message || 'Failed to fetch scheme details');
      }

      setFullSchemeData(data);
    } catch (error) {
      console.error('Error fetching scheme details:', error);
      Alert.alert('Error', error.message || 'Failed to load scheme details.');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    const dept = fullSchemeData.department.toLowerCase();
    
    if (dept.includes('health') || dept.includes('medical')) {
      return <Ionicons name="medical" size={48} color="#ef4444" />;
    } else if (dept.includes('finance') || dept.includes('bank')) {
      return <MaterialCommunityIcons name="gold" size={56} color="#fbbf24" />;
    } else if (dept.includes('housing') || dept.includes('urban')) {
      return <Ionicons name="home" size={56} color="#f97316" />;
    } else if (dept.includes('agriculture') || dept.includes('farming')) {
      return <MaterialCommunityIcons name="sprout" size={52} color="#22c55e" />;
    } else if (dept.includes('education')) {
      return <Ionicons name="school" size={48} color="#3b82f6" />;
    } else if (dept.includes('energy') || dept.includes('power')) {
      return <Ionicons name="flash" size={48} color="#eab308" />;
    } else {
      return <MaterialCommunityIcons name="file-document" size={48} color="#6b7280" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const parseBenefits = (benefits) => {
    if (Array.isArray(benefits)) return benefits;
    if (typeof benefits === 'string') {
      try {
        const parsed = JSON.parse(benefits);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return benefits.split(/[,;•\n]/).filter(b => b.trim());
      }
    }
    return [benefits];
  };

  const parseDocuments = (documents) => {
    if (!documents || documents.length === 0) {
      return ['Aadhaar Card', 'Basic identification documents'];
    }
    
    // Handle array of objects from API (like {id, document_name, is_mandatory, order})
    if (Array.isArray(documents)) {
      // Check if it's an array of objects with document_name property
      if (documents.length > 0 && typeof documents[0] === 'object' && documents[0].document_name) {
        return documents.map(doc => doc.document_name);
      }
      // If it's already an array of strings
      if (typeof documents[0] === 'string') {
        return documents;
      }
    }
    
    // Handle string format
    if (typeof documents === 'string') {
      try {
        const parsed = JSON.parse(documents);
        if (Array.isArray(parsed)) {
          // Check if parsed array contains objects
          if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0].document_name) {
            return parsed.map(doc => doc.document_name);
          }
          return parsed;
        }
      } catch (e) {
        return documents.split(/[,;•\n]/).filter(d => d.trim());
      }
    }
    
    return ['Required documents will be specified during application'];
  };

  const benefitsList = parseBenefits(fullSchemeData.benefits);
  const documentsList = parseDocuments(fullSchemeData.required_documents);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={{ marginTop: 10, color: '#6b7280' }}>Loading scheme details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      
      <View style={{
        backgroundColor: '#1e3a8a',
        paddingTop: Platform.OS === 'android' ? 40 : 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <TouchableOpacity 
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={onBack}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <Text style={{
            color: '#FFF',
            fontSize: 18,
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center',
            marginRight: 40,
          }}>
            Scheme Details
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Scheme Title Card */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#f3f4f6',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            {getIcon()}
          </View>
          
          <Text style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: '#1e3a8a',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            {fullSchemeData.name}
          </Text>
          
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            {fullSchemeData.department}
          </Text>

          <View style={{
            flexDirection: 'row',
            gap: 8,
            marginTop: 8,
          }}>
            <View style={{
              backgroundColor: fullSchemeData.scheme_type === 'state' ? '#dbeafe' : '#fef3c7',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 6,
            }}>
              <Text style={{ 
                fontSize: 12, 
                color: fullSchemeData.scheme_type === 'state' ? '#1e40af' : '#92400e',
                fontWeight: '600',
                textTransform: 'uppercase',
              }}>
                {fullSchemeData.scheme_type}
              </Text>
            </View>

            <View style={{
              backgroundColor: fullSchemeData.status === 'active' ? '#dcfce7' : '#fee2e2',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 6,
            }}>
              <Text style={{ 
                fontSize: 12, 
                color: fullSchemeData.status === 'active' ? '#166534' : '#991b1b',
                fontWeight: '600',
                textTransform: 'uppercase',
              }}>
                {fullSchemeData.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1e3a8a',
            marginBottom: 12,
          }}>
            Description
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#4b5563',
            lineHeight: 22,
          }}>
            {fullSchemeData.description}
          </Text>
        </View>

        {/* Eligibility */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1e3a8a',
            marginBottom: 12,
          }}>
            Eligibility
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f3f4f6',
            padding: 12,
            borderRadius: 8,
          }}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={{
              fontSize: 14,
              color: '#4b5563',
              marginLeft: 10,
              flex: 1,
            }}>
              {fullSchemeData.eligibility}
            </Text>
          </View>
        </View>

        {/* Benefits */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1e3a8a',
            marginBottom: 12,
          }}>
            Benefits
          </Text>
          {benefitsList.map((benefit, index) => (
            <View 
              key={index}
              style={{
                flexDirection: 'row',
                marginBottom: 12,
                alignItems: 'flex-start',
              }}
            >
              <View style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#1e3a8a',
                marginTop: 7,
                marginRight: 12,
              }} />
              <Text style={{
                fontSize: 14,
                color: '#4b5563',
                flex: 1,
                lineHeight: 20,
              }}>
                {benefit.trim()}
              </Text>
            </View>
          ))}
        </View>

        {/* Budget Information */}
        {fullSchemeData.total_budget && (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#e5e7eb',
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#1e3a8a',
              marginBottom: 12,
            }}>
              Budget Information
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f3f4f6',
              padding: 12,
              borderRadius: 8,
            }}>
              <MaterialCommunityIcons name="cash-multiple" size={20} color="#059669" />
              <Text style={{
                fontSize: 14,
                color: '#4b5563',
                marginLeft: 10,
                flex: 1,
              }}>
                Total Budget: <Text style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{fullSchemeData.total_budget}</Text>
              </Text>
            </View>
          </View>
        )}

        {/* Application Deadline */}
        {fullSchemeData.application_deadline && (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#e5e7eb',
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#1e3a8a',
              marginBottom: 12,
            }}>
              Application Deadline
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fef3c7',
              padding: 12,
              borderRadius: 8,
            }}>
              <Ionicons name="calendar" size={20} color="#d97706" />
              <Text style={{
                fontSize: 14,
                color: '#92400e',
                marginLeft: 10,
                flex: 1,
                fontWeight: '600',
              }}>
                {formatDate(fullSchemeData.application_deadline)}
              </Text>
            </View>
          </View>
        )}

        {/* Required Documents */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1e3a8a',
            marginBottom: 12,
          }}>
            Required Documents
          </Text>
          {documentsList.map((document, index) => (
            <View 
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f3f4f6',
                padding: 12,
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <Ionicons name="document-text" size={18} color="#1e3a8a" />
              <Text style={{
                fontSize: 14,
                color: '#4b5563',
                marginLeft: 10,
                flex: 1,
              }}>
                {typeof document === 'string' ? document : document.document_name || 'Document'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Apply Button - Now visible above bottom nav */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
        zIndex: 1000,
      }}>
        <TouchableOpacity 
          style={{
            backgroundColor: '#1e3a8a',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: '#1e3a8a',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
          activeOpacity={0.8}
          onPress={onApplyNow}
        >
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
          }}>
            Apply Now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SchemeDetailsScreen;
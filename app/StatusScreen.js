import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { 
  Ionicons,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ComplaintDetailsScreen from './ComplaintDetailsScreen';

const StatusScreen = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Complaint');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('@access_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch('https://7e3777787c19.ngrok-free.app/api/complaints', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      console.log('Complaints response status:', response.status);

      const rawText = await response.text();
      console.log('Complaints raw response:', rawText.substring(0, 200));

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
        throw new Error(data?.message || 'Failed to fetch complaints');
      }

      // Handle different response formats
      if (Array.isArray(data)) {
        setComplaints(data);
      } else if (data.results && Array.isArray(data.results)) {
        setComplaints(data.results);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      Alert.alert('Error', error.message || 'Failed to load complaints. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return '#10B981';
      case 'in_progress':
      case 'in progress':
        return '#F59E0B';
      case 'pending':
        return '#6B7280';
      case 'rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Pending';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetails(true);
  };

  const handleBackFromDetails = () => {
    setShowDetails(false);
    setSelectedComplaint(null);
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (showDetails && selectedComplaint) {
    return (
      <ComplaintDetailsScreen
        complaint={selectedComplaint}
        onBack={handleBackFromDetails}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Application Status</Text>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.notifCircle}>
              <Ionicons name="notifications-outline" size={20} color="#1E3A8A" />
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>1</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <TextInput 
            placeholder="Search complaints..." 
            placeholderTextColor="#64748b"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={22} color="#64748b" />
            </TouchableOpacity>
          ) : (
            <Ionicons name="search" size={22} color="#64748b" />
          )}
        </View>
      </View>

      {/* Tab - Only Complaints for now */}
      <View style={styles.tabContainer}>
        <View style={[styles.tab, styles.tabActive]}>
          <MaterialCommunityIcons name="comment-alert" size={20} color="#FFF" />
          <Text style={[styles.tabText, styles.tabTextActive]}>
            Complaints ({complaints.length})
          </Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Loading complaints...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.mainScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Your Complaints</Text>

          {filteredComplaints.map(complaint => (
            <View key={complaint.id} style={styles.statusCard}>
              <View style={styles.cardHeader}>
                <View style={styles.ticketBadge}>
                  <Text style={styles.ticketText}>{complaint.ticket_number}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(complaint.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(complaint.status) }
                  ]}>
                    {getStatusLabel(complaint.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.appTitle}>{complaint.title}</Text>
                <Text style={styles.appDescription} numberOfLines={2}>
                  {complaint.description}
                </Text>
                
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="location" size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{complaint.location_name || 'N/A'}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar" size={14} color="#6B7280" />
                    <Text style={styles.metaText}>
                      {formatDate(complaint.created_at || complaint.filed_date)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardDivider} />
              
              <TouchableOpacity 
                style={styles.viewDetailsButton}
                onPress={() => handleViewDetails(complaint)}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Ionicons name="chevron-forward" size={18} color="#1E3A8A" />
              </TouchableOpacity>
            </View>
          ))}

          {filteredComplaints.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="file-search-outline"
                size={64}
                color="#CBD5E1"
              />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No complaints found matching your search' : 'No complaints filed yet'}
              </Text>
              {searchQuery && (
                <TouchableOpacity 
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                >
                  <Text style={styles.clearButtonText}>Clear Search</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Static AI Button */}
      <View style={styles.fab}>
        <View style={styles.fabInner}>
          <Text style={styles.fabAiText}>AI</Text>
          <MaterialCommunityIcons
            name="message-text-outline"
            size={22}
            color="#1E3A8A"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F3F4F6',
  },
  header: { 
    backgroundColor: '#1E3A8A', 
    padding: 20, 
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  notifCircle: { 
    backgroundColor: '#bfdbfe', 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'relative',
  },
  notifBadge: { 
    position: 'absolute', 
    top: 5, 
    right: 8, 
    backgroundColor: '#EF4444', 
    width: 14, 
    height: 14, 
    borderRadius: 7, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  notifBadgeText: { 
    color: '#fff', 
    fontSize: 8, 
    fontWeight: 'bold',
  },
  searchContainer: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    height: 48,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#1a2b5d', 
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 14,
  },
  tabContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#1E3A8A',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFF',
  },
  mainScroll: { flex: 1 },
  scrollContent: { padding: 20 },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1E3A8A', 
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 10,
  },
  ticketBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ticketText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  cardBody: { 
    padding: 15,
    paddingTop: 5,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  appDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  viewDetailsButton: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    color: '#1E3A8A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  clearButton: {
    marginTop: 16,
    backgroundColor: '#1E3A8A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
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
    elevation: 8,
  },
  fabInner: { alignItems: 'center', justifyContent: 'center' },
  fabAiText: { 
    fontSize: 10, 
    fontWeight: '900', 
    color: '#1E3A8A', 
    marginBottom: -2,
  },
});

export default StatusScreen;
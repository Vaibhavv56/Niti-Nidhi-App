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
import JobDetailsScreen from './JobDetailsScreen';

// --- Constants ---
const SchemeCategory = {
  ALL: 'All',
  OPEN: 'Open',
  CLOSED: 'Closed'
};

// --- Main Component ---
function JobUpdateScreen({ onBack }) {
  const [activeFilter, setActiveFilter] = useState(SchemeCategory.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('@access_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch('https://7e3777787c19.ngrok-free.app/api/job-vacancies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      console.log('Jobs response status:', response.status);

      const rawText = await response.text();
      console.log('Jobs raw response:', rawText.substring(0, 200));

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
        throw new Error(data?.message || 'Failed to fetch jobs');
      }

      // Handle different response formats
      if (Array.isArray(data)) {
        setJobs(data);
      } else if (data.results && Array.isArray(data.results)) {
        setJobs(data.results);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      Alert.alert('Error', error.message || 'Failed to load jobs. Please try again.');
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

  const getStatusLabel = (status) => {
    if (!status) return 'Open';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowDetails(true);
  };

  const handleBackFromDetails = () => {
    setShowDetails(false);
    setSelectedJob(null);
  };

  // Filter by status first, then by search query
  const filteredJobs = jobs.filter(job => {
    const statusMatch = activeFilter === SchemeCategory.ALL || 
      (activeFilter === 'Open' && job.status === 'open') ||
      (activeFilter === 'Closed' && job.status === 'closed');
    
    const matchesSearch = 
      (job.title && job.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.department && job.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.eligibility && job.eligibility.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.location_name && job.location_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return statusMatch && matchesSearch;
  });

  if (showDetails && selectedJob) {
    return (
      <JobDetailsScreen
        job={selectedJob}
        onBack={handleBackFromDetails}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Job Updates</Text>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={20} color="#FFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.searchBar}>
          <TextInput 
            placeholder="Search schemes..." 
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ) : (
            <Ionicons name="search" size={20} color="#94a3b8" />
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Filter Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.filterBar}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {Object.values(SchemeCategory).map((cat) => (
              <TouchableOpacity 
                key={cat}
                onPress={() => setActiveFilter(cat)}
                style={[
                  styles.filterTab, 
                  activeFilter === cat && styles.filterTabActive
                ]}
              >
                <Text style={[
                  styles.filterTabText,
                  activeFilter === cat && styles.filterTabTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Job Cards */}
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <TouchableOpacity 
                key={job.id} 
                style={styles.card}
                onPress={() => handleViewDetails(job)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleSection}>
                    <Text style={styles.cardTitle}>{job.title}</Text>
                    <Text style={styles.cardDept}>{job.department}</Text>
                  </View>
                  <View style={styles.cardLogo}>
                    <View style={styles.cardLogoInner}>
                      <Text style={styles.cardLogoText}>
                        {job.status === 'open' ? 'OPEN' : 'CLOSED'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardInfo}>
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="school-outline" size={18} color="#94a3b8" />
                    <Text style={styles.infoText}>
                      {job.requirements?.education || 'Not specified'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="map-marker-outline" size={18} color="#94a3b8" />
                    <Text style={styles.infoText}>{job.location_name || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="cash" size={18} color="#94a3b8" />
                    <Text style={styles.infoText}>{job.salary_range || 'Not specified'}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.lastDateLabel}>Last Date</Text>
                    <Text style={styles.lastDateValue}>{formatDate(job.deadline)}</Text>
                  </View>
                  <View style={styles.categoryButton}>
                    <Text style={styles.categoryButtonText}>
                      {job.total_positions - job.filled_positions} Positions
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="briefcase-search-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyText}>No job schemes found</Text>
              <Text style={styles.emptySubText}>
                {searchQuery ? 'Try adjusting your search' : 'No jobs available at the moment'}
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
        </ScrollView>
      )}

      {/* Static AI Button */}
      <View style={styles.aiButton}>
        <View style={styles.aiButtonContent}>
          <Text style={styles.aiButtonText}>AI</Text>
          <MaterialCommunityIcons name="message-text-outline" size={20} color="#1E3A8A" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  headerIcons: {
    flexDirection: 'row',
    width: 40,
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  searchBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
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
  content: {
    padding: 20,
  },
  filterBar: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterTab: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    marginRight: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  filterTabText: {
    color: '#64748b',
    fontWeight: '700',
    fontSize: 14,
  },
  filterTabTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitleSection: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  cardDept: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  cardLogo: {
    width: 48,
    height: 48,
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardLogoInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLogoText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#1d4ed8',
  },
  cardInfo: {
    gap: 10,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  lastDateLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  lastDateValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
  },
  categoryButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  categoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: '#374151',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 8,
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
  aiButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 64,
    height: 64,
    backgroundColor: '#fde047',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  aiButtonContent: {
    alignItems: 'center',
  },
  aiButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E3A8A',
  },
});

export default JobUpdateScreen;
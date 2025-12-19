import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { 
  Ionicons,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import ApplicationFormScreen from './ApplicationFormScreen';

const JobDetailsScreen = ({ job, onBack }) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const handleApply = () => {
    // Show the application form instead of alert
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    // This will be called when application is successfully submitted
    console.log('Application submitted successfully');
  };

  const availablePositions = job.total_positions - job.filled_positions;
  const isJobClosed = job.status === 'closed' || availablePositions <= 0;

  // If application form is open, show it instead of job details
  if (showApplicationForm) {
    return (
      <ApplicationFormScreen 
        job={job}
        onBack={() => setShowApplicationForm(false)}
        onSuccess={handleApplicationSuccess}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          {/* Status Badge */}
          <View style={[
            styles.statusBadge,
            { backgroundColor: isJobClosed ? '#EF444420' : '#10B98120' }
          ]}>
            <MaterialCommunityIcons 
              name={isJobClosed ? 'close-circle' : 'check-circle'} 
              size={18} 
              color={isJobClosed ? '#EF4444' : '#10B981'} 
            />
            <Text style={[
              styles.statusText,
              { color: isJobClosed ? '#EF4444' : '#10B981' }
            ]}>
              {isJobClosed ? 'Closed' : 'Open for Applications'}
            </Text>
          </View>

          {/* Job Title & Department */}
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.department}>{job.department}</Text>

          {/* Quick Info Cards */}
          <View style={styles.quickInfoContainer}>
            <View style={styles.quickInfoCard}>
              <MaterialCommunityIcons name="cash-multiple" size={24} color="#1E3A8A" />
              <Text style={styles.quickInfoLabel}>Salary</Text>
              <Text style={styles.quickInfoValue}>{job.salary_range || 'Not specified'}</Text>
            </View>
            
            <View style={styles.quickInfoCard}>
              <MaterialCommunityIcons name="account-group" size={24} color="#1E3A8A" />
              <Text style={styles.quickInfoLabel}>Positions</Text>
              <Text style={styles.quickInfoValue}>{availablePositions}/{job.total_positions}</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#1E3A8A" />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            <View style={styles.locationCard}>
              <Text style={styles.locationName}>{job.location_name || 'N/A'}</Text>
              {job.location_text && (
                <Text style={styles.locationText}>{job.location_text}</Text>
              )}
            </View>
          </View>

          {/* Deadline */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="calendar-clock" size={20} color="#1E3A8A" />
              <Text style={styles.sectionTitle}>Application Deadline</Text>
            </View>
            <View style={styles.deadlineCard}>
              <Text style={styles.deadlineText}>{formatDate(job.deadline)}</Text>
            </View>
          </View>

          {/* Education Requirements */}
          {job.requirements?.education && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="school" size={20} color="#1E3A8A" />
                <Text style={styles.sectionTitle}>Education Required</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>{job.requirements.education}</Text>
              </View>
            </View>
          )}

          {/* Eligibility */}
          {job.eligibility && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="clipboard-check" size={20} color="#1E3A8A" />
                <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>{job.eligibility}</Text>
              </View>
            </View>
          )}

          {/* Skills Required */}
          {job.requirements?.skills && job.requirements.skills.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="lightbulb-on" size={20} color="#1E3A8A" />
                <Text style={styles.sectionTitle}>Skills Required</Text>
              </View>
              <View style={styles.skillsContainer}>
                {job.requirements.skills.map((skill, index) => (
                  <View key={index} style={styles.skillChip}>
                    <MaterialCommunityIcons name="check" size={16} color="#10B981" />
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Job Description */}
          {job.description && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="file-document" size={20} color="#1E3A8A" />
                <Text style={styles.sectionTitle}>Job Description</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.descriptionText}>{job.description}</Text>
              </View>
            </View>
          )}

          {/* Posted Info */}
          <View style={styles.postedInfo}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.postedText}>
              Posted on {formatDate(job.posted_at)}
            </Text>
          </View>

          {/* Apply Button - Inside ScrollView */}
          <TouchableOpacity 
            style={[
              styles.applyButton,
              isJobClosed && styles.applyButtonDisabled
            ]}
            onPress={handleApply}
            disabled={isJobClosed}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons 
              name="send" 
              size={20} 
              color="#FFF" 
            />
            <Text style={styles.applyButtonText}>
              {isJobClosed ? 'Applications Closed' : 'Apply Now'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E3A8A',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contentContainer: {
    padding: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
    lineHeight: 34,
  },
  department: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
    fontWeight: '600',
  },
  quickInfoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickInfoCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickInfoLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 4,
  },
  quickInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  locationCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
  },
  deadlineCard: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  deadlineText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  skillText: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 24,
  },
  postedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  postedText: {
    fontSize: 13,
    color: '#6B7280',
  },
  applyButton: {
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 24,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  applyButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobDetailsScreen;
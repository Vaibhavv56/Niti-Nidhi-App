import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const ComplaintDetailsScreen = ({ complaint, onBack }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return '#EF4444';
      case 'high':
        return '#F59E0B';
      case 'medium':
        return '#3B82F6';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'roads':
        return 'road-variant';
      case 'water':
        return 'water';
      case 'electricity':
        return 'flash';
      case 'sanitation':
        return 'delete-variant';
      case 'healthcare':
        return 'hospital-box';
      default:
        return 'file-document';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.statusHeader}>
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

          <Text style={styles.title}>{complaint.title}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={16} color="#6B7280" />
              <Text style={styles.metaText}>
                Filed: {formatDate(complaint.created_at || complaint.filed_date)}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{complaint.description}</Text>
        </View>

        {/* Details Grid */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons 
                name={getCategoryIcon(complaint.category)} 
                size={20} 
                color="#1E3A8A" 
              />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>
                  {complaint.category?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="alert-circle" size={20} color={getPriorityColor(complaint.priority)} />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Priority</Text>
                <Text style={[styles.detailValue, { color: getPriorityColor(complaint.priority) }]}>
                  {complaint.priority?.toUpperCase() || 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="location" size={20} color="#1E3A8A" />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{complaint.location_name || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="office-building" size={20} color="#1E3A8A" />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Department</Text>
                <Text style={styles.detailValue}>
                  {complaint.assigned_department || 'Not Assigned'}
                </Text>
              </View>
            </View>
          </View>

          {complaint.escalated_to && (
            <View style={styles.escalationBox}>
              <MaterialCommunityIcons name="arrow-up-bold-circle" size={20} color="#F59E0B" />
              <View style={{ flex: 1 }}>
                <Text style={styles.escalationLabel}>Escalated To</Text>
                <Text style={styles.escalationValue}>
                  {complaint.escalated_to.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
                {complaint.escalation_reason && (
                  <Text style={styles.escalationReason}>{complaint.escalation_reason}</Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Resolution Notes */}
        {complaint.resolution_notes && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Resolution Notes</Text>
            <View style={styles.resolutionBox}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.resolutionText}>{complaint.resolution_notes}</Text>
            </View>
          </View>
        )}

        {/* Status History */}
        {complaint.history && complaint.history.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Status History</Text>
            {complaint.history.map((item, index) => (
              <View key={item.id || index} style={styles.historyItem}>
                <View style={styles.historyDot}>
                  <View style={[
                    styles.historyDotInner,
                    { backgroundColor: getStatusColor(item.new_status) }
                  ]} />
                </View>
                <View style={styles.historyContent}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyStatus}>
                      {getStatusLabel(item.old_status)} → {getStatusLabel(item.new_status)}
                    </Text>
                    <Text style={styles.historyDate}>
                      {formatDate(item.timestamp)}
                    </Text>
                  </View>
                  {item.comments && (
                    <Text style={styles.historyComment}>{item.comments}</Text>
                  )}
                  {item.changed_by_name && (
                    <Text style={styles.historyChangedBy}>
                      by {item.changed_by_name}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Citizen Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Filed By</Text>
          <View style={styles.citizenInfo}>
            <View style={styles.citizenAvatar}>
              <Ionicons name="person" size={24} color="#1E3A8A" />
            </View>
            <View style={styles.citizenDetails}>
              <Text style={styles.citizenName}>{complaint.citizen_name || 'N/A'}</Text>
              <Text style={styles.citizenPhone}>{complaint.citizen_phone || 'N/A'}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  ticketText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  escalationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  escalationLabel: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
    marginBottom: 4,
  },
  escalationValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#78350F',
  },
  escalationReason: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 4,
  },
  resolutionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8,
  },
  resolutionText: {
    flex: 1,
    fontSize: 14,
    color: '#065F46',
    lineHeight: 20,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  historyDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  historyDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  historyDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  historyComment: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  historyChangedBy: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  citizenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  citizenAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  citizenDetails: {
    flex: 1,
  },
  citizenName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  citizenPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default ComplaintDetailsScreen;
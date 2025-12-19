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
  Image,
  Dimensions,
} from 'react-native';
import { 
  Ionicons,
  MaterialCommunityIcons
} from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const NewsDetailsScreen = ({ news, onBack }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category) => {
    if (!category) return 'General';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return '#EF4444';
      case 'high':
        return '#F59E0B';
      case 'normal':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getPriorityLabel = (priority) => {
    if (!priority) return 'Normal';
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>News Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Section */}
        {news.attachments && news.attachments.length > 0 && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: news.attachments[0].file }}
              style={styles.newsImage}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.contentContainer}>
          {/* Priority Badge */}
          {news.priority && (
            <View style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(news.priority) + '20' }
            ]}>
              <MaterialCommunityIcons 
                name={news.priority === 'urgent' ? 'alert' : 'flag'} 
                size={16} 
                color={getPriorityColor(news.priority)} 
              />
              <Text style={[
                styles.priorityText,
                { color: getPriorityColor(news.priority) }
              ]}>
                {getPriorityLabel(news.priority)} Priority
              </Text>
            </View>
          )}

          {/* Category Badge */}
          {news.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {getCategoryLabel(news.category)}
              </Text>
            </View>
          )}

          {/* Title */}
          <Text style={styles.title}>{news.title}</Text>

          {/* Meta Information */}
          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <Ionicons name="business" size={16} color="#6B7280" />
              <Text style={styles.metaText}>
                {news.publishing_authority || 'Gram Panchayat'}
              </Text>
            </View>
            
            <View style={styles.metaRow}>
              <Ionicons name="calendar" size={16} color="#6B7280" />
              <Text style={styles.metaText}>
                {formatDate(news.published_at)}
              </Text>
            </View>

            {news.target_audience && (
              <View style={styles.metaRow}>
                <Ionicons name="people" size={16} color="#6B7280" />
                <Text style={styles.metaText}>
                  Target: {news.target_audience.charAt(0).toUpperCase() + news.target_audience.slice(1)}
                </Text>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Content */}
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Details</Text>
            <Text style={styles.content}>{news.content}</Text>
          </View>

          {/* Additional Attachments */}
          {news.attachments && news.attachments.length > 1 && (
            <View style={styles.attachmentsSection}>
              <Text style={styles.sectionTitle}>Additional Attachments</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.attachmentsScroll}
              >
                {news.attachments.slice(1).map((attachment, index) => (
                  <View key={attachment.id || index} style={styles.attachmentCard}>
                    {attachment.file_type?.startsWith('image/') ? (
                      <Image 
                        source={{ uri: attachment.file }}
                        style={styles.attachmentImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.fileIcon}>
                        <Ionicons name="document" size={40} color="#1E3A8A" />
                        <Text style={styles.fileType}>
                          {attachment.file_type?.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Important Notice */}
          {news.priority === 'urgent' && (
            <View style={styles.urgentNotice}>
              <MaterialCommunityIcons name="alert-circle" size={24} color="#EF4444" />
              <Text style={styles.urgentText}>
                This is an urgent update. Please take necessary action immediately.
              </Text>
            </View>
          )}
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
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#E5E7EB',
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    gap: 6,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  categoryText: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    lineHeight: 32,
  },
  metaContainer: {
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  contentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
  },
  attachmentsSection: {
    marginTop: 20,
  },
  attachmentsScroll: {
    marginTop: 10,
  },
  attachmentCard: {
    width: 150,
    height: 150,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
  },
  fileIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
  },
  fileType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginTop: 8,
  },
  urgentNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    gap: 12,
  },
  urgentText: {
    flex: 1,
    fontSize: 14,
    color: '#991B1B',
    fontWeight: '600',
    lineHeight: 20,
  },
});

export default NewsDetailsScreen;
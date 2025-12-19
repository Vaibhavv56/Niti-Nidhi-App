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
  Image,
} from 'react-native';
import { 
  Ionicons,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewsDetailsScreen from './NewsDetailsScreen';

function NewsScreen({ onBack }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('@access_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch('https://7e3777787c19.ngrok-free.app/api/news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      console.log('News response status:', response.status);

      const rawText = await response.text();
      console.log('News raw response:', rawText.substring(0, 200));

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
        throw new Error(data?.message || 'Failed to fetch news');
      }

      // Handle different response formats
      if (Array.isArray(data)) {
        setNews(data);
      } else if (data.results && Array.isArray(data.results)) {
        setNews(data.results);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      Alert.alert('Error', error.message || 'Failed to load news. Please try again.');
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

  const getCategoryLabel = (category) => {
    if (!category) return 'General';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleViewDetails = (newsItem) => {
    setSelectedNews(newsItem);
    setShowDetails(true);
  };

  const handleBackFromDetails = () => {
    setShowDetails(false);
    setSelectedNews(null);
  };

  // Filter by category first, then by search query
  const filteredNews = news.filter(item => {
    const categoryMatch = activeFilter === 'All' || 
      (item.category && getCategoryLabel(item.category) === activeFilter);
    
    const matchesSearch = 
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.publishing_authority && item.publishing_authority.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && matchesSearch;
  });

  // Get unique categories from news data
  const categories = ['All', ...new Set(news.map(item => getCategoryLabel(item.category)))];

  if (showDetails && selectedNews) {
    return (
      <NewsDetailsScreen
        news={selectedNews}
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

          <Text style={styles.headerTitle}>News & Updates</Text>

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
            placeholder="Search updates..." 
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
          <Text style={styles.loadingText}>Loading news...</Text>
        </View>
      ) : (
        <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
          {/* Filters */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScrollView}
            contentContainerStyle={styles.filterRow}
          >
            {categories.map((f) => (
              <TouchableOpacity 
                key={f}
                onPress={() => setActiveFilter(f)}
                style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
              >
                <Text style={[styles.filterBtnText, activeFilter === f && styles.filterBtnTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.updateCounter}>{filteredNews.length} Updates</Text>

          {/* News Cards */}
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card}
                onPress={() => handleViewDetails(item)}
                activeOpacity={0.7}
              >
                {/* Image Section */}
                {item.attachments && item.attachments.length > 0 && (
                  <View style={styles.cardImageContainer}>
                    <Image 
                      source={{ uri: item.attachments[0].file }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                    {item.priority === 'urgent' && (
                      <View style={styles.urgentOverlay}>
                        <MaterialCommunityIcons name="alert" size={16} color="#fff" />
                        <Text style={styles.urgentOverlayText}>URGENT</Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={styles.sourceRow}>
                      <View style={styles.blueDot} />
                      <Text style={styles.sourceText}>
                        {item.publishing_authority || 'Gram Panchayat'}
                      </Text>
                    </View>
                    {item.priority === 'high' && (
                      <View style={styles.importantBadge}>
                        <Text style={styles.importantText}>Important</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.updateTitle}>{item.title}</Text>
                    <Text style={styles.updateDesc} numberOfLines={2}>
                      {item.content}
                    </Text>
                    
                    {item.category && (
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>
                          {getCategoryLabel(item.category)}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardInnerDivider} />

                  <View style={styles.cardFooter}>
                    <Text style={styles.footerLocation}>
                      {item.publishing_authority || 'Gram Panchayat'}
                    </Text>
                    <Text style={styles.footerDate}>
                      {formatDate(item.published_at)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="newspaper-variant-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyText}>No updates found</Text>
              <Text style={styles.emptySubText}>
                {searchQuery ? 'Try adjusting your search' : 'No news available at the moment'}
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
        <Text style={styles.fabAiText}>AI</Text>
        <MaterialCommunityIcons name="message-text-outline" size={22} color="#1E3A8A" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f3f4f6' 
  },
  header: { 
    backgroundColor: '#1E3A8A', 
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
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
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
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
    color: '#1a2b5d', 
    fontWeight: '500' 
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
  mainScroll: { 
    flex: 1, 
    padding: 20 
  },
  filterScrollView: {
    marginBottom: 15,
  },
  filterRow: { 
    flexDirection: 'row', 
    gap: 10,
  },
  filterBtn: { 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 8, 
    borderWidth: 2, 
    borderColor: '#1E3A8A', 
    backgroundColor: '#fff' 
  },
  filterBtnActive: { 
    backgroundColor: '#1E3A8A' 
  },
  filterBtnText: { 
    color: '#1E3A8A', 
    fontWeight: 'bold',
    fontSize: 14,
  },
  filterBtnTextActive: { 
    color: '#fff' 
  },
  updateCounter: { 
    color: '#64748b', 
    fontSize: 13, 
    marginBottom: 15, 
    fontWeight: '500' 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    marginBottom: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  cardImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  urgentOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 4,
  },
  urgentOverlayText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  sourceRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    flex: 1,
  },
  blueDot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: '#1d4ed8' 
  },
  sourceText: { 
    color: '#1E3A8A', 
    fontWeight: '700', 
    fontSize: 14,
    flex: 1,
  },
  importantBadge: { 
    backgroundColor: '#fee2e2', 
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderRadius: 4 
  },
  importantText: { 
    color: '#ef4444', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  cardBody: { 
    marginBottom: 15 
  },
  alertRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  alertTitle: { 
    color: '#ef4444', 
    fontWeight: '900', 
    fontSize: 16 
  },
  updateTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#000', 
    marginBottom: 6 
  },
  updateDesc: { 
    color: '#64748b', 
    fontSize: 14, 
    lineHeight: 20,
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  categoryText: {
    color: '#1E3A8A',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardInnerDivider: { 
    height: 1, 
    backgroundColor: '#f1f5f9', 
    marginVertical: 10 
  },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  footerLocation: { 
    color: '#94a3b8', 
    fontSize: 12, 
    fontWeight: '500',
    flex: 1,
  },
  footerDate: { 
    color: '#94a3b8', 
    fontSize: 12 
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
  fabAiText: { 
    fontSize: 10, 
    fontWeight: '900', 
    color: '#1E3A8A', 
    marginBottom: -2 
  },
});

export default NewsScreen;
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


// Use default imports since both files use "export default"
import EligibleSchemesScreen from './EligibleSchemesScreen';
import ExploreSchemes from './ExploreSchemes';



const SchemesScreen = ({ onBack }) => {
  const [showEligible, setShowEligible] = useState(false);
  const [showExplore, setShowExplore] = useState(false);


  // If Eligible Schemes clicked, show that screen
  if (showEligible) {
    return <EligibleSchemesScreen onBack={() => setShowEligible(false)} />;
  }


  // If Explore Schemes clicked, show that screen
  if (showExplore) {
    return <ExploreSchemes onBack={() => setShowExplore(false)} />;
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Header matching other screens style */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Schemes</Text>

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
          <Text style={styles.searchPlaceholder}>Search</Text>
          <Ionicons name="search" size={20} color="#94a3b8" />
        </View>
      </View>


      {/* Schemes Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerPlaceholder}>
            <MaterialCommunityIcons name="school" size={40} color="#FFF" style={{opacity: 0.8}} />
            <Text style={styles.bannerTextMain}>समग्र शिक्षा</Text>
            <Text style={styles.bannerTextSub}>Samagra Shiksha</Text>
            <View style={[styles.bannerOverlayLine, { transform: [{ rotate: '45deg' }], left: -20 }]} />
            <View style={[styles.bannerOverlayLine, { transform: [{ rotate: '45deg' }], left: 40 }]} />
          </View>
        </View>


        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowEligible(true)}
          >
            <View style={styles.actionIconContainer}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={32} color="#1F2937" />
            </View>
            <Text style={styles.actionButtonText}>Eligible Schemes</Text>
          </TouchableOpacity>


          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowExplore(true)}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="search-outline" size={32} color="#1F2937" />
            </View>
            <Text style={styles.actionButtonText}>Explore Schemes</Text>
          </TouchableOpacity>
        </View>


        <View style={{ height: 100 }} />
      </ScrollView>


      {/* Static AI Button */}
      <View style={styles.fab}>
        <View style={styles.fabInner}>
          <Text style={styles.fabAiText}>AI</Text>
          <MaterialCommunityIcons name="message-text-outline" size={22} color="#1E3A8A" />
        </View>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
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
  searchPlaceholder: {
    flex: 1,
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  bannerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bannerPlaceholder: {
    height: 160,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bannerTextMain: {
    color: '#F97316',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bannerTextSub: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 2,
    fontStyle: 'italic',
  },
  bannerOverlayLine: {
    position: 'absolute',
    width: 300,
    height: 20,
    backgroundColor: '#FFF',
    opacity: 0.1,
  },
  actionButtonsContainer: {
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIconContainer: {
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
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


export default SchemesScreen;

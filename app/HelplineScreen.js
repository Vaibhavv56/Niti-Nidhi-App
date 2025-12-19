import React, { useState } from 'react';
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
  Linking,
  Alert,
} from 'react-native';
import { 
  Ionicons,
  MaterialCommunityIcons
} from '@expo/vector-icons';


// --- Constants ---
const HELPLINES = [
  { id: '1', name: 'Police Emergency', number: '100' },
  { id: '2', name: 'Fire Department', number: '101' },
  { id: '3', name: 'Ambulance', number: '102' },
  { id: '4', name: 'Women Helpline', number: '1091' },
  { id: '5', name: 'Child Helpline', number: '1098' },
  { id: '6', name: 'Disaster Management', number: '108' },
  { id: '7', name: 'National Emergency Number', number: '112' },
  { id: '8', name: 'Blood Bank', number: '104' },
];


// --- Main Component ---
function HelplineScreen({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHelplines = HELPLINES.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.number.includes(searchQuery)
  );

  const handleCall = (name, number) => {
    Alert.alert(
      'Call ' + name,
      'Do you want to call ' + number + '?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            Linking.openURL(`tel:${number}`);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Helpline Numbers</Text>

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
            placeholder="Search helplines..." 
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={20} color="#94a3b8" />
        </View>
      </View>

      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Emergency Contacts</Text>

        {/* Helpline Cards */}
        {filteredHelplines.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.phoneIconCircle}>
                <MaterialCommunityIcons 
                  name={
                    item.name.includes('Police') ? 'shield-account' :
                    item.name.includes('Fire') ? 'fire-truck' :
                    item.name.includes('Ambulance') ? 'ambulance' :
                    item.name.includes('Women') ? 'gender-female' :
                    item.name.includes('Child') ? 'human-child' :
                    item.name.includes('Disaster') ? 'alert-circle' :
                    item.name.includes('Blood') ? 'water' :
                    'phone'
                  } 
                  size={22} 
                  color="#475569" 
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.helplineName}>{item.name}</Text>
                <Text style={styles.helplineNumber}>{item.number}</Text>
              </View>
              <TouchableOpacity 
                style={styles.callButton}
                onPress={() => handleCall(item.name, item.number)}
              >
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredHelplines.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="phone-off" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>No helplines found</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Static AI Button (No functionality) */}
      <View style={styles.fab}>
        <View style={styles.fabInner}>
          <Text style={styles.fabAiText}>AI</Text>
          <MaterialCommunityIcons name="message-text-outline" size={22} color="#1E3A8A" />
        </View>
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
  mainScroll: { 
    flex: 1, 
    padding: 20 
  },
  pageTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1E3A8A', 
    marginBottom: 20 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  cardContent: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  phoneIconCircle: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    borderWidth: 2, 
    borderColor: '#94a3b8', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 16
  },
  textContainer: { 
    flex: 1 
  },
  helplineName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1e293b' 
  },
  helplineNumber: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1d4ed8', 
    marginTop: 2 
  },
  callButton: { 
    backgroundColor: '#1E3A8A', 
    paddingVertical: 10, 
    paddingHorizontal: 24, 
    borderRadius: 8 
  },
  callButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 12,
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


export default HelplineScreen;

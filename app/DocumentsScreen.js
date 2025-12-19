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
  Alert,
  Platform, // Add this import
} from 'react-native';
import { 
  Ionicons,
  MaterialCommunityIcons
} from '@expo/vector-icons';


// --- Constants ---
const DOCUMENTS = [
  { id: '1', name: 'Aadhar Card', timestamp: '2min ago', verified: true },
  { id: '2', name: 'Pan Card', timestamp: '2min ago', verified: true },
  { id: '3', name: 'Ration Card', timestamp: '2min ago', verified: false },
  { id: '4', name: 'Birth Certificate', timestamp: '1 hour ago', verified: true },
  { id: '5', name: 'Driving License', timestamp: '1 day ago', verified: false },
];


// --- Main Component ---
function DocumentsScreen({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');


  const filteredDocuments = DOCUMENTS.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleUpload = () => {
    Alert.alert(
      'Upload Document',
      'Select document type to upload',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'From Gallery', onPress: () => console.log('Gallery') },
        { text: 'Take Photo', onPress: () => console.log('Camera') }
      ]
    );
  };


  const handleViewVerified = () => {
  //no action 
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


          <Text style={styles.headerTitle}>Your Documents</Text>


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
            placeholder="Search documents..." 
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={20} color="#94a3b8" />
        </View>
      </View>


      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Document Library</Text>


        {/* Document List Card */}
        <View style={styles.documentListCard}>
          {filteredDocuments.map((doc, index) => (
            <View key={doc.id}>
              <TouchableOpacity style={styles.docItem}>
                <View style={styles.pdfIconContainer}>
                  <MaterialCommunityIcons name="file-document-outline" size={32} color="#94a3b8" />
                  <Text style={styles.pdfLabel}>PDF</Text>
                </View>
                <View style={styles.docTextContainer}>
                  <Text style={styles.timestampText}>{doc.timestamp}</Text>
                  <Text style={styles.docNameText}>{doc.name}</Text>
                </View>
                {doc.verified && (
                  <View style={styles.verifiedBadge}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#69bc7d" />
                  </View>
                )}
              </TouchableOpacity>
              {index < filteredDocuments.length - 1 && <View style={styles.docSeparator} />}
            </View>
          ))}
        </View>


        {filteredDocuments.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="file-document-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>No documents found</Text>
          </View>
        )}


        {/* Action Buttons */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <MaterialCommunityIcons name="upload" size={24} color="#fff" />
          <Text style={styles.uploadButtonText}>Upload Document</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.verifiedButton} onPress={handleViewVerified}>
          <View style={styles.verifiedContent}>
            <View style={styles.checkCircleWhite}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#69bc7d" />
            </View>
            <Text style={styles.verifiedButtonText}>Verified Documents</Text>
          </View>
        </TouchableOpacity>


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
    marginBottom: 15 
  },
  documentListCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  pdfIconContainer: {
    position: 'relative',
    marginRight: 15,
    width: 40,
  },
  pdfLabel: {
    position: 'absolute',
    bottom: 0,
    left: 2,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  docTextContainer: {
    flex: 1,
  },
  timestampText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  docNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  verifiedBadge: {
    marginLeft: 10,
  },
  docSeparator: {
    height: 1,
    backgroundColor: '#f1f5f9',
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
  uploadButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    gap: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  verifiedButton: {
    backgroundColor: '#69bc7d',
    borderRadius: 12,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  verifiedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircleWhite: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  verifiedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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


export default DocumentsScreen;

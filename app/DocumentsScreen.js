// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   SafeAreaView,
//   StatusBar,
//   Alert,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import { 
//   Ionicons,
//   MaterialCommunityIcons
// } from '@expo/vector-icons';
// import * as DocumentPicker from 'expo-document-picker';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // --- Main Component ---
// function DocumentsScreen({ onBack }) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     loadDocuments();
//     requestPermissions();
//   }, []);

//   const requestPermissions = async () => {
//     if (Platform.OS !== 'web') {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission needed', 'Please grant permission to access your media library.');
//       }
      
//       const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
//       if (cameraStatus.status !== 'granted') {
//         Alert.alert('Permission needed', 'Please grant permission to access your camera.');
//       }
//     }
//   };

//   const loadDocuments = async () => {
//     try {
//       setLoading(true);
//       const storedDocs = await AsyncStorage.getItem('@user_documents');
//       if (storedDocs) {
//         setDocuments(JSON.parse(storedDocs));
//       }
//     } catch (error) {
//       console.error('Error loading documents:', error);
//       Alert.alert('Error', 'Failed to load documents');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveDocuments = async (docs) => {
//     try {
//       await AsyncStorage.setItem('@user_documents', JSON.stringify(docs));
//     } catch (error) {
//       console.error('Error saving documents:', error);
//       Alert.alert('Error', 'Failed to save documents');
//     }
//   };

//   const getFileExtension = (uri) => {
//     const extension = uri.split('.').pop().toLowerCase();
//     return extension;
//   };

//   const getDocumentType = (uri, mimeType) => {
//     const extension = getFileExtension(uri);
    
//     if (extension === 'pdf' || mimeType?.includes('pdf')) {
//       return 'PDF';
//     } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension) || mimeType?.includes('image')) {
//       return 'IMAGE';
//     } else if (['doc', 'docx'].includes(extension) || mimeType?.includes('word')) {
//       return 'DOC';
//     } else if (['xls', 'xlsx'].includes(extension) || mimeType?.includes('excel') || mimeType?.includes('spreadsheet')) {
//       return 'EXCEL';
//     } else {
//       return 'FILE';
//     }
//   };

//   const getDocumentIcon = (type) => {
//     switch (type) {
//       case 'PDF':
//         return { name: 'file-pdf-box', color: '#ef4444' };
//       case 'IMAGE':
//         return { name: 'file-image', color: '#3b82f6' };
//       case 'DOC':
//         return { name: 'file-word', color: '#2563eb' };
//       case 'EXCEL':
//         return { name: 'file-excel', color: '#16a34a' };
//       default:
//         return { name: 'file-document-outline', color: '#94a3b8' };
//     }
//   };

//   const handlePickDocument = async () => {
//     try {
//       setUploading(true);
//       const result = await DocumentPicker.getDocumentAsync({
//         type: '*/*',
//         copyToCacheDirectory: true,
//       });

//       if (result.canceled === false && result.assets && result.assets.length > 0) {
//         const asset = result.assets[0];
//         const newDocument = {
//           id: Date.now().toString(),
//           name: asset.name,
//           uri: asset.uri,
//           size: asset.size,
//           mimeType: asset.mimeType,
//           type: getDocumentType(asset.uri, asset.mimeType),
//           timestamp: 'Just now',
//           verified: false,
//           uploadedAt: new Date().toISOString(),
//         };

//         const updatedDocs = [newDocument, ...documents];
//         setDocuments(updatedDocs);
//         await saveDocuments(updatedDocs);
//         Alert.alert('Success', 'Document uploaded successfully!');
//       }
//     } catch (error) {
//       console.error('Error picking document:', error);
//       Alert.alert('Error', 'Failed to upload document. Please try again.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleTakePhoto = async () => {
//     try {
//       setUploading(true);
//       const result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         const asset = result.assets[0];
//         const fileName = `Photo_${Date.now()}.jpg`;
        
//         const newDocument = {
//           id: Date.now().toString(),
//           name: fileName,
//           uri: asset.uri,
//           size: asset.fileSize || 0,
//           mimeType: 'image/jpeg',
//           type: 'IMAGE',
//           timestamp: 'Just now',
//           verified: false,
//           uploadedAt: new Date().toISOString(),
//         };

//         const updatedDocs = [newDocument, ...documents];
//         setDocuments(updatedDocs);
//         await saveDocuments(updatedDocs);
//         Alert.alert('Success', 'Photo captured successfully!');
//       }
//     } catch (error) {
//       console.error('Error taking photo:', error);
//       Alert.alert('Error', 'Failed to capture photo. Please try again.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handlePickFromGallery = async () => {
//     try {
//       setUploading(true);
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         const asset = result.assets[0];
//         const fileName = asset.fileName || `Image_${Date.now()}.jpg`;
        
//         const newDocument = {
//           id: Date.now().toString(),
//           name: fileName,
//           uri: asset.uri,
//           size: asset.fileSize || 0,
//           mimeType: asset.type || 'image/jpeg',
//           type: 'IMAGE',
//           timestamp: 'Just now',
//           verified: false,
//           uploadedAt: new Date().toISOString(),
//         };

//         const updatedDocs = [newDocument, ...documents];
//         setDocuments(updatedDocs);
//         await saveDocuments(updatedDocs);
//         Alert.alert('Success', 'Image uploaded successfully!');
//       }
//     } catch (error) {
//       console.error('Error picking from gallery:', error);
//       Alert.alert('Error', 'Failed to upload image. Please try again.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleUpload = () => {
//     Alert.alert(
//       'Upload Document',
//       'Choose upload method',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'From Gallery', 
//           onPress: handlePickFromGallery 
//         },
//         { 
//           text: 'Take Photo', 
//           onPress: handleTakePhoto 
//         },
//         { 
//           text: 'Choose File', 
//           onPress: handlePickDocument 
//         }
//       ]
//     );
//   };

//   const handleDeleteDocument = (docId) => {
//     Alert.alert(
//       'Delete Document',
//       'Are you sure you want to delete this document?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             const updatedDocs = documents.filter(doc => doc.id !== docId);
//             setDocuments(updatedDocs);
//             await saveDocuments(updatedDocs);
//             Alert.alert('Success', 'Document deleted successfully!');
//           }
//         }
//       ]
//     );
//   };

//   const handleViewVerified = () => {
//     const verifiedDocs = documents.filter(doc => doc.verified);
//     if (verifiedDocs.length === 0) {
//       Alert.alert('No Verified Documents', 'You have no verified documents yet.');
//     } else {
//       Alert.alert(
//         'Verified Documents',
//         `You have ${verifiedDocs.length} verified document${verifiedDocs.length > 1 ? 's' : ''}.`
//       );
//     }
//   };

//   const getRelativeTime = (uploadedAt) => {
//     const now = new Date();
//     const uploaded = new Date(uploadedAt);
//     const diffInSeconds = Math.floor((now - uploaded) / 1000);

//     if (diffInSeconds < 60) return 'Just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
//     if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
//     return uploaded.toLocaleDateString();
//   };

//   const filteredDocuments = documents.filter(doc => 
//     doc.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const formatFileSize = (bytes) => {
//     if (!bytes) return '';
//     if (bytes < 1024) return bytes + ' B';
//     if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
//     return (bytes / 1048576).toFixed(1) + ' MB';
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
//       {/* Header Section */}
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <TouchableOpacity onPress={onBack} style={styles.backButton}>
//             <Ionicons name="arrow-back" size={24} color="#FFF" />
//           </TouchableOpacity>

//           <Text style={styles.headerTitle}>Your Documents</Text>

//           <View style={styles.headerIcons}>
//             <TouchableOpacity style={styles.iconButton}>
//               <Ionicons name="notifications-outline" size={20} color="#FFF" />
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>1</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
        
//         <View style={styles.searchBar}>
//           <TextInput 
//             placeholder="Search documents..." 
//             placeholderTextColor="#94a3b8"
//             style={styles.searchInput}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           {searchQuery ? (
//             <TouchableOpacity onPress={() => setSearchQuery('')}>
//               <Ionicons name="close-circle" size={20} color="#94a3b8" />
//             </TouchableOpacity>
//           ) : (
//             <Ionicons name="search" size={20} color="#94a3b8" />
//           )}
//         </View>
//       </View>

//       <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
//         <View style={styles.headerRow}>
//           <Text style={styles.pageTitle}>Document Library</Text>
//           <Text style={styles.documentCount}>
//             {documents.length} {documents.length === 1 ? 'document' : 'documents'}
//           </Text>
//         </View>

//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#1E3A8A" />
//             <Text style={styles.loadingText}>Loading documents...</Text>
//           </View>
//         ) : uploading ? (
//           <View style={styles.uploadingContainer}>
//             <ActivityIndicator size="large" color="#1E3A8A" />
//             <Text style={styles.loadingText}>Uploading document...</Text>
//           </View>
//         ) : filteredDocuments.length > 0 ? (
//           <View style={styles.documentListCard}>
//             {filteredDocuments.map((doc, index) => {
//               const iconData = getDocumentIcon(doc.type);
//               return (
//                 <View key={doc.id}>
//                   <TouchableOpacity 
//                     style={styles.docItem}
//                     onLongPress={() => handleDeleteDocument(doc.id)}
//                   >
//                     <View style={styles.pdfIconContainer}>
//                       <MaterialCommunityIcons 
//                         name={iconData.name} 
//                         size={32} 
//                         color={iconData.color} 
//                       />
//                       <Text style={[styles.pdfLabel, { color: iconData.color }]}>
//                         {doc.type}
//                       </Text>
//                     </View>
//                     <View style={styles.docTextContainer}>
//                       <Text style={styles.timestampText}>
//                         {getRelativeTime(doc.uploadedAt)}
//                         {doc.size > 0 && ` • ${formatFileSize(doc.size)}`}
//                       </Text>
//                       <Text style={styles.docNameText} numberOfLines={1}>
//                         {doc.name}
//                       </Text>
//                     </View>
//                     <View style={styles.docActions}>
//                       {doc.verified && (
//                         <View style={styles.verifiedBadge}>
//                           <MaterialCommunityIcons 
//                             name="check-circle" 
//                             size={20} 
//                             color="#69bc7d" 
//                           />
//                         </View>
//                       )}
//                       <TouchableOpacity 
//                         onPress={() => handleDeleteDocument(doc.id)}
//                         style={styles.deleteButton}
//                       >
//                         <Ionicons name="trash-outline" size={20} color="#ef4444" />
//                       </TouchableOpacity>
//                     </View>
//                   </TouchableOpacity>
//                   {index < filteredDocuments.length - 1 && (
//                     <View style={styles.docSeparator} />
//                   )}
//                 </View>
//               );
//             })}
//           </View>
//         ) : (
//           <View style={styles.emptyState}>
//             <MaterialCommunityIcons 
//               name="file-document-outline" 
//               size={64} 
//               color="#94a3b8" 
//             />
//             <Text style={styles.emptyText}>
//               {searchQuery ? 'No documents found' : 'No documents uploaded yet'}
//             </Text>
//             <Text style={styles.emptySubtext}>
//               {searchQuery 
//                 ? 'Try a different search term' 
//                 : 'Upload your first document to get started'}
//             </Text>
//           </View>
//         )}

//         {/* Action Buttons */}
//         <TouchableOpacity 
//           style={styles.uploadButton} 
//           onPress={handleUpload}
//           disabled={uploading}
//         >
//           <MaterialCommunityIcons name="upload" size={24} color="#fff" />
//           <Text style={styles.uploadButtonText}>
//             {uploading ? 'Uploading...' : 'Upload Document'}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={styles.verifiedButton} 
//           onPress={handleViewVerified}
//         >
//           <View style={styles.verifiedContent}>
//             <View style={styles.checkCircleWhite}>
//               <MaterialCommunityIcons 
//                 name="check-circle" 
//                 size={20} 
//                 color="#69bc7d" 
//               />
//             </View>
//             <Text style={styles.verifiedButtonText}>
//               Verified Documents ({documents.filter(d => d.verified).length})
//             </Text>
//           </View>
//         </TouchableOpacity>

//         <View style={{ height: 20 }} />
//       </ScrollView>

//       {/* Static AI Button (No functionality) */}
//       <View style={styles.fab}>
//         <View style={styles.fabInner}>
//           <Text style={styles.fabAiText}>AI</Text>
//           <MaterialCommunityIcons 
//             name="message-text-outline" 
//             size={22} 
//             color="#1E3A8A" 
//           />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#f3f4f6' 
//   },
//   header: { 
//     backgroundColor: '#1E3A8A', 
//     padding: 20,
//     paddingTop: Platform.OS === 'android' ? 40 : 20,
//     paddingBottom: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   headerTop: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     marginBottom: 16 
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//     flex: 1,
//     textAlign: 'center',
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     width: 40,
//     justifyContent: 'flex-end',
//   },
//   iconButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   badge: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     backgroundColor: '#EF4444',
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 8,
//     fontWeight: 'bold',
//   },
//   searchBar: { 
//     backgroundColor: '#fff', 
//     borderRadius: 12, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     paddingHorizontal: 15, 
//     height: 48,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   searchInput: { 
//     flex: 1, 
//     fontSize: 16, 
//     color: '#1a2b5d', 
//     fontWeight: '500' 
//   },
//   mainScroll: { 
//     flex: 1, 
//     padding: 20 
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   pageTitle: { 
//     fontSize: 20, 
//     fontWeight: 'bold', 
//     color: '#1E3A8A',
//   },
//   documentCount: {
//     fontSize: 14,
//     color: '#64748b',
//     fontWeight: '600',
//   },
//   documentListCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     padding: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   docItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   pdfIconContainer: {
//     position: 'relative',
//     marginRight: 15,
//     width: 40,
//     alignItems: 'center',
//   },
//   pdfLabel: {
//     position: 'absolute',
//     bottom: -2,
//     fontSize: 8,
//     fontWeight: 'bold',
//   },
//   docTextContainer: {
//     flex: 1,
//   },
//   timestampText: {
//     fontSize: 11,
//     color: '#94a3b8',
//     marginBottom: 2,
//   },
//   docNameText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1e293b',
//   },
//   docActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   verifiedBadge: {
//     marginLeft: 10,
//   },
//   deleteButton: {
//     padding: 4,
//   },
//   docSeparator: {
//     height: 1,
//     backgroundColor: '#f1f5f9',
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//     paddingHorizontal: 20,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1e293b',
//     marginTop: 16,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#64748b',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   loadingContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 80,
//   },
//   uploadingContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 40,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: '#64748b',
//   },
//   uploadButton: {
//     backgroundColor: '#1E3A8A',
//     borderRadius: 12,
//     height: 60,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//     gap: 10,
//   },
//   uploadButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   verifiedButton: {
//     backgroundColor: '#69bc7d',
//     borderRadius: 12,
//     height: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   verifiedContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   checkCircleWhite: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     width: 28,
//     height: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   verifiedButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   fab: { 
//     position: 'absolute', 
//     bottom: 20, 
//     right: 20, 
//     backgroundColor: '#fde047', 
//     width: 60, 
//     height: 60, 
//     borderRadius: 30, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     shadowOpacity: 0.3, 
//     shadowRadius: 5, 
//     elevation: 8 
//   },
//   fabInner: { 
//     alignItems: 'center', 
//     justifyContent: 'center' 
//   },
//   fabAiText: { 
//     fontSize: 10, 
//     fontWeight: '900', 
//     color: '#1E3A8A', 
//     marginBottom: -2 
//   },
// });

// export default DocumentsScreen;

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
} from 'react-native';
import { 
  Ionicons,
  MaterialCommunityIcons
} from '@expo/vector-icons';

// --- Constants ---
const VERIFIED_DOCUMENTS = [
  { id: '1', name: 'Aadhar Card', timestamp: '2min ago', verified: true },
  { id: '2', name: 'Pan Card', timestamp: '2min ago', verified: true },
  { id: '4', name: 'Birth Certificate', timestamp: '1 hour ago', verified: true },
];

// --- Main Component ---
function VerifiedDocuments({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = VERIFIED_DOCUMENTS.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Verified Documents</Text>

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
            placeholder="Search verified documents..." 
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={20} color="#94a3b8" />
        </View>
      </View>

      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Your Verified Documents</Text>

        {/* Document List Card */}
        <View style={styles.documentListCard}>
          {filteredDocs.map((doc, index) => (
            <View key={doc.id}>
              <TouchableOpacity style={styles.docItem}>
                <View style={styles.pdfIconContainer}>
                  <MaterialCommunityIcons name="file-document-outline" size={32} color="#69bc7d" />
                  <Text style={styles.pdfLabel}>PDF</Text>
                </View>
                <View style={styles.docTextContainer}>
                  <Text style={styles.timestampText}>{doc.timestamp}</Text>
                  <Text style={styles.docNameText}>{doc.name}</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <MaterialCommunityIcons name="check-circle" size={24} color="#69bc7d" />
                </View>
              </TouchableOpacity>
              {index < filteredDocs.length - 1 && <View style={styles.docSeparator} />}
            </View>
          ))}
        </View>

        {filteredDocs.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="file-document-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>No verified documents found</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
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
    color: '#69bc7d',
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

export default VerifiedDocuments;

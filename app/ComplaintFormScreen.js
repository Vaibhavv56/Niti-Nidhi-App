import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';


const ComplaintFormScreen = ({ onBack }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');


  const handleSubmit = () => {
    console.log({ title, category, description });
    alert('Complaint submitted successfully!');
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>


          <Text style={styles.headerTitle}>File a Complaint</Text>


          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={20} color="#FFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>


      {/* Scrollable Form Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>File a new Complaint</Text>


        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title:</Text>
            <TextInput 
              style={styles.input} 
              placeholderTextColor="#9CA3AF"
              placeholder="Enter complaint title"
              value={title}
              onChangeText={setTitle}
            />
          </View>


          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category:</Text>
            <TextInput 
              style={styles.input} 
              placeholderTextColor="#9CA3AF"
              placeholder="Select or enter category"
              value={category}
              onChangeText={setCategory}
            />
          </View>


          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description:</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              multiline 
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
              placeholder="Describe your complaint in detail..."
              value={description}
              onChangeText={setDescription}
            />
          </View>


          {/* Upload Section */}
          <View style={styles.uploadRow}>
            <View>
              <Text style={styles.uploadLabel}>Upload</Text>
              <Text style={styles.uploadSubLabel}>image/video/docs</Text>
            </View>
            <TouchableOpacity style={styles.uploadBtn}>
              <MaterialCommunityIcons name="cloud-upload-outline" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>


        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitBtn} 
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>


        <View style={{height: 40}} />
      </ScrollView>


      {/* Static AI Button */}
      <View style={styles.fab}>
        <View style={styles.fabInner}>
          <Text style={styles.fabAiText}>AI</Text>
          <MaterialCommunityIcons name="message-text-outline" size={22} color="#1E3A8A" />
        </View>
      </View>
    </View>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginRight: 40,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBtn: {
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 112,
    paddingTop: 12,
  },
  uploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  uploadSubLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  uploadBtn: {
    backgroundColor: '#F3F4F6',
    width: 80,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  submitBtn: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  submitBtnText: {
    color: 'white',
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


export default ComplaintFormScreen;

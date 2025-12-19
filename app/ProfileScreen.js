import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, Image, 
  TextInput, StyleSheet, StatusBar, Switch
} from 'react-native';
import { 
  Ionicons, MaterialCommunityIcons, FontAwesome5 
} from '@expo/vector-icons';

const INITIAL_PROFILE = {
  fullName: "Harshal G. Varde",
  photoUrl: "https://picsum.photos/200/200",
  gender: "Male",
  dob: "1992-02-17",
  mobile: "8948552458",
  alternateMobile: "9876543210",
  language: "Marathi",
  village: "Rajgad",
  gramPanchayat: "Rajgad Gram",
  taluka: "Velhe",
  district: "Pune",
  state: "Maharashtra",
  pinCode: "412212",
  wardNumber: "04",
  primaryOccupation: "Farmer",
  landOwnership: true,
  landArea: "2.5 Acres",
  annualIncome: "1-2.5 Lakhs"
};

const ProfileScreen = ({ onBack }) => {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [view, setView] = useState('profile');

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const navigateTo = (nextView) => {
    setView(nextView);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {view !== 'profile' ? (
          <TouchableOpacity onPress={() => navigateTo('profile')} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {view === 'profile' ? 'My Profile' : 
           view === 'edit-personal' ? 'Personal Details' :
           view === 'edit-address' ? 'Address Details' : 'Economic Details'}
        </Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="share-social-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderProfileView = () => (
    <ScrollView style={styles.scrollView}>
      {/* VCard Section */}
      <View style={styles.vcard}>
        <View style={styles.vcardPattern}>
          <MaterialCommunityIcons name="shield-check" size={200} color="#60a5fa" style={{opacity: 0.1}} />
        </View>
        
        <View style={styles.vcardContent}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: profile.photoUrl || 'https://picsum.photos/200/200' }} 
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.vcardInfo}>
            <Text style={styles.vcardTitle}>HG VCard</Text>
            <Text style={styles.vcardNumber}>
              XXXX XXXX XXXX {profile.mobile.slice(-4)}
            </Text>
          </View>
        </View>
      </View>

      {/* Verification Status */}
      <View style={styles.verificationRow}>
        <Text style={styles.regDate}>Reg Date: 20 Dec 2024</Text>
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={12} color="#fff" />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      {/* Profile Sections */}
      <ProfileSection 
        title="Personal Details" 
        icon={<Ionicons name="person" size={18} color="#3b82f6" />}
        onEdit={() => navigateTo('edit-personal')}
        items={[
          { label: 'Name', value: profile.fullName },
          { label: 'DOB', value: profile.dob },
          { label: 'Gender', value: profile.gender },
          { label: 'Mobile', value: profile.mobile },
          { label: 'Language', value: profile.language },
        ]}
      />

      <ProfileSection 
        title="Address & Governance" 
        icon={<Ionicons name="location" size={18} color="#10b981" />}
        onEdit={() => navigateTo('edit-address')}
        items={[
          { label: 'Village', value: profile.village },
          { label: 'Gram Panchayat', value: profile.gramPanchayat },
          { label: 'Taluka/Block', value: profile.taluka },
          { label: 'PIN Code', value: profile.pinCode },
        ]}
      />

      <ProfileSection 
        title="Economic Details" 
        icon={<Ionicons name="briefcase" size={18} color="#f59e0b" />}
        onEdit={() => navigateTo('edit-economic')}
        items={[
          { label: 'Occupation', value: profile.primaryOccupation },
          { label: 'Land Owner', value: profile.landOwnership ? 'Yes' : 'No' },
          { label: 'Annual Income', value: profile.annualIncome },
        ]}
      />
      <View style={{height: 20}} />
    </ScrollView>
  );

  const renderPersonalEdit = () => (
    <ScrollView style={styles.scrollView}>
      <FormField label="Full Name" value={profile.fullName} onChange={(val) => updateProfile({ fullName: val })} />
      
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <SelectField 
            label="Gender" 
            value={profile.gender} 
            options={['Male', 'Female', 'Other']} 
            onChange={(val) => updateProfile({ gender: val })} 
          />
        </View>
        <View style={styles.halfWidth}>
          <FormField label="Date of Birth" value={profile.dob} onChange={(val) => updateProfile({ dob: val })} />
        </View>
      </View>

      <FormField label="Mobile Number" value={profile.mobile} onChange={(val) => updateProfile({ mobile: val })} />
      <FormField label="Alternate Mobile" value={profile.alternateMobile} onChange={(val) => updateProfile({ alternateMobile: val })} />
      
      <SelectField 
        label="Language Preference" 
        value={profile.language} 
        options={['Marathi', 'Hindi', 'English', 'Local']} 
        onChange={(val) => updateProfile({ language: val })} 
      />

      <TouchableOpacity 
        onPress={() => navigateTo('edit-address')}
        style={styles.nextButton}
      >
        <Text style={styles.nextButtonText}>Next Step</Text>
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </TouchableOpacity>
      <View style={{height: 20}} />
    </ScrollView>
  );

  const renderAddressEdit = () => (
    <ScrollView style={styles.scrollView}>
      <FormField label="Village Name" value={profile.village} onChange={(val) => updateProfile({ village: val })} />
      <FormField label="Gram Panchayat" value={profile.gramPanchayat} onChange={(val) => updateProfile({ gramPanchayat: val })} />
      
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <FormField label="Taluka / Block" value={profile.taluka} onChange={(val) => updateProfile({ taluka: val })} />
        </View>
        <View style={styles.halfWidth}>
          <FormField label="District" value={profile.district} onChange={(val) => updateProfile({ district: val })} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <FormField label="State" value={profile.state} onChange={(val) => updateProfile({ state: val })} />
        </View>
        <View style={styles.halfWidth}>
          <FormField label="PIN Code" value={profile.pinCode} onChange={(val) => updateProfile({ pinCode: val })} />
        </View>
      </View>

      <FormField label="Ward / Booth Number" value={profile.wardNumber} onChange={(val) => updateProfile({ wardNumber: val })} />

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          onPress={() => navigateTo('edit-personal')}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigateTo('edit-economic')}
          style={styles.nextButtonSmall}
        >
          <Text style={styles.nextButtonText}>Next Step</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={{height: 20}} />
    </ScrollView>
  );

  const renderEconomicEdit = () => (
    <ScrollView style={styles.scrollView}>
      <SelectField 
        label="Primary Occupation" 
        value={profile.primaryOccupation} 
        options={['Farmer', 'Laborer', 'Self-Employed', 'Student', 'Homemaker', 'Unemployed']} 
        onChange={(val) => updateProfile({ primaryOccupation: val })} 
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Land Ownership</Text>
        <Switch 
          value={profile.landOwnership}
          onValueChange={(val) => updateProfile({ landOwnership: val })}
          trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
          thumbColor="#fff"
        />
      </View>

      {profile.landOwnership && (
        <FormField 
          label="Land Area (Acres/Bigha)" 
          value={profile.landArea} 
          placeholder="e.g. 2.5 Acres"
          onChange={(val) => updateProfile({ landArea: val })} 
        />
      )}

      <SelectField 
        label="Annual Income Range" 
        value={profile.annualIncome} 
        options={['Below 1 Lakh', '1-2.5 Lakhs', '2.5-5 Lakhs', 'Above 5 Lakhs']} 
        onChange={(val) => updateProfile({ annualIncome: val })} 
      />

      <TouchableOpacity 
        onPress={() => navigateTo('profile')}
        style={styles.saveButton}
      >
        <Text style={styles.nextButtonText}>Save Profile</Text>
        <Ionicons name="checkmark-circle" size={20} color="#fff" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigateTo('edit-address')}
        style={styles.textButton}
      >
        <Text style={styles.textButtonText}>Back to Address</Text>
      </TouchableOpacity>
      <View style={{height: 20}} />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#60a5fa" />
      {renderHeader()}
      
      {view === 'profile' && renderProfileView()}
      {view === 'edit-personal' && renderPersonalEdit()}
      {view === 'edit-address' && renderAddressEdit()}
      {view === 'edit-economic' && renderEconomicEdit()}

      {/* Progress Indicator */}
      {view !== 'profile' && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Step {view === 'edit-personal' ? '1' : view === 'edit-address' ? '2' : '3'} of 3
          </Text>
          <View style={styles.progressDots}>
            {[1,2,3].map(i => (
              <View 
                key={i} 
                style={[
                  styles.progressDot,
                  ((view === 'edit-personal' && i === 1) || 
                   (view === 'edit-address' && i <= 2) || 
                   (view === 'edit-economic' && i <= 3)) && styles.progressDotActive
                ]} 
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

// Helper Components
const ProfileSection = ({ title, icon, onEdit, items }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onEdit} style={styles.editButton}>
        <MaterialCommunityIcons name="pencil" size={16} color="#3b82f6" />
      </TouchableOpacity>
    </View>
    <View style={styles.sectionContent}>
      {items.map((item, idx) => (
        <View key={idx} style={[styles.sectionRow, idx === items.length - 1 && {borderBottomWidth: 0}]}>
          <Text style={styles.sectionLabel}>{item.label}</Text>
          <Text style={styles.sectionValue}>{item.value || '-'}</Text>
        </View>
      ))}
    </View>
  </View>
);

const FormField = ({ label, value, placeholder, onChange }) => (
  <View style={styles.formField}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput 
      value={value}
      placeholder={placeholder}
      onChangeText={onChange}
      style={styles.input}
    />
  </View>
);

const SelectField = ({ label, value, options, onChange }) => (
  <View style={styles.formField}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.selectContainer}>
      <Text style={styles.selectText}>{value}</Text>
      <Ionicons name="chevron-down" size={16} color="#9ca3af" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: StatusBar.currentHeight + 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  vcard: {
    backgroundColor: '#dbeafe',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  vcardPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  vcardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    zIndex: 1,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#1E3A8A',
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  vcardInfo: {
    gap: 4,
  },
  vcardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  vcardNumber: {
    fontSize: 18,
    fontFamily: 'monospace',
    letterSpacing: 2,
    color: '#4b5563',
  },
  verificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  regDate: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  verifiedBadge: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
  editButton: {
    padding: 6,
  },
  sectionContent: {
    borderTopWidth: 1,
    borderTopColor: '#f9fafb',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  sectionLabel: {
    color: '#6b7280',
    fontWeight: '500',
    fontSize: 13,
  },
  sectionValue: {
    color: '#1f2937',
    fontWeight: '600',
    fontSize: 13,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 14,
  },
  selectContainer: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 14,
    color: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  switchLabel: {
    fontWeight: '500',
    color: '#1f2937',
  },
  nextButton: {
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 32,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#6b7280',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nextButtonSmall: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  saveButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 32,
  },
  textButton: {
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  textButtonText: {
    color: '#9ca3af',
    fontWeight: '500',
  },
  progressContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    color: '#9ca3af',
    fontSize: 13,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    height: 8,
    width: 32,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  progressDotActive: {
    backgroundColor: '#3b82f6',
  },
});

export default ProfileScreen;
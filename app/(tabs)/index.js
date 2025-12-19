
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import all your screen components
import ComplaintFormScreen from '../ComplaintFormScreen';
import SchemesScreen from '../SchemesScreen';
import { AuthChoiceScreen, SignInScreen } from '../AuthScreens';
import JobUpdateScreen from '../JobUpdateScreen';
import NewsScreen from '../NewsScreen';
import HelplineScreen from '../HelplineScreen';
import DocumentsScreen from '../DocumentsScreen';
import StatusScreen from '../StatusScreen';
import ChatbotScreen from '../chatbot';
import ProfileScreen from '../ProfileScreen'; // Add your ProfileScreen import

// --- DASHBOARD HOME SCREEN ---
const DashboardHomeScreen = ({ onNavigate, onLogout }) => {
  const quickAccessItems = [
    { id: 'schemes', label: 'Schemes', icon: 'file-document-edit-outline', lib: MaterialCommunityIcons },
    { id: 'complaints', label: 'Complaints', icon: 'comment-alert-outline', lib: MaterialCommunityIcons },
    { id: 'jobs', label: 'Job Updates', icon: 'briefcase-search-outline', lib: MaterialCommunityIcons },
    { id: 'news', label: 'News', icon: 'newspaper-variant-outline', lib: MaterialCommunityIcons },
    { id: 'documents', label: 'Documents', icon: 'file-document-multiple-outline', lib: MaterialCommunityIcons },
    { id: 'helpline', label: 'Helpline', icon: 'phone-in-talk-outline', lib: MaterialCommunityIcons },
  ];

  const handleQuickAccessPress = (itemId) => {
    console.log('Quick access pressed:', itemId);
    switch(itemId) {
      case 'schemes':
        onNavigate('schemes');
        break;
      case 'complaints':
        onNavigate('complaint_form');
        break;
      case 'jobs':
        onNavigate('job_updates');
        break;
      case 'news':
        onNavigate('news');
        break;
      case 'documents':
        onNavigate('documents');
        break;
      case 'helpline':
        onNavigate('helpline');
        break;
      default:
        console.log('Unknown item:', itemId);
    }
  };

  return (
    <View style={styles.dashContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      <View style={styles.dashHeader}>
        <View style={styles.dashHeaderTop}>
          <View style={styles.dashLogoContainer}>
             <MaterialCommunityIcons name="bank" size={24} color="#1E3A8A" />
          </View>
          <View style={styles.dashHeaderIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#FFF" />
              <View style={styles.notificationBadge}><Text style={styles.badgeText}>1</Text></View>
            </TouchableOpacity>
            {/* Profile Button - Navigate to Profile Screen */}
            <TouchableOpacity 
              style={styles.profileButton} 
              onPress={() => onNavigate('profile')}
            >
              <View style={styles.avatarCircle} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.greetingText}>hello, nitesh</Text>
        
        <View style={styles.searchBarContainer}>
          <Text style={styles.searchPlaceholder}>Search</Text>
          <Ionicons name="search" size={20} color="#6B7280" />
        </View>
      </View>

      <ScrollView 
        style={styles.dashScrollView} 
        contentContainerStyle={styles.dashContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bannerContainer}>
          <View style={styles.bannerPlaceholder}>
            <MaterialCommunityIcons name="school" size={40} color="#FFF" style={{opacity: 0.8}} />
            <Text style={styles.bannerTextMain}>समग्र शिक्षा</Text>
            <Text style={styles.bannerTextSub}>Samagra Shiksha</Text>
            <View style={[styles.bannerOverlayLine, { transform: [{ rotate: '45deg' }], left: -20 }]} />
            <View style={[styles.bannerOverlayLine, { transform: [{ rotate: '45deg' }], left: 40 }]} />
          </View>
        </View>

        <Text style={styles.sectionHeading}>Quick Access</Text>
        <View style={styles.quickAccessGrid}>
          {quickAccessItems.map((item) => {
            const IconComponent = item.lib;
            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.quickAccessCard}
                onPress={() => handleQuickAccessPress(item.id)}
              >
                <IconComponent name={item.icon} size={32} color="#4B5563" />
                <Text style={styles.quickAccessLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomActionRow}>
          {/* Check Status Button */}
          <TouchableOpacity 
            style={styles.checkStatusBtn}
            activeOpacity={0.7}
            onPress={() => {
              console.log('Check Status pressed');
              onNavigate('status');
            }}
          >
            <Text style={styles.checkStatusBtnText}>Check Status</Text>
          </TouchableOpacity>
          
          {/* AI Chatbot Button */}
          <TouchableOpacity 
            style={styles.aiBotBtn}
            activeOpacity={0.7}
            onPress={() => {
              console.log('Chatbot pressed');
              onNavigate('chatbot');
            }}
          >
            <MaterialCommunityIcons name="message-text-outline" size={24} color="#1E3A8A" />
            <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI</Text></View>
          </TouchableOpacity>
        </View>

        <View style={{height: 100}} /> 
      </ScrollView>

      <View style={styles.bgPatternContainer} pointerEvents="none">
         <MaterialCommunityIcons name="cube-outline" size={100} color="#E0E7FF" style={{position:'absolute', bottom: 100, left: -20, opacity: 0.5}} />
         <MaterialCommunityIcons name="city-variant-outline" size={150} color="#E0E7FF" style={{position:'absolute', bottom: 50, right: -30, opacity: 0.3}} />
      </View>
    </View>
  );
};

// --- MAIN COMPONENT WITH AUTH ---
export const DashboardScreen = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authScreen, setAuthScreen] = useState('choice');
  const [screen, setScreen] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('@access_token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (mobile, password) => {
    try {
      console.log('Attempting login with:', mobile);
      
      const response = await fetch(
        'https://675c206341f0.ngrok-free.app/api/auth/token/',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            username: mobile,
            password,
          }),
        }
      );

      console.log('Response status:', response.status);

      const rawText = await response.text();
      console.log('Raw response:', rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error(`Server error: ${rawText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        const message = data?.detail || data?.message || 'Invalid credentials';
        throw new Error(message);
      }

      if (!data?.access || !data?.refresh) {
        throw new Error('Invalid server response - missing tokens');
      }

      await AsyncStorage.setItem('@access_token', data.access);
      await AsyncStorage.setItem('@refresh_token', data.refresh);
      
      setIsAuthenticated(true);
      Alert.alert('Success', 'Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message);
      throw error;
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@access_token');
              await AsyncStorage.removeItem('@refresh_token');
              setIsAuthenticated(false);
              setAuthScreen('choice');
              setScreen('dashboard');
              setActiveTab('home');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    switch(tabId) {
      case 'home':
        setScreen('dashboard');
        break;
      case 'schemes':
        setScreen('schemes');
        break;
      case 'jobs':
        setScreen('job_updates');
        break;
      case 'menu':
        Alert.alert('Menu', 'Menu screen coming soon!');
        break;
      default:
        setScreen('dashboard');
    }
  };

  // Determine if bottom nav should be shown
  const shouldShowBottomNav = () => {
    const screensWithoutNav = [
      'chatbot', 
      'complaint_form', 
      'status', 
      'news', 
      'helpline', 
      'documents', 
      'profile'
    ];
    return !screensWithoutNav.includes(screen);
  };

  const renderScreen = () => {
    switch(screen) {
      case 'dashboard':
        return (
          <DashboardHomeScreen 
            onNavigate={setScreen} 
            onLogout={handleLogout} 
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            onBack={() => {
              setScreen('dashboard');
              setActiveTab('home');
            }}
            onLogout={handleLogout}
          />
        );
      case 'complaint_form':
        return (
          <ComplaintFormScreen 
            onBack={() => {
              setScreen('dashboard');
              setActiveTab('home');
            }} 
          />
        );
      case 'schemes':
        return (
          <SchemesScreen 
            onBack={() => {
              setScreen('dashboard');
              setActiveTab('home');
            }} 
          />
        );
      case 'job_updates':
        return (
          <JobUpdateScreen 
            onBack={() => {
              setScreen('dashboard');
              setActiveTab('home');
            }} 
          />
        );
      case 'news':
        return (
          <NewsScreen 
            onBack={() => {
              setScreen('dashboard');
              setActiveTab('home');
            }} 
          />
        );
      case 'helpline':
        return (
          <HelplineScreen 
            onBack={() => {
              setScreen('dashboard');
              setActiveTab('home');
            }} 
          />
        );
      case 'documents':
        return (
          <DocumentsScreen 
            onBack={() => {
              setScreen('dashboard');
              setActiveTab('home');
            }} 
          />
        );
      case 'status':
        return (
          <StatusScreen 
            onBack={() => {
              setScreen('dashboard');
              setActiveTab('home');
            }} 
          />
        );
      case 'chatbot':
        return (
          <ChatbotScreen 
            onBack={() => {
              setScreen('dashboard');
              setActiveTab('home');
            }} 
          />
        );
      default:
        return (
          <DashboardHomeScreen 
            onNavigate={setScreen} 
            onLogout={handleLogout} 
          />
        );
    }
  };

  if (loading) {
    return (
      <View style={[styles.mainContainer, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    if (authScreen === 'choice') {
      return (
        <AuthChoiceScreen 
          onSignIn={() => setAuthScreen('signin')}
          onCreateAccount={() => Alert.alert('Info', 'Account creation is currently disabled')}
        />
      );
    }
    if (authScreen === 'signin') {
      return (
        <SignInScreen
          onBack={() => setAuthScreen('choice')}
          onSubmit={handleSignIn}
        />
      );
    }
  }

  // Show main app if authenticated
  return (
    <View style={styles.mainContainer}>
      <View style={styles.mainContent}>
        {renderScreen()}
      </View>

      {/* Conditionally render bottom navigation */}
      {shouldShowBottomNav() && (
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('home')}>
            <View style={[styles.navIconContainer, activeTab === 'home' && styles.navIconActive]}>
              <Ionicons name="home" size={24} color={activeTab === 'home' ? "#FFF" : "#6B7280"} />
            </View>
            <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('schemes')}>
            <MaterialCommunityIcons name="file-document-outline" size={24} color={activeTab === 'schemes' ? "#1E3A8A" : "#6B7280"} />
            <Text style={[styles.navLabel, activeTab === 'schemes' && styles.navLabelActive]}>Schemes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('jobs')}>
            <MaterialCommunityIcons name="briefcase-search-outline" size={24} color={activeTab === 'jobs' ? "#1E3A8A" : "#6B7280"} />
            <Text style={[styles.navLabel, activeTab === 'jobs' && styles.navLabelActive]}>Jobs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('menu')}>
            <MaterialCommunityIcons name="view-grid-outline" size={24} color={activeTab === 'menu' ? "#1E3A8A" : "#6B7280"} />
            <Text style={[styles.navLabel, activeTab === 'menu' && styles.navLabelActive]}>Menu</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  mainContent: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  dashHeader: {
    backgroundColor: '#1E3A8A',
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  dashHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dashLogoContainer: {
    backgroundColor: '#E0E7FF',
    padding: 8,
    borderRadius: 8,
  },
  dashHeaderIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconButton: {
    position: 'relative',
  },
  profileButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1D5DB',
  },
  greetingText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchBarContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 48,
  },
  searchPlaceholder: {
    flex: 1,
    color: '#374151',
    fontSize: 14,
  },
  dashScrollView: {
    flex: 1,
    zIndex: 10,
  },
  dashContent: {
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
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 15,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 40,
  },
  quickAccessCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  quickAccessLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  checkStatusBtn: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 20,
    elevation: 3,
  },
  checkStatusBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  aiBotBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FDE047',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    position: 'relative',
  },
  aiBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  aiBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  bgPatternContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    overflow: 'hidden',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    zIndex: 100
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIconContainer: {
    padding: 6,
    borderRadius: 20,
  },
  navIconActive: {
    backgroundColor: '#818CF8',
  },
  navLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#1E3A8A',
    fontWeight: '700',
  },
});
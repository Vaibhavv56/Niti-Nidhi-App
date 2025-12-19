// import React, { useState } from 'react';
// import { 
//   StyleSheet, 
//   Text, 
//   View, 
//   ScrollView, 
//   TouchableOpacity, 
//   StatusBar, 
//   SafeAreaView,
//   Platform,
// } from 'react-native';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


// // Use default imports since both files use "export default"
// import EligibleSchemesScreen from './EligibleSchemesScreen';
// import ExploreSchemes from './ExploreSchemes';



// const SchemesScreen = ({ onBack }) => {
//   const [showEligible, setShowEligible] = useState(false);
//   const [showExplore, setShowExplore] = useState(false);


//   // If Eligible Schemes clicked, show that screen
//   if (showEligible) {
//     return <EligibleSchemesScreen onBack={() => setShowEligible(false)} />;
//   }


//   // If Explore Schemes clicked, show that screen
//   if (showExplore) {
//     return <ExploreSchemes onBack={() => setShowExplore(false)} />;
//   }


//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
//       {/* Header matching other screens style */}
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <TouchableOpacity onPress={onBack} style={styles.backButton}>
//             <Ionicons name="arrow-back" size={24} color="#FFF" />
//           </TouchableOpacity>

//           <Text style={styles.headerTitle}>Schemes</Text>

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
//           <Text style={styles.searchPlaceholder}>Search</Text>
//           <Ionicons name="search" size={20} color="#94a3b8" />
//         </View>
//       </View>


//       {/* Schemes Content */}
//       <ScrollView 
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Banner */}
//         <View style={styles.bannerContainer}>
//           <View style={styles.bannerPlaceholder}>
//             <MaterialCommunityIcons name="school" size={40} color="#FFF" style={{opacity: 0.8}} />
//             <Text style={styles.bannerTextMain}>समग्र शिक्षा</Text>
//             <Text style={styles.bannerTextSub}>Samagra Shiksha</Text>
//             <View style={[styles.bannerOverlayLine, { transform: [{ rotate: '45deg' }], left: -20 }]} />
//             <View style={[styles.bannerOverlayLine, { transform: [{ rotate: '45deg' }], left: 40 }]} />
//           </View>
//         </View>


//         {/* Action Buttons */}
//         <View style={styles.actionButtonsContainer}>
//           <TouchableOpacity 
//             style={styles.actionButton}
//             onPress={() => setShowEligible(true)}
//           >
//             <View style={styles.actionIconContainer}>
//               <MaterialCommunityIcons name="clipboard-text-outline" size={32} color="#1F2937" />
//             </View>
//             <Text style={styles.actionButtonText}>Eligible Schemes</Text>
//           </TouchableOpacity>


//           <TouchableOpacity 
//             style={styles.actionButton}
//             onPress={() => setShowExplore(true)}
//           >
//             <View style={styles.actionIconContainer}>
//               <Ionicons name="search-outline" size={32} color="#1F2937" />
//             </View>
//             <Text style={styles.actionButtonText}>Explore Schemes</Text>
//           </TouchableOpacity>
//         </View>


//         <View style={{ height: 100 }} />
//       </ScrollView>


//       {/* Static AI Button */}
//       <View style={styles.fab}>
//         <View style={styles.fabInner}>
//           <Text style={styles.fabAiText}>AI</Text>
//           <MaterialCommunityIcons name="message-text-outline" size={22} color="#1E3A8A" />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f3f4f6',
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
//   searchPlaceholder: {
//     flex: 1,
//     color: '#64748b',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 20,
//   },
//   bannerContainer: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     marginBottom: 25,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   bannerPlaceholder: {
//     height: 160,
//     backgroundColor: '#0F172A',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   bannerTextMain: {
//     color: '#F97316',
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   bannerTextSub: {
//     color: '#FFF',
//     fontSize: 14,
//     marginTop: 2,
//     fontStyle: 'italic',
//   },
//   bannerOverlayLine: {
//     position: 'absolute',
//     width: 300,
//     height: 20,
//     backgroundColor: '#FFF',
//     opacity: 0.1,
//   },
//   actionButtonsContainer: {
//     gap: 16,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#DBEAFE',
//     borderRadius: 12,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: '#BFDBFE',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   actionIconContainer: {
//     marginRight: 16,
//   },
//   actionButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#111827',
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


// export default SchemesScreen;


import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  SafeAreaView,
  Platform,
  Switch,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

// Use default imports since both files use "export default"
import EligibleSchemesScreen from './EligibleSchemesScreen';
import ExploreSchemes from './ExploreSchemes';

const SchemesScreen = ({ onBack }) => {
  const [showEligible, setShowEligible] = useState(false);
  const [showExplore, setShowExplore] = useState(false);

  // Voice guidance states
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [language, setLanguage] = useState('english'); // 'english' or 'hindi'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState(null); // 'eligible', 'explore', or null

  // Animation values for highlighting
  const eligiblePulseAnim = useState(new Animated.Value(1))[0];
  const explorePulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Play welcome guidance after component mounts
    const timer = setTimeout(() => {
      if (voiceEnabled) {
        playVoiceGuidance();
      }
    }, 500);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      Speech.stop();
    };
  }, []);

  // Animate highlighted button
  useEffect(() => {
    if (currentHighlight === 'eligible') {
      startPulseAnimation(eligiblePulseAnim);
    } else if (currentHighlight === 'explore') {
      startPulseAnimation(explorePulseAnim);
    }
  }, [currentHighlight]);

  const startPulseAnimation = (animValue) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1.05,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = (animValue) => {
    animValue.stopAnimation();
    Animated.timing(animValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const playVoiceGuidance = async () => {
    if (!voiceEnabled) return;

    const messages = {
      english: {
        welcome: "Welcome to the Schemes page. Here you can find government schemes that may benefit you.",
        eligible: "The Eligible Schemes button shows you all the government schemes that you are eligible for based on your profile.",
        explore: "The Explore Schemes button lets you browse all available government schemes and learn more about them.",
        outro: "Tap on any button to get started.",
      },
      hindi: {
        welcome: "योजनाओं के पृष्ठ में आपका स्वागत है। यहां आप सरकारी योजनाएं पा सकते हैं जो आपके लिए फायदेमंद हो सकती हैं।",
        eligible: "योग्य योजनाएं बटन आपको आपकी प्रोफ़ाइल के आधार पर सभी सरकारी योजनाएं दिखाता है जिनके लिए आप पात्र हैं।",
        explore: "योजनाओं का अन्वेषण करें बटन आपको सभी उपलब्ध सरकारी योजनाओं को ब्राउज़ करने और उनके बारे में अधिक जानने देता है।",
        outro: "शुरू करने के लिए किसी भी बटन पर टैप करें।",
      },
    };

    try {
      setIsSpeaking(true);
      const languageCode = language === 'hindi' ? 'hi-IN' : 'en-US';

      // Welcome message
      await speakMessage(messages[language].welcome, languageCode);
      await delay(500);

      // Highlight and explain Eligible Schemes
      setCurrentHighlight('eligible');
      await speakMessage(messages[language].eligible, languageCode);
      setCurrentHighlight(null);
      stopPulseAnimation(eligiblePulseAnim);
      await delay(500);

      // Highlight and explain Explore Schemes
      setCurrentHighlight('explore');
      await speakMessage(messages[language].explore, languageCode);
      setCurrentHighlight(null);
      stopPulseAnimation(explorePulseAnim);
      await delay(500);

      // Outro message
      await speakMessage(messages[language].outro, languageCode);

      setIsSpeaking(false);
    } catch (error) {
      console.error('Error playing voice guidance:', error);
      setIsSpeaking(false);
      setCurrentHighlight(null);
      stopPulseAnimation(eligiblePulseAnim);
      stopPulseAnimation(explorePulseAnim);
    }
  };

  const speakMessage = (message, languageCode) => {
    return new Promise((resolve, reject) => {
      Speech.speak(message, {
        language: languageCode,
        pitch: 1.0,
        rate: 0.85,
        onDone: resolve,
        onStopped: resolve,
        onError: reject,
      });
    });
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const stopVoiceGuidance = async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
      setCurrentHighlight(null);
      stopPulseAnimation(eligiblePulseAnim);
      stopPulseAnimation(explorePulseAnim);
    } catch (error) {
      console.error('Error stopping voice guidance:', error);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    stopVoiceGuidance();
  };

  const handleVoiceToggle = (value) => {
    setVoiceEnabled(value);
    if (!value) {
      stopVoiceGuidance();
    }
  };

  const handleReplayGuidance = () => {
    stopVoiceGuidance();
    setTimeout(() => {
      if (voiceEnabled) {
        playVoiceGuidance();
      }
    }, 300);
  };

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

          <TouchableOpacity 
            onPress={isSpeaking ? stopVoiceGuidance : null}
            style={styles.headerIcons}
          >
            {isSpeaking && (
              <MaterialCommunityIcons name="volume-high" size={24} color="#FFF" />
            )}
          </TouchableOpacity>
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

        {/* Voice Guidance Controls */}
        <View style={styles.voiceControlsContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-voice" size={20} color="#1E3A8A" />
            <Text style={styles.sectionTitle}>Voice Guidance</Text>
          </View>
          
          <View style={styles.voiceControls}>
            {/* Voice On/Off */}
            <View style={styles.controlRow}>
              <View style={styles.controlLabel}>
                <MaterialCommunityIcons 
                  name={voiceEnabled ? "volume-high" : "volume-off"} 
                  size={20} 
                  color="#1E3A8A" 
                />
                <Text style={styles.controlText}>Enable Voice</Text>
              </View>
              <Switch
                value={voiceEnabled}
                onValueChange={handleVoiceToggle}
                trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                thumbColor={voiceEnabled ? '#1E3A8A' : '#64748B'}
              />
            </View>

            {/* Language Selection */}
            <View style={styles.controlRow}>
              <View style={styles.controlLabel}>
                <MaterialCommunityIcons name="translate" size={20} color="#1E3A8A" />
                <Text style={styles.controlText}>Language</Text>
              </View>
              <View style={styles.languageButtons}>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    language === 'english' && styles.languageButtonActive
                  ]}
                  onPress={() => handleLanguageChange('english')}
                >
                  <Text style={[
                    styles.languageButtonText,
                    language === 'english' && styles.languageButtonTextActive
                  ]}>
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    language === 'hindi' && styles.languageButtonActive
                  ]}
                  onPress={() => handleLanguageChange('hindi')}
                >
                  <Text style={[
                    styles.languageButtonText,
                    language === 'hindi' && styles.languageButtonTextActive
                  ]}>
                    हिंदी
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Replay and Stop Buttons */}
          <View style={styles.voiceActionButtons}>
            {isSpeaking ? (
              <TouchableOpacity 
                style={styles.stopSpeakingButton}
                onPress={stopVoiceGuidance}
              >
                <MaterialCommunityIcons name="stop-circle" size={20} color="#EF4444" />
                <Text style={styles.stopSpeakingText}>Stop Voice</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.replayButton}
                onPress={handleReplayGuidance}
                disabled={!voiceEnabled}
              >
                <MaterialCommunityIcons 
                  name="replay" 
                  size={20} 
                  color={voiceEnabled ? "#1E3A8A" : "#CBD5E1"} 
                />
                <Text style={[
                  styles.replayButtonText,
                  !voiceEnabled && styles.replayButtonTextDisabled
                ]}>
                  Replay Guidance
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <Animated.View
            style={[
              styles.animatedButtonWrapper,
              {
                transform: [{ scale: eligiblePulseAnim }],
              },
            ]}
          >
            <TouchableOpacity 
              style={[
                styles.actionButton,
                currentHighlight === 'eligible' && styles.actionButtonHighlighted
              ]}
              onPress={() => setShowEligible(true)}
              disabled={isSpeaking}
            >
              <View style={styles.actionIconContainer}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={32} color="#1F2937" />
              </View>
              <View style={styles.actionButtonTextContainer}>
                <Text style={styles.actionButtonText}>Eligible Schemes</Text>
                <Text style={styles.actionButtonSubtext}>
                  Find schemes you qualify for
                </Text>
              </View>
              {currentHighlight === 'eligible' && (
                <View style={styles.highlightIndicator}>
                  <MaterialCommunityIcons name="volume-high" size={20} color="#1E3A8A" />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              styles.animatedButtonWrapper,
              {
                transform: [{ scale: explorePulseAnim }],
              },
            ]}
          >
            <TouchableOpacity 
              style={[
                styles.actionButton,
                currentHighlight === 'explore' && styles.actionButtonHighlighted
              ]}
              onPress={() => setShowExplore(true)}
              disabled={isSpeaking}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="search-outline" size={32} color="#1F2937" />
              </View>
              <View style={styles.actionButtonTextContainer}>
                <Text style={styles.actionButtonText}>Explore Schemes</Text>
                <Text style={styles.actionButtonSubtext}>
                  Browse all available schemes
                </Text>
              </View>
              {currentHighlight === 'explore' && (
                <View style={styles.highlightIndicator}>
                  <MaterialCommunityIcons name="volume-high" size={20} color="#1E3A8A" />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 20,
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
  voiceControlsContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  voiceControls: {
    gap: 16,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  languageButtonActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  languageButtonTextActive: {
    color: '#FFF',
  },
  voiceActionButtons: {
    marginTop: 12,
  },
  stopSpeakingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  stopSpeakingText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  replayButtonText: {
    fontSize: 14,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  replayButtonTextDisabled: {
    color: '#CBD5E1',
  },
  actionButtonsContainer: {
    gap: 16,
  },
  animatedButtonWrapper: {
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#BFDBFE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  actionButtonHighlighted: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
    borderWidth: 3,
    elevation: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  actionIconContainer: {
    marginRight: 16,
  },
  actionButtonTextContainer: {
    flex: 1,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  actionButtonSubtext: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  highlightIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF',
    padding: 6,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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

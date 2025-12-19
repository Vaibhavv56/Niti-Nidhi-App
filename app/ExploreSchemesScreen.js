// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TextInput,
//   SafeAreaView,
//   StatusBar,
//   TouchableOpacity,
//   Platform,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import SchemeDetailsScreen from './SchemeDetailsScreen';

// const EligibleSchemesScreen = ({ onBack, initialCategory = 'All' }) => {
//   const [currentScreen, setCurrentScreen] = useState('list');
//   const [selectedScheme, setSelectedScheme] = useState(null);
//   const [schemes, setSchemes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeCategory, setActiveCategory] = useState(initialCategory);
//   const [categories, setCategories] = useState(['All']);

//   useEffect(() => {
//     fetchSchemes();
//   }, []);

//   const fetchSchemes = async () => {
//     try {
//       setLoading(true);
      
//       const token = await AsyncStorage.getItem('@access_token');
      
//       if (!token) {
//         throw new Error('No authentication token found. Please login again.');
//       }

//       const response = await fetch('https://675c206341f0.ngrok-free.app/api/schemes', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//           'ngrok-skip-browser-warning': 'true'
//         }
//       });

//       console.log('Schemes response status:', response.status);

//       const rawText = await response.text();
//       console.log('Schemes raw response:', rawText.substring(0, 200));

//       let data;
//       try {
//         data = JSON.parse(rawText);
//       } catch (parseError) {
//         console.error('Failed to parse JSON:', parseError);
//         throw new Error(`Server error: ${rawText.substring(0, 100)}`);
//       }
      
//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error('Session expired. Please login again.');
//         }
//         throw new Error(data?.message || 'Failed to fetch schemes');
//       }
      
//       let schemesList = [];
//       if (Array.isArray(data)) {
//         schemesList = data;
//       } else if (data.results && Array.isArray(data.results)) {
//         schemesList = data.results;
//       } else {
//         throw new Error('Invalid response format from server');
//       }

//       setSchemes(schemesList);

//       // Extract unique categories from schemes
//       const uniqueCategories = ['All', ...new Set(
//         schemesList
//           .map(scheme => getCategoryFromDepartment(scheme.department))
//           .filter(cat => cat)
//       )];
//       setCategories(uniqueCategories);

//     } catch (error) {
//       console.error('Error fetching schemes:', error);
//       Alert.alert('Error', error.message || 'Failed to load schemes. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to categorize schemes based on department
//   const getCategoryFromDepartment = (department) => {
//     if (!department) return 'Others';
    
//     const dept = department.toLowerCase();
    
//     if (dept.includes('health') || dept.includes('medical')) return 'Health';
//     if (dept.includes('finance') || dept.includes('bank') || dept.includes('economic')) return 'Finance';
//     if (dept.includes('housing') || dept.includes('urban') || dept.includes('awas')) return 'Housing';
//     if (dept.includes('agriculture') || dept.includes('farming') || dept.includes('krishi')) return 'Agriculture';
//     if (dept.includes('education') || dept.includes('shiksha')) return 'Education';
//     if (dept.includes('energy') || dept.includes('power') || dept.includes('urja')) return 'Energy';
//     if (dept.includes('women') || dept.includes('child')) return 'Women & Child';
//     if (dept.includes('social') || dept.includes('welfare')) return 'Social Welfare';
    
//     return 'Others';
//   };

//   const handleNavigateToSchemeDetails = (scheme) => {
//     setSelectedScheme(scheme);
//     setCurrentScreen('details');
//   };

//   const handleBackToList = () => {
//     setCurrentScreen('list');
//     setSelectedScheme(null);
//   };

//   const handleApplyNow = () => {
//     Alert.alert('Success', 'Application process started!');
//     setCurrentScreen('list');
//   };

//   // Filter schemes based on category and search query
//   const filteredSchemes = schemes.filter(scheme => {
//     const category = getCategoryFromDepartment(scheme.department);
//     const matchesCategory = activeCategory === 'All' || category === activeCategory;
    
//     const matchesSearch = 
//       scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       scheme.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       scheme.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    
//     return matchesCategory && matchesSearch;
//   });

//   if (currentScreen === 'details' && selectedScheme) {
//     return (
//       <SchemeDetailsScreen
//         scheme={selectedScheme}
//         onBack={handleBackToList}
//         onApplyNow={handleApplyNow}
//       />
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
//       <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
//       <Header onBack={onBack} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

//       {loading ? (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <ActivityIndicator size="large" color="#1E3A8A" />
//           <Text style={{ marginTop: 10, color: '#6b7280' }}>Loading schemes...</Text>
//         </View>
//       ) : (
//         <>
//           {/* Category Filter */}
//           <View style={{ backgroundColor: '#fff', paddingVertical: 12 }}>
//             <ScrollView 
//               horizontal 
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{ paddingHorizontal: 16 }}
//             >
//               {categories.map((category) => (
//                 <TouchableOpacity
//                   key={category}
//                   onPress={() => setActiveCategory(category)}
//                   style={{
//                     backgroundColor: activeCategory === category ? '#1E3A8A' : '#fff',
//                     paddingVertical: 10,
//                     paddingHorizontal: 20,
//                     borderRadius: 20,
//                     marginRight: 10,
//                     borderWidth: 2,
//                     borderColor: activeCategory === category ? '#1E3A8A' : '#e5e7eb',
//                   }}
//                 >
//                   <Text style={{
//                     color: activeCategory === category ? '#fff' : '#6b7280',
//                     fontWeight: '700',
//                     fontSize: 14,
//                   }}>
//                     {category}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>

//           {/* Scheme Count */}
//           <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
//             <Text style={{ fontSize: 13, color: '#6b7280', fontWeight: '500' }}>
//               {filteredSchemes.length} {filteredSchemes.length === 1 ? 'Scheme' : 'Schemes'} Available
//             </Text>
//           </View>

//           {filteredSchemes.length === 0 ? (
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
//               <MaterialCommunityIcons name="file-document-alert-outline" size={80} color="#9ca3af" />
//               <Text style={{ fontSize: 18, color: '#4b5563', marginTop: 20, textAlign: 'center' }}>
//                 {searchQuery ? 'No schemes found matching your search' : `No schemes available in ${activeCategory}`}
//               </Text>
//               {(searchQuery || activeCategory !== 'All') && (
//                 <TouchableOpacity 
//                   onPress={() => {
//                     setSearchQuery('');
//                     setActiveCategory('All');
//                   }}
//                   style={{
//                     marginTop: 20,
//                     backgroundColor: '#1E3A8A',
//                     paddingVertical: 10,
//                     paddingHorizontal: 20,
//                     borderRadius: 8,
//                   }}
//                 >
//                   <Text style={{ color: '#fff', fontWeight: '600' }}>Show All Schemes</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           ) : (
//             <ScrollView
//               contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
//               showsVerticalScrollIndicator={false}
//             >
//               {filteredSchemes.map((scheme) => (
//                 <SchemeCard 
//                   key={scheme.id} 
//                   data={scheme}
//                   category={getCategoryFromDepartment(scheme.department)}
//                   onApply={() => handleNavigateToSchemeDetails(scheme)}
//                 />
//               ))}
//               <View style={{ height: 100 }} />
//             </ScrollView>
//           )}
//         </>
//       )}

//       <AIFloatingButton />
//     </SafeAreaView>
//   );
// };

// const Header = ({ onBack, searchQuery, setSearchQuery }) => {
//   return (
//     <View style={{
//       backgroundColor: '#1E3A8A',
//       padding: 20,
//       paddingTop: Platform.OS === 'android' ? 40 : 20,
//       paddingBottom: 20,
//       borderBottomLeftRadius: 20,
//       borderBottomRightRadius: 20,
//     }}>
//       <View style={{
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 16,
//       }}>
//         <TouchableOpacity onPress={onBack} style={{
//           width: 40,
//           height: 40,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//           <Ionicons name="arrow-back" size={24} color="#FFF" />
//         </TouchableOpacity>

//         <Text style={{
//           color: '#FFF',
//           fontSize: 18,
//           fontWeight: 'bold',
//           flex: 1,
//           textAlign: 'center',
//         }}>
//           Eligible Schemes
//         </Text>

//         <View style={{
//           flexDirection: 'row',
//           width: 40,
//           justifyContent: 'flex-end',
//         }}>
//           <TouchableOpacity style={{
//             width: 40,
//             height: 40,
//             justifyContent: 'center',
//             alignItems: 'center',
//             position: 'relative',
//           }}>
//             <Ionicons name="notifications-outline" size={20} color="#FFF" />
//             <View style={{
//               position: 'absolute',
//               top: 8,
//               right: 8,
//               backgroundColor: '#EF4444',
//               width: 14,
//               height: 14,
//               borderRadius: 7,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//               <Text style={{ color: '#fff', fontSize: 8, fontWeight: 'bold' }}>1</Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={{
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 15,
//         height: 48,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//       }}>
//         <TextInput
//           placeholder="Search schemes..."
//           placeholderTextColor="#94a3b8"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           style={{
//             flex: 1,
//             fontSize: 16,
//             color: '#1a2b5d',
//             fontWeight: '500',
//           }}
//         />
//         {searchQuery ? (
//           <TouchableOpacity onPress={() => setSearchQuery('')}>
//             <Ionicons name="close-circle" size={20} color="#94a3b8" />
//           </TouchableOpacity>
//         ) : (
//           <Ionicons name="search" size={20} color="#94a3b8" />
//         )}
//       </View>
//     </View>
//   );
// };

// const SchemeCard = ({ data, category, onApply }) => {
//   const getIcon = () => {
//     switch (category) {
//       case 'Health':
//         return (
//           <View style={{
//             width: 56,
//             height: 56,
//             borderRadius: 28,
//             backgroundColor: '#fee2e2',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//             <Ionicons name="medical" size={32} color="#ef4444" />
//           </View>
//         );
//       case 'Finance':
//         return (
//           <View style={{
//             width: 56,
//             height: 56,
//             borderRadius: 28,
//             backgroundColor: '#fef3c7',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//             <MaterialCommunityIcons name="gold" size={40} color="#fbbf24" />
//           </View>
//         );
//       case 'Housing':
//         return (
//           <View style={{
//             width: 56,
//             height: 56,
//             borderRadius: 28,
//             backgroundColor: '#ffedd5',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//             <Ionicons name="home" size={36} color="#f97316" />
//           </View>
//         );
//       case 'Agriculture':
//         return (
//           <View style={{
//             width: 56,
//             height: 56,
//             borderRadius: 28,
//             backgroundColor: '#dcfce7',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//             <MaterialCommunityIcons name="sprout" size={36} color="#22c55e" />
//           </View>
//         );
//       case 'Education':
//         return (
//           <View style={{
//             width: 56,
//             height: 56,
//             borderRadius: 28,
//             backgroundColor: '#dbeafe',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//             <Ionicons name="school" size={32} color="#3b82f6" />
//           </View>
//         );
//       case 'Energy':
//         return (
//           <View style={{
//             width: 56,
//             height: 56,
//             borderRadius: 28,
//             backgroundColor: '#fef9c3',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//             <Ionicons name="flash" size={32} color="#eab308" />
//           </View>
//         );
//       case 'Women & Child':
//         return (
//           <View style={{
//             width: 56,
//             height: 56,
//             borderRadius: 28,
//             backgroundColor: '#fce7f3',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//             <MaterialCommunityIcons name="human-female-girl" size={36} color="#ec4899" />
//           </View>
//         );
//       case 'Social Welfare':
//         return (
//           <View style={{
//             width: 56,
//             height: 56,
//             borderRadius: 28,
//             backgroundColor: '#e0e7ff',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//             <MaterialCommunityIcons name="account-group" size={36} color="#6366f1" />
//           </View>
//         );
//       default:
//         return (
//           <View style={{
//             width: 56,
//             height: 56,
//             borderRadius: 28,
//             backgroundColor: '#e5e7eb',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//             <MaterialCommunityIcons name="file-document" size={32} color="#6b7280" />
//           </View>
//         );
//     }
//   };

//   return (
//     <View style={{
//       backgroundColor: 'white',
//       borderRadius: 12,
//       padding: 16,
//       marginBottom: 16,
//       borderWidth: 1,
//       borderColor: '#e5e7eb',
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.05,
//       shadowRadius: 4,
//       elevation: 2,
//     }}>
//       <View style={{ flexDirection: 'row', marginBottom: 12 }}>
//         <View style={{ marginRight: 16, justifyContent: 'center' }}>
//           {getIcon()}
//         </View>
//         <View style={{ flex: 1, justifyContent: 'center' }}>
//           <Text style={{ fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 4 }}>
//             {data.name}
//           </Text>
//           <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>
//             {data.department}
//           </Text>
//           <View style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             gap: 8,
//             marginTop: 4,
//           }}>
//             <View style={{
//               backgroundColor: data.scheme_type === 'state' ? '#dbeafe' : '#fef3c7',
//               paddingHorizontal: 8,
//               paddingVertical: 2,
//               borderRadius: 4,
//             }}>
//               <Text style={{ 
//                 fontSize: 10, 
//                 color: data.scheme_type === 'state' ? '#1e40af' : '#92400e',
//                 fontWeight: '600',
//                 textTransform: 'uppercase',
//               }}>
//                 {data.scheme_type}
//               </Text>
//             </View>
            
//             <View style={{
//               backgroundColor: '#f3e8ff',
//               paddingHorizontal: 8,
//               paddingVertical: 2,
//               borderRadius: 4,
//             }}>
//               <Text style={{ 
//                 fontSize: 10, 
//                 color: '#6b21a8',
//                 fontWeight: '600',
//               }}>
//                 {category}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       <Text style={{ 
//         fontSize: 13, 
//         color: '#4b5563', 
//         lineHeight: 18,
//         marginBottom: 12,
//       }} numberOfLines={2}>
//         {data.description}
//       </Text>

//       <View style={{ height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 }} />

//       <View style={{
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//       }}>
//         <View style={{ flex: 1 }}>
//           <Text style={{ fontSize: 10, color: '#9ca3af', marginBottom: 2 }}>
//             Eligibility:
//           </Text>
//           <Text style={{ fontSize: 12, color: '#4b5563', fontWeight: '500' }} numberOfLines={2}>
//             {data.eligibility}
//           </Text>
//         </View>
//         <TouchableOpacity 
//           style={{
//             backgroundColor: '#1E3A8A',
//             paddingVertical: 8,
//             paddingHorizontal: 20,
//             borderRadius: 6,
//             marginLeft: 10,
//           }}
//           onPress={onApply}
//         >
//           <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
//             Apply
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const AIFloatingButton = () => {
//   return (
//     <View style={{
//       position: 'absolute',
//       bottom: 20,
//       right: 20,
//       backgroundColor: '#fde047',
//       width: 60,
//       height: 60,
//       borderRadius: 30,
//       justifyContent: 'center',
//       alignItems: 'center',
//       shadowOpacity: 0.3,
//       shadowRadius: 5,
//       elevation: 8,
//     }}>
//       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//         <Text style={{ fontSize: 10, fontWeight: '900', color: '#1E3A8A', marginBottom: -2 }}>
//           AI
//         </Text>
//         <MaterialCommunityIcons name="message-text-outline" size={22} color="#1E3A8A" />
//       </View>
//     </View>
//   );
// };

// export default EligibleSchemesScreen;



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SchemeDetailsScreen from './SchemeDetailsScreen';

const EligibleSchemesScreen = ({ onBack, initialCategory = 'All' }) => {
  const [currentScreen, setCurrentScreen] = useState('list');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('@access_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch('https://7e3777787c19.ngrok-free.app/api/schemes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      console.log('Schemes response status:', response.status);

      const rawText = await response.text();
      console.log('Schemes raw response:', rawText.substring(0, 200));

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
        throw new Error(data?.message || 'Failed to fetch schemes');
      }
      
      let schemesList = [];
      if (Array.isArray(data)) {
        schemesList = data;
      } else if (data.results && Array.isArray(data.results)) {
        schemesList = data.results;
      } else {
        throw new Error('Invalid response format from server');
      }

      setSchemes(schemesList);

      // Extract unique categories from schemes
      const uniqueCategories = ['All', ...new Set(
        schemesList
          .map(scheme => getCategoryFromDepartment(scheme.department))
          .filter(cat => cat)
      )];
      setCategories(uniqueCategories);

    } catch (error) {
      console.error('Error fetching schemes:', error);
      Alert.alert('Error', error.message || 'Failed to load schemes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to categorize schemes based on department
  const getCategoryFromDepartment = (department) => {
    if (!department) return 'Others';
    
    const dept = department.toLowerCase();
    
    // Agriculture
    if (dept.includes('agriculture') || dept.includes('farming') || dept.includes('krishi') || 
        dept.includes('crop') || dept.includes('farmer')) {
      return 'Agriculture';
    }
    
    // Health
    if (dept.includes('health') || dept.includes('medical') || dept.includes('hospital') ||
        dept.includes('swasthya') || dept.includes('ayush')) {
      return 'Health';
    }
    
    // Finance/Business
    if (dept.includes('finance') || dept.includes('bank') || dept.includes('economic') ||
        dept.includes('business') || dept.includes('msme') || dept.includes('industry') ||
        dept.includes('commerce') || dept.includes('trade')) {
      return 'Business';
    }
    
    // Education
    if (dept.includes('education') || dept.includes('shiksha') || dept.includes('school') ||
        dept.includes('university') || dept.includes('student')) {
      return 'Education';
    }
    
    // Women & Child
    if (dept.includes('women') || dept.includes('child') || dept.includes('mahila') ||
        dept.includes('girl') || dept.includes('mother')) {
      return 'Women';
    }
    
    // Housing
    if (dept.includes('housing') || dept.includes('urban') || dept.includes('awas') ||
        dept.includes('home') || dept.includes('shelter')) {
      return 'Housing';
    }
    
    // Science & Technology
    if (dept.includes('science') || dept.includes('technology') || dept.includes('research') ||
        dept.includes('innovation') || dept.includes('vigyan')) {
      return 'Science';
    }
    
    // Sports
    if (dept.includes('sports') || dept.includes('youth') || dept.includes('khel') ||
        dept.includes('athletics')) {
      return 'Sports';
    }
    
    // Public Safety
    if (dept.includes('police') || dept.includes('safety') || dept.includes('security') ||
        dept.includes('disaster') || dept.includes('fire') || dept.includes('defense')) {
      return 'Public Safety';
    }
    
    // Energy
    if (dept.includes('energy') || dept.includes('power') || dept.includes('urja') ||
        dept.includes('electricity')) {
      return 'Energy';
    }
    
    // Social Welfare
    if (dept.includes('social') || dept.includes('welfare') || dept.includes('pension') ||
        dept.includes('disability')) {
      return 'Social Welfare';
    }
    
    return 'Others';
  };

  const handleNavigateToSchemeDetails = (scheme) => {
    setSelectedScheme(scheme);
    setCurrentScreen('details');
  };

  const handleBackToList = () => {
    setCurrentScreen('list');
    setSelectedScheme(null);
  };

  const handleApplyNow = () => {
    Alert.alert('Success', 'Application process started!');
    setCurrentScreen('list');
  };

  // Filter schemes based on category and search query
  const filteredSchemes = schemes.filter(scheme => {
    const category = getCategoryFromDepartment(scheme.department);
    const matchesCategory = activeCategory === 'All' || category === activeCategory;
    
    const matchesSearch = 
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (currentScreen === 'details' && selectedScheme) {
    return (
      <SchemeDetailsScreen
        scheme={selectedScheme}
        onBack={handleBackToList}
        onApplyNow={handleApplyNow}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      <Header onBack={onBack} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={{ marginTop: 10, color: '#6b7280' }}>Loading schemes...</Text>
        </View>
      ) : (
        <>
          {/* Category Filter */}
          <View style={{ backgroundColor: '#fff', paddingVertical: 12 }}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setActiveCategory(category)}
                  style={{
                    backgroundColor: activeCategory === category ? '#1E3A8A' : '#fff',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    marginRight: 10,
                    borderWidth: 2,
                    borderColor: activeCategory === category ? '#1E3A8A' : '#e5e7eb',
                  }}
                >
                  <Text style={{
                    color: activeCategory === category ? '#fff' : '#6b7280',
                    fontWeight: '700',
                    fontSize: 14,
                  }}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Scheme Count */}
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <Text style={{ fontSize: 13, color: '#6b7280', fontWeight: '500' }}>
              {filteredSchemes.length} {filteredSchemes.length === 1 ? 'Scheme' : 'Schemes'} Available
            </Text>
          </View>

          {filteredSchemes.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <MaterialCommunityIcons name="file-document-alert-outline" size={80} color="#9ca3af" />
              <Text style={{ fontSize: 18, color: '#4b5563', marginTop: 20, textAlign: 'center' }}>
                {searchQuery ? 'No schemes found matching your search' : `No schemes available in ${activeCategory}`}
              </Text>
              {(searchQuery || activeCategory !== 'All') && (
                <TouchableOpacity 
                  onPress={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  style={{
                    marginTop: 20,
                    backgroundColor: '#1E3A8A',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Show All Schemes</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {filteredSchemes.map((scheme) => (
                <SchemeCard 
                  key={scheme.id} 
                  data={scheme}
                  category={getCategoryFromDepartment(scheme.department)}
                  onApply={() => handleNavigateToSchemeDetails(scheme)}
                />
              ))}
              <View style={{ height: 100 }} />
            </ScrollView>
          )}
        </>
      )}

      <AIFloatingButton />
    </SafeAreaView>
  );
};

const Header = ({ onBack, searchQuery, setSearchQuery }) => {
  return (
    <View style={{
      backgroundColor: '#1E3A8A',
      padding: 20,
      paddingTop: Platform.OS === 'android' ? 40 : 20,
      paddingBottom: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <TouchableOpacity onPress={onBack} style={{
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={{
          color: '#FFF',
          fontSize: 18,
          fontWeight: 'bold',
          flex: 1,
          textAlign: 'center',
        }}>
          Eligible Schemes
        </Text>

        <View style={{
          flexDirection: 'row',
          width: 40,
          justifyContent: 'flex-end',
        }}>
          <TouchableOpacity style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}>
            <Ionicons name="notifications-outline" size={20} color="#FFF" />
            <View style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: '#EF4444',
              width: 14,
              height: 14,
              borderRadius: 7,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{ color: '#fff', fontSize: 8, fontWeight: 'bold' }}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{
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
      }}>
        <TextInput
          placeholder="Search schemes..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            flex: 1,
            fontSize: 16,
            color: '#1a2b5d',
            fontWeight: '500',
          }}
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
  );
};

const SchemeCard = ({ data, category, onApply }) => {
  const getIcon = () => {
    switch (category) {
      case 'Health':
        return (
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#fee2e2',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="medical" size={32} color="#ef4444" />
          </View>
        );
      case 'Business':
        return (
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#fef3c7',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="briefcase" size={32} color="#f59e0b" />
          </View>
        );
      case 'Housing':
        return (
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#ffedd5',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="home" size={36} color="#f97316" />
          </View>
        );
      case 'Agriculture':
        return (
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#dcfce7',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="leaf" size={36} color="#22c55e" />
          </View>
        );
      case 'Education':
        return (
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#dbeafe',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="school" size={32} color="#3b82f6" />
          </View>
        );
      case 'Energy':
        return (
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#fef9c3',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="flash" size={32} color="#eab308" />
          </View>
        );
      case 'Women':
        return (
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#fce7f3',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="woman" size={36} color="#ec4899" />
          </View>
        );
      case 'Social Welfare':
        return (
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#e0e7ff',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MaterialCommunityIcons name="account-group" size={36} color="#6366f1" />
          </View>
        );
      case 'Science':
        return (
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#e0f2fe',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="flask" size={32} color="#0284c7" />
          </View>
        );
      case 'Sports':
        return (
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#fef3c7',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="basketball" size={32} color="#f59e0b" />
          </View>
        );
      case 'Public Safety':
        return (
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#dbeafe',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="shield-checkmark" size={32} color="#2563eb" />
          </View>
        );
      default:
        return (
          <View style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#e5e7eb',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MaterialCommunityIcons name="file-document" size={32} color="#6b7280" />
          </View>
        );
    }
  };

  return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    }}>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <View style={{ marginRight: 16, justifyContent: 'center' }}>
          {getIcon()}
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 4 }}>
            {data.name}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>
            {data.department}
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 4,
          }}>
            <View style={{
              backgroundColor: data.scheme_type === 'state' ? '#dbeafe' : '#fef3c7',
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 4,
            }}>
              <Text style={{ 
                fontSize: 10, 
                color: data.scheme_type === 'state' ? '#1e40af' : '#92400e',
                fontWeight: '600',
                textTransform: 'uppercase',
              }}>
                {data.scheme_type}
              </Text>
            </View>
            
            <View style={{
              backgroundColor: '#f3e8ff',
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 4,
            }}>
              <Text style={{ 
                fontSize: 10, 
                color: '#6b21a8',
                fontWeight: '600',
              }}>
                {category}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={{ 
        fontSize: 13, 
        color: '#4b5563', 
        lineHeight: 18,
        marginBottom: 12,
      }} numberOfLines={2}>
        {data.description}
      </Text>

      <View style={{ height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 }} />

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, color: '#9ca3af', marginBottom: 2 }}>
            Eligibility:
          </Text>
          <Text style={{ fontSize: 12, color: '#4b5563', fontWeight: '500' }} numberOfLines={2}>
            {data.eligibility}
          </Text>
        </View>
        <TouchableOpacity 
          style={{
            backgroundColor: '#1E3A8A',
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 6,
            marginLeft: 10,
          }}
          onPress={onApply}
        >
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
            Apply
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AIFloatingButton = () => {
  return (
    <View style={{
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
      elevation: 8,
    }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 10, fontWeight: '900', color: '#1E3A8A', marginBottom: -2 }}>
          AI
        </Text>
        <MaterialCommunityIcons name="message-text-outline" size={22} color="#1E3A8A" />
      </View>
    </View>
  );
};

export default EligibleSchemesScreen;
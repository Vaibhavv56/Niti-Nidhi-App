// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   ScrollView,
//   TextInput,
//   SafeAreaView,
//   StatusBar,
//   TouchableOpacity,
//   Platform,
//   Dimensions,
// } from 'react-native';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';



// const CATEGORIES = [
//   { id: '1', name: 'Agriculture', icon: 'leaf', isHighlighted: false },
//   { id: '2', name: 'Health', icon: 'medical', isHighlighted: false },
//   { id: '3', name: 'Business', icon: 'briefcase', isHighlighted: false },
//   { id: '4', name: 'Education', icon: 'book', isHighlighted: false },
//   { id: '5', name: 'Women', icon: 'woman', isHighlighted: false },
//   { id: '6', name: 'Housing', icon: 'home', isHighlighted: false },
//   { id: '7', name: 'Science', icon: 'flask', isHighlighted: false },
//   { id: '8', name: 'Sports', icon: 'basketball', isHighlighted: false },
//   { id: '9', name: 'Public Safety', icon: 'shield-checkmark', isHighlighted: false },
// ];



// const { width } = Dimensions.get('window');
// const cardWidth = (width - 56) / 3;



// // --- Sub Components DEFINED BEFORE MAIN COMPONENT ---



// const Header = ({ onBack, searchQuery, setSearchQuery }) => {
//   return (
//     <View style={styles.headerContainer}>
//       <View style={styles.headerTop}>
//         <TouchableOpacity onPress={onBack} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#FFF" />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>Explore Schemes</Text>

//         <View style={styles.headerIcons}>
//           <TouchableOpacity style={styles.iconButton}>
//             <Ionicons name="notifications-outline" size={20} color="#FFF" />
//             <View style={styles.badge}>
//               <Text style={styles.badgeText}>1</Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </View>


//       <View style={styles.searchBar}>
//         <TextInput
//           placeholder="Search schemes..."
//           placeholderTextColor="#94a3b8"
//           style={styles.searchInput}
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//         <Ionicons name="search" size={20} color="#94a3b8" />
//       </View>
//     </View>
//   );
// };



// const CategoryCard = ({ data }) => {
//   return (
//     <TouchableOpacity 
//       style={styles.card}
//       activeOpacity={0.7}
//     >
//       <View style={styles.iconWrapper}>
//         <Ionicons 
//           name={data.icon}
//           size={36} 
//           color="#374151"
//         />
//       </View>
//       <Text style={styles.cardText}>{data.name}</Text>
//     </TouchableOpacity>
//   );
// };



// const AIFloatingButton = () => {
//   return (
//     <View style={styles.fab}>
//       <View style={styles.fabInner}>
//         <Text style={styles.fabAiText}>AI</Text>
//         <MaterialCommunityIcons name="message-text-outline" size={22} color="#1E3A8A" />
//       </View>
//     </View>
//   );
// };



// // --- MAIN COMPONENT ---



// const ExploreSchemes = ({ onBack }) => {
//   const [searchQuery, setSearchQuery] = useState('');

//   // Filter categories based on search query
//   const filteredCategories = CATEGORIES.filter(cat =>
//     cat.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
//       <Header onBack={onBack} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />


//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <Text style={styles.sectionTitle}>Categories</Text>
        
//         {filteredCategories.length > 0 ? (
//           <View style={styles.gridContainer}>
//             {filteredCategories.map((cat) => (
//               <CategoryCard key={cat.id} data={cat} />
//             ))}
//           </View>
//         ) : (
//           <View style={styles.emptyState}>
//             <MaterialCommunityIcons name="folder-search-outline" size={64} color="#CBD5E1" />
//             <Text style={styles.emptyText}>No categories found</Text>
//           </View>
//         )}


//         <View style={{ height: 100 }} />
//       </ScrollView>


//       <AIFloatingButton />
//     </SafeAreaView>
//   );
// };



// // --- Styles ---



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f3f4f6',
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     justifyContent: 'space-between',
//   },
//   card: {
//     width: cardWidth,
//     height: cardWidth * 1.1,
//     backgroundColor: 'white',
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   iconWrapper: {
//     marginBottom: 8,
//     width: 48,
//     height: 48,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cardText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#1f2937',
//     textAlign: 'center',
//   },
//   headerContainer: {
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
//     marginBottom: 16,
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
//     fontWeight: '500',
//   },
//   emptyState: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 80,
//   },
//   emptyText: {
//     color: '#374151',
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 16,
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
//     elevation: 8,
//   },
//   fabInner: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   fabAiText: {
//     fontSize: 10,
//     fontWeight: '900',
//     color: '#1E3A8A',
//     marginBottom: -2,
//   },
// });



// export default ExploreSchemes;


import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';



const CATEGORIES = [
  { id: '1', name: 'Agriculture', icon: 'leaf', isHighlighted: false },
  { id: '2', name: 'Health', icon: 'medical', isHighlighted: false },
  { id: '3', name: 'Business', icon: 'briefcase', isHighlighted: false },
  { id: '4', name: 'Education', icon: 'book', isHighlighted: false },
  { id: '5', name: 'Women', icon: 'woman', isHighlighted: false },
  { id: '6', name: 'Housing', icon: 'home', isHighlighted: false },
  { id: '7', name: 'Science', icon: 'flask', isHighlighted: false },
  { id: '8', name: 'Sports', icon: 'basketball', isHighlighted: false },
  { id: '9', name: 'Public Safety', icon: 'shield-checkmark', isHighlighted: false },
];



const { width } = Dimensions.get('window');
const cardWidth = (width - 56) / 3;



// --- Sub Components DEFINED BEFORE MAIN COMPONENT ---



const Header = ({ onBack, searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Explore Schemes</Text>

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
          placeholder="Search schemes..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={20} color="#94a3b8" />
      </View>
    </View>
  );
};



const CategoryCard = ({ data, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress(data.name)}
    >
      <View style={styles.iconWrapper}>
        <Ionicons 
          name={data.icon}
          size={36} 
          color="#374151"
        />
      </View>
      <Text style={styles.cardText}>{data.name}</Text>
    </TouchableOpacity>
  );
};



const AIFloatingButton = () => {
  return (
    <View style={styles.fab}>
      <View style={styles.fabInner}>
        <Text style={styles.fabAiText}>AI</Text>
        <MaterialCommunityIcons name="message-text-outline" size={22} color="#1E3A8A" />
      </View>
    </View>
  );
};



// --- MAIN COMPONENT ---



const ExploreSchemes = ({ onBack, onCategorySelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter categories based on search query
  const filteredCategories = CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryPress = (categoryName) => {
    // Navigate to eligible schemes screen with selected category
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      <Header onBack={onBack} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />


      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Categories</Text>
        
        {filteredCategories.length > 0 ? (
          <View style={styles.gridContainer}>
            {filteredCategories.map((cat) => (
              <CategoryCard 
                key={cat.id} 
                data={cat} 
                onPress={handleCategoryPress}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="folder-search-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        )}


        <View style={{ height: 100 }} />
      </ScrollView>


      <AIFloatingButton />
    </SafeAreaView>
  );
};



// --- Styles ---



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    height: cardWidth * 1.1,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iconWrapper: {
    marginBottom: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  headerContainer: {
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
    marginBottom: 16,
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
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
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
    elevation: 8,
  },
  fabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabAiText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1E3A8A',
    marginBottom: -2,
  },
});



export default ExploreSchemes;
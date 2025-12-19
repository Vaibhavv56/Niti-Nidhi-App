// // import { usePathname, useRouter } from 'expo-router';
// // import React from 'react';
// // import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// // export default function BottomNav() {
// //   const router = useRouter();
// //   const pathname = usePathname();

// //   const isActive = (path) => {
// //     if (path === '/' && pathname === '/(tabs)') return true;
// //     return pathname === path;
// //   };

// //   return (
// //     <View style={styles.bottomNav}>
// //       <TouchableOpacity 
// //         style={styles.navItem} 
// //         onPress={() => router.push('/(tabs)')}
// //       >
// //         <View style={[styles.navIconContainer, isActive('/(tabs)') && styles.activeIconContainer]}>
// //           <Text style={styles.navIcon}>🏠</Text>
// //         </View>
// //         <Text style={[styles.navText, isActive('/(tabs)') && styles.activeNavText]}>Home</Text>
// //       </TouchableOpacity>
      
// //       <TouchableOpacity 
// //         style={styles.navItem}
// //         onPress={() => router.push('/explore-schemes')}
// //       >
// //         <View style={[styles.navIconContainer, (pathname === '/explore-schemes' || pathname === '/schemes-by-category') && styles.activeIconContainer]}>
// //           <Text style={styles.navIcon}>🔍</Text>
// //         </View>
// //         <Text style={[styles.navText, (pathname === '/explore-schemes' || pathname === '/schemes-by-category') && styles.activeNavText]}>Search</Text>
// //       </TouchableOpacity>
      
// //       <TouchableOpacity 
// //         style={styles.navItem}
// //         onPress={() => router.push('/menu')}
// //       >
// //         <View style={[styles.navIconContainer, isActive('/menu') && styles.activeIconContainer]}>
// //           <Text style={styles.navIcon}>☰</Text>
// //         </View>
// //         <Text style={[styles.navText, isActive('/menu') && styles.activeNavText]}>Menu</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   bottomNav: {
// //     backgroundColor: '#fff',
// //     borderTopWidth: 1,
// //     borderTopColor: '#E5E7EB',
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     alignItems: 'center',
// //     paddingVertical: 12,
// //     paddingHorizontal: 20,
// //     paddingBottom: 24,
// //     paddingTop: 12,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: -2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 8,
// //   },
// //   navItem: {
// //     flex: 1,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   navIconContainer: {
// //     width: 48,
// //     height: 48,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     borderRadius: 24,
// //     marginBottom: 4,
// //   },
// //   activeIconContainer: {
// //     backgroundColor: '#DBEAFE',
// //   },
// //   navIcon: {
// //     fontSize: 24,
// //   },
// //   navText: {
// //     fontSize: 12,
// //     color: '#6B7280',
// //     marginTop: 2,
// //     fontWeight: '500',
// //   },
// //   activeNavText: {
// //     color: '#2563EB',
// //     fontWeight: '600',
// //   },
// // });

// import { usePathname, useRouter } from 'expo-router';
// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function BottomNav() {
//   const router = useRouter();
//   const pathname = usePathname();

//   const isActive = (path) => {
//     // Handle home route
//     if (path === '/') {
//       return pathname === '/(tabs)' || pathname === '/' || pathname === '/index';
//     }
//     // Handle search/explore routes
//     if (path === '/explore-schemes') {
//       return pathname === '/explore-schemes' || pathname === '/schemes-by-category' || pathname === '/schemes';
//     }
//     return pathname === path;
//   };

//   return (
//     <View style={styles.bottomNav}>
//       <TouchableOpacity 
//         style={styles.navItem} 
//         onPress={() => router.push('/')}
//       >
//         <View style={[styles.navIconContainer, isActive('/') && styles.activeIconContainer]}>
//           <Text style={styles.navIcon}>🏠</Text>
//         </View>
//         <Text style={[styles.navText, isActive('/') && styles.activeNavText]}>Home</Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity 
//         style={styles.navItem}
//         onPress={() => router.push('/explore-schemes')}
//       >
//         <View style={[styles.navIconContainer, isActive('/explore-schemes') && styles.activeIconContainer]}>
//           <Text style={styles.navIcon}>🔍</Text>
//         </View>
//         <Text style={[styles.navText, isActive('/explore-schemes') && styles.activeNavText]}>Search</Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity 
//         style={styles.navItem}
//         onPress={() => router.push('/menu')}
//       >
//         <View style={[styles.navIconContainer, isActive('/menu') && styles.activeIconContainer]}>
//           <Text style={styles.navIcon}>☰</Text>
//         </View>
//         <Text style={[styles.navText, isActive('/menu') && styles.activeNavText]}>Menu</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   bottomNav: {
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     paddingBottom: 24,
//     paddingTop: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 8,
//   },
//   navItem: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   navIconContainer: {
//     width: 48,
//     height: 48,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 24,
//     marginBottom: 4,
//   },
//   activeIconContainer: {
//     backgroundColor: '#DBEAFE',
//   },
//   navIcon: {
//     fontSize: 24,
//   },
//   navText: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//     fontWeight: '500',
//   },
//   activeNavText: {
//     color: '#2563EB',
//     fontWeight: '600',
//   },
// });

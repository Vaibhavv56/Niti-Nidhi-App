import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function AppHeader({ title, showBack = true, onBackPress }) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      )}
      
      {!title ? (
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🏛️</Text>
          </View>
          <Text style={styles.appName}>Niti Nidhi</Text>
        </View>
      ) : (
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      )}
      
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.headerIcon}>
          <Text style={styles.headerIconText}>🔔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#0F172A',
  },
  backIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#6366F1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 22,
  },
  appName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 20,
  },
});

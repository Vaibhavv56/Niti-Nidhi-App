import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';

const MenuButton = ({ icon, title, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={styles.menuButton}
  >
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>{icon}</Text>
    </View>
    <Text style={styles.menuTitle}>{title}</Text>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const menuItems = [
    { id: 1, icon: '🎯', title: 'My Schemes', screen: 'MySchemes' },
    { id: 2, icon: '📁', title: 'My Documents', screen: 'MyDocuments' },
    { id: 3, icon: '🤖', title: 'Chatbot', screen: 'Chatbot' },
    { id: 4, icon: '📢', title: 'Complaints', screen: 'Complaints' },
    { id: 5, icon: '📰', title: 'News & Local Updates', screen: 'News' },
    { id: 6, icon: '📞', title: 'Call on Helpline', screen: 'Helpline' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>hello, vaibhav</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.headerIconText}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerIcon, { backgroundColor: '#BFDBFE' }]}>
            <Text style={styles.headerIconText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerIcon, { backgroundColor: '#93C5FD' }]}>
            <Text style={styles.headerIconText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>● sukanya.com</Text>
          </View>
          
          <View style={styles.heroContent}>
            <View style={styles.heroText}>
              <Text style={styles.schemeLabel}>Government Schemes</Text>
              <Text style={styles.forText}>For</Text>
              <Text style={styles.girlChildText}>Girl Child</Text>
            </View>
            <View style={styles.illustrationContainer}>
              <View style={styles.mainCircle}>
                <Text style={styles.girlEmoji}>👧</Text>
              </View>
              <View style={[styles.decorBox, styles.booksBox]}>
                <Text style={styles.decorEmoji}>📚</Text>
              </View>
              <View style={[styles.decorBox, styles.giftBox]}>
                <Text style={styles.decorEmoji}>🎁</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <MenuButton
              key={item.id}
              icon={item.icon}
              title={item.title}
              onPress={() => navigation.navigate(item.screen)}
            />
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>☰</Text>
          <Text style={styles.navText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroBanner: {
    backgroundColor: '#DBEAFE',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    marginTop: 8,
  },
  badge: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroText: {
    flex: 1,
  },
  schemeLabel: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 4,
  },
  forText: {
    color: '#1F2937',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  girlChildText: {
    color: '#2563EB',
    fontSize: 30,
    fontWeight: 'bold',
  },
  illustrationContainer: {
    alignItems: 'center',
    position: 'relative',
    width: 120,
    height: 120,
  },
  mainCircle: {
    width: 96,
    height: 96,
    backgroundColor: '#BFDBFE',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  girlEmoji: {
    fontSize: 50,
  },
  decorBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  booksBox: {
    width: 64,
    height: 64,
    backgroundColor: '#FEF3C7',
    bottom: -8,
    left: -16,
  },
  giftBox: {
    width: 48,
    height: 48,
    backgroundColor: '#FCE7F3',
    bottom: -8,
    right: -8,
  },
  decorEmoji: {
    fontSize: 30,
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  arrow: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  bottomSpacing: {
    height: 80,
  },
  bottomNav: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#6B7280',
  },
  activeNavText: {
    color: '#2563EB',
    fontWeight: '600',
  },
});
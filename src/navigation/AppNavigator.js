import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';

// Placeholder screens (create these later)
const PlaceholderScreen = ({ route }) => {
  const { name } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{name}</Text>
      <Text style={{ marginTop: 10, color: '#666' }}>Coming Soon...</Text>
    </View>
  );
};

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="MySchemes" 
          component={PlaceholderScreen} 
          initialParams={{ name: 'My Schemes' }}
          options={{ headerShown: true, title: 'My Schemes' }}
        />
        <Stack.Screen 
          name="MyDocuments" 
          component={PlaceholderScreen}
          initialParams={{ name: 'My Documents' }}
          options={{ headerShown: true, title: 'My Documents' }}
        />
        <Stack.Screen 
          name="Chatbot" 
          component={PlaceholderScreen}
          initialParams={{ name: 'Chatbot' }}
          options={{ headerShown: true, title: 'Chatbot' }}
        />
        <Stack.Screen 
          name="Complaints" 
          component={PlaceholderScreen}
          initialParams={{ name: 'Complaints' }}
          options={{ headerShown: true, title: 'Complaints' }}
        />
        <Stack.Screen 
          name="News" 
          component={PlaceholderScreen}
          initialParams={{ name: 'News & Updates' }}
          options={{ headerShown: true, title: 'News & Updates' }}
        />
        <Stack.Screen 
          name="Helpline" 
          component={PlaceholderScreen}
          initialParams={{ name: 'Helpline' }}
          options={{ headerShown: true, title: 'Call Helpline' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; // Stack eklendi
import React from 'react';

import CreateReportScreen from '../screens/home/CreateReportScreen'; // Yeni ekranı çağır
import HomeScreen from '../screens/home/HomeScreen';
import MapScreen from '../screens/home/MapScreen';
import ReportDetailScreen from '../screens/home/ReportDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

// Ana Sayfa Yığını (Liste -> Detay -> Ekleme)
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Bildirim Akışı" component={HomeScreen} />
      <HomeStack.Screen name="CreateReport" component={CreateReportScreen} options={{ title: 'Bildirim Oluştur' }} />
      <HomeStack.Screen name="ReportDetail" component={ReportDetailScreen} options={{ title: 'Bildirim Detayı' }} />
    </HomeStack.Navigator>
  );
}

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Tab'ın kendi başlığını gizle, Stack'inkini kullanacağız
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Ana Sayfa') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Harita') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Profil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeStackNavigator} />
      <Tab.Screen name="Harita" component={MapScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
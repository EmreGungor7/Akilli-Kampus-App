import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { auth } from './src/config/firebaseConfig';

import AppTabs from './src/navigation/AppTabs';
import AuthStack from './src/navigation/AuthStack';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App.js: Dinleyici başlatılıyor...");
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Bu satır terminalde çıkarsa App.js haberi almış demektir
      console.log("App.js: AUTH DURUMU DEĞİŞTİ! Kullanıcı:", currentUser ? currentUser.email : "YOK");
      
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* Kullanıcı varsa AppTabs, yoksa AuthStack göster */}
        {console.log("App.js: Render ediliyor. Aktif ekran:", user ? "ANA SAYFA (AppTabs)" : "GİRİŞ (AuthStack)")}
        {user ? <AppTabs /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
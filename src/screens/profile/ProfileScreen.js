import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../config/firebaseConfig';
import { logoutUser } from '../../services/authService';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Firestore'dan kullanıcının detaylarını (Bölüm, İsim vb.) çek
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    } catch (error) {
      console.error("Profil yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Uygulamadan çıkmak istediğine emin misin?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Çıkış Yap", 
          style: "destructive", 
          onPress: () => {
            logoutUser(); // App.js bunu algılayıp seni giriş ekranına atacak
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Üst Kısım: Avatar ve İsim */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={60} color="#fff" />
        </View>
        <Text style={styles.name}>{userData?.name || "Kullanıcı"}</Text>
        <Text style={styles.role}>{userData?.role === 'admin' ? 'Yönetici' : 'Öğrenci / Personel'}</Text>
      </View>

      {/* Bilgi Kartları  */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={24} color="#555" />
          <View style={styles.infoText}>
            <Text style={styles.label}>E-posta</Text>
            <Text style={styles.value}>{userData?.email}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={24} color="#555" />
          <View style={styles.infoText}>
            <Text style={styles.label}>Birim / Bölüm</Text>
            <Text style={styles.value}>{userData?.department || "Belirtilmemiş"}</Text>
          </View>
        </View>
      </View>

      {/* Çıkış Yap Butonu [cite: 89] */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    backgroundColor: '#007AFF', 
    padding: 30, 
    alignItems: 'center', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30 
  },
  avatarContainer: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: 'rgba(255,255,255,0.3)', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 10
  },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  role: { fontSize: 16, color: '#e0e0e0', marginTop: 5 },
  infoSection: { padding: 20, marginTop: 10 },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  infoText: { marginLeft: 15 },
  label: { fontSize: 12, color: '#888' },
  value: { fontSize: 16, fontWeight: '500', color: '#333' },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff3b30',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff3b30',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 }
  },
  logoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 }
});
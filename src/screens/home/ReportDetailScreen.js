import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { auth, db } from '../../config/firebaseConfig';
import { updateReportStatus } from '../../services/reportService';

export default function ReportDetailScreen({ route, navigation }) {
  // Önceki sayfadan gelen bildirim verisi
  const { report } = route.params;
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(report.status || 'Açık');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  // Giren kişi Admin mi kontrol et
  const checkUserRole = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        setIsAdmin(true);
      }
    }
  };

  // Durum Değiştirme Fonksiyonu
  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await updateReportStatus(report.id, newStatus);
      setCurrentStatus(newStatus);
      Alert.alert("Başarılı", `Durum '${newStatus}' olarak güncellendi.`);
    } catch (error) {
      Alert.alert("Hata", "Güncelleme yapılamadı.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Harita (Mini Görünüm) */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: report.location.latitude,
            longitude: report.location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          scrollEnabled={false} // Sadece görüntüleme amaçlı
        >
          <Marker coordinate={report.location} />
        </MapView>
      </View>

      <View style={styles.content}>
        {/* Başlık ve İkon */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{report.title}</Text>
          <View style={[styles.badge, { backgroundColor: currentStatus === 'Çözüldü' ? '#28a745' : '#007AFF' }]}>
            <Text style={styles.badgeText}>{currentStatus}</Text>
          </View>
        </View>

        {/* Tarih ve Tür Bilgisi */}
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.metaText}>
            {report.createdAt ? new Date(report.createdAt.seconds * 1000).toLocaleDateString('tr-TR') : 'Tarih Yok'}
          </Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.metaText}>{report.type.toUpperCase()}</Text>
        </View>

        <Text style={styles.label}>AÇIKLAMA</Text>
        <Text style={styles.description}>{report.description}</Text>

        {/* Yönetici Paneli (Sadece Admin Görür) */}
        {isAdmin && (
          <View style={styles.adminPanel}>
            <Text style={styles.adminTitle}>Yönetici İşlemleri</Text>
            <Text style={styles.adminSub}>Bu bildirimin durumunu değiştir:</Text>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.statusBtn, { backgroundColor: '#007AFF', opacity: currentStatus === 'Açık' ? 0.5 : 1 }]}
                onPress={() => handleStatusChange('Açık')}
                disabled={currentStatus === 'Açık' || updating}
              >
                <Text style={styles.btnText}>AÇIK</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.statusBtn, { backgroundColor: '#28a745', opacity: currentStatus === 'Çözüldü' ? 0.5 : 1 }]}
                onPress={() => handleStatusChange('Çözüldü')}
                disabled={currentStatus === 'Çözüldü' || updating}
              >
                {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>ÇÖZÜLDÜ</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mapContainer: { height: 200, width: '100%' },
  map: { flex: 1 },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  metaText: { color: '#666', marginLeft: 5, fontSize: 14 },
  separator: { marginHorizontal: 10, color: '#ddd' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#999', marginBottom: 5 },
  description: { fontSize: 16, color: '#333', lineHeight: 24 },
  
  // Admin Paneli Stilleri
  adminPanel: { marginTop: 30, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  adminTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5, color: '#333' },
  adminSub: { fontSize: 12, color: '#666', marginBottom: 15 },
  buttonGroup: { flexDirection: 'row', gap: 10 },
  statusBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
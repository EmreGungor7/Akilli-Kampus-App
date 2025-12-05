import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location'; // Konum paketi eklendi
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addReport } from '../../services/reportService';

export default function CreateReportScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('technical');
  const [loading, setLoading] = useState(false);
  
  // Konum bilgisi için state (Başlangıçta boş)
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Telefonun anlık konumunu alma fonksiyonu
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      // 1. İzin İste
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("İzin Hatası", "Konum izni verilmedi.");
        setLocationLoading(false);
        return;
      }

      // 2. Koordinatları Al
      let userLocation = await Location.getCurrentPositionAsync({});
      
      // 3. State'e kaydet
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude
      });
      
      Alert.alert("Konum Alındı", "Bulunduğunuz yer başarıyla belirlendi.");
    } catch (error) {
      Alert.alert("Hata", "Konum alınamadı. GPS açık mı?");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSend = async () => {
    if (!title || !description) {
      Alert.alert("Eksik Bilgi", "Lütfen başlık ve açıklama giriniz.");
      return;
    }

    if (!location) {
      Alert.alert("Konum Eksik", "Lütfen önce 'Konumumu Bul' butonuna basınız.");
      return;
    }

    setLoading(true);
    try {
      // Artık gerçek konumu gönderiyoruz
      await addReport(title, description, type, location);
      
      Alert.alert("Başarılı", "Bildiriminiz gerçek konumunuzla oluşturuldu!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Hata", "Bildirim gönderilemedi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const TypeButton = ({ value, label, icon, color }) => (
    <TouchableOpacity 
      style={[styles.typeBtn, type === value && { backgroundColor: color, borderColor: color }]} 
      onPress={() => setType(value)}
    >
      <Ionicons name={icon} size={24} color={type === value ? 'white' : color} />
      <Text style={[styles.typeText, type === value && { color: 'white' }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yeni Bildirim Oluştur</Text>

      <View style={styles.typeContainer}>
        <TypeButton value="security" label="Güvenlik" icon="shield" color="#d9534f" />
        <TypeButton value="health" label="Sağlık" icon="medkit" color="#5bc0de" />
        <TypeButton value="technical" label="Teknik" icon="construct" color="#f0ad4e" />
      </View>

      <Text style={styles.label}>Başlık</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Örn: Kütüphane Kliması Bozuk" 
        value={title} 
        onChangeText={setTitle} 
      />

      <Text style={styles.label}>Açıklama</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Detaylı bilgi verin..." 
        value={description} 
        onChangeText={setDescription}
        multiline
      />

      {/* KONUM BUTONU */}
      <TouchableOpacity 
        style={[styles.locationBtn, location && styles.locationBtnActive]} 
        onPress={getCurrentLocation}
        disabled={locationLoading}
      >
        {locationLoading ? (
          <ActivityIndicator color="#007AFF" />
        ) : (
          <>
            <Ionicons name={location ? "checkmark-circle" : "location"} size={24} color={location ? "white" : "#007AFF"} />
            <Text style={[styles.locationText, location && { color: 'white' }]}>
              {location ? "Konum Alındı" : "Konumumu Bul"}
            </Text>
          </>
        )}
      </TouchableOpacity>
      
      {/* Eğer konum alındıysa koordinatları göster (Test için) */}
      {location && (
        <Text style={styles.coordText}>
          Enlem: {location.latitude.toFixed(4)}, Boylam: {location.longitude.toFixed(4)}
        </Text>
      )}

      <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendText}>BİLDİRİM GÖNDER</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  textArea: { height: 100, textAlignVertical: 'top' },
  typeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  typeBtn: { flex: 1, alignItems: 'center', padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginHorizontal: 3 },
  typeText: { marginTop: 5, fontSize: 12, fontWeight: 'bold', color: '#555' },
  
  // Konum Butonu Stilleri
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    backgroundColor: '#f0f8ff'
  },
  locationBtnActive: {
    backgroundColor: '#28a745', // Yeşil renk (Başarılı)
    borderColor: '#28a745'
  },
  locationText: { marginLeft: 10, color: '#007AFF', fontWeight: 'bold' },
  coordText: { textAlign: 'center', color: '#888', fontSize: 12, marginTop: 5 },

  sendBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  sendText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
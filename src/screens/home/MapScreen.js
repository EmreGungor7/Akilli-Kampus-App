import { useFocusEffect } from '@react-navigation/native'; // Sayfa her açıldığında yenilemek için
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { getReports } from '../../services/reportService';

export default function MapScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sayfa her odaklandığında verileri yeniden çek
  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [])
  );

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Türüne göre Pin Rengi Belirleme 
  const getPinColor = (type) => {
    switch (type) {
      case 'security': return 'red';    // Güvenlik: Kırmızı
      case 'health': return 'blue';     // Sağlık: Mavi
      case 'technical': return 'orange';// Teknik: Turuncu
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Harita Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        initialRegion={{
          latitude: 39.9030, // Erzurum Kampüs (Varsayılan)
          longitude: 41.2460,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
      >
        {reports.map((report) => (
          <Marker
            key={report.id}
            coordinate={report.location}
            pinColor={getPinColor(report.type)} // Renkli pinler
            title={report.title}
            description={report.description}
          >
            {/* Pin Tıklanınca Çıkan Bilgi Kartı [cite: 50, 51] */}
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{report.title}</Text>
                <Text style={styles.calloutType}>{report.type.toUpperCase()}</Text>
                <Text>{report.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  callout: { width: 150, padding: 5 },
  calloutTitle: { fontWeight: 'bold', marginBottom: 5 },
  calloutType: { fontSize: 10, color: '#666', marginBottom: 5 },
});
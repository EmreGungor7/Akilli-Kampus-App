import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getReports } from '../../services/reportService';

export default function HomeScreen({ navigation }) {
  const [reports, setReports] = useState([]); // Tüm veriler
  const [filteredReports, setFilteredReports] = useState([]); // Ekranda görünenler
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Arama ve Filtre State'leri
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, security, health, technical

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  // Arama veya Kategori değişince listeyi güncelle
  useEffect(() => {
    filterData();
  }, [searchText, selectedType, reports]);

  const loadReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
      setFilteredReports(data); // İlk başta hepsi görünsün
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReports();
  };

  // Filtreleme Mantığı
  const filterData = () => {
    let result = reports;

    // 1. Tür Filtresi
    if (selectedType !== 'all') {
      result = result.filter(item => item.type === selectedType);
    }

    // 2. Arama Filtresi (Başlık içinde ara)
    if (searchText) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredReports(result);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ReportDetail', { report: item })} 
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconRow}>
          <Ionicons 
            name={item.type === 'security' ? 'shield' : item.type === 'health' ? 'medkit' : 'construct'} 
            size={20} 
            color="#555" 
          />
          <Text style={styles.cardType}>
            {item.type === 'security' ? 'GÜVENLİK' : item.type === 'health' ? 'SAĞLIK' : 'TEKNİK'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Çözüldü' ? '#28a745' : '#007AFF' }]}>
          <Text style={styles.statusText}>{item.status || 'Açık'}</Text>
        </View>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
      {item.createdAt && (
        <Text style={styles.dateText}>
          {new Date(item.createdAt.seconds * 1000).toLocaleDateString('tr-TR')}
        </Text>
      )}
    </TouchableOpacity>
  );

  // Kategori Butonu Bileşeni
  const FilterButton = ({ type, label }) => (
    <TouchableOpacity 
      style={[styles.filterBtn, selectedType === type && styles.filterBtnActive]} 
      onPress={() => setSelectedType(type)}
    >
      <Text style={[styles.filterText, selectedType === type && { color: 'white' }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ARAMA ALANI */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Bildirim Ara..." 
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* KATEGORİ FİLTRELERİ */}
      <View style={styles.filterContainer}>
        <FilterButton type="all" label="Tümü" />
        <FilterButton type="security" label="Güvenlik" />
        <FilterButton type="health" label="Sağlık" />
        <FilterButton type="technical" label="Teknik" />
      </View>

      {/* LİSTE */}
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Kayıt bulunamadı.</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateReport')}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Arama Alanı
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    margin: 15, marginBottom: 10, padding: 10, borderRadius: 10,
    borderWidth: 1, borderColor: '#ddd'
  },
  searchInput: { flex: 1, fontSize: 16 },

  // Filtre Alanı
  filterContainer: { flexDirection: 'row', paddingHorizontal: 15, marginBottom: 10 },
  filterBtn: { 
    paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, 
    backgroundColor: '#e0e0e0', marginRight: 10 
  },
  filterBtnActive: { backgroundColor: '#333' },
  filterText: { fontSize: 12, fontWeight: 'bold', color: '#333' },

  // Kartlar (Aynı)
  card: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  cardType: { fontSize: 12, fontWeight: 'bold', color: '#555', marginLeft: 5 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  cardDesc: { fontSize: 14, color: '#666' },
  dateText: { fontSize: 12, color: '#999', marginTop: 10, textAlign: 'right' },
  
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#007AFF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#666' }
});
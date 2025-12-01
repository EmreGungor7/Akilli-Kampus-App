import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { registerUser } from '../../services/authService';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !department) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      await registerUser(email, password, name, department);
      Alert.alert("Başarılı", "Kayıt oluşturuldu. Giriş yapabilirsiniz.");
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>

      <TextInput style={styles.input} placeholder="Ad Soyad" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Birim / Bölüm" value={department} onChangeText={setDepartment} />
      <TextInput style={styles.input} placeholder="E-posta" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Şifre" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Zaten hesabın var mı? Giriş Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  linkText: { color: '#666', textAlign: 'center', marginTop: 20 },
});
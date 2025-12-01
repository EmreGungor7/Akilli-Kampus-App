import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginUser, resetPassword } from '../../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // DÜZELTME: 'async' kelimesi eklendi
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      // Giriş yapılıyor...
      const { role } = await loginUser(email, password);
      
      console.log("Giriş Başarılı! Rol:", role);
      // Alert kutusu kalktı, App.js seni otomatik ana sayfaya atacak.
      
    } catch (error) {
      console.error(error); // Hatayı konsola yaz
      Alert.alert("Giriş Başarısız", "E-posta veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if(!email) return Alert.alert("Uyarı", "Şifre sıfırlama için e-posta giriniz.");
    resetPassword(email)
      .then(() => Alert.alert("Bilgi", "Sıfırlama bağlantısı gönderildi."))
      .catch((err) => Alert.alert("Hata", err.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Akıllı Kampüs</Text>
      <Text style={styles.subtitle}>Giriş Yap</Text>

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotText}>Şifremi Unuttum</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Giriş Yap</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Hesabın yok mu? Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#333' },
  subtitle: { fontSize: 20, color: '#666', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  forgotText: { color: '#007AFF', textAlign: 'right', marginBottom: 20 },
  linkText: { color: '#666', textAlign: 'center', marginTop: 20 },
});
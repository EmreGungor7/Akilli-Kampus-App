import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

// Kayıt Ol Fonksiyonu (Loglu Versiyon)
export const registerUser = async (email, password, name, department) => {
  console.log("1. Kayıt işlemi tetiklendi..."); 
  try {
    console.log("2. Firebase Authentication'a istek atılıyor...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("3. Kullanıcı Auth servisinde oluşturuldu. ID:", user.uid);

    console.log("4. Firestore veritabanına kullanıcı detayı yazılıyor...");
    // Firestore'a kullanıcı detaylarını kaydet
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      department: department,
      role: 'user', // Proje kuralı: Varsayılan rol User
      createdAt: new Date()
    });
    console.log("5. Firestore yazma işlemi BAŞARILI!");

    return user;
  } catch (error) {
    console.error("!!! KAYIT HATASI !!!", error.code, error.message);
    throw error;
  }
};

// Giriş Yap Fonksiyonu
export const loginUser = async (email, password) => {
  console.log("Giriş işlemi başladı...");
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Auth girişi başarılı. Firestore'dan rol çekiliyor...");
    
    // Kullanıcının rolünü öğrenmek için Firestore'dan verisini çekiyoruz
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("Kullanıcı verisi çekildi. Rol:", userData.role);
      return { user, role: userData.role }; 
    } else {
      console.log("Kullanıcı veritabanında bulunamadı (Eski kullanıcı olabilir). Varsayılan rol: user");
      return { user, role: 'user' };
    }

  } catch (error) {
    console.error("!!! GİRİŞ HATASI !!!", error.code, error.message);
    throw error;
  }
};

// Çıkış Yap
export const logoutUser = () => {
  console.log("Çıkış yapılıyor...");
  return signOut(auth);
};

// Şifre Sıfırlama
export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};
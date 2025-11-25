import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc // <-- Bu eksikse hata verir!
} from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

// 1. Yeni Bildirim Ekleme
export const addReport = async (title, description, type, location) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Kullanıcı oturumu kapalı!");

    await addDoc(collection(db, "reports"), {
      title: title,
      description: description,
      type: type,
      location: location,
      status: 'Açık',
      createdBy: user.uid,
      creatorEmail: user.email,
      createdAt: new Date(),
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// 2. Tüm Bildirimleri Çekme
export const getReports = async () => {
  try {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id, // <-- ID'nin alındığından emin oluyoruz
      ...doc.data()
    }));
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    return [];
  }
};

// 3. Durum Güncelleme (Çözüldü Yapma)
export const updateReportStatus = async (reportId, newStatus) => {
  try {
    if (!reportId) throw new Error("Bildirim ID'si bulunamadı!");
    
    // Güncellenecek belgenin referansı
    const reportRef = doc(db, "reports", reportId);
    
    await updateDoc(reportRef, {
      status: newStatus,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Servis Hatası (updateReportStatus):", error);
    throw error;
  }
};
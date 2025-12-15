import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  PhoneAuthProvider,
  signInWithCredential
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import {
  getMessaging,
  getToken,
  onMessage,
  deleteToken
} from "firebase/messaging";
import { firebaseConfig, collections } from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

// Auth Services
export const authService = {
  // Sign in with phone number
  async signInWithPhone(phoneNumber, appVerifier) {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      return confirmationResult;
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP code
  async verifyOTP(confirmationResult, code) {
    try {
      const result = await confirmationResult.confirm(code);
      return result.user;
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Monitor auth state
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
};

// Firestore Services
export const firestoreService = {
  // Get document reference
  getDocRef(collectionName, docId) {
    return doc(db, collectionName, docId);
  },

  // Get collection reference
  getCollectionRef(collectionName) {
    return collection(db, collectionName);
  },

  // Create or update document
  async setDocument(collectionName, docId, data) {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef;
    } catch (error) {
      throw error;
    }
  },

  // Update document
  async updateDocument(collectionName, docId, data) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return docRef;
    } catch (error) {
      throw error;
    }
  },

  // Get document
  async getDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      throw error;
    }
  },

  // Query documents
  async queryDocuments(collectionName, conditions = [], orderByField = null, limitCount = null) {
    try {
      let q = collection(db, collectionName);

      conditions.forEach(condition => {
        const [field, operator, value] = condition;
        q = query(q, where(field, operator, value));
      });

      if (orderByField) {
        q = query(q, orderBy(orderByField, 'desc'));
      }

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  },

  // Add new document
  async addDocument(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef;
    } catch (error) {
      throw error;
    }
  },

  // Delete document
  async deleteDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      throw error;
    }
  }
};

// Storage Services
export const storageService = {
  // Upload file
  async uploadFile(filePath, file) {
    try {
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw error;
    }
  },

  // Get file URL
  async getFileURL(filePath) {
    try {
      const storageRef = ref(storage, filePath);
      return await getDownloadURL(storageRef);
    } catch (error) {
      throw error;
    }
  },

  // Delete file
  async deleteFile(filePath) {
    try {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    } catch (error) {
      throw error;
    }
  }
};

// Messaging Services
export const messagingService = {
  // Get FCM token
  async getToken(vapidKey) {
    try {
      const token = await getToken(messaging, { vapidKey });
      return token;
    } catch (error) {
      throw error;
    }
  },

  // Delete FCM token
  async deleteToken() {
    try {
      await deleteToken(messaging);
    } catch (error) {
      throw error;
    }
  },

  // Listen for messages
  onMessage(callback) {
    return onMessage(messaging, callback);
  }
};

export default app;
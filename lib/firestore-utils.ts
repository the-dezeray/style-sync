import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';

// Generic function to get a collection
export const getCollection = async <T = DocumentData>(collectionName: string, constraints: QueryConstraint[] = []) => {
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};

// Generic function to listen to a collection (real-time)
export const subscribeToCollection = <T = DocumentData>(
  collectionName: string, 
  callback: (data: T[]) => void,
  constraints: QueryConstraint[] = []
) => {
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...constraints);
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    callback(data);
  });
};

// Generic function to add a document
export const addDocument = async (collectionName: string, data: any) => {
  const colRef = collection(db, collectionName);
  return await addDoc(colRef, data);
};

// Generic function to update a document
export const updateDocument = async (collectionName: string, id: string, data: any) => {
  const docRef = doc(db, collectionName, id);
  return await updateDoc(docRef, data);
};

// Generic function to delete a document
export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  return await deleteDoc(docRef);
};

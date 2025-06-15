'use client';

import React, { createContext, useContext } from 'react';
import { 
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
  DocumentData, 
  QueryConstraint, 
  addDoc, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import { useAuth } from './auth-context';

interface FirestoreContextType {
  createDocument: <T extends DocumentData>(collectionName: string, data: T, customId?: string) => Promise<string>;
  getDocument: <T = DocumentData>(collectionName: string, docId: string) => Promise<T | null>;
  updateDocument: <T extends DocumentData>(collectionName: string, docId: string, data: Partial<T>) => Promise<void>;
  deleteDocument: (collectionName: string, docId: string) => Promise<void>;
  queryDocuments: <T = DocumentData>(
    collectionName: string, 
    constraints?: QueryConstraint[]
  ) => Promise<T[]>;
  getUserDocuments: <T = DocumentData>(collectionName: string) => Promise<T[]>;
}

const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined);

export function FirestoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const createDocument = async <T extends DocumentData>(
    collectionName: string, 
    data: T, 
    customId?: string
  ): Promise<string> => {
    try {
      const dataWithTimestamp = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user?.uid || null,
      };

      if (customId) {
        const docRef = doc(db, collectionName, customId);
        await setDoc(docRef, dataWithTimestamp);
        return customId;
      } else {
        const collectionRef = collection(db, collectionName);
        const docRef = await addDoc(collectionRef, dataWithTimestamp);
        return docRef.id;
      }
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  };

  const getDocument = async <T = DocumentData>(
    collectionName: string, 
    docId: string
  ): Promise<T | null> => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  };

  const updateDocument = async <T extends DocumentData>(
    collectionName: string, 
    docId: string, 
    data: Partial<T>
  ): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  };

  const deleteDocument = async (
    collectionName: string, 
    docId: string
  ): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  };

  const queryDocuments = async <T = DocumentData>(
    collectionName: string, 
    constraints: QueryConstraint[] = []
  ): Promise<T[]> => {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  };

  const getUserDocuments = async <T = DocumentData>(
    collectionName: string
  ): Promise<T[]> => {
    if (!user) return [];
    
    try {
      return await queryDocuments<T>(collectionName, [
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      ]);
    } catch (error) {
      console.error('Error getting user documents:', error);
      throw error;
    }
  };

  const value = {
    createDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    queryDocuments,
    getUserDocuments,
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}

export function useFirestore() {
  const context = useContext(FirestoreContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirestoreProvider');
  }
  return context;
}

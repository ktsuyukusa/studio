'use client';

import React, { createContext, useContext } from 'react';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll, 
  UploadResult 
} from 'firebase/storage';
import { storage } from './config';
import { useAuth } from './auth-context';

interface StorageContextType {
  uploadFile: (file: File, path: string) => Promise<string>;
  getFileUrl: (path: string) => Promise<string>;
  deleteFile: (path: string) => Promise<void>;
  listFiles: (path: string) => Promise<string[]>;
  getUserFilesPath: (path: string) => string;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const getUserFilesPath = (path: string): string => {
    if (!user) throw new Error('User must be logged in to access storage');
    return `users/${user.uid}/${path}`;
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
      const fullPath = getUserFilesPath(path);
      const storageRef = ref(storage, `${fullPath}/${file.name}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const getFileUrl = async (path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  };

  const deleteFile = async (path: string): Promise<void> => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  const listFiles = async (path: string): Promise<string[]> => {
    try {
      const fullPath = getUserFilesPath(path);
      const storageRef = ref(storage, fullPath);
      const result = await listAll(storageRef);
      
      const urls = await Promise.all(
        result.items.map(itemRef => getDownloadURL(itemRef))
      );
      
      return urls;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  };

  const value = {
    uploadFile,
    getFileUrl,
    deleteFile,
    listFiles,
    getUserFilesPath,
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
}

'use client';

import React from 'react';
import { AuthProvider } from './auth-context';
import { FirestoreProvider } from './firestore-context';
import { StorageProvider } from './storage-context';
import { AnalyticsProvider } from './analytics-context';
import { UserProvider } from '@/lib/contexts/user-context';

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  return (
    <AuthProvider>
      <FirestoreProvider>
        <StorageProvider>
          <AnalyticsProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </AnalyticsProvider>
        </StorageProvider>
      </FirestoreProvider>
    </AuthProvider>
  );
}

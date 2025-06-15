'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { 
  getAnalytics, 
  logEvent, 
  setUserId, 
  setUserProperties,
  isSupported
} from 'firebase/analytics';
import { app } from './config';
import { useAuth } from './auth-context';

interface AnalyticsContextType {
  logEvent: (eventName: string, eventParams?: Record<string, any>) => void;
  setUserProperties: (properties: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  useEffect(() => {
    const initAnalytics = async () => {
      const supported = await isSupported();
      if (!supported) {
        console.log('Firebase Analytics is not supported in this environment');
        return;
      }
      
      const analytics = getAnalytics(app);
      
      // Set user ID when user is authenticated
      if (user) {
        setUserId(analytics, user.uid);
        
        // Set some basic user properties
        setUserProperties(analytics, {
          user_role: 'user',
          account_created_at: user.metadata.creationTime,
          display_name: user.displayName || 'Anonymous',
          email_verified: user.emailVerified
        });
      }
    };
    
    if (typeof window !== 'undefined') {
      initAnalytics();
    }
  }, [user]);
  
  const logAnalyticsEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      isSupported().then(supported => {
        if (supported) {
          const analytics = getAnalytics(app);
          logEvent(analytics, eventName, eventParams);
        }
      });
    }
  };
  
  const setAnalyticsUserProperties = (properties: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      isSupported().then(supported => {
        if (supported) {
          const analytics = getAnalytics(app);
          setUserProperties(analytics, properties);
        }
      });
    }
  };
  
  const value = {
    logEvent: logAnalyticsEvent,
    setUserProperties: setAnalyticsUserProperties
  };
  
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

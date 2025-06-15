# Firebase Analytics Guide

This guide explains how to implement Firebase Analytics in your Globalink CEO application.

## Overview

Firebase Analytics is a free app measurement solution that provides insight into app usage and user engagement. It offers unlimited reporting for up to 500 distinct events and works with Firebase Crashlytics to provide crash-free user metrics.

## Benefits of Implementing Firebase Analytics

1. **User Behavior Insights**: Understand how users interact with your application
2. **Audience Segmentation**: Create audience segments based on user behavior
3. **Conversion Tracking**: Track important conversion events
4. **Campaign Performance**: Measure the effectiveness of your marketing campaigns
5. **User Retention**: Analyze user retention and engagement over time
6. **Integration with Other Firebase Services**: Works seamlessly with other Firebase services

## Implementation Steps

### 1. Update Firebase Configuration

First, update your Firebase configuration in `src/lib/firebase/config.ts` to include the `measurementId`:

```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAqXhkPnc8p8coutoZKnfLtvs92TRbDoeY",
  authDomain: "globalink-ceo.firebaseapp.com",
  projectId: "globalink-ceo",
  storageBucket: "globalink-ceo.appspot.com",
  messagingSenderId: "199954181433",
  appId: "1:199954181433:web:4010fa8c76dc960477cce8",
  measurementId: "G-7G7T4BRGPV"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  // Check if analytics is supported before initializing
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
```

### 2. Create an Analytics Context Provider

Create a new file `src/lib/firebase/analytics-context.tsx`:

```typescript
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
      }
    };
    
    if (typeof window !== 'undefined') {
      initAnalytics();
    }
  }, [user]);
  
  const logAnalyticsEvent = (eventName: string, eventParams?: Record<string, any>) => {
    isSupported().then(supported => {
      if (supported) {
        const analytics = getAnalytics(app);
        logEvent(analytics, eventName, eventParams);
      }
    });
  };
  
  const setAnalyticsUserProperties = (properties: Record<string, any>) => {
    isSupported().then(supported => {
      if (supported) {
        const analytics = getAnalytics(app);
        setUserProperties(analytics, properties);
      }
    });
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
```

### 3. Add the Analytics Provider to Your App

Update your `src/lib/firebase/firebase-provider.tsx` file to include the Analytics Provider:

```typescript
'use client';

import { AuthProvider } from './auth-context';
import { FirestoreProvider } from './firestore-context';
import { AnalyticsProvider } from './analytics-context';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FirestoreProvider>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </FirestoreProvider>
    </AuthProvider>
  );
}
```

### 4. Using Analytics in Your Components

Now you can use the Analytics context in your components:

```typescript
'use client';

import { useAnalytics } from '@/lib/firebase/analytics-context';

export default function MyComponent() {
  const { logEvent } = useAnalytics();
  
  const handleButtonClick = () => {
    // Log a custom event
    logEvent('button_click', {
      button_name: 'submit',
      screen: 'profile'
    });
    
    // Your other code here
  };
  
  return (
    <button onClick={handleButtonClick}>
      Submit
    </button>
  );
}
```

## Common Analytics Events to Track

Here are some common events you might want to track in your application:

1. **Page Views**:
   ```typescript
   logEvent('page_view', {
     page_title: 'Home',
     page_location: window.location.href,
     page_path: window.location.pathname
   });
   ```

2. **User Sign-in**:
   ```typescript
   logEvent('login', {
     method: 'google' // or 'email_link'
   });
   ```

3. **Feature Usage**:
   ```typescript
   logEvent('feature_use', {
     feature_name: 'post_creation',
     content_type: 'text'
   });
   ```

4. **Error Tracking**:
   ```typescript
   logEvent('error', {
     error_code: 'auth/user-not-found',
     error_message: 'User not found',
     error_context: 'login'
   });
   ```

5. **User Engagement**:
   ```typescript
   logEvent('engagement', {
     action: 'like',
     content_type: 'post',
     content_id: '12345'
   });
   ```

## Best Practices

1. **Define a Measurement Plan**: Before implementing analytics, define what you want to measure and why
2. **Use Consistent Naming Conventions**: Use a consistent naming convention for events and parameters
3. **Don't Over-Track**: Focus on tracking meaningful events rather than everything
4. **Respect User Privacy**: Be transparent about data collection and comply with privacy regulations
5. **Test Your Implementation**: Verify that events are being logged correctly using the Firebase console
6. **Use Enhanced Measurement**: Enable enhanced measurement in the Firebase console for automatic event tracking
7. **Set Up Conversions**: Define conversion events to track important user actions

## Debugging Analytics

To debug your analytics implementation:

1. **Enable Debug Mode**:
   ```typescript
   import { setAnalyticsCollectionEnabled } from 'firebase/analytics';
   
   // Enable debug mode in development
   if (process.env.NODE_ENV === 'development') {
     setAnalyticsCollectionEnabled(analytics, true);
   }
   ```

2. **Use the Firebase Console**: Check the "DebugView" in the Firebase console to see events in real-time
3. **Check Browser Console**: Look for any errors related to analytics in the browser console

## Privacy Considerations

When implementing analytics, consider these privacy aspects:

1. **User Consent**: Obtain user consent before collecting analytics data, especially in regions covered by GDPR or similar regulations
2. **Data Retention**: Configure appropriate data retention periods in the Firebase console
3. **Privacy Policy**: Update your privacy policy to include information about analytics data collection
4. **Data Minimization**: Only collect the data you need for your analytics purposes
5. **User Control**: Provide users with options to opt out of analytics tracking

## Conclusion

Firebase Analytics provides valuable insights into user behavior and app performance. By implementing analytics in your Globalink CEO application, you can make data-driven decisions to improve user experience and engagement.

Remember to balance the need for data with respect for user privacy, and focus on tracking events that provide meaningful insights for your business goals.

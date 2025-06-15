# Firebase Cloud Messaging (FCM) Guide

This guide explains how to set up Firebase Cloud Messaging (FCM) for web push notifications in your Globalink CEO application.

## Overview

Firebase Cloud Messaging (FCM) is a cross-platform messaging solution that lets you reliably send messages at no cost. Using FCM, you can notify a client app that new email or other data is available to sync, or you can send notification messages to drive user re-engagement and retention.

## Web Push Certificates

For web applications, FCM uses the Web Push protocol, which requires Application Identity key pairs (also known as Web Push certificates) to connect with external push services.

### Should You Generate Web Push Certificates?

**Yes, you should generate Web Push certificates if:**

1. You plan to implement push notifications in your web application
2. You want to send notifications to users when they're not actively using your application
3. You need to re-engage users or notify them of important events

**No, you don't need to generate Web Push certificates if:**

1. You don't plan to use push notifications in your application
2. You only need in-app notifications that appear when the user is actively using your application
3. You're using other communication channels like email or SMS for notifications

## How to Generate Web Push Certificates

If you decide to implement push notifications, follow these steps to generate Web Push certificates:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project "globalink-ceo"
3. Navigate to "Project settings" (the gear icon)
4. Go to the "Cloud Messaging" tab
5. In the "Web configuration" section, click "Generate key pair"
6. The generated key pair will be displayed and automatically saved to your project

## Implementing FCM in Your Web Application

To implement FCM in your Next.js application, you'll need to:

1. **Install the required packages**:
   ```bash
   npm install firebase
   ```

2. **Initialize Firebase and FCM in your application**:
   ```typescript
   // src/lib/firebase/fcm.ts
   import { getMessaging, getToken, onMessage } from 'firebase/messaging';
   import { app } from './config';

   export const initializeFCM = async () => {
     try {
       const messaging = getMessaging(app);
       
       // Request permission
       const permission = await Notification.requestPermission();
       if (permission !== 'granted') {
         console.log('Notification permission not granted');
         return null;
       }
       
       // Get FCM token
       const token = await getToken(messaging, {
         vapidKey: 'YOUR_WEB_PUSH_CERTIFICATE_KEY_PAIR'
       });
       
       console.log('FCM Token:', token);
       return token;
     } catch (error) {
       console.error('Error initializing FCM:', error);
       return null;
     }
   };

   export const onMessageListener = () => {
     const messaging = getMessaging(app);
     return onMessage(messaging, (payload) => {
       console.log('Message received:', payload);
       return payload;
     });
   };
   ```

3. **Create a service worker for background notifications**:
   Create a file named `firebase-messaging-sw.js` in the `public` directory:
   ```javascript
   // public/firebase-messaging-sw.js
   importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
   importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

   firebase.initializeApp({
     apiKey: 'YOUR_API_KEY',
     authDomain: 'YOUR_AUTH_DOMAIN',
     projectId: 'YOUR_PROJECT_ID',
     storageBucket: 'YOUR_STORAGE_BUCKET',
     messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
     appId: 'YOUR_APP_ID'
   });

   const messaging = firebase.messaging();

   messaging.onBackgroundMessage((payload) => {
     console.log('Background message received:', payload);
     
     const notificationTitle = payload.notification.title;
     const notificationOptions = {
       body: payload.notification.body,
       icon: '/favicon.ico'
     };
     
     self.registration.showNotification(notificationTitle, notificationOptions);
   });
   ```

4. **Initialize FCM in your application**:
   ```typescript
   // src/app/layout.tsx or another appropriate component
   'use client';
   
   import { useEffect } from 'react';
   import { initializeFCM, onMessageListener } from '@/lib/firebase/fcm';

   export default function Layout({ children }) {
     useEffect(() => {
       if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
         initializeFCM();
         
         const unsubscribe = onMessageListener();
         return () => {
           unsubscribe && unsubscribe();
         };
       }
     }, []);
     
     return <>{children}</>;
   }
   ```

## Sending Test Notifications

Once you've set up FCM, you can send test notifications from the Firebase Console:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project "globalink-ceo"
3. Navigate to "Messaging" in the left sidebar
4. Click "Create your first campaign" or "New campaign"
5. Select "Notification message"
6. Fill in the notification details (title, body, etc.)
7. In the "Target" step, select your app and the appropriate audience
8. Complete the remaining steps and send the test notification

## Best Practices for Push Notifications

1. **Get explicit permission**: Always ask users for permission before sending notifications
2. **Be relevant**: Send notifications that are valuable and relevant to the user
3. **Don't overdo it**: Avoid sending too many notifications, which can lead to users disabling them
4. **Personalize**: Use user data to send personalized notifications
5. **Time it right**: Consider the user's time zone and send notifications at appropriate times
6. **Provide clear actions**: Make it clear what action the user should take when they receive a notification

## Troubleshooting

If you encounter issues with FCM:

1. **Check browser compatibility**: FCM requires a modern browser that supports service workers and the Push API
2. **Verify your Web Push certificate**: Make sure you've generated and correctly configured your Web Push certificate
3. **Check service worker registration**: Ensure your service worker is correctly registered and active
4. **Inspect browser console**: Look for errors in the browser console related to FCM
5. **Test with different browsers**: Some browsers may have different implementations or restrictions for push notifications

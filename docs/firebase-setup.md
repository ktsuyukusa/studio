# Firebase Setup Guide for Globalink CEO

This guide will help you set up Firebase for the Globalink CEO application. Firebase provides authentication, database, and storage services for the application.

## Prerequisites

- A Google account
- Node.js and npm installed
- The Globalink CEO codebase

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "Globalink CEO")
4. Choose whether to enable Google Analytics (recommended)
5. Accept the terms and click "Create project"

## Step 2: Register Your Web App

1. In the Firebase Console, click on the project you just created
2. Click on the web icon (</>) to add a web app
3. Enter a nickname for your app (e.g., "Globalink CEO Web")
4. Check the box for "Also set up Firebase Hosting" if you plan to deploy the app
5. Click "Register app"
6. Copy the Firebase configuration object

## Step 3: Configure Environment Variables

1. In your project directory, locate the `.env.local` file
2. Update the Firebase configuration variables with your own values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Step 4: Enable Authentication Methods

1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable the authentication methods you want to use:
   - Email/Password
   - Google
   - (Optional) Other providers like Facebook, Twitter, etc.

## Step 5: Set Up Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" or "Start in test mode" (for development)
4. Select a location for your database
5. Click "Enable"

## Step 6: Set Up Firebase Storage

1. In the Firebase Console, go to "Storage"
2. Click "Get started"
3. Choose "Start in production mode" or "Start in test mode" (for development)
4. Select a location for your storage
5. Click "Done"

## Step 7: Set Up Firebase Security Rules

### Firestore Rules

In the Firebase Console, go to "Firestore Database" > "Rules" and update the rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Add more rules for other collections as needed
  }
}
```

### Storage Rules

In the Firebase Console, go to "Storage" > "Rules" and update the rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Add more rules for other paths as needed
  }
}
```

## Step 8: Run the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:9002`

## Firebase Features in Globalink CEO

### Authentication

The application uses Firebase Authentication for user management. Users can:
- Sign up with email and password
- Sign in with email and password
- Sign in with Google
- Reset their password
- Update their profile

### Firestore Database

The application uses Firestore to store user data, including:
- User profiles
- Generated LinkedIn profiles
- Posts
- Comments
- Trends

### Firebase Storage

The application uses Firebase Storage to store user files, such as:
- Profile pictures
- Uploaded images for posts

## Troubleshooting

- **Authentication Issues**: Make sure you've enabled the authentication methods in the Firebase Console.
- **Database Issues**: Check your Firestore security rules to ensure they allow the operations you're trying to perform.
- **Storage Issues**: Check your Storage security rules to ensure they allow the operations you're trying to perform.
- **Environment Variables**: Make sure your `.env.local` file contains the correct Firebase configuration values.

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)

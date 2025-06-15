# Firebase CLI Instructions

## Installation

You've already installed the Firebase CLI tools globally using:

```bash
npm install -g firebase-tools
```

## Authentication and Project Setup

To configure Firebase authentication for your project, follow these steps:

1. **Login to Firebase**:
   ```bash
   firebase login
   ```
   This will open a browser window where you can log in with your Google account.

2. **Initialize Firebase in your project**:
   ```bash
   firebase init
   ```
   - Select "Authentication" when prompted for which Firebase features to set up
   - Select your existing project "globalink-ceo"
   - Follow the prompts to complete the setup

3. **Configure Authentication Methods**:

   You can configure authentication methods directly in the Firebase console:
   
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project "globalink-ceo"
   - Navigate to "Authentication" > "Sign-in method"
   - Enable the authentication methods you want to use:
     - Email/Password
     - Google
     - Any other methods you need

   Alternatively, you can use the Firebase CLI to deploy authentication configuration:

   ```bash
   firebase deploy --only auth
   ```

## Testing Authentication

After configuring authentication, you can test it using the test files we created:

- `firebase-test.html` - Tests email/password authentication
- `firebase-google-test.html` - Tests Google authentication

## Additional Firebase CLI Commands

- **View your Firebase projects**:
  ```bash
  firebase projects:list
  ```

- **Get details about your current project**:
  ```bash
  firebase projects:details
  ```

- **Deploy your application to Firebase Hosting**:
  ```bash
  firebase deploy --only hosting
  ```

- **Run Firebase locally for testing**:
  ```bash
  firebase emulators:start
  ```

## Troubleshooting

If you encounter issues with authentication:

1. Make sure you've enabled the authentication methods in the Firebase console
2. Check that your authorized domains include "localhost" for local testing
3. Verify that your Firebase configuration in the code matches the project settings
4. Check the Firebase Authentication documentation for specific error codes: [Firebase Auth Error Codes](https://firebase.google.com/docs/auth/admin/errors)

## Next Steps

Once authentication is working, you can continue developing your application with Firebase features. The Firebase CLI provides commands for managing all aspects of your Firebase project, including:

- Firestore database
- Storage
- Functions
- Hosting
- Emulators for local development

For more information, see the [Firebase CLI documentation](https://firebase.google.com/docs/cli).

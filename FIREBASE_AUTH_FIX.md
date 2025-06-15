# Fixing Firebase Authentication Issues

## Current Issues

1. **Google Authentication Error**: When trying to sign in with Google, you're receiving an error message: "signin with Google': The requested action is invalid."
2. **Access to Examples**: You're unable to access the examples section through the Vercel deployment.

## Step 1: Access Examples Without Authentication

To immediately access the examples section without fixing the authentication:

1. Open the `examples-direct-access.html` file we created
2. Enter your Vercel deployment URL in the input field
3. Click on the example buttons to access them directly

## Step 2: Fix Firebase Authentication (Complete Solution)

The root cause of your authentication issues is that Google authentication is not properly configured in your Firebase project. Here's how to fix it:

### 1. Access Firebase Console

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Select the "globalink-ceo" project

### 2. Enable Google Authentication

1. In the left sidebar, click on "Authentication"
2. Go to the "Sign-in method" tab
3. Find "Google" in the list of providers and click on it
4. Toggle the "Enable" switch to ON
5. Configure the OAuth client:
   - The "Web SDK configuration" section should show your project's web client ID
   - You don't need to change this unless you want to use a custom OAuth client
6. Click "Save"

### 3. Add Authorized Domains

1. Still in the Authentication section, scroll down to "Authorized domains"
2. Make sure the following domains are added:
   - `localhost` (for local development)
   - Your Vercel deployment domain (e.g., `studio-ktsuyukusa.vercel.app`)
   - Any other domains where you'll be hosting your application
3. Click "Add domain" if you need to add any of these

### 4. Configure OAuth Consent Screen (if needed)

If you haven't set up the OAuth consent screen for your Google project:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select the project associated with your Firebase project
3. Go to "APIs & Services" > "OAuth consent screen"
4. Choose "External" user type (unless you're using Google Workspace)
5. Fill in the required information:
   - App name: "Globalink CEO"
   - User support email: Your email
   - Developer contact information: Your email
6. Click "Save and Continue"
7. Add the scopes you need (at minimum, "email" and "profile")
8. Click "Save and Continue"
9. Add test users if you're in testing mode
10. Click "Save and Continue"

### 5. Test Authentication

After making these changes:

1. Go back to your application
2. Try signing in with Google again
3. You should now be able to authenticate successfully

## Step 3: Verify Authorized JavaScript Origins

If you're still having issues after completing the steps above:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Find the OAuth 2.0 Client ID used by your Firebase project and click on it
5. Under "Authorized JavaScript origins", make sure the following are added:
   - `http://localhost:3000` (for local development)
   - Your Vercel deployment URL (e.g., `https://studio-ktsuyukusa.vercel.app`)
6. Click "Save" if you made any changes

## Common Issues and Solutions

### "The requested action is invalid"

This typically means one of the following:

1. Google authentication is not enabled in Firebase
2. The domain you're using is not in the authorized domains list
3. There's an issue with the OAuth configuration

### "auth/configuration-not-found"

This error occurs when:

1. The authentication method is not enabled in Firebase
2. The Firebase project is not properly configured for the authentication methods being used

### "popup_closed_by_user"

This happens when:

1. The user closes the Google sign-in popup before completing authentication
2. There might be popup blockers enabled in the browser

## Need More Help?

If you're still experiencing issues after following these steps, you may need to:

1. Check the browser console for more detailed error messages
2. Verify that your Firebase configuration in `src/lib/firebase/config.ts` matches the configuration in your Firebase project
3. Ensure that you're using the latest version of the Firebase SDK
4. Check if there are any network issues preventing the authentication request from completing

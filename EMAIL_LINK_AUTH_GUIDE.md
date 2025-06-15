# Authentication Guide

This guide explains how to use the authentication features in the Globalink CEO application, including both email link authentication and Google authentication.

## Overview

The application supports two authentication methods:

1. **Email Link Authentication** (also known as "passwordless authentication" or "magic link") allows users to sign in to the application without a password. Instead, they receive an email with a special link that, when clicked, automatically signs them in.

2. **Google Authentication** allows users to sign in using their Google account, providing a quick and secure authentication method.

## Implementation Details

The authentication features have been implemented with the following components:

1. **AuthContext Provider** (`src/lib/firebase/auth-context.tsx`)
   - Contains methods for both authentication methods:
     - Email Link Authentication:
       - `sendSignInLink`: Sends an authentication link to the user's email
       - `isSignInLink`: Checks if a URL is a valid sign-in link
       - `completeSignInWithEmailLink`: Completes the sign-in process when a user clicks the link
     - Google Authentication:
       - `signInWithGoogle`: Initiates the Google authentication flow

2. **Authentication Components**
   - `EmailLinkAuth` (`src/components/auth/email-link-auth.tsx`):
     - Provides a user interface for email link authentication
     - Handles sending the authentication link
     - Verifies and processes the authentication link when the user returns
   - `GoogleAuth` (`src/components/auth/google-auth.tsx`):
     - Provides a user interface for Google authentication
     - Handles the Google sign-in process

3. **Auth Page** (`src/app/auth/page.tsx`)
   - Integrates both authentication components with tabs
   - Handles redirecting authenticated users to the home page

4. **Auth Layout** (`src/app/auth/layout.tsx`)
   - Provides a layout for the authentication page without using the ProtectedRoute component

## How It Works

### Email Link Authentication

#### Sending the Authentication Link

1. The user selects the "メールリンク認証" tab on the authentication page
2. The user enters their email address
3. The application sends a sign-in link to the user's email using Firebase Authentication
4. The user's email is stored in localStorage to remember it when they return

#### Completing the Authentication

1. When the user clicks the link in their email, they are redirected to the application
2. The application detects the authentication link in the URL
3. The email is retrieved from localStorage (or the user is prompted to enter it again)
4. The authentication is completed, and the user is signed in
5. The user is redirected to the home page

### Google Authentication

1. The user selects the "Google認証" tab on the authentication page
2. The user clicks the "Continue with Google" button
3. A Google sign-in popup appears
4. The user selects their Google account and grants permissions
5. The authentication is completed, and the user is signed in
6. The user is redirected to the home page

## Security Considerations

- The email address is required to complete the sign-in process, ensuring that only the intended recipient can use the link
- The link is only valid for a limited time (typically a few hours)
- The link can only be used once
- The application uses HTTPS to prevent interception of the link

## Firebase Configuration Requirements

For authentication to work, you need to configure Firebase:

1. Enable the authentication methods in the Firebase console:
   - For Email Link Authentication: Enable Email/Password authentication
   - For Google Authentication: Enable Google authentication and configure the OAuth client ID

2. Add your application domains to the authorized domains list:
   - For local development: Add "localhost"
   - For production: Add your production domain

## Testing

### Testing Email Link Authentication

1. Go to the `/auth` page
2. Select the "メールリンク認証" tab
3. Enter your email address and click "Send Sign-In Link"
4. Check your email for the authentication link
5. Click the link to complete the sign-in process

### Testing Google Authentication

1. Go to the `/auth` page
2. Select the "Google認証" tab
3. Click the "Continue with Google" button
4. Select your Google account in the popup
5. Verify that you are signed in and redirected to the home page

## Troubleshooting

### Email Link Authentication Issues

1. Make sure Email/Password authentication is enabled in the Firebase console
2. Verify that your domain is in the authorized domains list
3. Check that the email link is being opened on the same device where it was requested (or ensure the user enters the correct email)
4. Look for errors in the browser console
5. Check the Firebase Authentication logs in the Firebase console

### Google Authentication Issues

1. Make sure Google authentication is enabled in the Firebase console
2. Verify that the OAuth client ID is correctly configured
3. Check that your domain is in the authorized domains list
4. Look for errors in the browser console
5. Check the Firebase Authentication logs in the Firebase console

## Next Steps

To further enhance the authentication experience, consider:

1. Adding additional authentication methods (Google, Facebook, etc.)
2. Implementing account linking to allow users to connect multiple authentication methods
3. Adding email verification for new accounts
4. Implementing account recovery options

import { auth } from './config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// This is a test function to check if Firebase authentication is working
export async function testFirebaseAuth() {
  try {
    console.log('Testing Firebase authentication...');
    console.log('Firebase auth instance:', auth);
    
    // Try to create a test user
    const email = 'test-' + Date.now() + '@example.com';
    const password = 'TestPassword123!';
    
    console.log('Attempting to create user with email:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created successfully:', userCredential.user);
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Firebase auth test failed:', error);
    return { success: false, error };
  }
}

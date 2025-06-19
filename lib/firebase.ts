import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  // Get this from Firebase Console > Project Settings > General > Your apps > Web app
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate Firebase configuration in development
if (process.env.NODE_ENV === 'development') {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.warn(`Missing required Firebase environment variables: ${missingVars.join(', ')}`);
  }
}

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize App Check for production security
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (recaptchaSiteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    });
  } else {
    console.warn('ReCAPTCHA site key not found. App Check will not be initialized.');
  }
}

// Initialize Analytics if supported
let analytics: any = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Configure Firestore for offline persistence in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Enable offline persistence
  try {
    enableNetwork(db);
  } catch (error) {
    console.warn('Failed to enable Firestore network:', error);
  }
}

// Auth providers configuration
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');
githubProvider.addScope('read:user');

// Utility functions
const enableFirestore = () => enableNetwork(db);
const disableFirestore = () => disableNetwork(db);

export { 
  auth, 
  db, 
  googleProvider, 
  githubProvider, 
  analytics,
  enableFirestore,
  disableFirestore
};
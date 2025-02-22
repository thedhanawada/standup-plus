# Standup+

![Version](https://img.shields.io/badge/version-2.2.0-blue.svg)
![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000.svg)

## Technical Architecture

### Core Technologies
- **Next.js 14 (App Router)**: Server-side rendering and API routes
- **React 18**: UI components with hooks for state management
- **TypeScript**: Type-safe development with strict mode enabled
- **Firebase v9**: Authentication and real-time data storage
- **Tailwind CSS**: Utility-first styling with custom configuration
- **Radix UI**: Headless UI components with full accessibility
- **Google Gemini**: AI-powered summary generation

### Data Flow Architecture

#### Authentication Flow
```typescript
// Using Firebase Auth with multiple providers
const auth = getAuth(firebaseApp);
const providers = {
  github: new GithubAuthProvider(),
  google: new GoogleAuthProvider()
};

// Custom hook for auth state
function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  return user;
}
```

#### Database Schema
```typescript
interface StandupEntry {
  id: string;
  text: string;
  date: string;
  tags?: string[];
  projects?: string[];
  userId: string;
}

// Firestore Collections Structure
/users/{userId}/entries/{entryId}
```

#### State Management
- **React Context**: Global state management for auth and UI
- **Custom Hooks**: Encapsulated business logic and Firebase interactions
- **Optimistic Updates**: Real-time UI updates before Firebase confirmation

### Key Implementation Details

#### 1. Real-time Data Sync
```typescript
// Firestore real-time subscription
const unsubscribe = onSnapshot(
  query(collection(db, `users/${userId}/entries`)),
  (snapshot) => {
    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setEntries(entries);
  }
);
```

#### 2. AI Integration
```typescript
// Gemini API integration for summaries
async function generateSummary(entries: StandupEntry[]) {
  const model = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const prompt = formatEntriesForSummary(entries);
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

#### 3. Performance Optimizations
- **Dynamic Imports**: Code splitting for heavy components
- **Image Optimization**: Next.js Image component with automatic optimization
- **Memoization**: React.memo and useMemo for expensive computations
- **Debounced Search**: Performance-optimized search functionality

## Development Setup

### 1. Environment Configuration
```bash
# Required environment variables
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_APP_VERSION=
```

### 2. Firebase Configuration

#### Authentication Setup
1. Enable GitHub and Google providers in Firebase Console
2. Configure OAuth in respective platforms:
   ```typescript
   // GitHub OAuth Setup
   const provider = new GithubAuthProvider();
   provider.addScope('read:user');
   provider.setCustomParameters({
     'allow_signup': 'false'
   });
   ```

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Validation rules
      allow create: if validateEntry(request.resource.data);
      allow update: if validateEntry(request.resource.data);
    }
  }
  
  function validateEntry(entry) {
    return entry.text.size() > 0 
      && entry.date is string
      && (entry.tags == null || entry.tags is list)
      && (entry.projects == null || entry.projects is list);
  }
}
```

### 3. Component Architecture

#### Layout System
```tsx
// AppLayout.tsx - Main layout component
interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // ... layout logic
};
```

#### UI Components
- Fully accessible components using Radix UI primitives
- Custom hooks for complex interactions
- Compound components pattern for flexibility

### 4. Build and Deploy

#### Development
```bash
npm install
npm run dev
```

#### Production Build
```bash
npm run build
npm run start
```
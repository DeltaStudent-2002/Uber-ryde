# TODO - Clerk Authentication Implementation

## Progress: [======] 100%

- [x] 1. Install @clerk/clerk-react (frontend) and @clerk/clerk-sdk-node (backend)
- [x] 2. Wrap app with ClerkProvider in App.jsx
- [x] 3. Replace signup form with Clerk SignUp component
- [x] 4. Replace login form with Clerk SignIn component

## Setup Required

Your Clerk Publishable Key: `pk_test_dGhhbmtmdWwtbWFybGluLTY3LmNsZXJrLmFjY291bnRzLmRldiQ`

### Frontend (.env file in frontend folder):
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_dGhhbmtmdWwtbWFybGluLTY3LmNsZXJrLmFjY291bnRzLmRldiQ
```

### Backend (.env file in Backend folder):
```
CLERK_SECRET_KEY=sk_test_your_secret_key
```

## How to Get Clerk API Keys:

### Step 1: Sign up for Clerk
1. Go to https://clerk.com/
2. Click "Sign up" and create an account

### Step 2: Create an Application
1. After signing up, click "Add application"
2. Enter your application name (e.g., "Uber Video")
3. Choose "Sign in with email" or any preferred providers
4. Click "Create Application"

### Step 3: Get Your API Keys
1. Click "Configure" in the sidebar
2. Click "API Keys"
3. Copy your **Publishable Key** (starts with `pk_test_`) and add to frontend .env
4. Copy your **Secret Key** (starts with `sk_test_`) and add to backend .env

### Step 4: Configure Redirect URLs (Optional)
1. In Clerk dashboard, go to "Paths" or "Redirect URLs"
2. Add your app URLs:
   - For development: http://localhost:5173
   - Add `/login` and `/signup` as allowed redirect paths

### Step 5: Customization (Optional)
You can customize the Clerk components by passing appearance props:
```jsx
<SignIn 
  signUpUrl="/signup"
  afterSignInUrl="/home"
  appearance={{
    variables: { colorPrimary: '#000000' },
    elements: { rootBox: 'w-full' }
  }}
/>
```


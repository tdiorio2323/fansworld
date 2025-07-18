# 🔐 Google & Apple Sign-In Implementation Guide

## 🎯 Overview

This guide will help you implement "Sign in with Google" and "Sign in with Apple" for your Fansworld platform using Supabase Auth.

---

## 🟦 Sign in with Google

### Step 1: Google Cloud Console Setup

1. **Create Google OAuth Application**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Navigate to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     https://ydrlcunmhcgmbxpsztbo.supabase.co/auth/v1/callback
     https://cabana.tdstudiosny.com/auth/callback
     http://localhost:5173/auth/callback (for development)
     ```
   - Save Client ID and Client Secret

2. **Configure OAuth Consent Screen**
   - Go to "OAuth consent screen"
   - Choose "External" user type
   - Fill in app information:
     - App name: Fansworld
     - User support email: support@tdstudiosny.com
     - App logo: Upload Fansworld logo
   - Add scopes: email, profile
   - Add test users if needed

### Step 2: Supabase Configuration

1. **Add Google Provider in Supabase**
   - Go to [Supabase Dashboard](https://app.supabase.com/project/ydrlcunmhcgmbxpsztbo)
   - Navigate to Authentication → Providers
   - Enable Google
   - Add your Client ID and Client Secret
   - Save configuration

### Step 3: Frontend Implementation

1. **Create Google Sign-In Component** (`src/components/auth/GoogleSignIn.tsx`)

```tsx
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";

export function GoogleSignIn() {
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to sign in with Google",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full btn-glass hover:scale-105 transition-all"
      onClick={handleGoogleSignIn}
    >
      <FcGoogle className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  );
}
```

2. **Update Auth Page** (`src/pages/Auth.tsx`)

Add the Google sign-in button:

```tsx
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";

// In your auth form
<div className="space-y-4">
  {/* Existing email/password form */}
  
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-white/10" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-black px-2 text-gray-400">Or continue with</span>
    </div>
  </div>
  
  <GoogleSignIn />
</div>
```

---

## 🍎 Sign in with Apple

### Step 1: Apple Developer Setup

1. **Create Apple App ID**
   - Go to [Apple Developer](https://developer.apple.com/)
   - Navigate to Certificates, Identifiers & Profiles
   - Create new App ID
   - Enable "Sign in with Apple" capability
   - Configure:
     - Primary App ID: com.tdstudios.fansworld
     - Enable Sign in with Apple

2. **Create Service ID**
   - Create new Service ID
   - Identifier: com.tdstudios.fansworld.web
   - Enable Sign in with Apple
   - Configure Web Authentication:
     - Domains: cabana.tdstudiosny.com
     - Return URLs:
       ```
       https://ydrlcunmhcgmbxpsztbo.supabase.co/auth/v1/callback
       https://cabana.tdstudiosny.com/auth/callback
       ```

3. **Create Private Key**
   - Generate new private key
   - Download .p8 file
   - Note the Key ID

### Step 2: Supabase Configuration

1. **Configure Apple Provider**
   - In Supabase Dashboard → Authentication → Providers
   - Enable Apple
   - Add:
     - Service ID: com.tdstudios.fansworld.web
     - Team ID: (from Apple Developer account)
     - Key ID: (from private key)
     - Private Key: (contents of .p8 file)

### Step 3: Frontend Implementation

1. **Create Apple Sign-In Component** (`src/components/auth/AppleSignIn.tsx`)

```tsx
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Apple } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AppleSignIn() {
  const { toast } = useToast();

  const handleAppleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to sign in with Apple",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Apple sign-in error:', error);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full btn-glass hover:scale-105 transition-all bg-black text-white"
      onClick={handleAppleSignIn}
    >
      <Apple className="mr-2 h-5 w-5" />
      Continue with Apple
    </Button>
  );
}
```

---

## 🔄 Auth Callback Handler

Create callback handler (`src/pages/AuthCallback.tsx`):

```tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          // Check if user needs to complete profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!profile?.username) {
            // New user - redirect to complete profile
            navigate('/onboarding');
          } else {
            // Existing user - redirect to dashboard
            navigate('/dashboard');
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: "Authentication Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-400">Completing sign in...</p>
      </div>
    </div>
  );
}
```

---

## 🛣️ Update Routes

Add callback route to `App.tsx`:

```tsx
import AuthCallback from "./pages/AuthCallback";

// In your routes
<Route path="/auth/callback" element={<AuthCallback />} />
```

---

## 🎨 Complete Auth UI

Update your Auth/Register pages with both options:

```tsx
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { AppleSignIn } from "@/components/auth/AppleSignIn";

// In your auth form
<div className="space-y-4">
  {/* Email/Password form */}
  
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-white/10" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-black px-2 text-gray-400">Or continue with</span>
    </div>
  </div>
  
  <div className="space-y-3">
    <GoogleSignIn />
    <AppleSignIn />
  </div>
</div>
```

---

## 📱 Mobile App Considerations

If you plan to have mobile apps:

### iOS App
- Use native Sign in with Apple SDK
- Required by App Store guidelines
- Better user experience with Face ID/Touch ID

### Android App
- Use Google Sign-In SDK
- Native integration with Google accounts

---

## 🔒 Security Considerations

1. **Profile Creation**
   - Auto-create profiles on first sign-in
   - Merge accounts with same email
   - Handle edge cases

2. **Permissions**
   - Only request necessary scopes
   - Handle permission denials gracefully

3. **Data Privacy**
   - Store minimal user data
   - Follow GDPR/privacy regulations
   - Clear consent for data usage

---

## 📋 Testing Checklist

- [ ] Test Google sign-in flow
- [ ] Test Apple sign-in flow
- [ ] Verify callback handling
- [ ] Check profile creation
- [ ] Test error scenarios
- [ ] Verify mobile responsiveness
- [ ] Test redirect URLs
- [ ] Check session persistence

---

## 🚀 Environment Variables

Add to `.env.local`:

```env
# Existing
VITE_SUPABASE_URL=https://ydrlcunmhcgmbxpsztbo.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Site URL for callbacks
VITE_SITE_URL=https://cabana.tdstudiosny.com
```

---

## 🎯 Benefits of Social Login

1. **Higher Conversion**: 40% increase in sign-ups
2. **Faster Onboarding**: One-click registration
3. **Trust**: Users trust Google/Apple
4. **Security**: No password to remember
5. **Mobile**: Seamless on devices

---

## ⚠️ Important Notes

1. **Apple Requirements**
   - Required for iOS apps
   - Must be top sign-in option
   - Follow Apple's design guidelines

2. **Google Best Practices**
   - Use official Google button style
   - Don't modify Google logo
   - Follow brand guidelines

3. **User Experience**
   - Show loading states
   - Handle errors gracefully
   - Provide alternative options

Your social authentication is now ready to implement!
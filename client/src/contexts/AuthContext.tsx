import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  role: string;
  email: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    // Check for sessionStorage token first (our custom auth)
    const adminToken = sessionStorage.getItem('adminToken');
    
    if (adminToken) {
      // Create a mock user for our token-based auth
      const mockUser = {
        id: 'admin-user',
        email: 'admin@goanwedding.com',
        role: 'admin'
      } as any;
      
      const mockProfile = {
        id: 'admin-user',
        role: 'admin',
        email: 'admin@goanwedding.com',
        full_name: 'Admin User'
      };
      
      setUser(mockUser);
      setProfile(mockProfile);
      setLoading(false);
      console.log('✅ AuthContext: Token authentication successful');
      return;
    }
    
    // Fallback to Supabase auth if no token
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    checkAuth();
    
    // Listen for storage changes (when token is set from login)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for Supabase auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only handle Supabase auth if no token exists
      if (!sessionStorage.getItem('adminToken')) {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once on mount

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error.message);
        setProfile(null);
        setLoading(false);
        return;
      }
      
      console.log('✅ Profile loaded:', data.role);
      setProfile(data);
    } catch (error) {
      console.error('❌ Exception fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    // Clear our custom token
    sessionStorage.removeItem('adminToken');
    
    // Also clear Supabase auth if it exists
    await supabase.auth.signOut();
    
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const isAdmin = profile?.role === 'admin';

  const value = {
    user,
    session,
    profile,
    loading,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

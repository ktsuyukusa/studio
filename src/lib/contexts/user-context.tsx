'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { UserProfile } from '@/lib/models/user-profile';
import { useUserProfileService } from '@/lib/services/user-profile-service';

interface UserContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const userProfileService = useUserProfileService();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, check if the user has a profile
      let userProfile = await userProfileService.getUserProfile(user.uid);

      // If no profile exists, create one
      if (!userProfile) {
        const profileId = await userProfileService.createUserProfile(user);
        userProfile = await userProfileService.getUserProfile(user.uid);
      }

      setProfile(userProfile);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile when auth state changes
  useEffect(() => {
    if (!authLoading) {
      fetchUserProfile();
    }
  }, [user, authLoading]);

  const refreshProfile = async () => {
    await fetchUserProfile();
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!profile || !profile.id) {
      throw new Error('No profile to update');
    }

    try {
      await userProfileService.updateUserProfile(profile.id, data);
      await refreshProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const value = {
    profile,
    loading: authLoading || loading,
    error,
    refreshProfile,
    updateProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

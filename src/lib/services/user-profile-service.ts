import { User } from 'firebase/auth';
import { where } from 'firebase/firestore';
import { useFirestore } from '@/lib/firebase/firestore-context';
import { UserProfile, USERS_COLLECTION, createEmptyUserProfile } from '@/lib/models/user-profile';

export class UserProfileService {
  private firestore: ReturnType<typeof useFirestore>;

  constructor(firestore: ReturnType<typeof useFirestore>) {
    this.firestore = firestore;
  }

  async createUserProfile(user: User): Promise<string> {
    try {
      // Check if profile already exists
      const existingProfiles = await this.firestore.queryDocuments<UserProfile>(
        USERS_COLLECTION,
        [where('userId', '==', user.uid)]
      );

      if (existingProfiles.length > 0) {
        return existingProfiles[0].id as string;
      }

      // Create new profile
      const newProfile = createEmptyUserProfile(
        user.uid,
        user.displayName || 'User',
        user.email || ''
      );

      // Add photo URL if available
      if (user.photoURL) {
        newProfile.photoURL = user.photoURL;
      }

      // Save to Firestore
      const profileId = await this.firestore.createDocument<UserProfile>(
        USERS_COLLECTION,
        newProfile
      );

      return profileId;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const profiles = await this.firestore.queryDocuments<UserProfile>(
        USERS_COLLECTION,
        [where('userId', '==', userId)]
      );

      return profiles.length > 0 ? profiles[0] : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(profileId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      await this.firestore.updateDocument<UserProfile>(
        USERS_COLLECTION,
        profileId,
        data
      );
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async deleteUserProfile(profileId: string): Promise<void> {
    try {
      await this.firestore.deleteDocument(USERS_COLLECTION, profileId);
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  }
}

// Hook to use the user profile service
export function useUserProfileService(): UserProfileService {
  const firestore = useFirestore();
  return new UserProfileService(firestore);
}

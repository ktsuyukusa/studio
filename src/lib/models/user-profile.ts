export interface UserProfile {
  id?: string;
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  company?: string;
  position?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const USERS_COLLECTION = 'users';

export const createEmptyUserProfile = (userId: string, displayName: string, email: string): UserProfile => {
  return {
    userId,
    displayName,
    email,
    bio: '',
    company: '',
    position: '',
    location: '',
    website: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    youtube: '',
    instagram: '',
  };
};

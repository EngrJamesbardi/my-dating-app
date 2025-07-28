export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio: string;
  interests: string[];
  preferences: Preferences;
  photos: string[];
  verified: boolean;
  location: Location;
  createdAt: string;
  updatedAt: string;
  privacy: PrivacySettings;
}

export interface Preferences {
  minAge: number;
  maxAge: number;
  gender: Array<'male' | 'female' | 'other'>;
  distance: number; // in km
  interests: string[];
}

export interface Location {
  lat: number;
  lng: number;
  city?: string;
  country?: string;
}

export interface PrivacySettings {
  showDistance: boolean;
  showOnlineStatus: boolean;
  allowMessagesFromNonMatches: boolean;
}

export interface Match {
  id: string;
  userA: string;
  userB: string;
  score: number;
  createdAt: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  mediaUrl?: string;
  sentAt: string;
  read: boolean;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  createdAt: string;
}

export interface AuthToken {
  token: string;
  expiresAt: string;
}

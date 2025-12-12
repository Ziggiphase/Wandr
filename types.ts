export enum AttractionCategory {
  Nature = 'Nature',
  City = 'City',
  Historical = 'Historical',
  Beach = 'Beach',
  Mountain = 'Mountain',
  Safari = 'Safari'
}

export enum RewardTier {
  None = 'None',
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
  Platinum = 'Platinum'
}

export enum TransportMode {
  Car = 'Car',
  Bus = 'Bus',
  Train = 'Train',
  Flight = 'Flight',
  Boat = 'Boat'
}

export type UserRole = 'tourist' | 'manager';

export interface Transaction {
  id: string;
  type: 'deposit' | 'payment';
  amount: number;
  date: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalLikesReceived: number; // For badge calculation
  rewardTier?: RewardTier;
  walletBalance: number; // Travel savings fund
  transactions: Transaction[];
  role: UserRole;
}

export interface Post {
  id: string;
  attractionId: string;
  userId: string;
  user: User;
  imageUrl: string;
  caption: string;
  likes: number;
  timestamp: string;
}

export interface Pricing {
  entry: number;
  tourGuide: number;
  feedingPerDay: number;
  accommodationPerNight: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Attraction {
  id: string;
  name: string;
  location: string;
  description: string;
  category: AttractionCategory;
  rating: number; // Owner rating derived from reviews
  reviewsCount: number;
  imageUrl: string;
  images: string[];
  pricing: Pricing;
  reviews?: Review[];
  // New Fields for Management
  maxDurationHours: number; // Maximum allowed stay
  currentVisitors: number; // Analytics
  avgVisitDuration: number; // Analytics in hours
  capacity: number; // Max concurrent visitors
}

export interface BookingDetails {
  date: string;
  guests: number;
  includeTour: boolean;
  includeFeeding: boolean;
  nights: number;
  durationHours: number;
  transportModes: TransportMode[]; // Changed to array for multi-modal
  originCity: string;
}
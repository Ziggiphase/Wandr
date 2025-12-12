import { Attraction, AttractionCategory, Post, RewardTier, Transaction, User } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Wanderer',
  email: 'alex@wandr.com',
  avatar: 'https://picsum.photos/seed/user1/100/100',
  totalLikesReceived: 850,
  rewardTier: RewardTier.Gold,
  walletBalance: 450, // Initial savings
  role: 'tourist',
  transactions: [
    { id: 't1', type: 'deposit', amount: 500, date: '10/12/2023', description: 'Initial Deposit' },
    { id: 't2', type: 'payment', amount: 50, date: '10/15/2023', description: 'Booking: Kyoto Bamboo Forest' }
  ]
};

export const MOCK_MANAGER: User = {
  id: 'm1',
  name: 'Sarah Manager',
  email: 'sarah@resorts.com',
  avatar: 'https://picsum.photos/seed/manager1/100/100',
  totalLikesReceived: 0,
  rewardTier: RewardTier.None,
  walletBalance: 1000,
  role: 'manager',
  transactions: []
};

// Helper to assign badges based on mock likes
const getTier = (likes: number): RewardTier => {
  if (likes > 1000) return RewardTier.Platinum;
  if (likes > 500) return RewardTier.Gold;
  if (likes > 100) return RewardTier.Silver;
  return RewardTier.Bronze;
}

const mockUser2: User = { id: 'u2', name: 'Sarah Jenkins', email: 'sarah@test.com', avatar: 'https://picsum.photos/seed/u2/100/100', totalLikesReceived: 1200, rewardTier: RewardTier.Platinum, walletBalance: 0, transactions: [], role: 'tourist' };
const mockUser3: User = { id: 'u3', name: 'Kenji M.', email: 'kenji@test.com', avatar: 'https://picsum.photos/seed/u3/100/100', totalLikesReceived: 320, rewardTier: RewardTier.Silver, walletBalance: 0, transactions: [], role: 'tourist' };
const mockUser4: User = { id: 'u4', name: 'Elena G.', email: 'elena@test.com', avatar: 'https://picsum.photos/seed/u4/100/100', totalLikesReceived: 45, rewardTier: RewardTier.Bronze, walletBalance: 0, transactions: [], role: 'tourist' };

export const ATTRACTIONS: Attraction[] = [
  {
    id: 'a1',
    name: 'Kyoto Bamboo Forest',
    location: 'Kyoto, Japan',
    description: 'Walk through the soaring stalks of bamboo in this serene grove. The sound of the wind rustling the bamboo leaves is one of the "100 Soundscapes of Japan". Ideal for meditation and photography.',
    category: AttractionCategory.Nature,
    rating: 4.8,
    reviewsCount: 1240,
    imageUrl: 'https://images.unsplash.com/photo-1576082592408-f3534a6b3e2d?q=80&w=1000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1576082592408-f3534a6b3e2d?q=80&w=800'],
    pricing: { entry: 15, tourGuide: 40, feedingPerDay: 25, accommodationPerNight: 120 },
    maxDurationHours: 4,
    currentVisitors: 142,
    avgVisitDuration: 2.5,
    capacity: 500
  },
  {
    id: 'a2',
    name: 'Santorini Caldera',
    location: 'Santorini, Greece',
    description: 'Famous for its dramatic views, stunning sunsets, and white-washed houses clinging to the cliffs. Experience the ultimate romantic getaway with crystal clear waters.',
    category: AttractionCategory.Beach,
    rating: 4.9,
    reviewsCount: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4c79e4284?q=80&w=1000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1613395877344-13d4c79e4284?q=80&w=800'],
    pricing: { entry: 0, tourGuide: 60, feedingPerDay: 50, accommodationPerNight: 250 },
    maxDurationHours: 12,
    currentVisitors: 850,
    avgVisitDuration: 5,
    capacity: 2000
  },
  {
    id: 'a3',
    name: 'Machu Picchu',
    location: 'Cusco Region, Peru',
    description: 'A 15th-century Inca citadel, located in the Eastern Cordillera of southern Peru on a 2,430-meter mountain ridge. A mystical journey into history.',
    category: AttractionCategory.Historical,
    rating: 4.9,
    reviewsCount: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800'],
    pricing: { entry: 70, tourGuide: 50, feedingPerDay: 30, accommodationPerNight: 90 },
    maxDurationHours: 6,
    currentVisitors: 320,
    avgVisitDuration: 4.2,
    capacity: 2500
  },
  {
    id: 'a4',
    name: 'Banff National Park',
    location: 'Alberta, Canada',
    description: 'Rocky Mountain peaks, turquoise glacial lakes, a picture-perfect mountain town and village, abundant wildlife and scenic drives come together in Banff National Park.',
    category: AttractionCategory.Mountain,
    rating: 4.7,
    reviewsCount: 2100,
    imageUrl: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=1000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=800'],
    pricing: { entry: 20, tourGuide: 80, feedingPerDay: 40, accommodationPerNight: 180 },
    maxDurationHours: 48,
    currentVisitors: 1200,
    avgVisitDuration: 24,
    capacity: 10000
  },
  {
    id: 'a5',
    name: 'Great Barrier Reef',
    location: 'Queensland, Australia',
    description: 'The world\'s largest coral reef system, composed of over 2,900 individual reefs. A paradise for divers, snorkelers, and marine life enthusiasts looking for vibrant underwater colors.',
    category: AttractionCategory.Beach,
    rating: 4.8,
    reviewsCount: 4200,
    imageUrl: 'https://images.unsplash.com/photo-1583212234802-397505436694?q=80&w=1000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1583212234802-397505436694?q=80&w=800'],
    pricing: { entry: 35, tourGuide: 120, feedingPerDay: 45, accommodationPerNight: 200 },
    maxDurationHours: 8,
    currentVisitors: 450,
    avgVisitDuration: 6,
    capacity: 1500
  },
  {
    id: 'a6',
    name: 'Serengeti National Park',
    location: 'Tanzania',
    description: 'Experience the greatest wildlife spectacle on earth - the Great Migration. Vast plains, ancient predators, and golden sunsets define this ultimate safari destination.',
    category: AttractionCategory.Safari,
    rating: 4.9,
    reviewsCount: 1850,
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800'],
    pricing: { entry: 80, tourGuide: 150, feedingPerDay: 60, accommodationPerNight: 400 },
    maxDurationHours: 72,
    currentVisitors: 150,
    avgVisitDuration: 36,
    capacity: 800
  },
  {
    id: 'a7',
    name: 'Eiffel Tower',
    location: 'Paris, France',
    description: 'The Iron Lady of Paris. Ascend to the top for breathtaking views of the City of Lights, or enjoy a picnic on the Champ de Mars below.',
    category: AttractionCategory.City,
    rating: 4.6,
    reviewsCount: 12500,
    imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=1000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=800'],
    pricing: { entry: 25, tourGuide: 40, feedingPerDay: 80, accommodationPerNight: 220 },
    maxDurationHours: 3,
    currentVisitors: 2500,
    avgVisitDuration: 2,
    capacity: 3000
  },
  {
    id: 'a8',
    name: 'Petra',
    location: 'Ma\'an, Jordan',
    description: 'The Rose City, half as old as time. Famous for its rock-cut architecture and water conduit system. Walking through the Siq to reveal the Treasury is an unforgettable moment.',
    category: AttractionCategory.Historical,
    rating: 4.9,
    reviewsCount: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1579606038836-e8d1c7d248b8?q=80&w=1000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1579606038836-e8d1c7d248b8?q=80&w=800'],
    pricing: { entry: 70, tourGuide: 60, feedingPerDay: 20, accommodationPerNight: 80 },
    maxDurationHours: 8,
    currentVisitors: 600,
    avgVisitDuration: 5.5,
    capacity: 1000
  },
  {
    id: 'a9',
    name: 'Times Square',
    location: 'New York City, USA',
    description: 'The Crossroads of the World. Bright lights, Broadway shows, and an energy that never sleeps. A sensory overload of commercial culture and urban life.',
    category: AttractionCategory.City,
    rating: 4.4,
    reviewsCount: 8900,
    imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=800'],
    pricing: { entry: 0, tourGuide: 30, feedingPerDay: 100, accommodationPerNight: 350 },
    maxDurationHours: 2,
    currentVisitors: 5000,
    avgVisitDuration: 1.5,
    capacity: 6000
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    attractionId: 'a1',
    userId: 'u2',
    user: mockUser2,
    imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d9b152c6d1?q=80&w=600',
    caption: 'The morning light through the bamboo is absolutely magical. #ZenMode',
    likes: 124,
    timestamp: '2 hours ago'
  },
  {
    id: 'p2',
    attractionId: 'a1',
    userId: 'u3',
    user: mockUser3,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600',
    caption: 'Found a quiet spot away from the crowd. So peaceful.',
    likes: 89,
    timestamp: '5 hours ago'
  },
  {
    id: 'p3',
    attractionId: 'a2',
    userId: 'u4',
    user: mockUser4,
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600',
    caption: 'Sunset in Oia. Nothing compares.',
    likes: 432,
    timestamp: '1 day ago'
  },
  {
    id: 'p4',
    attractionId: 'a6',
    userId: 'u2',
    user: mockUser2,
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=600',
    caption: 'Witnessed the migration today. Nature is powerful.',
    likes: 560,
    timestamp: '3 days ago'
  },
  {
    id: 'p5',
    attractionId: 'a7',
    userId: 'u3',
    user: mockUser3,
    imageUrl: 'https://images.unsplash.com/photo-1492136344046-866c85e0bf04?q=80&w=600',
    caption: 'Picnic by the tower. Cheese, wine, and views.',
    likes: 210,
    timestamp: '4 days ago'
  }
];
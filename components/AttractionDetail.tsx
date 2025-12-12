import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Plus, Send, Bot, CalendarCheck, Utensils, Camera, X, Sparkles, Clock, AlertTriangle, Lock } from 'lucide-react';
import { Attraction, Post, User, RewardTier, BookingDetails } from '../types';
import { PostGrid } from './PostGrid';
import { BookingModal } from './BookingModal';
import { generateAttractionGuide, generateItinerary } from '../services/geminiService';

interface Props {
  attraction: Attraction;
  allPosts: Post[];
  currentUser: User;
  onBack: () => void;
  onAddPost: (post: Post) => void;
  onTransaction: (amount: number, type: 'deposit' | 'payment', description: string) => void;
}

export const AttractionDetail: React.FC<Props> = ({ attraction, allPosts, onBack, onAddPost, currentUser, onTransaction }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'info'>('feed');
  const [showBooking, setShowBooking] = useState(false);
  const [posts, setPosts] = useState(allPosts.filter(p => p.attractionId === attraction.id));
  const [currentRating, setCurrentRating] = useState(attraction.rating);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(attraction.reviewsCount);
  const [hasRated, setHasRated] = useState(false);
  
  // AI Chat State
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isItineraryLoading, setIsItineraryLoading] = useState(false);
  const [itinerary, setItinerary] = useState('');

  // Booking & Visit State
  const [activeBooking, setActiveBooking] = useState<BookingDetails | null>(null);
  const [visitTimeRemaining, setVisitTimeRemaining] = useState(0); // in minutes
  
  // New Post State
  const [isPosting, setIsPosting] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeBooking && visitTimeRemaining > 0) {
      const timer = setInterval(() => {
        setVisitTimeRemaining(prev => Math.max(0, prev - 1));
      }, 60000); // Reduce every minute
      return () => clearInterval(timer);
    }
  }, [activeBooking, visitTimeRemaining]);

  const handleBookingConfirm = (details: BookingDetails, totalCost: number) => {
    setActiveBooking(details);
    setVisitTimeRemaining(details.durationHours * 60);
  };

  const handleExtendVisit = () => {
    // Check constraints
    const currentDurationHours = activeBooking!.durationHours;
    if (currentDurationHours + 1 <= attraction.maxDurationHours) {
      const newDuration = currentDurationHours + 1;
      setActiveBooking({ ...activeBooking!, durationHours: newDuration });
      setVisitTimeRemaining(prev => prev + 60);
    }
  };

  const handleAIQuery = async () => {
    if (!chatQuery.trim()) return;
    setIsChatLoading(true);
    setChatResponse(''); 
    const response = await generateAttractionGuide(attraction.name, chatQuery);
    setChatResponse(response);
    setIsChatLoading(false);
  };

  const handleGenerateItinerary = async () => {
    setIsItineraryLoading(true);
    setItinerary('');
    const response = await generateItinerary(attraction.name, 3);
    setItinerary(response);
    setIsItineraryLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    if (!newPostImage) return;
    const post: Post = {
      id: `new_${Date.now()}`,
      attractionId: attraction.id,
      userId: currentUser.id,
      user: currentUser,
      imageUrl: newPostImage,
      caption: newPostCaption,
      likes: 0,
      timestamp: 'Just now'
    };
    setPosts([post, ...posts]);
    onAddPost(post);
    setIsPosting(false);
    setNewPostImage(null);
    setNewPostCaption('');
  };

  const handleSubmitReview = () => {
    if (userRating === 0) return;
    const newCount = reviewsCount + 1;
    const newAvg = ((currentRating * reviewsCount) + userRating) / newCount;
    setCurrentRating(parseFloat(newAvg.toFixed(1)));
    setReviewsCount(newCount);
    setHasRated(true);
    setUserReview('');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] w-full group">
        <img src={attraction.imageUrl} alt={attraction.name} className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
        <div className="absolute inset-0 bg-brand-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-transparent to-transparent opacity-90" />
        
        <button 
          onClick={onBack}
          className="absolute left-4 top-4 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/40"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        
        {/* Active Visit Widget (Top Right) - Only for Tourists */}
        {currentUser.role === 'tourist' && activeBooking && (
          <div className="absolute top-4 right-4 md:right-10 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 animate-fade-in z-20 w-72">
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-brand-500 tracking-wider flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Active Visit
                </span>
                <span className="text-xs text-gray-500 line-clamp-1">{activeBooking.transportModes.join(' + ')}</span>
             </div>
             <div className="mb-3">
                <div className="text-3xl font-bold font-serif text-brand-900">
                  {Math.floor(visitTimeRemaining / 60)}h {visitTimeRemaining % 60}m
                </div>
                <div className="text-xs text-gray-500">Remaining Time</div>
             </div>
             
             {activeBooking.durationHours < attraction.maxDurationHours ? (
               <button 
                onClick={handleExtendVisit}
                className="w-full py-2 bg-brand-100 text-brand-700 rounded-xl text-sm font-semibold hover:bg-brand-200 transition-colors flex items-center justify-center gap-2"
               >
                 <Clock className="h-4 w-4" /> Extend (+1h)
               </button>
             ) : (
               <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded-lg flex items-center gap-2">
                 <AlertTriangle className="h-4 w-4" />
                 Max duration reached
               </div>
             )}
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full px-6 pb-12 pt-24 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-3">
               <span className="inline-block rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                 {attraction.category}
               </span>
               <div className="flex items-center rounded-full bg-white/20 backdrop-blur px-3 py-1">
                 <Star className="mr-1 h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                 <span className="text-xs font-bold">{currentRating} Owner Rating</span>
               </div>
            </div>
            
            <h1 className="mb-2 font-serif text-5xl font-bold md:text-7xl shadow-black drop-shadow-md">{attraction.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-brand-100">
               <div className="flex items-center">
                 <MapPin className="mr-1 h-5 w-5 text-accent-400" />
                 <span className="text-lg">{attraction.location}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          
          {/* Left Column: Social & Info */}
          <div className="flex-1">
            <div className="mb-8 flex space-x-8 border-b border-gray-100 pb-1">
              <button 
                onClick={() => setActiveTab('feed')}
                className={`pb-3 text-lg font-bold transition-all relative ${activeTab === 'feed' ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Community Feed
                {activeTab === 'feed' && <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-500 rounded-t-full"></span>}
              </button>
              <button 
                onClick={() => setActiveTab('info')}
                className={`pb-3 text-lg font-bold transition-all relative ${activeTab === 'info' ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Guide & Reviews
                {activeTab === 'info' && <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-500 rounded-t-full"></span>}
              </button>
            </div>

            {activeTab === 'feed' ? (
              <div className="animate-fade-in">
                {/* Create Post Bar - Only for Tourists */}
                {currentUser.role === 'tourist' && (
                  <div className="mb-8 rounded-3xl bg-gradient-to-r from-brand-50 to-white p-1 shadow-sm ring-1 ring-brand-100">
                    <div className="flex items-center gap-4 bg-white rounded-[1.4rem] p-4">
                       <img src={currentUser.avatar} className="h-10 w-10 rounded-full ring-2 ring-brand-100" alt="Me" />
                       <button 
                        onClick={() => setIsPosting(true)}
                        className="flex-1 text-left text-gray-400 hover:text-gray-600 transition-colors font-medium"
                       >
                         Share your moment at {attraction.name}...
                       </button>
                       <button onClick={() => setIsPosting(true)} className="rounded-full bg-brand-100 p-3 text-brand-600 hover:bg-brand-200 transition-colors">
                          <Camera className="h-5 w-5" />
                       </button>
                    </div>
                  </div>
                )}

                <PostGrid posts={posts} />
                
                {posts.length === 0 && (
                   <div className="text-center py-12">
                      <p className="text-gray-400 italic">No posts yet. Be the first to share!</p>
                   </div>
                )}
              </div>
            ) : (
              <div className="animate-fade-in space-y-8">
                <div className="prose prose-lg text-gray-700">
                  <p className="lead border-l-4 border-accent-400 pl-4 italic">{attraction.description}</p>
                </div>

                {/* Rating Section */}
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                   <h3 className="font-serif text-xl font-bold mb-4 flex items-center">
                     <Star className="mr-2 h-5 w-5 text-accent-500 fill-accent-500" />
                     Rate your Experience
                   </h3>
                   
                   {!hasRated ? (
                     <div className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                           {[1, 2, 3, 4, 5].map((star) => (
                             <button 
                               key={star}
                               onClick={() => setUserRating(star)}
                               className="transition-transform hover:scale-110 focus:outline-none"
                             >
                               <Star 
                                 className={`h-8 w-8 ${userRating >= star ? 'fill-accent-500 text-accent-500' : 'text-gray-300'}`} 
                               />
                             </button>
                           ))}
                           <span className="ml-2 text-sm font-semibold text-gray-500">{userRating > 0 ? `${userRating}.0` : 'Select stars'}</span>
                        </div>
                        <textarea
                          placeholder="What did you think of the owner's service and the spot?"
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-accent-500 mb-3 resize-none h-20"
                          value={userReview}
                          onChange={(e) => setUserReview(e.target.value)}
                        />
                        <button 
                          onClick={handleSubmitReview}
                          disabled={userRating === 0}
                          className="rounded-xl bg-brand-900 px-6 py-2 text-sm font-bold text-white shadow hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Submit Rating
                        </button>
                     </div>
                   ) : (
                     <div className="rounded-2xl bg-brand-50 p-6 text-center border border-brand-100">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 mb-2">
                           <Sparkles className="h-6 w-6" />
                        </div>
                        <p className="font-bold text-brand-900">Thank you for contributing!</p>
                        <p className="text-sm text-brand-700">Your feedback helps improve the owner's rating.</p>
                     </div>
                   )}
                </div>

                {/* AI Section */}
                <div className="rounded-3xl bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm ring-1 ring-brand-100">
                  <div className="flex items-center space-x-2 mb-4">
                    <Bot className="h-6 w-6 text-brand-600" />
                    <h3 className="text-xl font-bold text-gray-800">Ask the AI Concierge</h3>
                  </div>
                  
                  <div className="mb-4 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="E.g., What is the best time for photos?" 
                      className="flex-1 rounded-xl border-none bg-white px-4 py-3 shadow-sm outline-none ring-1 ring-brand-200 focus:ring-brand-500 transition-shadow text-brand-900 placeholder-brand-900/40"
                      value={chatQuery}
                      onChange={(e) => setChatQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAIQuery()}
                      disabled={isChatLoading}
                    />
                    <button 
                      onClick={handleAIQuery}
                      disabled={isChatLoading || !chatQuery.trim()}
                      className="rounded-xl bg-brand-600 px-4 py-3 text-white shadow-md hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>

                  {isChatLoading ? (
                    <div className="rounded-2xl bg-white p-5 shadow-sm border border-brand-100 space-y-4 animate-pulse">
                      <div className="flex items-center space-x-2 opacity-60">
                         <Sparkles className="h-4 w-4 text-brand-400 animate-spin-slow" />
                         <div className="h-3 w-32 bg-brand-100 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-[95%]"></div>
                        <div className="h-3 bg-gray-100 rounded w-[90%]"></div>
                        <div className="h-3 bg-gray-100 rounded w-[85%]"></div>
                      </div>
                    </div>
                  ) : chatResponse ? (
                    <div className="rounded-2xl bg-white p-5 shadow-sm text-gray-700 leading-relaxed border border-brand-100 animate-fade-in relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full bg-brand-300"></div>
                      {chatResponse}
                    </div>
                  ) : null}

                  <div className="mt-6 border-t border-brand-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Suggestions</h4>
                    <button 
                      onClick={handleGenerateItinerary}
                      disabled={isItineraryLoading}
                      className="text-sm text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-2 group"
                    >
                      <span>Generate a 3-Day Itinerary for me</span>
                      <Sparkles className="h-3 w-3 text-accent-500 group-hover:animate-pulse" />
                    </button>
                    
                    {isItineraryLoading ? (
                       <div className="mt-4 rounded-2xl bg-white p-5 border border-brand-100 space-y-4 animate-pulse">
                          <div className="h-4 bg-brand-50 rounded w-40 mb-2"></div>
                          
                          {[1, 2, 3].map((i) => (
                             <div key={i} className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex-shrink-0"></div>
                                <div className="space-y-2 w-full">
                                   <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                                   <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                </div>
                             </div>
                          ))}
                       </div>
                    ) : itinerary ? (
                       <div className="mt-4 rounded-2xl bg-white p-5 text-sm text-gray-700 whitespace-pre-line border border-brand-100 animate-fade-in shadow-sm">
                         {itinerary}
                       </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:w-[380px]">
            <div className="sticky top-24 space-y-6">
               <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-brand-900/5 ring-1 ring-black/5">
                  <div className="mb-6 flex items-baseline justify-between border-b border-gray-100 pb-6">
                    <div>
                      <span className="text-3xl font-bold text-brand-900">${attraction.pricing.entry}</span>
                      <span className="text-gray-500 text-sm font-medium"> / person</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <div className="flex text-accent-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 text-sm font-bold text-gray-900">{currentRating}</span>
                       </div>
                       <span className="text-xs text-gray-400">{reviewsCount} ratings</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                      <CalendarCheck className="mr-3 h-5 w-5 text-brand-500" />
                      <span>Instant Confirmation</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                      <Clock className="mr-3 h-5 w-5 text-accent-500" />
                      <span>Max Stay: {attraction.maxDurationHours}h</span>
                    </div>
                  </div>

                  {/* Booking logic restricted to Tourists */}
                  {currentUser.role === 'tourist' ? (
                     !activeBooking ? (
                      <button 
                        onClick={() => setShowBooking(true)}
                        className="w-full rounded-2xl bg-brand-900 py-4 font-bold text-white shadow-lg shadow-brand-900/20 transition-all hover:scale-[1.02] hover:bg-brand-800 active:scale-95"
                      >
                        Check Availability
                      </button>
                    ) : (
                      <div className="w-full rounded-2xl bg-green-50 text-green-700 py-4 font-bold text-center border border-green-200">
                         You are checked in!
                      </div>
                    )
                  ) : (
                    <div className="w-full rounded-2xl bg-gray-50 text-gray-500 py-6 px-4 text-center border border-dashed border-gray-300">
                       <div className="flex justify-center mb-2">
                          <Lock className="h-6 w-6 text-gray-400" />
                       </div>
                       <p className="font-semibold text-sm">Manager View</p>
                       <p className="text-xs mt-1">Switch to a tourist account to make bookings.</p>
                    </div>
                  )}
                  
                  <p className="mt-4 text-center text-xs text-gray-400">Free cancellation up to 24h before</p>
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* Create Post Modal */}
      {isPosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl animate-fade-in relative">
            <button onClick={() => setIsPosting(false)} className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-xl font-bold mb-4 font-serif text-brand-900">Share Experience</h3>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`mb-4 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors ${newPostImage ? 'border-transparent' : 'border-gray-300 hover:border-brand-500 bg-gray-50'}`}
            >
              {newPostImage ? (
                <img src={newPostImage} className="h-full w-full rounded-2xl object-cover" alt="Preview" />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="bg-brand-50 p-4 rounded-full inline-block mb-3">
                    <Camera className="mx-auto h-8 w-8 text-brand-400" />
                  </div>
                  <p className="font-medium text-gray-500">Click to upload photo</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload}
              />
            </div>
            
            <textarea
              placeholder="Write a caption..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 outline-none focus:ring-2 focus:ring-brand-500 mb-4 h-24 resize-none"
              value={newPostCaption}
              onChange={(e) => setNewPostCaption(e.target.value)}
            />
            
            <button 
              onClick={handleSubmitPost}
              disabled={!newPostImage}
              className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
            >
              Post Memory
            </button>
          </div>
        </div>
      )}

      {showBooking && (
        <BookingModal 
          attraction={attraction} 
          currentUser={currentUser}
          onClose={() => setShowBooking(false)} 
          onConfirm={handleBookingConfirm}
          onTransaction={onTransaction}
        />
      )}
    </div>
  );
};
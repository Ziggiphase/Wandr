import React, { useState } from 'react';
import { Compass, Search, User as UserIcon, Bell, Plus, Briefcase, ChevronRight, Building2, Wallet, LogOut } from 'lucide-react';
import { ATTRACTIONS, MOCK_POSTS, CURRENT_USER, MOCK_MANAGER } from './constants';
import { AttractionCard } from './components/AttractionCard';
import { AttractionDetail } from './components/AttractionDetail';
import { AddAttractionModal } from './components/AddAttractionModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { TravelFundModal } from './components/TravelFundModal';
import { AuthScreen } from './components/AuthScreen';
import { Post, Attraction, AttractionCategory, User, Transaction, RewardTier } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'detail' | 'dashboard'>('home');
  const [selectedAttractionId, setSelectedAttractionId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Manager Mode State
  const [managedAttractionId, setManagedAttractionId] = useState<string | null>(null);

  const [attractions, setAttractions] = useState<Attraction[]>(ATTRACTIONS);
  const [globalPosts, setGlobalPosts] = useState<Post[]>(MOCK_POSTS);
  
  // Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AttractionCategory | 'All'>('All');
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);

  // Auth Handlers
  const handleLogin = (user: User) => {
    // If it's a demo button click, load specific mock data
    if (user.email === 'alex@wandr.com') {
       setCurrentUser(CURRENT_USER);
    } else if (user.email === 'sarah@manager.com') {
       setCurrentUser(MOCK_MANAGER);
    } else {
       // Ensure user has all required fields if they are missing
       const secureUser: User = {
           ...user,
           walletBalance: user.walletBalance ?? 0,
           transactions: user.transactions ?? [],
           id: user.id ?? `u_${Date.now()}`,
           avatar: user.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
           totalLikesReceived: user.totalLikesReceived ?? 0,
           rewardTier: user.rewardTier ?? RewardTier.None
       };
       setCurrentUser(secureUser);
    }
    setIsAuthenticated(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('home');
    setManagedAttractionId(null);
  };

  const handleAttractionClick = (id: string) => {
    setSelectedAttractionId(id);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentView('home');
    setSelectedAttractionId(null);
  };

  const handleAddPost = (newPost: Post) => {
    setGlobalPosts([newPost, ...globalPosts]);
  };

  const handleAddAttraction = (newAttraction: Attraction) => {
    setAttractions([newAttraction, ...attractions]);
    // Scroll to the new item
    setTimeout(() => {
       const element = document.getElementById('attractions-grid');
       element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleUpdateAttraction = (updated: Attraction) => {
    setAttractions(attractions.map(a => a.id === updated.id ? updated : a));
  };

  const handleTransaction = (amount: number, type: 'deposit' | 'payment', description: string) => {
    if (!currentUser) return;

    const newTransaction: Transaction = {
      id: `t_${Date.now()}`,
      type,
      amount,
      description,
      date: new Date().toLocaleDateString()
    };
    
    const newBalance = type === 'deposit' 
      ? currentUser.walletBalance + amount 
      : currentUser.walletBalance - amount;

    setCurrentUser({
      ...currentUser,
      walletBalance: newBalance,
      transactions: [newTransaction, ...currentUser.transactions]
    });
  };

  const filteredAttractions = attractions.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedAttraction = attractions.find(a => a.id === selectedAttractionId);
  const managedAttraction = attractions.find(a => a.id === managedAttractionId);

  // Render Auth Screen if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen font-sans text-brand-900 bg-sand-50">
      {/* Navigation */}
      <nav className="fixed top-0 z-40 w-full border-b border-brand-900/10 bg-white/80 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div 
            className="flex cursor-pointer items-center space-x-2 text-brand-900 group" 
            onClick={handleBack}
          >
            <Compass className="h-8 w-8 text-brand-500 transition-transform duration-500 group-hover:rotate-45" />
            <span className="font-serif text-3xl font-bold tracking-tight text-brand-900">Wandr.</span>
          </div>

          <div className="hidden md:flex items-center rounded-full bg-sand-100/50 px-4 py-2 ring-1 ring-transparent focus-within:ring-2 focus-within:ring-brand-500 transition-all hover:bg-sand-100">
            <Search className="h-4 w-4 text-brand-900/40 mr-2" />
            <input 
              type="text" 
              placeholder="Search destinations..." 
              className="bg-transparent text-sm outline-none w-64 placeholder-brand-900/40 text-brand-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-6">
             {/* Wallet - Only for Tourists */}
             {currentUser.role === 'tourist' && (
               <button 
                  onClick={() => setShowFundModal(true)}
                  className="hidden md:flex items-center space-x-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100 transition-colors"
               >
                  <Wallet className="h-4 w-4" />
                  <span>${currentUser.walletBalance.toLocaleString()}</span>
               </button>
             )}

             {currentUser.role === 'manager' && (
               <>
                 <button 
                    onClick={() => setCurrentView(currentView === 'dashboard' ? 'home' : 'dashboard')}
                    className={`hidden md:flex items-center space-x-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${currentView === 'dashboard' ? 'bg-brand-900 text-white border-brand-900' : 'border-brand-900/10 text-brand-900 hover:bg-brand-50'}`}
                 >
                    <Briefcase className="h-4 w-4" />
                    <span>{currentView === 'dashboard' ? 'Tourist View' : 'Manager Mode'}</span>
                 </button>

                 <button 
                    onClick={() => setShowAddModal(true)}
                    className="hidden md:flex items-center space-x-2 rounded-full border border-brand-900/10 px-4 py-2 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-50"
                 >
                    <Plus className="h-4 w-4" />
                    <span>List Spot</span>
                 </button>
               </>
             )}

            <div className="flex items-center gap-4">
               <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Sign Out">
                  <LogOut className="h-5 w-5" />
               </button>
               <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-md cursor-pointer hover:border-brand-200 transition-colors">
                 <img src={currentUser.avatar} alt="User" className="h-full w-full object-cover" />
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main View Manager */}
      <main className="pt-20">
        {currentView === 'dashboard' && currentUser.role === 'manager' ? (
           managedAttraction ? (
             <OwnerDashboard 
               attraction={managedAttraction} 
               onUpdate={handleUpdateAttraction}
               onExit={() => setManagedAttractionId(null)}
             />
           ) : (
             <div className="mx-auto max-w-4xl px-6 py-20 animate-fade-in">
                <div className="text-center mb-12">
                   <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600 mb-6">
                      <Briefcase className="h-10 w-10" />
                   </div>
                   <h2 className="font-serif text-4xl font-bold text-brand-900 mb-4">Select Your Property</h2>
                   <p className="text-xl text-brand-900/60">Which destination would you like to manage today?</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                   {attractions.map(attr => (
                      <button 
                        key={attr.id}
                        onClick={() => setManagedAttractionId(attr.id)}
                        className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-brand-100 hover:shadow-lg hover:border-brand-300 transition-all text-left group"
                      >
                         <img src={attr.imageUrl} className="h-24 w-24 rounded-2xl object-cover shadow-md" alt="" />
                         <div className="flex-1">
                            <h3 className="font-serif text-xl font-bold text-brand-900 group-hover:text-brand-600 transition-colors">{attr.name}</h3>
                            <p className="text-brand-900/50 text-sm mb-2">{attr.location}</p>
                            <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-accent-600">
                               <Building2 className="h-4 w-4 mr-1" />
                               Manage Now
                            </div>
                         </div>
                         <ChevronRight className="h-6 w-6 text-gray-300 group-hover:text-brand-500 transition-colors" />
                      </button>
                   ))}
                </div>
             </div>
           )
        ) : (
           <>
              {currentView === 'home' && (
                <div className="animate-fade-in">
                  {/* Hero Section */}
                  <div className="relative mb-16 flex h-[550px] items-center justify-center overflow-hidden">
                     <div className="absolute inset-0">
                       <img 
                          src="https://picsum.photos/seed/travelhero/1920/1080" 
                          alt="Hero" 
                          className="h-full w-full object-cover opacity-90 scale-105 animate-[pulse_20s_ease-in-out_infinite]"
                       />
                       <div className="absolute inset-0 bg-gradient-to-b from-brand-900/30 via-brand-900/20 to-brand-900/60" />
                     </div>
                     <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                        <span className="inline-block mb-4 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-md">
                          {currentUser.role === 'manager' ? 'Welcome back, Manager' : 'The world is waiting'}
                        </span>
                        <h1 className="mb-6 font-serif text-6xl font-bold md:text-8xl drop-shadow-xl tracking-tight leading-tight">
                          Where will you <span className="italic text-brand-100">Wandr</span>?
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-brand-50 md:text-xl leading-relaxed">
                          {currentUser.role === 'manager' 
                            ? 'Manage your listings, analyze visitor data, and curate unforgettable experiences.'
                            : 'Connect with fellow explorers, uncover hidden sanctuaries, and let our AI guide curate your perfect escape.'}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                          <button className="w-full sm:w-auto rounded-full bg-accent-500 px-8 py-4 font-bold text-white shadow-lg shadow-accent-500/30 transition-all hover:scale-105 hover:bg-accent-600 hover:shadow-xl">
                            Start Exploring
                          </button>
                          {currentUser.role === 'manager' && (
                            <button 
                               onClick={() => setShowAddModal(true)}
                               className="w-full sm:w-auto rounded-full bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20"
                            >
                              Share a Destination
                            </button>
                          )}
                        </div>
                     </div>
                  </div>

                  {/* Attractions Section */}
                  <div className="mx-auto max-w-7xl px-6 pb-20" id="attractions-grid">
                    
                    {/* Controls Header */}
                    <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <h2 className="font-serif text-4xl font-bold text-brand-900">Curated Destinations</h2>
                        <p className="mt-2 text-brand-900/60 font-light text-lg">Hand-picked experiences for the modern nomad</p>
                      </div>
                      
                      {/* Category Filters */}
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setSelectedCategory('All')}
                          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${selectedCategory === 'All' ? 'bg-brand-900 text-white shadow-lg' : 'bg-white text-brand-900 border border-brand-900/10 hover:bg-brand-50'}`}
                        >
                          All
                        </button>
                        {Object.values(AttractionCategory).map(cat => (
                          <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-brand-900 text-white shadow-lg' : 'bg-white text-brand-900 border border-brand-900/10 hover:bg-brand-50'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Dynamic Grid */}
                    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                      {filteredAttractions.map(attraction => (
                        <AttractionCard 
                          key={attraction.id} 
                          attraction={attraction} 
                          onClick={handleAttractionClick} 
                        />
                      ))}
                    </div>

                    {filteredAttractions.length === 0 && (
                       <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sand-100 mb-4">
                             <Search className="h-6 w-6 text-brand-900/40" />
                          </div>
                          <p className="text-brand-900/60 text-lg mb-4">No destinations found matching your criteria.</p>
                          <button onClick={() => {setSearchTerm(''); setSelectedCategory('All');}} className="text-brand-600 font-semibold hover:underline">
                            Reset Filters
                          </button>
                       </div>
                    )}
                  </div>

                  {/* Newsletter / Footer Teaser */}
                  <div className="mx-6 mb-6 overflow-hidden rounded-[3rem] bg-brand-900 py-24 text-center text-white relative">
                     <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-brand-500 blur-[100px]"></div>
                        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-accent-500 blur-[100px]"></div>
                     </div>
                     
                     <div className="relative mx-auto max-w-3xl px-6 z-10">
                       <h2 className="mb-6 font-serif text-4xl font-bold md:text-5xl">Join the Wandr Club</h2>
                       <p className="mb-10 text-brand-100 text-lg font-light leading-relaxed">
                          Receive weekly curated itineraries, secret spots, and exclusive booking offers directly to your inbox.
                       </p>
                       <div className="mx-auto flex max-w-lg gap-2 rounded-full bg-white/10 p-2 backdrop-blur-md border border-white/10 focus-within:bg-white/15 focus-within:border-white/30 transition-all">
                         <input 
                           type="email" 
                           placeholder="Your email address" 
                           className="flex-1 bg-transparent px-6 py-3 text-white placeholder-brand-200 outline-none" 
                         />
                         <button className="rounded-full bg-white px-8 py-3 font-bold text-brand-900 hover:bg-brand-50 transition-colors shadow-lg">
                           Join
                         </button>
                       </div>
                     </div>
                  </div>
                  
                  <footer className="py-8 text-center text-brand-900/40 text-sm">
                     <p>© 2024 Wandr Inc. All rights reserved.</p>
                  </footer>
                </div>
              )}

              {currentView === 'detail' && selectedAttraction && (
                <AttractionDetail 
                  attraction={selectedAttraction}
                  allPosts={globalPosts}
                  currentUser={currentUser}
                  onBack={handleBack}
                  onAddPost={handleAddPost}
                  onTransaction={handleTransaction}
                />
              )}
           </>
        )}
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddAttractionModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAttraction}
        />
      )}
      
      {showFundModal && currentUser.role === 'tourist' && (
        <TravelFundModal 
          user={currentUser}
          onClose={() => setShowFundModal(false)}
          onTransaction={handleTransaction}
        />
      )}
    </div>
  );
}

export default App;
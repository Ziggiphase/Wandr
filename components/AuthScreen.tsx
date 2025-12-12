import React, { useState } from 'react';
import { Compass, Mail, Lock, User, Briefcase, Map, ArrowRight } from 'lucide-react';
import { User as UserType, UserRole, RewardTier } from '../types';

interface Props {
  onLogin: (user: UserType) => void;
}

export const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>('tourist');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate login delay
    setTimeout(() => {
      // Create a mock user based on input
      const newUser: UserType = {
        id: `u_${Date.now()}`,
        name: formData.name || 'New Explorer',
        email: formData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
        role: role,
        totalLikesReceived: 0,
        rewardTier: RewardTier.None,
        walletBalance: 0,
        transactions: []
      };
      
      onLogin(newUser);
    }, 800);
  };

  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden">
      
      {/* Left Panel: Visuals */}
      <div className={`relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-900 p-12 text-white lg:flex transition-all duration-700 ease-in-out ${isSignUp ? 'translate-x-full order-2' : 'translate-x-0 order-1'}`}>
        <div className="absolute inset-0 z-0">
           <img 
             src={role === 'tourist' 
                ? "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"
                : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop"
             } 
             className="h-full w-full object-cover opacity-60 transition-opacity duration-1000"
             alt="Background" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/40 to-transparent" />
        </div>
        
        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
             <Compass className="h-10 w-10 text-brand-300" />
             <span className="font-serif text-3xl font-bold">Wandr.</span>
          </div>
          <h1 className="font-serif text-6xl font-bold leading-tight mb-4">
            {role === 'tourist' ? "Discover the Unseen." : "Host the World."}
          </h1>
          <p className="text-brand-100 text-xl max-w-md">
            {role === 'tourist' 
              ? "Join a community of explorers finding serenity and adventure in every corner of the globe."
              : "Showcase your unique destination to millions of travelers looking for their next escape."
            }
          </p>
        </div>

        <div className="relative z-10 backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/10">
           <div className="flex gap-4 items-center">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/u${i}/50/50`} className="h-10 w-10 rounded-full border-2 border-brand-900" alt="" />
                 ))}
              </div>
              <div className="text-sm">
                 <p className="font-bold">Join 50,000+ explorers</p>
                 <p className="text-white/60">Sharing real experiences daily</p>
              </div>
           </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className={`flex w-full flex-col justify-center px-12 lg:w-1/2 transition-all duration-700 ease-in-out ${isSignUp ? '-translate-x-full order-1' : 'translate-x-0 order-2'}`}>
        <div className="mx-auto w-full max-w-md animate-slide-up">
          
          <div className="mb-10 text-center">
             <h2 className="font-serif text-4xl font-bold text-brand-900 mb-3">
               {isSignUp ? "Create an Account" : "Welcome Back"}
             </h2>
             <p className="text-gray-500">
               {isSignUp ? "Start your journey with us today." : "Please enter your details to sign in."}
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setRole('tourist')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${role === 'tourist' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-100 hover:border-brand-200 text-gray-500'}`}
                >
                   <Map className={`h-8 w-8 mb-2 ${role === 'tourist' ? 'text-brand-500' : 'text-gray-400'}`} />
                   <span className="font-bold text-sm">I'm a Tourist</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('manager')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${role === 'manager' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-100 hover:border-brand-200 text-gray-500'}`}
                >
                   <Briefcase className={`h-8 w-8 mb-2 ${role === 'manager' ? 'text-brand-500' : 'text-gray-400'}`} />
                   <span className="font-bold text-sm">I'm a Manager</span>
                </button>
              </div>
            )}

            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-900">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    required
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3 outline-none focus:border-brand-500 focus:bg-white transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input 
                  type="email" 
                  required
                  placeholder="hello@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3 outline-none focus:border-brand-500 focus:bg-white transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-3 outline-none focus:border-brand-500 focus:bg-white transition-all"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="group relative w-full overflow-hidden rounded-xl bg-brand-900 py-4 font-bold text-white shadow-lg transition-all hover:bg-brand-800 hover:shadow-xl active:scale-[0.98]"
            >
               <span className="relative z-10 flex items-center justify-center gap-2">
                 {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
               </span>
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
             {isSignUp ? "Already have an account?" : "Don't have an account yet?"}
             <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 font-bold text-brand-600 hover:underline"
             >
                {isSignUp ? "Sign In" : "Sign Up"}
             </button>
          </div>
          
          {!isSignUp && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Or demo as</p>
              <div className="flex justify-center gap-4">
                 <button onClick={() => {
                    const demoEmail = 'alex@wandr.com';
                    setFormData({ ...formData, name: 'Alex', email: demoEmail });
                    setRole('tourist');
                    // Important: Pass the specific email in the object so App.tsx recognizes it
                    onLogin({ name: 'Alex', email: demoEmail, role: 'tourist' } as any);
                 }} className="text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100 hover:bg-brand-100">
                    Tourist Demo
                 </button>
                 <button onClick={() => {
                    const demoEmail = 'sarah@manager.com';
                    setFormData({ ...formData, name: 'Sarah', email: demoEmail });
                    setRole('manager');
                    // Important: Pass the specific email in the object so App.tsx recognizes it
                    onLogin({ name: 'Sarah', email: demoEmail, role: 'manager' } as any);
                 }} className="text-xs font-semibold text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-100 hover:bg-accent-100">
                    Manager Demo
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
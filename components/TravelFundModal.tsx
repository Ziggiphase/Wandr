import React, { useState } from 'react';
import { X, Wallet, TrendingUp, PiggyBank, ArrowRight, CreditCard, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { User } from '../types';

interface Props {
  user: User;
  onClose: () => void;
  onTransaction: (amount: number, type: 'deposit' | 'payment', description: string) => void;
}

export const TravelFundModal: React.FC<Props> = ({ user, onClose, onTransaction }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      const value = parseFloat(amount);
      onTransaction(value, 'deposit', 'Travel Fund Deposit');
      setIsProcessing(false);
      setAmount('');
      alert(`Successfully added $${value} to your travel fund!`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10">
           <X className="h-5 w-5" />
        </button>

        <div className="bg-brand-50 p-8 text-center border-b border-brand-100 shrink-0">
           <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600 shadow-inner">
              <Wallet className="h-8 w-8" />
           </div>
           <h2 className="font-serif text-2xl font-bold text-brand-900">Travel Fund</h2>
           <p className="text-brand-900/60 mt-1">Save bit by bit for your next adventure</p>
           
           <div className="mt-6 flex flex-col items-center justify-center">
              <span className="text-sm font-medium text-brand-900/50 uppercase tracking-widest">Current Balance</span>
              <span className="text-5xl font-bold text-brand-600 mt-2">${user.walletBalance.toLocaleString()}</span>
           </div>
        </div>

        <div className="p-8 overflow-y-auto">
           <form onSubmit={handleDeposit} className="space-y-6 mb-8">
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Add Money</label>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input 
                      type="number" 
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 py-4 pl-8 pr-4 text-2xl font-bold text-gray-900 outline-none focus:border-brand-500 focus:bg-white transition-all"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                 {[20, 50, 100].map((val) => (
                    <button 
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors"
                    >
                       +${val}
                    </button>
                 ))}
              </div>

              <div className="rounded-xl bg-accent-50 p-4 border border-accent-100 flex items-start gap-3">
                 <PiggyBank className="h-6 w-6 text-accent-500 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="font-bold text-accent-800 text-sm">Smart Saving Tip</h4>
                    <p className="text-xs text-accent-700 mt-1">
                       Setting aside just $50 a week covers a weekend getaway in 3 months!
                    </p>
                 </div>
              </div>

              <button 
                 type="submit"
                 disabled={!amount || isProcessing}
                 className="w-full rounded-xl bg-brand-900 py-4 font-bold text-white shadow-lg hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                 {isProcessing ? (
                    'Processing...'
                 ) : (
                    <>
                       <CreditCard className="h-5 w-5" /> Deposit Funds
                    </>
                 )}
              </button>
           </form>

           <div className="border-t border-brand-100 pt-6">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-gray-400" />
                Transaction History
              </h4>
              <div className="space-y-3">
                {user.transactions.map(t => (
                  <div key={t.id} className="flex items-center justify-between text-sm p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-full ${t.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {t.type === 'deposit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                       </div>
                       <div>
                          <div className="font-medium text-gray-900 line-clamp-1">{t.description}</div>
                          <div className="text-xs text-gray-500">{t.date}</div>
                       </div>
                    </div>
                    <div className={`font-bold whitespace-nowrap ${t.type === 'deposit' ? 'text-green-600' : 'text-gray-900'}`}>
                       {t.type === 'deposit' ? '+' : '-'}${t.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
                {user.transactions.length === 0 && (
                  <p className="text-center text-gray-400 text-xs py-4">No recent transactions.</p>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
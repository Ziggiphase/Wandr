import React from 'react';
import { Heart, MessageCircle, Share2, BadgeCheck } from 'lucide-react';
import { Post, RewardTier } from '../types';

interface Props {
  posts: Post[];
}

const getBadgeColor = (tier?: RewardTier) => {
  switch (tier) {
    case RewardTier.Platinum: return 'text-blue-500 fill-blue-100';
    case RewardTier.Gold: return 'text-amber-500 fill-amber-100';
    case RewardTier.Silver: return 'text-slate-400 fill-slate-100';
    case RewardTier.Bronze: return 'text-orange-700 fill-orange-100';
    default: return 'hidden';
  }
};

export const PostGrid: React.FC<Props> = ({ posts }) => {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="break-inside-avoid rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-lg border border-brand-100/50">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <img src={post.user.avatar} alt={post.user.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-white" />
                {post.user.rewardTier && post.user.rewardTier !== RewardTier.None && (
                   <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <BadgeCheck className={`h-4 w-4 ${getBadgeColor(post.user.rewardTier)}`} />
                   </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-900">{post.user.name}</span>
                </div>
                <span className="text-xs text-gray-400 block">{post.timestamp}</span>
              </div>
            </div>
            
          </div>
          
          <div className="overflow-hidden rounded-xl bg-gray-100">
            <img src={post.imageUrl} alt="User post" className="w-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out" />
          </div>
          
          <div className="mt-4 px-1">
            <p className="mb-3 text-sm text-gray-700 leading-relaxed">{post.caption}</p>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <button className="flex items-center space-x-1.5 text-gray-500 hover:text-rose-500 transition-colors group">
                <Heart className="h-5 w-5 group-hover:fill-rose-500 transition-colors" />
                <span className="text-xs font-semibold group-hover:text-rose-600">{post.likes}</span>
              </button>
              <div className="flex space-x-4 text-gray-400">
                <button className="hover:text-brand-600 transition-colors flex items-center gap-1">
                   <MessageCircle className="h-5 w-5" />
                   <span className="text-xs">Comment</span>
                </button>
                <button className="hover:text-brand-600 transition-colors">
                   <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
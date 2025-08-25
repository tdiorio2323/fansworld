import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Menu, 
  Plus,
  Home,
  Search,
  Compass,
  Film,
  Bell,
  PlusSquare,
  User,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Feed: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Left Sidebar - Fixed */}
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-800 bg-black z-50">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-8">Cabana</h1>
            
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-3 text-white hover:bg-gray-800">
                <Home className="w-6 h-6" />
                <span>Home</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-3 text-white hover:bg-gray-800">
                <Search className="w-6 h-6" />
                <span>Search</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-3 text-white hover:bg-gray-800">
                <Compass className="w-6 h-6" />
                <span>Explore</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-3 text-white hover:bg-gray-800">
                <Film className="w-6 h-6" />
                <span>Reels</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-3 text-white hover:bg-gray-800">
                <MessageCircle className="w-6 h-6" />
                <span>Messages</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-3 text-white hover:bg-gray-800">
                <Bell className="w-6 h-6" />
                <span>Notifications</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-3 text-white hover:bg-gray-800">
                <PlusSquare className="w-6 h-6" />
                <span>Create</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-3 text-white hover:bg-gray-800">
                <User className="w-6 h-6" />
                <span>Profile</span>
              </Button>
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-3 text-white hover:bg-gray-800">
                <Settings className="w-6 h-6" />
                <span>More</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="ml-64 mr-80 flex-1 min-h-screen">
          {/* Center Feed */}
          <div className="max-w-lg mx-auto py-8">

      {/* Stories Row */}
      <div className="border-b border-gray-800 py-3">
        <div className="flex gap-4 px-4 overflow-x-auto scrollbar-hide">
          {/* Your Story */}
          <div className="flex flex-col items-center gap-1 min-w-[70px]">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-600">
                <Plus className="w-6 h-6" />
              </div>
            </div>
            <span className="text-xs">Your Story</span>
          </div>
          
          {/* Other Stories */}
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1 min-w-[70px]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-black p-[2px]">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={`/api/placeholder/64/64?${i}`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs">user{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Posts */}
      <div className="divide-y divide-gray-800">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="bg-black">
            {/* Post Header */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`/api/placeholder/32/32?post${i}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">creator_{i + 1}</p>
                  <p className="text-xs text-gray-400">{i + 1}h</p>
                </div>
              </div>
              <MoreHorizontal className="w-5 h-5" />
            </div>

            {/* Post Image */}
            <div className="aspect-square bg-gray-900">
              <img 
                src={`/api/placeholder/400/400?feed${i}`}
                alt="Post"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post Actions */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <Heart className="w-6 h-6" />
                  <MessageCircle className="w-6 h-6" />
                  <Send className="w-6 h-6" />
                </div>
                <Bookmark className="w-6 h-6" />
              </div>

              {/* Likes */}
              <p className="font-semibold text-sm mb-1">{Math.floor(Math.random() * 10000)} likes</p>

              {/* Caption */}
              <div className="text-sm">
                <span className="font-semibold">creator_{i + 1}</span>{' '}
                <span>Amazing content from today's shoot! 💕 #{i + 1}</span>
              </div>

              {/* Comments */}
              <p className="text-gray-400 text-sm mt-1">View all {Math.floor(Math.random() * 100)} comments</p>

              {/* Add Comment */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-800">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="/api/placeholder/24/24" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-sm placeholder:text-gray-500 border-none outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
          </div>
        </main>

        {/* Right Sidebar - Fixed */}
        <aside className="fixed right-0 top-0 h-screen w-80 bg-black p-6 z-40">
          <div className="pt-8">
            {/* Suggestions for You */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 font-semibold text-sm">Suggestions for you</h3>
                <button className="text-xs text-gray-400 hover:text-white">See All</button>
              </div>
              
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={`/api/placeholder/32/32?suggest${i}`} />
                        <AvatarFallback>S{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">suggested_user_{i + 1}</p>
                        <p className="text-xs text-gray-400">Followed by user_{i + 2}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 h-8 px-2 text-xs font-semibold">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-xs text-gray-500 space-y-2 mt-8">
              <div className="flex flex-wrap gap-2">
                <a href="#" className="hover:text-gray-400">About</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-400">Help</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-400">Press</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-400">API</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-400">Jobs</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-400">Privacy</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-400">Terms</a>
              </div>
              <p className="mt-4">© 2023 CABANA FROM FANSWORLD</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Stories Row */}
        <div className="border-b border-gray-800 py-3">
          <div className="flex gap-4 px-4 overflow-x-auto scrollbar-hide">
            {/* Your Story */}
            <div className="flex flex-col items-center gap-1 min-w-[70px]">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-600">
                  <Plus className="w-6 h-6" />
                </div>
              </div>
              <span className="text-xs">Your Story</span>
            </div>
            
            {/* Other Stories */}
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 min-w-[70px]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-black p-[2px]">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={`/api/placeholder/64/64?${i}`} />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <span className="text-xs">user{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feed Posts */}
        <div className="divide-y divide-gray-800">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="bg-black">
              {/* Post Header */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`/api/placeholder/32/32?post${i}`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">creator_{i + 1}</p>
                    <p className="text-xs text-gray-400">{i + 1}h</p>
                  </div>
                </div>
                <MoreHorizontal className="w-5 h-5" />
              </div>

              {/* Post Image */}
              <div className="aspect-square bg-gray-900">
                <img 
                  src={`/api/placeholder/400/400?feed${i}`}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Post Actions */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <Heart className="w-6 h-6" />
                    <MessageCircle className="w-6 h-6" />
                    <Send className="w-6 h-6" />
                  </div>
                  <Bookmark className="w-6 h-6" />
                </div>

                {/* Likes */}
                <p className="font-semibold text-sm mb-1">{Math.floor(Math.random() * 10000)} likes</p>

                {/* Caption */}
                <div className="text-sm">
                  <span className="font-semibold">creator_{i + 1}</span>{' '}
                  <span>Amazing content from today's shoot! 💕 #{i + 1}</span>
                </div>

                {/* Comments */}
                <p className="text-gray-400 text-sm mt-1">View all {Math.floor(Math.random() * 100)} comments</p>

                {/* Add Comment */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-800">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="/api/placeholder/24/24" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent text-sm placeholder:text-gray-500 border-none outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          <Button variant="ghost" size="sm" className="p-2">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <div className="w-6 h-6 border-2 border-white rounded-full"></div>
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <div className="w-6 h-6 border-2 border-white"></div>
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Heart className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
          </Button>
        </div>
      </nav>
      </div>

      {/* Floating Chat Bubble - Always visible */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-colors z-50">
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default Feed;
// 📚 STORIES & HIGHLIGHTS - MAIN COMPONENT

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ADDON_FLAGS } from '@/features/addons/feature-flags';
import type { Story, Highlight, StoryContent } from '../types';

interface StoriesProps {
  creatorId?: string;
  currentUserId?: string;
  stories?: Story[];
  highlights?: Highlight[];
  mode?: 'view' | 'create' | 'manage';
  embedded?: boolean;
  showHighlights?: boolean;
  onStoryView?: (storyId: string) => void;
  onStoryLike?: (storyId: string) => void;
  onStoryComment?: (storyId: string, comment: string) => void;
  className?: string;
}

export function Stories({
  creatorId,
  currentUserId,
  stories = [],
  highlights = [],
  mode = 'view',
  embedded = false,
  showHighlights = true,
  onStoryView,
  onStoryLike,
  onStoryComment,
  className = '',
}: StoriesProps) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const progressInterval = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Don't render if addon is disabled
  if (!ADDON_FLAGS.STORIES_HIGHLIGHTS) {
    return null;
  }

  useEffect(() => {
    if (activeStory && isPlaying) {
      startProgress();
    } else {
      stopProgress();
    }
    
    return () => stopProgress();
  }, [activeStory, isPlaying, activeContentIndex]);

  const startProgress = () => {
    stopProgress();
    const currentContent = activeStory?.content[activeContentIndex];
    const duration = currentContent?.duration || 5000; // Default 5 seconds
    
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100));
        if (newProgress >= 100) {
          nextContent();
          return 0;
        }
        return newProgress;
      });
    }, 100);
  };

  const stopProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const nextContent = () => {
    if (!activeStory) return;
    
    if (activeContentIndex < activeStory.content.length - 1) {
      setActiveContentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      // Story finished
      closeStory();
    }
  };

  const prevContent = () => {
    if (activeContentIndex > 0) {
      setActiveContentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const openStory = (story: Story, startIndex = 0) => {
    setActiveStory(story);
    setActiveContentIndex(startIndex);
    setProgress(0);
    setIsPlaying(true);
    
    // Record story view
    onStoryView?.(story.id);
  };

  const closeStory = () => {
    setActiveStory(null);
    setActiveContentIndex(0);
    setProgress(0);
    setIsPlaying(false);
    setShowComments(false);
    stopProgress();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    
    // Handle video play/pause
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleLike = () => {
    if (!activeStory) return;
    onStoryLike?.(activeStory.id);
  };

  const handleComment = () => {
    if (!activeStory || !commentText.trim()) return;
    onStoryComment?.(activeStory.id, commentText);
    setCommentText('');
    setShowComments(false);
  };

  const renderStoryRings = () => {
    if (embedded || mode !== 'view') return null;

    return (
      <div className="stories-rings flex gap-4 p-4 overflow-x-auto">
        {/* Creator's story ring (current user) */}
        {currentUserId === creatorId && (
          <div 
            onClick={() => mode === 'view' && null /* Open create modal */}
            className="flex-shrink-0 text-center cursor-pointer"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <img
                    src="/default-avatar.png"
                    alt="Your story"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">+</span>
              </div>
            </div>
            <p className="text-xs mt-1 text-gray-600">Your story</p>
          </div>
        )}

        {/* Story rings from stories */}
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => openStory(story)}
            className="flex-shrink-0 text-center cursor-pointer"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <img
                    src={story.thumbnailUrl || story.creator?.avatarUrl || '/default-avatar.png'}
                    alt={story.title}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              {story.isPremium && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">💎</span>
                </div>
              )}
            </div>
            <p className="text-xs mt-1 text-gray-600 truncate max-w-16">
              {story.creator?.displayName || story.creator?.username}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderHighlights = () => {
    if (!showHighlights || embedded || highlights.length === 0) return null;

    return (
      <div className="highlights-section p-4">
        <h3 className="text-lg font-semibold mb-3">Highlights</h3>
        <div className="grid grid-cols-4 gap-4">
          {highlights.map((highlight) => (
            <div
              key={highlight.id}
              onClick={() => {
                // Open first story in highlight
                if (highlight.stories?.[0]) {
                  openStory(highlight.stories[0]);
                }
              }}
              className="text-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-2 overflow-hidden">
                <img
                  src={highlight.coverUrl || '/default-highlight.png'}
                  alt={highlight.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-gray-600 truncate">{highlight.title}</p>
              <p className="text-xs text-gray-400">{highlight.storyCount} stories</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStoryContent = (content: StoryContent) => {
    switch (content.type) {
      case 'image':
        return (
          <img
            src={content.url}
            alt="Story content"
            className="w-full h-full object-cover"
            style={{ filter: getContentFilter(content.filter) }}
          />
        );
        
      case 'video':
        return (
          <video
            ref={videoRef}
            src={content.url}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop={false}
            style={{ filter: getContentFilter(content.filter) }}
            onEnded={nextContent}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        );
        
      case 'text':
        return (
          <div
            className="w-full h-full flex items-center justify-center p-8 text-center"
            style={{
              backgroundColor: content.backgroundColor || '#000000',
              color: content.textColor || '#FFFFFF',
            }}
          >
            <p
              className={`
                ${content.fontSize === 'small' ? 'text-lg' : 
                  content.fontSize === 'large' ? 'text-4xl' : 'text-2xl'}
                ${content.textAlign === 'left' ? 'text-left' : 
                  content.textAlign === 'right' ? 'text-right' : 'text-center'}
              `}
            >
              {content.text}
            </p>
          </div>
        );
        
      case 'poll':
        if (!content.poll) return null;
        return (
          <div className="w-full h-full flex flex-col justify-center items-center p-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
            <h3 className="text-2xl font-bold mb-8 text-center">{content.poll.question}</h3>
            <div className="space-y-4 w-full max-w-sm">
              {content.poll.options.map((option, index) => {
                const votes = content.poll!.votes[option] || 0;
                const totalVotes = Object.values(content.poll!.votes).reduce((sum, v) => sum + v, 0);
                const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                
                return (
                  <button
                    key={index}
                    className="w-full p-3 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                    onClick={() => {
                      // Handle poll vote
                      console.log('Poll vote:', option);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option}</span>
                      <span className="text-sm opacity-75">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                      <div
                        className="bg-white rounded-full h-1 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const getContentFilter = (filter?: string) => {
    switch (filter) {
      case 'vintage': return 'sepia(1) contrast(1.2)';
      case 'dramatic': return 'contrast(1.5) saturate(1.5)';
      case 'bright': return 'brightness(1.3) saturate(1.2)';
      case 'soft': return 'blur(1px) brightness(1.1)';
      default: return 'none';
    }
  };

  if (mode === 'create') {
    return (
      <div className={`story-creator ${className}`}>
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Create Story</h2>
          <p className="text-gray-600 mb-4">Story creation interface would go here</p>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
            Create Story
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`stories-component ${embedded ? 'embedded' : ''} ${className}`}>
      {/* Story Rings */}
      {renderStoryRings()}
      
      {/* Highlights */}
      {renderHighlights()}
      
      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Story Content */}
          <div className="relative w-full max-w-sm h-full max-h-screen bg-black">
            {/* Progress Bars */}
            <div className="absolute top-2 left-2 right-2 flex gap-1 z-20">
              {activeStory.content.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{
                      width: index < activeContentIndex ? '100%' :
                             index === activeContentIndex ? `${progress}%` : '0%'
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Story Header */}
            <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <img
                  src={activeStory.creator?.avatarUrl || '/default-avatar.png'}
                  alt={activeStory.creator?.username}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-white font-medium text-sm">
                    {activeStory.creator?.displayName || activeStory.creator?.username}
                  </p>
                  <p className="text-white/70 text-xs">
                    {new Date(activeStory.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={closeStory}
                className="text-white/70 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            {/* Story Content */}
            <div className="w-full h-full">
              {renderStoryContent(activeStory.content[activeContentIndex])}
            </div>
            
            {/* Story Stickers/Overlays */}
            {activeStory.content[activeContentIndex].stickers?.map((sticker, index) => (
              <div
                key={index}
                className="absolute z-10 pointer-events-none"
                style={{
                  left: `${sticker.x}%`,
                  top: `${sticker.y}%`,
                  transform: `scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
                }}
              >
                {sticker.type === 'emoji' && <span className="text-2xl">{sticker.content}</span>}
                {sticker.type === 'mention' && (
                  <span className="text-white font-medium">@{sticker.content}</span>
                )}
                {sticker.type === 'hashtag' && (
                  <span className="text-blue-400 font-medium">#{sticker.content}</span>
                )}
              </div>
            ))}
            
            {/* Story Controls */}
            <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="text-white hover:text-red-400 transition-colors"
                >
                  ❤️ {activeStory.likeCount}
                </button>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  💬 {activeStory.commentCount}
                </button>
                <button className="text-white hover:text-green-400 transition-colors">
                  📤
                </button>
              </div>
              
              <button
                onClick={togglePlay}
                className="text-white/70 hover:text-white"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
            </div>
            
            {/* Navigation Areas */}
            <button
              onClick={prevContent}
              className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
              disabled={activeContentIndex === 0}
            />
            <button
              onClick={nextContent}
              className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
            />
            <button
              onClick={togglePlay}
              className="absolute left-1/3 right-1/3 top-0 bottom-0 z-10"
            />
          </div>
          
          {/* Comments Panel */}
          {showComments && (
            <div className="absolute bottom-0 left-0 right-0 bg-white p-4 rounded-t-lg">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border rounded-full text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <button
                  onClick={handleComment}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Stories;
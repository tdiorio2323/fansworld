// 🗳️ POLLS & FAN VOTING - MAIN COMPONENT

'use client';

import React, { useState, useEffect } from 'react';
import { ADDON_FLAGS } from '@/features/addons/feature-flags';
import type { Poll, PollOption, PollVote } from '../types';

interface PollsProps {
  creatorId?: string;
  currentUserId?: string;
  polls?: Poll[];
  embedded?: boolean;
  showResults?: boolean;
  onVote?: (pollId: string, optionId: string) => void;
  onCreatePoll?: (poll: Omit<Poll, 'id' | 'createdAt' | 'updatedAt'>) => void;
  className?: string;
}

export function Polls({
  creatorId,
  currentUserId,
  polls = [],
  embedded = false,
  showResults = false,
  onVote,
  onCreatePoll,
  className = '',
}: PollsProps) {
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    description: '',
    options: ['', ''],
    allowMultiple: false,
    isPremium: false,
    expiresAt: '',
  });

  // Don't render if addon is disabled
  if (!ADDON_FLAGS.POLLS_VOTING) {
    return null;
  }

  const handleVote = async (pollId: string, optionId: string) => {
    if (!currentUserId) return;

    // Update local state optimistically
    setUserVotes(prev => ({ ...prev, [pollId]: optionId }));
    
    // Call parent handler
    onVote?.(pollId, optionId);
  };

  const handleCreatePoll = () => {
    if (!newPoll.question.trim() || newPoll.options.some(opt => !opt.trim())) {
      return;
    }

    const poll = {
      creatorId: creatorId!,
      question: newPoll.question,
      description: newPoll.description || undefined,
      type: 'simple' as const,
      category: 'fan_engagement' as const,
      options: newPoll.options.map((text, index) => ({
        id: `option_${Date.now()}_${index}`,
        text: text.trim(),
        voteCount: 0,
        percentage: 0,
      })),
      settings: {
        allowMultiple: newPoll.allowMultiple,
        showResults: 'after_vote' as const,
        requireLogin: true,
        isPremium: newPoll.isPremium,
        premiumPrice: newPoll.isPremium ? 100 : undefined,
      },
      isActive: true,
      totalVotes: 0,
      expiresAt: newPoll.expiresAt || undefined,
    };

    onCreatePoll?.(poll);
    
    // Reset form
    setNewPoll({
      question: '',
      description: '',
      options: ['', ''],
      allowMultiple: false,
      isPremium: false,
      expiresAt: '',
    });
    setShowCreateForm(false);
  };

  const addOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const renderPoll = (poll: Poll) => {
    const hasVoted = userVotes[poll.id];
    const canVote = currentUserId && !hasVoted && poll.isActive;
    const showPollResults = showResults || hasVoted || !poll.isActive;

    return (
      <div 
        key={poll.id}
        className={`poll-card bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${
          embedded ? 'mb-4' : 'mb-6'
        }`}
      >
        {/* Poll Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {poll.question}
            </h3>
            {poll.description && (
              <p className="text-gray-600 text-sm mb-3">{poll.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                🗳️ {poll.totalVotes} votes
              </span>
              {poll.settings.isPremium && (
                <span className="flex items-center gap-1 text-yellow-600">
                  💎 Premium
                </span>
              )}
              {poll.category && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  {poll.category.replace('_', ' ')}
                </span>
              )}
              {poll.expiresAt && (
                <span className="text-red-500">
                  Expires: {new Date(poll.expiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          {poll.creator && (
            <div className="flex items-center gap-2 ml-4">
              <img
                src={poll.creator.avatarUrl || '/default-avatar.png'}
                alt={poll.creator.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-gray-600">
                {poll.creator.displayName || poll.creator.username}
              </span>
            </div>
          )}
        </div>

        {/* Poll Options */}
        <div className="space-y-3">
          {poll.options.map((option) => {
            const isSelected = hasVoted === option.id;
            const percentage = poll.totalVotes > 0 ? option.percentage : 0;

            return (
              <div key={option.id} className="relative">
                {canVote ? (
                  <button
                    onClick={() => handleVote(poll.id, option.id)}
                    className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 focus:outline-none focus:border-purple-500"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {option.text}
                      </span>
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    </div>
                  </button>
                ) : (
                  <div 
                    className={`w-full p-4 rounded-lg border-2 relative overflow-hidden ${
                      isSelected 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    {showPollResults && (
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-purple-100 to-transparent transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    )}
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">
                          {option.text}
                        </span>
                        {isSelected && (
                          <span className="text-purple-600 text-sm font-medium">
                            ✓ Your vote
                          </span>
                        )}
                      </div>
                      
                      {showPollResults && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {option.voteCount}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Poll Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Created {new Date(poll.createdAt).toLocaleDateString()}
          </div>
          
          <div className="flex items-center gap-2">
            {poll.settings.allowMultiple && (
              <span className="text-xs text-blue-600">Multiple votes allowed</span>
            )}
            <button
              onClick={() => setActivePoll(poll)}
              className="text-xs text-purple-600 hover:text-purple-800 font-medium"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCreateForm = () => {
    if (!showCreateForm) return null;

    return (
      <div className="poll-create-form bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-900">Create New Poll</h3>
          <button
            onClick={() => setShowCreateForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question *
            </label>
            <input
              type="text"
              value={newPoll.question}
              onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
              placeholder="What would you like to ask your fans?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={newPoll.description}
              onChange={(e) => setNewPoll(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add more context to your poll..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options *
            </label>
            <div className="space-y-2">
              {newPoll.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {newPoll.options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              
              {newPoll.options.length < 8 && (
                <button
                  onClick={addOption}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                >
                  + Add Option
                </button>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newPoll.allowMultiple}
                onChange={(e) => setNewPoll(prev => ({ ...prev, allowMultiple: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Allow multiple votes</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newPoll.isPremium}
                onChange={(e) => setNewPoll(prev => ({ ...prev, isPremium: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Premium poll</span>
            </label>
          </div>

          {/* Expiration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expires (optional)
            </label>
            <input
              type="datetime-local"
              value={newPoll.expiresAt}
              onChange={(e) => setNewPoll(prev => ({ ...prev, expiresAt: e.target.value }))}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleCreatePoll}
              disabled={!newPoll.question.trim() || newPoll.options.some(opt => !opt.trim())}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Create Poll
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`polls-component ${embedded ? 'embedded' : ''} ${className}`}>
      {/* Header */}
      {!embedded && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Polls & Voting</h2>
            <p className="text-gray-600">Engage with your audience through interactive polls</p>
          </div>
          
          {creatorId === currentUserId && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 font-medium"
            >
              Create Poll
            </button>
          )}
        </div>
      )}

      {/* Create Form */}
      {renderCreateForm()}

      {/* Polls List */}
      <div className="polls-list">
        {polls.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗳️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No polls yet</h3>
            <p className="text-gray-600 mb-4">
              {creatorId === currentUserId 
                ? "Create your first poll to engage with your audience!"
                : "Check back later for new polls!"
              }
            </p>
            {creatorId === currentUserId && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 font-medium"
              >
                Create First Poll
              </button>
            )}
          </div>
        ) : (
          polls.map(renderPoll)
        )}
      </div>
    </div>
  );
}

export default Polls;
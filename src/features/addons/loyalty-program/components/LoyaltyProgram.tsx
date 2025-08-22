// 🎁 LOYALTY PROGRAM - MAIN COMPONENT

'use client';

import React, { useState, useEffect } from 'react';
import { ADDON_FLAGS } from '@/features/addons/feature-flags';
import { LoyaltyService } from '../services/loyalty-service';
import type { LoyaltyProgram as LoyaltyProgramType, LoyaltyMember } from '../types';

interface LoyaltyProgramProps {
  programId?: string;
  creatorId?: string;
  currentUserId?: string;
  embedded?: boolean;
  showStats?: boolean;
  className?: string;
}

export function LoyaltyProgram({
  programId,
  creatorId,
  currentUserId,
  embedded = false,
  showStats = true,
  className = '',
}: LoyaltyProgramProps) {
  const [program, setProgram] = useState<LoyaltyProgramType | null>(null);
  const [member, setMember] = useState<LoyaltyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Don't render if addon is disabled
  if (!ADDON_FLAGS.LOYALTY_PROGRAM) {
    return null;
  }

  useEffect(() => {
    if (programId) {
      loadProgram();
    } else if (creatorId) {
      loadCreatorPrograms();
    }
  }, [programId, creatorId]);

  useEffect(() => {
    if (program && currentUserId) {
      loadMemberData();
    }
  }, [program, currentUserId]);

  const loadProgram = async () => {
    if (!programId) return;
    
    try {
      setLoading(true);
      const programData = await LoyaltyService.getProgram(programId);
      setProgram(programData);
    } catch (err) {
      console.error('Failed to load loyalty program:', err);
      setError('Failed to load loyalty program');
    } finally {
      setLoading(false);
    }
  };

  const loadCreatorPrograms = async () => {
    if (!creatorId) return;
    
    try {
      setLoading(true);
      const programs = await LoyaltyService.getCreatorPrograms(creatorId, {
        isActive: true,
        isPublic: true,
        limit: 1,
      });
      setProgram(programs[0] || null);
    } catch (err) {
      console.error('Failed to load creator programs:', err);
      setError('Failed to load loyalty program');
    } finally {
      setLoading(false);
    }
  };

  const loadMemberData = async () => {
    if (!program || !currentUserId) return;
    
    try {
      const memberData = await LoyaltyService.getMember(program.id, currentUserId);
      setMember(memberData);
    } catch (err) {
      console.error('Failed to load member data:', err);
    }
  };

  const handleJoinProgram = async () => {
    if (!program || !currentUserId) return;
    
    try {
      const newMember = await LoyaltyService.joinProgram({
        programId: program.id,
        userId: currentUserId,
      });
      setMember(newMember);
    } catch (err) {
      console.error('Failed to join program:', err);
      setError('Failed to join loyalty program');
    }
  };

  if (loading) {
    return (
      <div className={`loyalty-program ${embedded ? 'embedded' : ''} ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className={`loyalty-program ${embedded ? 'embedded' : ''} ${className}`}>
        <div className="text-gray-500 text-sm">
          {error || 'No loyalty program available'}
        </div>
      </div>
    );
  }

  const containerClass = embedded 
    ? 'bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20'
    : 'bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100';

  return (
    <div className={`loyalty-program ${embedded ? 'embedded' : ''} ${className}`}>
      <div className={containerClass}>
        {/* Program Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {program.currency === 'hearts' && '💖'}
              {program.currency === 'stars' && '⭐'}
              {program.currency === 'gems' && '💎'}
              {program.currency === 'coins' && '🪙'}
              {program.currency === 'tokens' && '🎫'}
              {program.currency === 'points' && '🎯'}
              {program.name}
            </h3>
            {program.tagline && (
              <p className="text-sm text-gray-600 mt-1">{program.tagline}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">
              {program.totalMembers.toLocaleString()} members
            </div>
          </div>
        </div>

        {/* Member Status */}
        {member ? (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Active Member</span>
                {member.currentTier && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                    {member.currentTier}
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="font-semibold text-purple-600">
                  {member.currentPoints.toLocaleString()} {program.currencySymbol}
                </div>
                <div className="text-xs text-gray-500">
                  {member.lifetimePoints.toLocaleString()} lifetime
                </div>
              </div>
            </div>

            {/* Tier Progress */}
            {member.currentTier && member.tierProgress > 0 && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress to next tier</span>
                  <span>{member.tierProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${member.tierProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md text-sm font-medium transition-colors">
                View Rewards
              </button>
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors">
                My Stats
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              Join the loyalty program to earn {program.currencySymbol} and unlock exclusive rewards!
            </p>
            <button
              onClick={handleJoinProgram}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Join Program
            </button>
          </div>
        )}

        {/* Program Features */}
        {!embedded && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            {program.rewards.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-purple-500">🎁</span>
                <span>{program.rewards.length} Rewards</span>
              </div>
            )}
            {program.achievements.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">🏆</span>
                <span>{program.achievements.length} Achievements</span>
              </div>
            )}
            {program.tierConfig && (
              <div className="flex items-center gap-2">
                <span className="text-blue-500">⭐</span>
                <span>{program.tierConfig.tiers.length} Tiers</span>
              </div>
            )}
            {program.allowGifting && (
              <div className="flex items-center gap-2">
                <span className="text-pink-500">💖</span>
                <span>Gift Points</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoyaltyProgram;
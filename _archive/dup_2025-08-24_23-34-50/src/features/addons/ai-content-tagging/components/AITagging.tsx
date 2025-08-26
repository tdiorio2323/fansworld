// eslint-disable react-hooks/rules-of-hooks
// 🤖 AI CONTENT TAGGING - MAIN COMPONENT

'use client';

import React, { useState, useEffect } from 'react';
import { ADDON_FLAGS } from '@/features/addons/feature-flags';
import type { ContentTag, AIAnalysis } from '../types';

interface AITaggingProps {
  contentId?: string;
  contentType?: 'image' | 'video' | 'text';
  contentUrl?: string;
  existingTags?: ContentTag[];
  autoTag?: boolean;
  embedded?: boolean;
  onTagsUpdate?: (tags: ContentTag[]) => void;
  onAnalysisComplete?: (analysis: AIAnalysis) => void;
  className?: string;
}

export function AITagging({
  contentId,
  contentType,
  contentUrl,
  existingTags = [],
  autoTag = true,
  embedded = false,
  onTagsUpdate,
  onAnalysisComplete,
  className = '',
}: AITaggingProps) {
  const [tags, setTags] = useState<ContentTag[]>(existingTags);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customTag, setCustomTag] = useState('');

  // Don't render if addon is disabled
  if (!ADDON_FLAGS.AI_CONTENT_TAGGING) {
    return null;
  }

  useEffect(() => {
    if (autoTag && contentUrl && !analysis) {
      analyzeContent();
    }
  }, [contentUrl, autoTag]);

  const analyzeContent = async () => {
    if (!contentUrl || !contentType) return;

    setIsAnalyzing(true);
    try {
      // Simulate AI analysis - in real implementation would call AI service
      const mockAnalysis: AIAnalysis = {
        contentId: contentId || 'temp',
        contentType,
        confidence: 0.89,
        tags: [
          { id: '1', name: 'portrait', category: 'composition', confidence: 0.95, isAIGenerated: true },
          { id: '2', name: 'indoor', category: 'location', confidence: 0.87, isAIGenerated: true },
          { id: '3', name: 'professional', category: 'style', confidence: 0.82, isAIGenerated: true },
        ],
        metadata: {
          dominantColors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
          objects: ['person', 'background'],
          emotions: ['confident', 'friendly'],
          aestheticScore: 0.91,
          technicalQuality: 0.88,
        },
        processedAt: new Date().toISOString(),
      };

      setAnalysis(mockAnalysis);
      setTags(prev => [...prev, ...mockAnalysis.tags.filter(
        newTag => !prev.some(existingTag => existingTag.name === newTag.name)
      )]);
      onAnalysisComplete?.(mockAnalysis);
    } catch (error) {
      console.error('Failed to analyze content:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addCustomTag = () => {
    if (!customTag.trim()) return;

    const newTag: ContentTag = {
      id: Date.now().toString(),
      name: customTag.trim().toLowerCase(),
      category: 'custom',
      confidence: 1.0,
      isAIGenerated: false,
    };

    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    setCustomTag('');
    onTagsUpdate?.(updatedTags);
  };

  const removeTag = (tagId: string) => {
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    setTags(updatedTags);
    onTagsUpdate?.(updatedTags);
  };

  const acceptSuggestedTag = (suggestedTag: ContentTag) => {
    if (tags.some(tag => tag.name === suggestedTag.name)) return;

    const updatedTags = [...tags, suggestedTag];
    setTags(updatedTags);
    onTagsUpdate?.(updatedTags);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      composition: 'bg-blue-100 text-blue-800',
      location: 'bg-green-100 text-green-800',
      style: 'bg-purple-100 text-purple-800',
      mood: 'bg-pink-100 text-pink-800',
      custom: 'bg-gray-100 text-gray-800',
      default: 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  const renderTag = (tag: ContentTag) => (
    <div
      key={tag.id}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getCategoryColor(tag.category)}`}
    >
      <span>{tag.name}</span>
      {tag.isAIGenerated && (
        <span className="text-xs opacity-75">🤖</span>
      )}
      {tag.confidence < 1.0 && (
        <span className="text-xs opacity-75">
          {Math.round(tag.confidence * 100)}%
        </span>
      )}
      <button
        onClick={() => removeTag(tag.id)}
        className="text-current opacity-50 hover:opacity-75 ml-1"
      >
        ×
      </button>
    </div>
  );

  if (embedded) {
    return (
      <div className={`ai-tagging-embedded ${className}`}>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 5).map(renderTag)}
            {tags.length > 5 && (
              <span className="text-sm text-gray-500">+{tags.length - 5} more</span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`ai-tagging-component bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            🤖 AI Content Tagging
            {isAnalyzing && (
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h3>
          <p className="text-sm text-gray-600">
            Automatically detect and tag content elements
          </p>
        </div>
        
        {contentUrl && (
          <button
            onClick={analyzeContent}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-sm font-medium"
          >
            {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
          </button>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Analysis Results</h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Confidence:</span>
              <span className="font-medium text-purple-600">
                {Math.round(analysis.confidence * 100)}%
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Quality Score:</span>
              <span className="ml-2 font-medium">
                {Math.round((analysis.metadata?.technicalQuality || 0) * 100)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Aesthetic Score:</span>
              <span className="ml-2 font-medium">
                {Math.round((analysis.metadata?.aestheticScore || 0) * 100)}%
              </span>
            </div>
            {analysis.metadata?.dominantColors && (
              <div className="col-span-2">
                <span className="text-gray-600">Colors:</span>
                <div className="flex gap-2 mt-1">
                  {analysis.metadata.dominantColors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current Tags */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">Current Tags</h4>
          <span className="text-sm text-gray-500">{tags.length} tags</span>
        </div>
        
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map(renderTag)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🏷️</div>
            <p>No tags yet</p>
            <p className="text-sm">Add custom tags or analyze content to get started</p>
          </div>
        )}
      </div>

      {/* Add Custom Tag */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Add Custom Tag</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Enter custom tag..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
          />
          <button
            onClick={addCustomTag}
            disabled={!customTag.trim()}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Suggested Tags */}
      {analysis && analysis.tags.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">AI Suggestions</h4>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              {showSuggestions ? 'Hide' : 'Show'} ({analysis.tags.length})
            </button>
          </div>
          
          {showSuggestions && (
            <div className="space-y-2">
              {analysis.tags
                .filter(suggestedTag => !tags.some(tag => tag.name === suggestedTag.name))
                .map((suggestedTag) => (
                  <div
                    key={suggestedTag.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(suggestedTag.category)}`}>
                        {suggestedTag.name}
                      </div>
                      <span className="text-sm text-gray-600">
                        {suggestedTag.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round(suggestedTag.confidence * 100)}% confidence
                      </span>
                    </div>
                    <button
                      onClick={() => acceptSuggestedTag(suggestedTag)}
                      className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
                    >
                      Add
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AITagging;
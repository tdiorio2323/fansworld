'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Link as LinkIcon, 
  Video, 
  DollarSign, 
  MessageSquare, 
  Calendar,
  Music,
  ShoppingBag,
  Mail,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
  ArrowLeft,
  Trash2,
  GripVertical,
  Eye,
  Settings,
  Crown
} from 'lucide-react';

interface Feature {
  id: string;
  type: 'link' | 'video_chat' | 'tip_jar' | 'social' | 'booking' | 'music' | 'store' | 'email';
  title: string;
  subtitle?: string;
  url?: string;
  price?: number;
  enabled: boolean;
  config?: any;
}

const featureTemplates = [
  {
    type: 'link' as const,
    icon: LinkIcon,
    title: 'Custom Link',
    description: 'Add any external link',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    type: 'video_chat' as const,
    icon: Video,
    title: 'Video Chat',
    description: '1-on-1 video calls with fans',
    color: 'from-purple-500 to-pink-500'
  },
  {
    type: 'tip_jar' as const,
    icon: DollarSign,
    title: 'Tip Jar',
    description: 'Accept tips and donations',
    color: 'from-green-500 to-emerald-500'
  },
  {
    type: 'booking' as const,
    icon: Calendar,
    title: 'Booking',
    description: 'Schedule appointments',
    color: 'from-orange-500 to-red-500'
  },
  {
    type: 'music' as const,
    icon: Music,
    title: 'Music',
    description: 'Link to Spotify, Apple Music',
    color: 'from-pink-500 to-rose-500'
  },
  {
    type: 'store' as const,
    icon: ShoppingBag,
    title: 'Store',
    description: 'Sell products and merch',
    color: 'from-violet-500 to-purple-500'
  },
  {
    type: 'email' as const,
    icon: Mail,
    title: 'Email List',
    description: 'Collect email subscribers',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    type: 'social' as const,
    icon: Instagram,
    title: 'Social Media',
    description: 'Link to your socials',
    color: 'from-yellow-500 to-orange-500'
  }
];

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const addFeature = (type: Feature['type']) => {
    const template = featureTemplates.find(t => t.type === type);
    if (!template) return;

    const newFeature: Feature = {
      id: Date.now().toString(),
      type,
      title: template.title,
      subtitle: '',
      enabled: true,
    };

    // Set default configs based on type
    switch (type) {
      case 'tip_jar':
        newFeature.config = { minAmount: 5, maxAmount: 500 };
        break;
      case 'video_chat':
        newFeature.config = { pricePerMinute: 10, duration: 30 };
        break;
      case 'booking':
        newFeature.config = { duration: 60, price: 100 };
        break;
    }

    setFeatures([...features, newFeature]);
    setShowAddModal(false);
    setEditingFeature(newFeature);
  };

  const updateFeature = (id: string, updates: Partial<Feature>) => {
    setFeatures(features.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFeature = (id: string) => {
    setFeatures(features.filter(f => f.id !== id));
    setEditingFeature(null);
  };

  const moveFeature = (id: string, direction: 'up' | 'down') => {
    const index = features.findIndex(f => f.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= features.length) return;

    const newFeatures = [...features];
    [newFeatures[index], newFeatures[newIndex]] = [newFeatures[newIndex], newFeatures[index]];
    setFeatures(newFeatures);
  };

  const renderFeatureEditor = () => {
    if (!editingFeature) return null;

    const handleSave = () => {
      setEditingFeature(null);
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="glass-card p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Edit Feature</h3>
          <button
            onClick={() => setEditingFeature(null)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Title</label>
            <input
              type="text"
              value={editingFeature.title}
              onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Subtitle</label>
            <input
              type="text"
              value={editingFeature.subtitle || ''}
              onChange={(e) => setEditingFeature({ ...editingFeature, subtitle: e.target.value })}
              placeholder="Optional description"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
            />
          </div>

          {editingFeature.type === 'link' && (
            <div>
              <label className="block text-white font-medium mb-2">URL</label>
              <input
                type="url"
                value={editingFeature.url || ''}
                onChange={(e) => setEditingFeature({ ...editingFeature, url: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
              />
            </div>
          )}

          {editingFeature.type === 'tip_jar' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Min Amount ($)</label>
                <input
                  type="number"
                  value={editingFeature.config?.minAmount || 5}
                  onChange={(e) => setEditingFeature({
                    ...editingFeature,
                    config: { ...editingFeature.config, minAmount: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Max Amount ($)</label>
                <input
                  type="number"
                  value={editingFeature.config?.maxAmount || 500}
                  onChange={(e) => setEditingFeature({
                    ...editingFeature,
                    config: { ...editingFeature.config, maxAmount: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
          )}

          {editingFeature.type === 'video_chat' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Price per minute ($)</label>
                <input
                  type="number"
                  value={editingFeature.config?.pricePerMinute || 10}
                  onChange={(e) => setEditingFeature({
                    ...editingFeature,
                    config: { ...editingFeature.config, pricePerMinute: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Max duration (min)</label>
                <input
                  type="number"
                  value={editingFeature.config?.duration || 30}
                  onChange={(e) => setEditingFeature({
                    ...editingFeature,
                    config: { ...editingFeature.config, duration: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingFeature.enabled}
                onChange={(e) => setEditingFeature({ ...editingFeature, enabled: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-white">Enable this feature</span>
            </div>
            
            <button
              onClick={() => deleteFeature(editingFeature.id)}
              className="text-red-400 hover:text-red-300 flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <button
            onClick={handleSave}
            className="flex-1 glass-button-primary"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    );
  };

  const renderPreview = () => {
    return (
      <div className="glass-card p-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Crown size={32} className="text-yellow-400" />
          </div>
          <h2 className="text-xl font-bold text-white">@username</h2>
          <p className="text-gray-300">Creator Bio Preview</p>
        </div>

        <div className="space-y-3">
          {features.filter(f => f.enabled).map((feature) => {
            const template = featureTemplates.find(t => t.type === feature.type);
            if (!template) return null;

            const IconComponent = template.icon;

            return (
              <div
                key={feature.id}
                className={`w-full p-4 rounded-xl bg-gradient-to-r ${template.color} text-white font-medium text-center cursor-pointer hover:scale-105 transition-transform`}
              >
                <div className="flex items-center justify-center gap-3">
                  <IconComponent size={20} />
                  <span>{feature.title}</span>
                  {feature.type === 'tip_jar' && <span className="text-sm opacity-80">($5-$500)</span>}
                  {feature.type === 'video_chat' && <span className="text-sm opacity-80">(${feature.config?.pricePerMinute}/min)</span>}
                </div>
                {feature.subtitle && (
                  <p className="text-sm opacity-80 mt-1">{feature.subtitle}</p>
                )}
              </div>
            );
          })}
          
          {features.filter(f => f.enabled).length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <Plus size={32} className="mx-auto mb-2 opacity-50" />
              <p>Add features to see preview</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-noir">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <nav className="relative z-50 p-8">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-black text-gradient-gold tracking-tight">
            CABANA
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`glass-button flex items-center gap-2 ${previewMode ? 'bg-yellow-400/20' : ''}`}
            >
              <Eye size={16} />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-display mb-4">
              Build Your
              <span className="text-gradient-gold ml-4">Creator Page</span>
            </h1>
            <p className="text-subtitle text-gray-300">
              Add features to monetize your audience and engage with fans
            </p>
          </div>

          <div className={`grid gap-8 ${editingFeature ? 'grid-cols-1 lg:grid-cols-3' : previewMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            
            {/* Main Content */}
            <div className={editingFeature ? 'lg:col-span-2' : 'max-w-4xl mx-auto'}>
              
              {previewMode ? (
                renderPreview()
              ) : (
                <>
                  {/* Add Feature Button */}
                  <div className="mb-8">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="glass-button-primary w-full lg:w-auto flex items-center justify-center gap-3 text-lg py-4 px-8"
                    >
                      <Plus size={24} />
                      Add Feature
                    </button>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4">
                    {features.map((feature, index) => {
                      const template = featureTemplates.find(t => t.type === feature.type);
                      if (!template) return null;

                      const IconComponent = template.icon;

                      return (
                        <motion.div
                          key={feature.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="glass-card p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <GripVertical className="text-gray-400 cursor-move" size={16} />
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center`}>
                                <IconComponent size={20} className="text-white" />
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-white font-medium">{feature.title}</h3>
                              {feature.subtitle && (
                                <p className="text-gray-400 text-sm">{feature.subtitle}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={feature.enabled}
                                onChange={(e) => updateFeature(feature.id, { enabled: e.target.checked })}
                                className="w-4 h-4"
                              />
                              <span className="text-gray-300 text-sm">Enabled</span>
                            </label>
                            
                            <div className="flex gap-1">
                              <button
                                onClick={() => moveFeature(feature.id, 'up')}
                                disabled={index === 0}
                                className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => moveFeature(feature.id, 'down')}
                                disabled={index === features.length - 1}
                                className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
                              >
                                ↓
                              </button>
                            </div>

                            <button
                              onClick={() => setEditingFeature(feature)}
                              className="glass-button text-sm"
                            >
                              <Settings size={16} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}

                    {features.length === 0 && (
                      <div className="glass-card p-12 text-center">
                        <Plus size={48} className="mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-white mb-2">Add Your First Feature</h3>
                        <p className="text-gray-300 mb-6">
                          Start building your creator page by adding links, video chat, tip jar, and more
                        </p>
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="glass-button-primary"
                        >
                          <Plus size={20} />
                          Add Feature
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Feature Editor Sidebar */}
            <AnimatePresence>
              {editingFeature && (
                <div className="lg:col-span-1">
                  {renderFeatureEditor()}
                </div>
              )}
            </AnimatePresence>

            {/* Preview Sidebar */}
            {previewMode && !editingFeature && (
              <div className="lg:col-span-1">
                {renderPreview()}
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-700 max-w-4xl mx-auto">
            <button
              onClick={() => window.history.back()}
              className="glass-button flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Setup
            </button>
            
            <button
              onClick={() => {
                // Navigate to final page generation
                window.location.href = '/enter/complete';
              }}
              className="glass-button-primary text-lg px-8 py-4"
            >
              Create My Page
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Add Feature Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Add Feature</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featureTemplates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <button
                      key={template.type}
                      onClick={() => addFeature(template.type)}
                      className="glass-card p-6 text-left hover:scale-105 transition-transform group"
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <IconComponent size={24} className="text-white" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">{template.title}</h3>
                      <p className="text-gray-400 text-sm">{template.description}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
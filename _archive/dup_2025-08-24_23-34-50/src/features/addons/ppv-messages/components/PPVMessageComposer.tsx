//  PPV MESSAGE COMPOSER - Create Premium Content

import React, { useState, useRef, useCallback } from 'react';
import { Plus, Upload, X, DollarSign, Eye, Calendar, Target, Tag, Image, Video, FileText, Music, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { PPVMessagesService } from '../services/ppv-messages-service';
import type { PPVMessage, PPVCreateRequest, PPVMessageContent } from '../types';
import { 
  PPV_PRICING_TIERS, 
  DEFAULT_PPV_CONFIG, 
  CONTENT_TYPE_CONFIG, 
  PPV_POPULAR_TAGS,
  formatPrice,
  calculateCreatorEarnings,
  getFileTypeFromMime,
  isFileTypeSupported,
  formatFileSize 
} from '../config';

interface PPVMessageComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageCreated: (message: PPVMessage) => void;
  creatorId: string;
}

export const PPVMessageComposer: React.FC<PPVMessageComposerProps> = ({
  isOpen,
  onClose,
  onMessageCreated,
  creatorId
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(299); // Default $2.99
  const [previewText, setPreviewText] = useState('');
  const [content, setContent] = useState<Omit<PPVMessageContent, 'id'>[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [viewLimitEnabled, setViewLimitEnabled] = useState(false);
  const [maxViews, setMaxViews] = useState<number | undefined>();
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [activeContentTab, setActiveContentTab] = useState<'text' | 'media' | 'files'>('text');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice(299);
    setPreviewText('');
    setContent([]);
    setTags([]);
    setTagInput('');
    setExpirationEnabled(false);
    setExpiresAt('');
    setViewLimitEnabled(false);
    setMaxViews(undefined);
    setThumbnailUrl('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your message',
        variant: 'destructive'
      });
      return;
    }

    if (content.length === 0) {
      toast({
        title: 'Content required',
        description: 'Please add at least one piece of content',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const request: PPVCreateRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        price,
        content,
        thumbnailUrl: thumbnailUrl || undefined,
        previewText: previewText.trim() || undefined,
        expiresAt: expirationEnabled && expiresAt ? expiresAt : undefined,
        maxViews: viewLimitEnabled ? maxViews : undefined,
        tags: tags.length > 0 ? tags : undefined,
      };

      const newMessage = await PPVMessagesService.createMessage(request, creatorId);
      onMessageCreated(newMessage);
      handleClose();

    } catch (error: any) {
      toast({
        title: 'Failed to create message',
        description: error.message || 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePriceSelection = (selectedPrice: number) => {
    setPrice(selectedPrice);
  };

  const addTextContent = () => {
    const textContent = document.getElementById('text-content-input') as HTMLTextAreaElement;
    if (!textContent?.value.trim()) return;

    const newContent: Omit<PPVMessageContent, 'id'> = {
      type: 'text',
      content: textContent.value.trim(),
      order: content.length,
    };

    setContent(prev => [...prev, newContent]);
    textContent.value = '';
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      if (!isFileTypeSupported(file.type)) {
        toast({
          title: 'Unsupported file type',
          description: `${file.name}: ${file.type} is not supported`,
          variant: 'destructive'
        });
        return false;
      }

      const fileType = getFileTypeFromMime(file.type);
      const maxSize = CONTENT_TYPE_CONFIG[fileType].maxSize;
      
      if (file.size > maxSize) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds the ${formatFileSize(maxSize)} limit`,
          variant: 'destructive'
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Simulate file upload (in real implementation, upload to storage service)
    for (const file of validFiles) {
      const fileId = `upload-${Date.now()}-${Math.random()}`;
      setUploadingFiles(prev => new Set([...prev, fileId]));

      try {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Simulate successful upload
        const mockUrl = `https://storage.example.com/ppv/${fileId}-${file.name}`;
        
        const fileType = getFileTypeFromMime(file.type);
        const newContent: Omit<PPVMessageContent, 'id'> = {
          type: fileType,
          content: mockUrl,
          caption: '',
          thumbnail: fileType === 'video' ? `${mockUrl}-thumb.jpg` : undefined,
          duration: fileType === 'video' || fileType === 'audio' ? Math.floor(Math.random() * 300) + 30 : undefined,
          fileSize: file.size,
          mimeType: file.type,
          order: content.length,
        };

        setContent(prev => [...prev, newContent]);
        
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive'
        });
      } finally {
        setUploadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }
    }
  }, [content.length, toast]);

  const removeContent = (index: number) => {
    setContent(prev => prev.filter((_, i) => i !== index));
  };

  const moveContent = (index: number, direction: 'up' | 'down') => {
    setContent(prev => {
      const newContent = [...prev];
      if (direction === 'up' && index > 0) {
        [newContent[index], newContent[index - 1]] = [newContent[index - 1], newContent[index]];
      } else if (direction === 'down' && index < newContent.length - 1) {
        [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]];
      }
      // Update order numbers
      newContent.forEach((item, i) => {
        item.order = i;
      });
      return newContent;
    });
  };

  const updateContentCaption = (index: number, caption: string) => {
    setContent(prev => prev.map((item, i) => 
      i === index ? { ...item, caption } : item
    ));
  };

  const addTag = () => {
    if (!tagInput.trim() || tags.includes(tagInput.trim().toLowerCase())) return;
    
    const newTag = tagInput.trim().toLowerCase();
    if (tags.length >= 10) {
      toast({
        title: 'Too many tags',
        description: 'Maximum 10 tags allowed',
        variant: 'destructive'
      });
      return;
    }

    setTags(prev => [...prev, newTag]);
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const addPopularTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 10) {
      setTags(prev => [...prev, tag]);
    }
  };

  const getContentTypeIcon = (type: PPVMessageContent['type']) => {
    switch (type) {
      case 'text': return <FileText className=\"w-4 h-4\" />;
      case 'image': return <Image className=\"w-4 h-4\" />;
      case 'video': return <Video className=\"w-4 h-4\" />;
      case 'audio': return <Music className=\"w-4 h-4\" />;
      case 'file': return <File className=\"w-4 h-4\" />;
    }
  };

  const creatorEarnings = calculateCreatorEarnings(price);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className=\"bg-gradient-to-br from-purple-900/95 to-pink-900/95 border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto\">
        <DialogHeader>
          <DialogTitle className=\"text-2xl font-bold text-white flex items-center gap-2\">
            <Plus className=\"w-6 h-6\" />
            Create PPV Message
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className=\"space-y-6\">
          {/* Title and Description */}
          <div className=\"space-y-4\">
            <div>
              <label className=\"block text-white font-semibold mb-2\">
                Title <span className=\"text-red-400\">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder=\"Enter a compelling title for your premium message...\"
                className=\"bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400\"
                maxLength={200}
                required
              />
              <div className=\"text-right text-xs text-gray-400 mt-1\">
                {title.length}/200
              </div>
            </div>

            <div>
              <label className=\"block text-white font-semibold mb-2\">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder=\"Describe what buyers will get for their purchase...\"
                className=\"bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400\"
                rows={3}
                maxLength={500}
              />
              <div className=\"text-right text-xs text-gray-400 mt-1\">
                {description.length}/500
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className=\"space-y-4\">
            <label className=\"block text-white font-semibold\">
              Price <span className=\"text-red-400\">*</span>
            </label>

            {/* Quick Price Selection */}
            <div className=\"grid grid-cols-3 sm:grid-cols-4 gap-3\">
              {PPV_PRICING_TIERS.map((tier) => (
                <Button
                  key={tier.value}
                  type=\"button\"
                  variant={price === tier.value ? 'default' : 'outline'}
                  onClick={() => handlePriceSelection(tier.value)}
                  className={price === tier.value 
                    ? 'bg-purple-600 text-white' 
                    : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'}
                >
                  {tier.label}
                </Button>
              ))}
            </div>

            {/* Custom Price Input */}
            <div className=\"flex items-center gap-3\">
              <div className=\"flex-1\">
                <Input
                  type=\"number\"
                  value={price / 100}
                  onChange={(e) => {
                    const dollars = parseFloat(e.target.value) || 0;
                    setPrice(Math.max(99, Math.min(99999, Math.round(dollars * 100))));
                  }}
                  min={DEFAULT_PPV_CONFIG.minPrice / 100}
                  max={DEFAULT_PPV_CONFIG.maxPrice / 100}
                  step={0.01}
                  className=\"bg-black/20 border-purple-500/30 text-white\"
                />
              </div>
              <div className=\"text-sm text-gray-400\">
                You earn: <span className=\"text-green-400 font-semibold\">{formatPrice(creatorEarnings)}</span>
              </div>
            </div>
          </div>

          {/* Preview Text */}
          <div>
            <label className=\"block text-white font-semibold mb-2\">
              Preview Text (Optional)
            </label>
            <Input
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder=\"First few words users see before purchasing...\"
              className=\"bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400\"
              maxLength={DEFAULT_PPV_CONFIG.maxPreviewLength}
            />
            <div className=\"text-xs text-gray-400 mt-1\">
              This text is visible to users before they purchase. {previewText.length}/{DEFAULT_PPV_CONFIG.maxPreviewLength} characters.
            </div>
          </div>

          {/* Content */}
          <div className=\"space-y-4\">
            <label className=\"block text-white font-semibold\">
              Content <span className=\"text-red-400\">*</span>
            </label>

            {/* Content Type Tabs */}
            <div className=\"flex gap-2\">
              <Button
                type=\"button\"
                variant={activeContentTab === 'text' ? 'default' : 'outline'}
                onClick={() => setActiveContentTab('text')}
                className={activeContentTab === 'text' 
                  ? 'bg-purple-600 text-white' 
                  : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'}
              >
                <FileText className=\"w-4 h-4 mr-2\" />
                Text
              </Button>
              <Button
                type=\"button\"
                variant={activeContentTab === 'media' ? 'default' : 'outline'}
                onClick={() => setActiveContentTab('media')}
                className={activeContentTab === 'media' 
                  ? 'bg-purple-600 text-white' 
                  : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'}
              >
                <Image className=\"w-4 h-4 mr-2\" />
                Media
              </Button>
              <Button
                type=\"button\"
                variant={activeContentTab === 'files' ? 'default' : 'outline'}
                onClick={() => setActiveContentTab('files')}
                className={activeContentTab === 'files' 
                  ? 'bg-purple-600 text-white' 
                  : 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10'}
              >
                <File className=\"w-4 h-4 mr-2\" />
                Files
              </Button>
            </div>

            {/* Text Content Tab */}
            {activeContentTab === 'text' && (
              <div className=\"space-y-3\">
                <Textarea
                  id=\"text-content-input\"
                  placeholder=\"Write your premium text content here...\"
                  className=\"bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400\"
                  rows={4}
                />
                <Button
                  type=\"button\"
                  onClick={addTextContent}
                  className=\"bg-purple-600 hover:bg-purple-700 text-white\"
                >
                  <Plus className=\"w-4 h-4 mr-2\" />
                  Add Text Content
                </Button>
              </div>
            )}

            {/* Media/Files Upload Tab */}
            {(activeContentTab === 'media' || activeContentTab === 'files') && (
              <div className=\"space-y-3\">
                <div
                  className=\"border-2 border-dashed border-purple-500/30 rounded-xl p-6 text-center hover:border-purple-500/50 transition-colors cursor-pointer\"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      handleFileUpload(files);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Upload className=\"w-8 h-8 text-purple-400 mx-auto mb-3\" />
                  <div className=\"text-white font-semibold mb-2\">
                    Upload {activeContentTab === 'media' ? 'Images/Videos' : 'Files'}
                  </div>
                  <div className=\"text-gray-400 text-sm\">
                    Click to browse or drag and drop files here
                  </div>
                  <div className=\"text-xs text-gray-500 mt-2\">
                    Max size: {formatFileSize(DEFAULT_PPV_CONFIG.maxFileSize)}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type=\"file\"
                  multiple
                  accept={activeContentTab === 'media' 
                    ? 'image/*,video/*' 
                    : '.pdf,.txt,.doc,.docx,audio/*'}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileUpload(e.target.files);
                    }
                  }}
                  className=\"hidden\"
                />

                {uploadingFiles.size > 0 && (
                  <div className=\"text-sm text-gray-400\">
                    Uploading {uploadingFiles.size} file{uploadingFiles.size !== 1 ? 's' : ''}...
                  </div>
                )}
              </div>
            )}

            {/* Content Preview */}
            {content.length > 0 && (
              <div className=\"space-y-3\">
                <div className=\"text-white font-semibold\">Content Preview ({content.length}/10)</div>
                {content.map((item, index) => (
                  <ContentPreview
                    key={index}
                    content={item}
                    index={index}
                    onRemove={() => removeContent(index)}
                    onMoveUp={index > 0 ? () => moveContent(index, 'up') : undefined}
                    onMoveDown={index < content.length - 1 ? () => moveContent(index, 'down') : undefined}
                    onCaptionChange={(caption) => updateContentCaption(index, caption)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className=\"space-y-4\">
            <label className=\"block text-white font-semibold\">Tags</label>
            
            <div className=\"flex gap-2\">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder=\"Add tags to help users find your content...\"
                className=\"flex-1 bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400\"
              />
              <Button
                type=\"button\"
                onClick={addTag}
                className=\"bg-purple-600 hover:bg-purple-700 text-white\"
              >
                <Plus className=\"w-4 h-4\" />
              </Button>
            </div>

            {/* Current Tags */}
            {tags.length > 0 && (
              <div className=\"flex flex-wrap gap-2\">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    className=\"bg-purple-500/20 text-purple-300 border-purple-500/30\"
                  >
                    #{tag}
                    <button
                      type=\"button\"
                      onClick={() => removeTag(tag)}
                      className=\"ml-2 text-purple-400 hover:text-white\"
                    >
                      <X className=\"w-3 h-3\" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Popular Tags */}
            <div>
              <div className=\"text-sm text-gray-400 mb-2\">Popular tags:</div>
              <div className=\"flex flex-wrap gap-2\">
                {PPV_POPULAR_TAGS.slice(0, 12).map((tag) => (
                  <Button
                    key={tag}
                    type=\"button\"
                    variant=\"outline\"
                    size=\"sm\"
                    onClick={() => addPopularTag(tag)}
                    disabled={tags.includes(tag) || tags.length >= 10}
                    className=\"border-purple-500/30 text-purple-400 hover:bg-purple-500/10 text-xs\"
                  >
                    <Tag className=\"w-3 h-3 mr-1\" />
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className=\"space-y-4\">
            <label className=\"block text-white font-semibold\">Advanced Settings</label>

            {/* Expiration */}
            <div className=\"flex items-center gap-3\">
              <input
                type=\"checkbox\"
                id=\"expiration-enabled\"
                checked={expirationEnabled}
                onChange={(e) => setExpirationEnabled(e.target.checked)}
                className=\"rounded border-purple-500/30\"
              />
              <label htmlFor=\"expiration-enabled\" className=\"text-white cursor-pointer\">
                Set expiration date
              </label>
              {expirationEnabled && (
                <Input
                  type=\"datetime-local\"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className=\"ml-3 bg-black/20 border-purple-500/30 text-white\"
                />
              )}
            </div>

            {/* View Limit */}
            <div className=\"flex items-center gap-3\">
              <input
                type=\"checkbox\"
                id=\"view-limit-enabled\"
                checked={viewLimitEnabled}
                onChange={(e) => setViewLimitEnabled(e.target.checked)}
                className=\"rounded border-purple-500/30\"
              />
              <label htmlFor=\"view-limit-enabled\" className=\"text-white cursor-pointer\">
                Limit number of views
              </label>
              {viewLimitEnabled && (
                <Input
                  type=\"number\"
                  value={maxViews || ''}
                  onChange={(e) => setMaxViews(parseInt(e.target.value) || undefined)}
                  min={1}
                  max={1000000}
                  placeholder=\"Max views\"
                  className=\"ml-3 w-32 bg-black/20 border-purple-500/30 text-white\"
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className=\"flex gap-3 pt-4 border-t border-white/10\">
            <Button
              type=\"submit\"
              disabled={isSubmitting || content.length === 0 || !title.trim()}
              className=\"flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-12\"
            >
              {isSubmitting ? (
                <>
                  <div className=\"w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2\" />
                  Creating Message...
                </>
              ) : (
                <>
                  <DollarSign className=\"w-5 h-5 mr-2\" />
                  Create PPV Message ({formatPrice(price)})
                </>
              )}
            </Button>

            <Button
              type=\"button\"
              variant=\"outline\"
              onClick={handleClose}
              className=\"border-gray-500/30 text-gray-400 hover:bg-gray-500/10\"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ==================== CONTENT PREVIEW COMPONENT ====================

interface ContentPreviewProps {
  content: Omit<PPVMessageContent, 'id'>;
  index: number;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onCaptionChange: (caption: string) => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  content,
  index,
  onRemove,
  onMoveUp,
  onMoveDown,
  onCaptionChange
}) => {
  const typeConfig = CONTENT_TYPE_CONFIG[content.type];

  const renderContentPreview = () => {
    switch (content.type) {
      case 'text':
        return (
          <div className=\"p-3 bg-white/5 rounded border-l-4 border-blue-400\">
            <div className=\"text-white text-sm line-clamp-3\">{content.content}</div>
          </div>
        );
      
      case 'image':
        return (
          <div className=\"w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-lg flex items-center justify-center\">
            <Image className=\"w-8 h-8 text-white\" />
          </div>
        );
      
      case 'video':
        return (
          <div className=\"w-16 h-16 bg-gradient-to-br from-red-600 to-red-400 rounded-lg flex items-center justify-center\">
            <Video className=\"w-8 h-8 text-white\" />
          </div>
        );
      
      case 'audio':
        return (
          <div className=\"w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center\">
            <Music className=\"w-8 h-8 text-white\" />
          </div>
        );
      
      case 'file':
        return (
          <div className=\"w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-lg flex items-center justify-center\">
            <File className=\"w-8 h-8 text-white\" />
          </div>
        );
    }
  };

  return (
    <div className=\"p-4 bg-black/20 rounded-xl border border-white/10\">
      <div className=\"flex items-start gap-4\">
        {/* Content Preview */}
        <div className=\"flex-shrink-0\">
          {renderContentPreview()}
        </div>

        {/* Content Info */}
        <div className=\"flex-1 min-w-0\">
          <div className=\"flex items-center gap-2 mb-2\">
            <div className={`flex items-center gap-1 text-sm ${typeConfig.color}`}>
              {React.createElement(typeConfig.icon.type, { className: \"w-4 h-4\" })}
              <span>{typeConfig.label}</span>
            </div>
            
            {content.fileSize && (
              <Badge variant=\"secondary\" className=\"bg-black/20 text-gray-300 text-xs\">
                {formatFileSize(content.fileSize)}
              </Badge>
            )}
            
            {content.duration && (
              <Badge variant=\"secondary\" className=\"bg-black/20 text-gray-300 text-xs\">
                {Math.floor(content.duration / 60)}:{(content.duration % 60).toString().padStart(2, '0')}
              </Badge>
            )}
          </div>

          {content.type !== 'text' && (
            <Input
              value={content.caption || ''}
              onChange={(e) => onCaptionChange(e.target.value)}
              placeholder=\"Add a caption (optional)...\"
              className=\"bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400 text-sm\"
            />
          )}
        </div>

        {/* Actions */}
        <div className=\"flex flex-col gap-1\">
          {onMoveUp && (
            <Button
              type=\"button\"
              variant=\"outline\"
              size=\"sm\"
              onClick={onMoveUp}
              className=\"border-purple-500/30 text-purple-400 hover:bg-purple-500/10 h-8 w-8 p-0\"
            >
              
            </Button>
          )}
          
          {onMoveDown && (
            <Button
              type=\"button\"
              variant=\"outline\"
              size=\"sm\"
              onClick={onMoveDown}
              className=\"border-purple-500/30 text-purple-400 hover:bg-purple-500/10 h-8 w-8 p-0\"
            >
              
            </Button>
          )}
          
          <Button
            type=\"button\"
            variant=\"outline\"
            size=\"sm\"
            onClick={onRemove}
            className=\"border-red-500/30 text-red-400 hover:bg-red-500/10 h-8 w-8 p-0\"
          >
            <X className=\"w-4 h-4\" />
          </Button>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { X, Download, ExternalLink, Lock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface MediaPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    id: string;
    title: string;
    description: string | null;
    content_type: string;
    file_url: string | null;
    is_premium: boolean | null;
    price: number | null;
    created_at: string;
  } | null;
  canAccess?: boolean;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ 
  isOpen, 
  onClose, 
  content,
  canAccess = true 
}) => {
  const [imageError, setImageError] = useState(false);

  if (!content) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async () => {
    if (!content.file_url) return;
    
    try {
      const response = await fetch(content.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${content.title}.${content.content_type === 'image' ? 'jpg' : 'mp4'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const isPremium = content.is_premium;
  const hasAccess = canAccess || !isPremium;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="flex items-center gap-2 text-xl">
                {content.title}
                {isPremium && (
                  <Badge variant="secondary" className="ml-2">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ${content.price?.toFixed(2)}
                  </Badge>
                )}
              </DialogTitle>
              {content.description && (
                <DialogDescription className="mt-2 text-base">
                  {content.description}
                </DialogDescription>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Uploaded on {formatDate(content.created_at)}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {!hasAccess ? (
            // Premium content preview for non-subscribers
            <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
              <div className="text-center">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Premium Content</h3>
                <p className="text-muted-foreground mb-4">
                  Subscribe to access this exclusive content
                </p>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${content.price?.toFixed(2)}
                </Badge>
              </div>
            </div>
          ) : content.content_type === 'image' ? (
            // Image preview
            <div className="flex justify-center">
              {imageError ? (
                <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                  <p className="text-muted-foreground">Unable to load image</p>
                </div>
              ) : (
                <img
                  src={content.file_url || ''}
                  alt={content.title}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
          ) : (
            // Video preview
            <div className="flex justify-center">
              <video
                controls
                className="max-w-full max-h-[60vh] rounded-lg"
                preload="metadata"
              >
                <source src={content.file_url || ''} type={`video/${content.content_type}`} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        {hasAccess && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => content.file_url && window.open(content.file_url, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
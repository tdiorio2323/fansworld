import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Eye, DollarSign, Image, Video, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Content {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  file_url: string | null;
  is_premium: boolean | null;
  price: number | null;
  created_at: string;
  updated_at: string;
}

interface ContentManagerProps {
  refreshTrigger?: number;
}

export const ContentManager: React.FC<ContentManagerProps> = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    isPremium: false,
    price: ''
  });

  const loadContent = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('creator_content')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Error",
        description: "Failed to load your content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadContent();
  }, [user, refreshTrigger, loadContent]);

  const handleEdit = (item: Content) => {
    setEditingContent(item);
    setEditForm({
      title: item.title,
      description: item.description || '',
      isPremium: item.is_premium || false,
      price: item.price ? item.price.toString() : ''
    });
  };

  const handleUpdate = async () => {
    if (!editingContent) return;

    try {
      const { error } = await supabase
        .from('creator_content')
        .update({
          title: editForm.title,
          description: editForm.description || null,
          is_premium: editForm.isPremium,
          price: editForm.isPremium ? parseFloat(editForm.price) || 0 : null
        })
        .eq('id', editingContent.id);

      if (error) throw error;

      toast({
        title: "Content updated",
        description: "Your content has been updated successfully."
      });

      setEditingContent(null);
      loadContent();
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Update failed",
        description: "Failed to update content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Get the content to find the file URL
      const contentToDelete = content.find(c => c.id === id);
      
      // Delete from database
      const { error } = await supabase
        .from('creator_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete file from storage if it exists
      if (contentToDelete?.file_url) {
        const fileName = contentToDelete.file_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('creator-content')
            .remove([`${user?.id}/${fileName}`]);
        }
      }

      toast({
        title: "Content deleted",
        description: "Your content has been deleted successfully."
      });

      setDeletingId(null);
      loadContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Content ({content.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {content.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No content uploaded yet.</p>
              <p className="text-sm">Upload your first piece of content to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {content.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  {/* Content Icon */}
                  <div className="flex-shrink-0">
                    {item.content_type === 'image' ? (
                      <Image className="h-8 w-8 text-blue-500" />
                    ) : (
                      <Video className="h-8 w-8 text-purple-500" />
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{item.title}</h3>
                      {item.is_premium && (
                        <Badge variant="secondary" className="text-xs">
                          <DollarSign className="h-3 w-3 mr-1" />
                          ${item.price?.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {item.file_url && (
                        <DropdownMenuItem onClick={() => window.open(item.file_url!, '_blank')}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeletingId(item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingContent} onOpenChange={() => setEditingContent(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>
              Update your content details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-premium"
                checked={editForm.isPremium}
                onCheckedChange={(checked) => setEditForm(prev => ({ 
                  ...prev, 
                  isPremium: checked,
                  price: checked ? prev.price : ''
                }))}
              />
              <Label htmlFor="edit-premium">Premium Content</Label>
            </div>
            {editForm.isPremium && (
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-10"
                    value={editForm.price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingContent(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Update Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your content
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
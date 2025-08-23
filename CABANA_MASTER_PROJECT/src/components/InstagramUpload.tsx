import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  X, 
  DollarSign, 
  Lock, 
  Users, 
  Eye,
  Sparkles,
  Camera,
  FileText,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
  duration?: string;
}

export default function InstagramUpload() {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [caption, setCaption] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [isSubscriberOnly, setIsSubscriberOnly] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      duration: file.type.startsWith('video/') ? '0:00' : undefined
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image or video to upload.",
        variant: "destructive"
      });
      return;
    }

    if (isPaid && !price) {
      toast({
        title: "Price required",
        description: "Please set a price for paid content.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Content uploaded!",
        description: "Your content has been successfully uploaded and is now live.",
      });

      // Reset form
      setUploadedFiles([]);
      setCaption("");
      setIsPaid(false);
      setPrice("");
      setIsSubscriberOnly(false);
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const contentTypes = [
    { id: 'free', label: 'Free', icon: Users, description: 'Visible to everyone' },
    { id: 'subscriber', label: 'Subscribers Only', icon: Lock, description: 'Only your subscribers can see' },
    { id: 'paid', label: 'Pay-per-view', icon: DollarSign, description: 'Users pay to unlock' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Create New Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
                uploadedFiles.length > 0 && "border-green-500 bg-green-50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileInput}
                className="hidden"
              />
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {uploadedFiles.length > 0 ? 'Add more files' : 'Upload your content'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Drag and drop or click to select images and videos
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {file.type === 'image' ? (
                        <img 
                          src={file.url} 
                          alt="Upload preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center relative">
                          <Video className="w-8 h-8 text-gray-400" />
                          <video 
                            src={file.url} 
                            className="absolute inset-0 w-full h-full object-cover"
                            muted
                          />
                        </div>
                      )}
                    </div>
                    
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    
                    <div className="absolute bottom-2 left-2 right-2 text-xs text-white bg-black/60 rounded px-2 py-1">
                      {file.type === 'video' ? (
                        <div className="flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          {file.duration || 'Video'}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          Image
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-20"
                maxLength={2000}
              />
              <div className="text-right text-sm text-gray-500">
                {caption.length}/2000
              </div>
            </div>

            {/* Content Type Selection */}
            <div className="space-y-3">
              <Label>Content Type</Label>
              <div className="space-y-2">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = 
                    (type.id === 'free' && !isPaid && !isSubscriberOnly) ||
                    (type.id === 'subscriber' && isSubscriberOnly) ||
                    (type.id === 'paid' && isPaid);
                  
                  return (
                    <div
                      key={type.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => {
                        setIsPaid(type.id === 'paid');
                        setIsSubscriberOnly(type.id === 'subscriber');
                      }}
                    >
                      <Icon className={cn("w-5 h-5", isSelected ? "text-blue-600" : "text-gray-400")} />
                      <div className="flex-1">
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Input for Paid Content */}
            {isPaid && (
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="9.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="pl-10"
                    min="0.99"
                    step="0.01"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Set a price between $0.99 and $99.99
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isUploading || uploadedFiles.length === 0}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isPaid ? `Publish for ${price ? `$${price}` : '$0.99'}` : 'Publish Post'}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
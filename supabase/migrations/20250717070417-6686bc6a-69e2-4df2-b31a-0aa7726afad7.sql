-- Create storage buckets for creator content
INSERT INTO storage.buckets (id, name, public) VALUES ('creator-content', 'creator-content', true);

-- Create storage policies for creator content
CREATE POLICY "Creators can upload their own content" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'creator-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Creators can view their own content" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'creator-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Creators can update their own content" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'creator-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Creators can delete their own content" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'creator-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public content is viewable by everyone" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'creator-content');
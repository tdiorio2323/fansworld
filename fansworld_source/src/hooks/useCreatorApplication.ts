import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CreatorApplication {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  age: number;
  location: string;
  primary_platform: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  onlyfans_handle?: string;
  twitch_handle?: string;
  youtube_handle?: string;
  total_followers: number;
  monthly_earnings: number;
  content_niche: string;
  career_goals: string;
  current_challenges: string;
  previous_management: string;
  interested_package: string;
  over_18: boolean;
  agrees_to_terms: boolean;
  agrees_to_background: boolean;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'on_hold';
  progress_stage: number;
  estimated_response_days: number;
  created_at: string;
  updated_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
}

export interface CreatorApplicationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  location: string;
  primaryPlatform: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  onlyfansHandle?: string;
  twitchHandle?: string;
  youtubeHandle?: string;
  totalFollowers: string;
  monthlyEarnings: string;
  contentNiche: string;
  careerGoals: string;
  currentChallenges: string;
  previousManagement: string;
  interestedPackage: string;
  over18: boolean;
  agreesToTerms: boolean;
  agreesToBackground: boolean;
}

export const useCreatorApplication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: application,
    isLoading,
    error
  } = useQuery({
    queryKey: ['creator-application', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('creator_applications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as CreatorApplication | null;
    },
    enabled: !!user?.id,
  });

  const submitApplication = useMutation({
    mutationFn: async (formData: CreatorApplicationForm) => {
      if (!user?.id) {
        throw new Error('User must be logged in to submit application');
      }

      const applicationData = {
        user_id: user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        age: parseInt(formData.age),
        location: formData.location,
        primary_platform: formData.primaryPlatform,
        instagram_handle: formData.instagramHandle,
        tiktok_handle: formData.tiktokHandle,
        onlyfans_handle: formData.onlyfansHandle,
        twitch_handle: formData.twitchHandle,
        youtube_handle: formData.youtubeHandle,
        total_followers: parseInt(formData.totalFollowers),
        monthly_earnings: parseInt(formData.monthlyEarnings),
        content_niche: formData.contentNiche,
        career_goals: formData.careerGoals,
        current_challenges: formData.currentChallenges,
        previous_management: formData.previousManagement,
        interested_package: formData.interestedPackage,
        over_18: formData.over18,
        agrees_to_terms: formData.agreesToTerms,
        agrees_to_background: formData.agreesToBackground,
      };

      const { data, error } = await supabase
        .from('creator_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as CreatorApplication;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-application'] });
    },
  });

  const updateApplication = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreatorApplication> }) => {
      const { data, error } = await supabase
        .from('creator_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as CreatorApplication;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-application'] });
    },
  });

  return {
    application,
    isLoading,
    error,
    submitApplication,
    updateApplication,
  };
};

export const useCreatorMilestones = () => {
  const { user } = useAuth();

  const {
    data: milestones,
    isLoading,
    error
  } = useQuery({
    queryKey: ['creator-milestones', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('creator_milestones')
        .select('*')
        .eq('creator_id', user.id)
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  return {
    milestones,
    isLoading,
    error,
  };
};

export const useCreatorGoals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: goals,
    isLoading,
    error
  } = useQuery({
    queryKey: ['creator-goals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('creator_goals')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  const updateGoal = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('creator_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-goals'] });
    },
  });

  return {
    goals,
    isLoading,
    error,
    updateGoal,
  };
};
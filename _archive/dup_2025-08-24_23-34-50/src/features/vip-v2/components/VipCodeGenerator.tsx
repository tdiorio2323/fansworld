/**
 * VIP Code Generator Component - Creator interface for managing VIP v2 codes
 * FansWorld Creator Platform
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, Copy, Eye, EyeOff, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { useFlag } from '@/hooks/useFlag';
import { vipV2Service, type CreateVipCodeData } from '../services/vipService';
import { useAuth } from '@/hooks/useAuth';

const vipCodeSchema = z.object({
  code: z.string()
    .min(3, 'Code must be at least 3 characters')
    .max(50, 'Code must be no more than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Code can only contain letters, numbers, underscores, and hyphens'),
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be no more than 255 characters'),
  description: z.string()
    .max(1000, 'Description must be no more than 1000 characters')
    .optional(),
  maxUses: z.number()
    .int()
    .min(1, 'Must allow at least 1 use')
    .max(10000, 'Cannot exceed 10,000 uses'),
  priceCents: z.number()
    .int()
    .min(0, 'Price cannot be negative'),
  benefits: z.array(z.string()).default([]),
  expiresAt: z.string().optional(),
  hasExpiration: z.boolean().default(false),
});

type VipCodeFormData = z.infer<typeof vipCodeSchema>;

interface VipCodeGeneratorProps {
  onCodeCreated?: (code: any) => void;
}

export function VipCodeGenerator({ onCodeCreated }: VipCodeGeneratorProps) {
  const { isEnabled: vipV2Enabled } = useFlag('VIP_V2_ENABLED');
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');

  const form = useForm<VipCodeFormData>({
    resolver: zodResolver(vipCodeSchema),
    defaultValues: {
      code: '',
      title: '',
      description: '',
      maxUses: 1,
      priceCents: 0,
      benefits: [],
      hasExpiration: false,
    },
  });

  if (!vipV2Enabled) {
    return null;
  }

  const generateRandomCode = () => {
    const code = vipV2Service.generateCode();
    form.setValue('code', code);
    toast.success('Random code generated!');
  };

  const addBenefit = () => {
    if (newBenefit.trim() && benefits.length < 10) {
      const updatedBenefits = [...benefits, newBenefit.trim()];
      setBenefits(updatedBenefits);
      form.setValue('benefits', updatedBenefits);
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    const updatedBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(updatedBenefits);
    form.setValue('benefits', updatedBenefits);
  };

  const onSubmit = async (data: VipCodeFormData) => {
    if (!user?.id) {
      toast.error('You must be logged in to create VIP codes');
      return;
    }

    setIsGenerating(true);

    try {
      const codeData: CreateVipCodeData = {
        code: data.code,
        title: data.title,
        description: data.description,
        maxUses: data.maxUses,
        priceCents: data.priceCents,
        benefits: data.benefits,
        expiresAt: data.hasExpiration ? data.expiresAt : undefined,
      };

      const newCode = await vipV2Service.createCode(user.id, codeData);
      
      toast.success('VIP code created successfully!');
      form.reset();
      setBenefits([]);
      setIsDialogOpen(false);
      
      if (onCodeCreated) {
        onCodeCreated(newCode);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create VIP code');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          Create VIP Code
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New VIP Code</DialogTitle>
          <DialogDescription>
            Create exclusive VIP codes for your fans with custom benefits and pricing.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Code Field */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIP Code</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="EXCLUSIVE2024"
                        className="uppercase font-mono"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <Button type="button" variant="outline" onClick={generateRandomCode}>
                      Generate
                    </Button>
                  </div>
                  <FormDescription>
                    Unique code your fans will use to redeem this VIP access.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Exclusive VIP Access" />
                  </FormControl>
                  <FormDescription>
                    What fans will see when they view this VIP code.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Get exclusive access to premium content, early releases, and special perks!"
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe what fans get with this VIP code.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Max Uses */}
              <FormField
                control={form.control}
                name="maxUses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Uses</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="1" 
                        max="10000"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      How many times this code can be redeemed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="priceCents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="0" 
                          step="0.01"
                          className="pl-8"
                          placeholder="0.00"
                          onChange={(e) => field.onChange(Math.round(parseFloat(e.target.value || '0') * 100))}
                          value={formatPrice(field.value || 0)}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Cost to redeem this VIP code (0 = free).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <Label>Benefits Included</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="e.g., Exclusive photos, Early access, Discord VIP role"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                />
                <Button type="button" variant="outline" onClick={addBenefit} disabled={!newBenefit.trim() || benefits.length >= 10}>
                  Add
                </Button>
              </div>
              {benefits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeBenefit(index)}>
                      {benefit} ×
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">
                Add up to 10 benefits that come with this VIP code. Click to remove.
              </p>
            </div>

            {/* Advanced Options Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="advanced-options">Advanced Options</Label>
              <Switch
                id="advanced-options"
                checked={showAdvancedOptions}
                onCheckedChange={setShowAdvancedOptions}
              />
            </div>

            {showAdvancedOptions && (
              <div className="space-y-4 border-t pt-4">
                {/* Expiration */}
                <div className="flex items-center space-x-3">
                  <FormField
                    control={form.control}
                    name="hasExpiration"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label>Set Expiration Date</Label>
                      </div>
                    )}
                  />
                </div>

                {form.watch('hasExpiration') && (
                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expires At</FormLabel>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input 
                              {...field} 
                              type="datetime-local"
                              className="pl-8"
                            />
                          </FormControl>
                        </div>
                        <FormDescription>
                          When this VIP code should stop working.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create VIP Code'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
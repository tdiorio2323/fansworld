'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Calendar, Clock, DollarSign, Users, Tag, Image, Save, Zap } from 'lucide-react';
import { FlashSaleCreateRequest, FlashSaleItem, FlashSaleTemplate } from '../types';
import { FlashSalesService } from '../services/flash-sales-service';
import { FLASH_SALE_TEMPLATES, calculateSalePrice } from '../config';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface FlashSaleCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  template?: FlashSaleTemplate;
}

export default function FlashSaleCreator({ 
  isOpen, 
  onClose, 
  onSuccess, 
  template 
}: FlashSaleCreatorProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState<FlashSaleCreateRequest>({
    title: template?.name || '',
    description: template?.description || '',
    saleType: template?.saleType || 'subscription',
    discountType: template?.discountType || 'percentage',
    discountValue: template?.discountValue || 25,
    startsAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
    endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    items: template?.items || [],
    isPublic: true,
    allowSharing: true,
    tags: template?.tags || [],
  });

  const [newItem, setNewItem] = useState<Partial<FlashSaleItem>>({
    itemType: 'subscription_month',
    title: '',
    originalPrice: 0,
    order: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setErrors({});
    }
  }, [isOpen]);

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (formData.discountValue <= 0) newErrors.discountValue = 'Discount must be greater than 0';
      if (formData.discountType === 'percentage' && formData.discountValue > 90) {
        newErrors.discountValue = 'Percentage discount cannot exceed 90%';
      }
    }

    if (stepNumber === 2) {
      const now = new Date();
      const startsAt = new Date(formData.startsAt);
      const endsAt = new Date(formData.endsAt);

      if (startsAt < now) newErrors.startsAt = 'Start time must be in the future';
      if (endsAt <= startsAt) newErrors.endsAt = 'End time must be after start time';
      
      const duration = endsAt.getTime() - startsAt.getTime();
      const minDuration = 5 * 60 * 1000; // 5 minutes
      const maxDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      if (duration < minDuration) newErrors.duration = 'Sale must run for at least 5 minutes';
      if (duration > maxDuration) newErrors.duration = 'Sale cannot run for more than 7 days';
    }

    if (stepNumber === 3) {
      if (formData.items.length === 0) newErrors.items = 'At least one item is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  const handleInputChange = (field: keyof FlashSaleCreateRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddItem = () => {
    if (!newItem.title || !newItem.originalPrice) {
      toast.error('Please fill in all item fields');
      return;
    }

    const item: Omit<FlashSaleItem, 'id' | 'saleId'> = {
      itemType: newItem.itemType as any,
      title: newItem.title,
      description: newItem.description,
      originalPrice: newItem.originalPrice * 100, // Convert to cents
      salePrice: calculateSalePrice(
        newItem.originalPrice * 100,
        formData.discountType,
        formData.discountValue
      ),
      order: formData.items.length,
      quantity: newItem.quantity,
      thumbnailUrl: newItem.thumbnailUrl,
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));

    setNewItem({
      itemType: 'subscription_month',
      title: '',
      originalPrice: 0,
      order: 0
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
      setLoading(true);
      
      // Convert prices to cents and calculate sale prices
      const processedData = {
        ...formData,
        items: formData.items.map(item => ({
          ...item,
          originalPrice: typeof item.originalPrice === 'number' ? item.originalPrice : item.originalPrice * 100,
          salePrice: calculateSalePrice(
            typeof item.originalPrice === 'number' ? item.originalPrice : item.originalPrice * 100,
            formData.discountType,
            formData.discountValue
          )
        }))
      };

      await FlashSalesService.createFlashSale(processedData);
      toast.success('Flash sale created successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create flash sale:', error);
      toast.error('Failed to create flash sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalOriginalPrice = formData.items.reduce((sum, item) => sum + (typeof item.originalPrice === 'number' ? item.originalPrice : item.originalPrice * 100), 0);
  const totalSalePrice = formData.items.reduce((sum, item) => {
    const original = typeof item.originalPrice === 'number' ? item.originalPrice : item.originalPrice * 100;
    return sum + calculateSalePrice(original, formData.discountType, formData.discountValue);
  }, 0);
  const totalSavings = totalOriginalPrice - totalSalePrice;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Zap className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Create Flash Sale</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > num ? 'bg-red-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Basic Info</span>
            <span>Timing</span>
            <span>Items & Review</span>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sale Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 50% Off Premium Subscription"
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Describe what's included in this flash sale..."
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Type
                  </label>
                  <select
                    value={formData.saleType}
                    onChange={(e) => handleInputChange('saleType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="subscription">Subscription</option>
                    <option value="ppv_message">PPV Message</option>
                    <option value="virtual_gift">Virtual Gift</option>
                    <option value="bundle">Bundle</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => handleInputChange('discountType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed_amount">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value))}
                    min="1"
                    max={formData.discountType === 'percentage' ? 90 : undefined}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={formData.discountType === 'percentage' ? '25' : '10.00'}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                    {formData.discountType === 'percentage' ? '%' : '$'}
                  </div>
                </div>
                {errors.discountValue && <p className="text-red-600 text-sm mt-1">{errors.discountValue}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., premium, limited-time, exclusive"
                />
              </div>
            </div>
          )}

          {/* Step 2: Timing and Limits */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timing & Limits</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startsAt.slice(0, 16)}
                    onChange={(e) => handleInputChange('startsAt', new Date(e.target.value).toISOString())}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.startsAt && <p className="text-red-600 text-sm mt-1">{errors.startsAt}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endsAt.slice(0, 16)}
                    onChange={(e) => handleInputChange('endsAt', new Date(e.target.value).toISOString())}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.endsAt && <p className="text-red-600 text-sm mt-1">{errors.endsAt}</p>}
                </div>
              </div>

              {errors.duration && <p className="text-red-600 text-sm">{errors.duration}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Total Purchases
                  </label>
                  <input
                    type="number"
                    value={formData.maxPurchases || ''}
                    onChange={(e) => handleInputChange('maxPurchases', e.target.value ? parseInt(e.target.value) : undefined)}
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Leave blank for unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Per User
                  </label>
                  <input
                    type="number"
                    value={formData.maxPurchasesPerUser || ''}
                    onChange={(e) => handleInputChange('maxPurchasesPerUser', e.target.value ? parseInt(e.target.value) : undefined)}
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Leave blank for unlimited"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                    Make this sale public (visible to all users)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowSharing"
                    checked={formData.allowSharing}
                    onChange={(e) => handleInputChange('allowSharing', e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="allowSharing" className="ml-2 text-sm text-gray-700">
                    Allow users to share this sale
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requiresSubscription"
                    checked={formData.requiresSubscription || false}
                    onChange={(e) => handleInputChange('requiresSubscription', e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="requiresSubscription" className="ml-2 text-sm text-gray-700">
                    Require subscription to purchase
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Items and Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Items & Review</h3>
                <div className="text-sm text-gray-600">
                  {formData.items.length} item{formData.items.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Add New Item */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-800 mb-3">Add Item</h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Item title"
                    value={newItem.title}
                    onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Price ($)"
                    value={newItem.originalPrice || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={newItem.itemType}
                    onChange={(e) => setNewItem(prev => ({ ...prev, itemType: e.target.value as any }))}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="subscription_month">1 Month Subscription</option>
                    <option value="subscription_year">1 Year Subscription</option>
                    <option value="ppv_message">PPV Message</option>
                    <option value="virtual_gift_bundle">Virtual Gift Bundle</option>
                    <option value="custom_item">Custom Item</option>
                  </select>
                  <button
                    onClick={handleAddItem}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-md font-medium text-gray-800">Sale Items</h4>
                  {formData.items.map((item, index) => {
                    const originalPrice = typeof item.originalPrice === 'number' ? item.originalPrice : item.originalPrice * 100;
                    const salePrice = calculateSalePrice(originalPrice, formData.discountType, formData.discountValue);
                    const savings = originalPrice - salePrice;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">{item.title}</h5>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-500 line-through">
                              {formatPrice(originalPrice)}
                            </span>
                            <span className="text-green-600 font-medium">
                              {formatPrice(salePrice)}
                            </span>
                            <span className="text-red-600 text-xs">
                              Save {formatPrice(savings)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {errors.items && <p className="text-red-600 text-sm">{errors.items}</p>}

              {/* Sale Summary */}
              {formData.items.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-md font-medium text-red-800 mb-3">Sale Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Original Price:</span>
                      <div className="font-medium text-gray-900">{formatPrice(totalOriginalPrice)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Sale Price:</span>
                      <div className="font-medium text-green-600">{formatPrice(totalSalePrice)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Savings:</span>
                      <div className="font-medium text-red-600">{formatPrice(totalSavings)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={step === 1 ? onClose : handlePrevious}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            {step === 1 ? 'Cancel' : 'Previous'}
          </button>
          
          <div className="flex gap-2">
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || formData.items.length === 0}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Create Sale
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// eslint-disable react-hooks/rules-of-hooks
// 💰 ONE-CLICK UPSELLS - MAIN COMPONENT

'use client';

import React, { useState, useEffect } from 'react';
import { ADDON_FLAGS } from '@/features/addons/feature-flags';
import { UpsellsService } from '../services/upsells-service';
import type { Upsell, UpsellDisplayResponse } from '../types';
import { getTimeUntilExpiration, formatPrice, formatConversionRate } from '../config';

interface UpsellsProps {
  upsellId?: string;
  creatorId?: string;
  currentUserId?: string;
  context?: {
    page: string;
    triggerSource: string;
    deviceType: string;
    userAgent: string;
    sessionData?: Record<string, any>;
  };
  onConversion?: (upsellId: string, conversionValue: number) => void;
  onDismiss?: (upsellId: string, reason: string) => void;
  className?: string;
}

export function Upsells({
  upsellId,
  creatorId,
  currentUserId,
  context,
  onConversion,
  onDismiss,
  className = '',
}: UpsellsProps) {
  const [displayResponse, setDisplayResponse] = useState<UpsellDisplayResponse | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Don't render if addon is disabled
  if (!ADDON_FLAGS.ONE_CLICK_UPSELLS) {
    return null;
  }

  useEffect(() => {
    if (upsellId && currentUserId && context) {
      checkShouldDisplay();
    }
  }, [upsellId, currentUserId]);

  useEffect(() => {
    if (displayResponse?.expiresAt) {
      const timer = setInterval(() => {
        const remaining = getTimeUntilExpiration(displayResponse.expiresAt!);
        setTimeRemaining(remaining);
        
        if (remaining === 'Expired') {
          handleDismiss('timeout');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [displayResponse]);

  const checkShouldDisplay = async () => {
    if (!upsellId || !currentUserId || !context) return;

    try {
      setIsLoading(true);
      const response = await UpsellsService.checkShouldDisplay({
        upsellId,
        userId: currentUserId,
        context,
      });

      setDisplayResponse(response);
      
      if (response.shouldDisplay) {
        setIsVisible(true);
        // Record impression is handled by the service
      }
    } catch (error) {
      console.error('Failed to check upsell display:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async () => {
    if (!displayResponse || !currentUserId) return;

    const timeToClick = Math.floor((Date.now() - startTime) / 1000);

    try {
      await UpsellsService.recordInteraction(
        'click',
        displayResponse.upsell!.id,
        displayResponse.variant?.id,
        currentUserId,
        displayResponse.displayId,
        { timeToAction: timeToClick }
      );
    } catch (error) {
      console.error('Failed to record click:', error);
    }
  };

  const handleConversion = async (conversionValue: number) => {
    if (!displayResponse || !currentUserId) return;

    const timeToConversion = Math.floor((Date.now() - startTime) / 1000);

    try {
      await UpsellsService.recordInteraction(
        'conversion',
        displayResponse.upsell!.id,
        displayResponse.variant?.id,
        currentUserId,
        displayResponse.displayId,
        { 
          timeToAction: timeToConversion,
          conversionValue,
        }
      );

      // Call parent callback
      onConversion?.(displayResponse.upsell!.id, conversionValue);
      
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to record conversion:', error);
    }
  };

  const handleDismiss = async (reason: string) => {
    if (!displayResponse || !currentUserId) return;

    const timeToAction = Math.floor((Date.now() - startTime) / 1000);

    try {
      await UpsellsService.recordInteraction(
        'dismiss',
        displayResponse.upsell!.id,
        displayResponse.variant?.id,
        currentUserId,
        displayResponse.displayId,
        { 
          timeToAction,
          dismissReason: reason,
        }
      );

      // Call parent callback
      onDismiss?.(displayResponse.upsell!.id, reason);
      
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to record dismiss:', error);
    }
  };

  const getVariantContent = (upsell: Upsell, variant?: any) => {
    return {
      headline: variant?.headline || upsell.headline,
      subheadline: variant?.subheadline || upsell.subheadline,
      ctaText: variant?.ctaText || upsell.ctaText,
      imageUrl: variant?.imageUrl || upsell.imageUrl,
      bulletPoints: upsell.bulletPoints,
    };
  };

  if (isLoading || !displayResponse?.shouldDisplay || !isVisible) {
    return null;
  }

  const upsell = displayResponse.upsell!;
  const variant = displayResponse.variant;
  const content = getVariantContent(upsell, variant);
  const design = variant?.design || upsell.design;

  // Calculate savings
  const savings = upsell.originalPrice - upsell.discountedPrice;
  const savingsPercentage = Math.round((savings / upsell.originalPrice) * 100);

  // Template-specific rendering
  const renderContent = () => (
    <div className="upsell-content p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {timeRemaining && timeRemaining !== 'Expired' && (
            <div className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full mb-2">
              ⏰ {timeRemaining}
            </div>
          )}
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ 
              color: design.textColor,
              fontFamily: design.headlineFont,
              fontSize: design.headlineSize === 'extra_large' ? '2rem' : 
                        design.headlineSize === 'large' ? '1.5rem' :
                        design.headlineSize === 'medium' ? '1.25rem' : '1rem'
            }}
          >
            {content.headline}
          </h2>
          {content.subheadline && (
            <p className="text-gray-600 mb-4" style={{ fontFamily: design.bodyFont }}>
              {content.subheadline}
            </p>
          )}
        </div>
        
        {upsell.template !== 'banner' && (
          <button
            onClick={() => handleDismiss('close_button')}
            className="text-gray-400 hover:text-gray-600 text-xl ml-4"
          >
            ×
          </button>
        )}
      </div>

      {/* Image */}
      {content.imageUrl && (
        <div className="mb-4">
          <img
            src={content.imageUrl}
            alt={content.headline}
            className={`rounded-lg ${
              design.imagePosition === 'background' ? 'absolute inset-0 object-cover' : 'w-full h-48 object-cover'
            }`}
          />
        </div>
      )}

      {/* Pricing */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span 
            className="text-3xl font-bold"
            style={{ color: design.primaryColor }}
          >
            {formatPrice(upsell.discountedPrice)}
          </span>
          {upsell.originalPrice > upsell.discountedPrice && (
            <>
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(upsell.originalPrice)}
              </span>
              <span 
                className="px-2 py-1 rounded text-sm font-medium"
                style={{ 
                  backgroundColor: design.accentColor,
                  color: 'white'
                }}
              >
                Save {savingsPercentage}%
              </span>
            </>
          )}
        </div>
        {savings > 0 && (
          <p className="text-sm text-gray-600">
            You save {formatPrice(savings)}!
          </p>
        )}
      </div>

      {/* Bullet Points */}
      {content.bulletPoints.length > 0 && (
        <ul className="mb-6 space-y-2">
          {content.bulletPoints.map((point, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <span className="text-green-500">✓</span>
              <span style={{ color: design.textColor }}>{point}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA Button */}
      <div className="space-y-3">
        <button
          onClick={() => {
            handleClick();
            handleConversion(upsell.discountedPrice);
          }}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
            design.buttonSize === 'large' ? 'text-lg' : 
            design.buttonSize === 'medium' ? 'text-base' : 'text-sm'
          } ${
            design.hoverEffects ? 'hover:scale-105 hover:shadow-lg' : ''
          }`}
          style={{
            backgroundColor: design.primaryColor,
            backgroundImage: design.buttonStyle === 'gradient' 
              ? `linear-gradient(135deg, ${design.primaryColor}, ${design.secondaryColor})`
              : undefined,
            border: design.buttonStyle === 'outlined' ? `2px solid ${design.primaryColor}` : 'none',
            color: design.buttonStyle === 'outlined' ? design.primaryColor : 'white',
            background: design.buttonStyle === 'outlined' ? 'transparent' : undefined,
          }}
        >
          {content.ctaText}
        </button>
        
        {upsell.template !== 'banner' && (
          <button
            onClick={() => handleDismiss('user_choice')}
            className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            No thanks, maybe later
          </button>
        )}
      </div>
    </div>
  );

  // Template-specific styling
  const getTemplateStyles = () => {
    const baseStyles = {
      backgroundColor: design.backgroundColor,
      borderRadius: `${design.borderRadius}px`,
      border: design.borderWidth > 0 ? `${design.borderWidth}px solid ${design.borderColor}` : 'none',
      boxShadow: design.shadowIntensity === 'none' ? 'none' :
                 design.shadowIntensity === 'light' ? '0 2px 8px rgba(0,0,0,0.1)' :
                 design.shadowIntensity === 'medium' ? '0 4px 16px rgba(0,0,0,0.15)' :
                 '0 8px 32px rgba(0,0,0,0.2)',
    };

    switch (upsell.template) {
      case 'modal':
        return {
          ...baseStyles,
          position: 'fixed' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto' as const,
          zIndex: 9999,
        };
      case 'banner':
        return {
          ...baseStyles,
          position: 'fixed' as const,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9998,
        };
      case 'slide_in':
        return {
          ...baseStyles,
          position: 'fixed' as const,
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          maxWidth: '400px',
          zIndex: 9997,
        };
      case 'full_screen':
        return {
          ...baseStyles,
          position: 'fixed' as const,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        };
      case 'inline':
      default:
        return {
          ...baseStyles,
          maxWidth: '100%',
        };
    }
  };

  return (
    <>
      {/* Backdrop for modal/full_screen */}
      {(upsell.template === 'modal' || upsell.template === 'full_screen') && (
        <div
          className="fixed inset-0 bg-black/50 z-9998"
          onClick={() => handleDismiss('outside_click')}
        />
      )}
      
      {/* Upsell Container */}
      <div
        className={`upsell-container ${upsell.template} ${className}`}
        style={getTemplateStyles()}
      >
        {renderContent()}
      </div>
    </>
  );
}

export default Upsells;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

interface ExpandableProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'luxury' | 'chrome' | 'glass';
  className?: string;
  onToggle?: (expanded: boolean) => void;
}

export const Expandable: React.FC<ExpandableProps> = ({
  title,
  children,
  defaultExpanded = false,
  icon,
  variant = 'default',
  className,
  onToggle
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'luxury':
        return 'bg-gradient-to-r from-purple-900/10 to-pink-900/10 border-purple-500/30';
      case 'chrome':
        return 'bg-gradient-chrome-luxury border-chrome-silver/50';
      case 'glass':
        return 'bg-glass-surface/50 backdrop-blur-lg border-glass-border/30';
      default:
        return 'bg-card border-border';
    }
  };

  return (
    <div className={cn('rounded-lg border', getVariantStyles(), className)}>
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full p-4 text-left hover:bg-accent/5 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <ChevronDownIcon
          className={cn(
            'w-5 h-5 transition-transform duration-200',
            expanded && 'rotate-180'
          )}
        />
      </button>
      
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
            data-testid="expanded-content"
          >
            <div className="p-4 pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ShowMoreProps {
  children: React.ReactNode;
  maxHeight?: number;
  collapsedHeight?: number;
  showLabel?: string;
  hideLabel?: string;
  variant?: 'default' | 'luxury' | 'chrome' | 'glass';
  className?: string;
}

export const ShowMore: React.FC<ShowMoreProps> = ({
  children,
  maxHeight = 300,
  collapsedHeight = 100,
  showLabel = 'Show more',
  hideLabel = 'Show less',
  variant = 'default',
  className
}) => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [needsExpansion, setNeedsExpansion] = useState(false);

  React.useEffect(() => {
    if (contentRef.current) {
      setNeedsExpansion(contentRef.current.scrollHeight > collapsedHeight);
    }
  }, [collapsedHeight, children]);

  const getButtonVariantStyles = () => {
    switch (variant) {
      case 'luxury':
        return 'text-purple-400 hover:text-purple-300';
      case 'chrome':
        return 'text-chrome-accent hover:text-chrome-glow';
      case 'glass':
        return 'text-primary hover:text-primary/80';
      default:
        return 'text-primary hover:text-primary/80';
    }
  };

  return (
    <div className={className}>
      <motion.div
        ref={contentRef}
        initial={false}
        animate={{
          height: expanded ? 'auto' : collapsedHeight,
          transition: { duration: 0.3, ease: 'easeInOut' }
        }}
        className="overflow-hidden relative"
      >
        {children}
        {!expanded && needsExpansion && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </motion.div>
      
      {needsExpansion && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'mt-2 text-sm font-medium transition-colors',
            getButtonVariantStyles()
          )}
        >
          {expanded ? hideLabel : showLabel}
        </button>
      )}
    </div>
  );
};

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
    badge?: string | number;
  }[];
  defaultTab?: string;
  variant?: 'default' | 'luxury' | 'chrome' | 'glass' | 'pills';
  className?: string;
  onChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  variant = 'default',
  className,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const getTabVariantStyles = () => {
    switch (variant) {
      case 'luxury':
        return {
          container: 'bg-purple-900/10 border-purple-500/30',
          tab: 'hover:bg-purple-500/10',
          active: 'bg-gradient-luxury text-white'
        };
      case 'chrome':
        return {
          container: 'bg-chrome-dark border-chrome-silver/50',
          tab: 'hover:bg-chrome-silver/10',
          active: 'bg-gradient-chrome text-white'
        };
      case 'glass':
        return {
          container: 'bg-glass-surface/50 backdrop-blur-lg border-glass-border/30',
          tab: 'hover:bg-white/5',
          active: 'bg-white/10 backdrop-blur-xl'
        };
      case 'pills':
        return {
          container: '',
          tab: 'rounded-full hover:bg-accent/10',
          active: 'bg-primary text-primary-foreground rounded-full'
        };
      default:
        return {
          container: 'bg-muted/50',
          tab: 'hover:bg-muted',
          active: 'bg-background border-b-2 border-primary'
        };
    }
  };

  const styles = getTabVariantStyles();
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={className}>
      <div className={cn(
        'flex gap-1 p-1 rounded-lg',
        variant !== 'pills' && 'border',
        styles.container
      )}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all',
              styles.tab,
              activeTab === tab.id && styles.active
            )}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={cn(
                'px-1.5 py-0.5 text-xs rounded-full',
                typeof tab.badge === 'number' 
                  ? 'bg-destructive text-destructive-foreground'
                  : 'bg-primary/20 text-primary'
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-4"
          role="tabpanel"
        >
          {activeTabData?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

interface StepperProps {
  steps: {
    id: string;
    label: string;
    description?: string;
    content: React.ReactNode;
  }[];
  currentStep?: number;
  variant?: 'default' | 'luxury' | 'chrome' | 'glass';
  className?: string;
  onStepChange?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep = 0,
  variant = 'default',
  className,
  onStepChange
}) => {
  const [activeStep, setActiveStep] = useState(currentStep);

  const handleStepChange = (step: number) => {
    setActiveStep(step);
    onStepChange?.(step);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'luxury':
        return {
          active: 'bg-gradient-luxury text-white',
          completed: 'bg-purple-500 text-white',
          upcoming: 'bg-purple-900/20 text-purple-400'
        };
      case 'chrome':
        return {
          active: 'bg-gradient-chrome text-white',
          completed: 'bg-chrome-silver text-chrome-black',
          upcoming: 'bg-chrome-dark/50 text-chrome-silver'
        };
      case 'glass':
        return {
          active: 'bg-white/20 backdrop-blur-xl text-white',
          completed: 'bg-white/10 text-foreground',
          upcoming: 'bg-glass-surface/30 text-muted-foreground'
        };
      default:
        return {
          active: 'bg-primary text-primary-foreground',
          completed: 'bg-primary/20 text-primary',
          upcoming: 'bg-muted text-muted-foreground'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={className} data-testid="stepper">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => index <= activeStep && handleStepChange(index)}
              disabled={index > activeStep}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                index === activeStep && styles.active,
                index < activeStep && styles.completed,
                index > activeStep && styles.upcoming
              )}>
                {index < activeStep ? '✓' : index + 1}
              </div>
              <div>
                <p className="font-medium text-sm">Step {index + 1}</p>
                <p className="font-medium text-sm">{step.label}</p>
                {step.description && (
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                )}
              </div>
            </button>
            
            {index < steps.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mx-4',
                index < activeStep ? 'bg-primary' : 'bg-muted'
              )} />
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {steps[activeStep]?.content}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleStepChange(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className="px-4 py-2 text-sm rounded-lg border hover:bg-accent disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handleStepChange(Math.min(steps.length - 1, activeStep + 1))}
          disabled={activeStep === steps.length - 1}
          className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
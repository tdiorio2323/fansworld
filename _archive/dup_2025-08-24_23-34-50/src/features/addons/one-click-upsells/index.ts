// 💰 ONE-CLICK UPSELLS - MAIN EXPORTS

export { Upsells as default } from './components/Upsells';
export { UpsellsService } from './services/upsells-service';
export { 
  DEFAULT_UPSELL_CONFIG, 
  UPSELL_TEMPLATES,
  UPSELL_SCENARIOS,
  USER_SEGMENTS,
  TRIGGER_TEMPLATES,
  OFFER_TEMPLATES,
  DESIGN_PRESETS,
  PERFORMANCE_BENCHMARKS
} from './config';
export type {
  Upsell,
  UpsellConversion,
  UpsellAnalytics,
  UpsellVariant,
  CreateUpsellRequest,
  UpdateUpsellRequest,
  UpsellDisplayRequest,
  UpsellDisplayResponse,
  UpsellTrigger,
  UpsellOffer,
  UpsellDesign,
  UpsellCondition,
} from './types';
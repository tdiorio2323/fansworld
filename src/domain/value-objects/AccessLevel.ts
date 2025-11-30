import { ValueObject } from './ValueObject';

export interface AccessLevelProps {
  value: 'public' | 'subscribers_only' | 'premium_subscribers' | 'ppv_locked' | 'custom_price';
}

export class AccessLevel extends ValueObject<AccessLevelProps> {
  constructor(props: AccessLevelProps) {
    super(props);
  }

  get value(): AccessLevelProps['value'] {
    return this.props.value;
  }

  static PUBLIC = new AccessLevel({ value: 'public' });
  static SUBSCRIBERS_ONLY = new AccessLevel({ value: 'subscribers_only' });
  static PREMIUM_SUBSCRIBERS = new AccessLevel({ value: 'premium_subscribers' });
  static PPV_LOCKED = new AccessLevel({ value: 'ppv_locked' });
  static CUSTOM_PRICE = new AccessLevel({ value: 'custom_price' });

  static create(value: AccessLevelProps['value']): AccessLevel {
    return new AccessLevel({ value });
  }

  /**
   * Check if this access level requires subscription
   */
  requiresSubscription(): boolean {
    return this.props.value !== 'public';
  }

  /**
   * Check if this access level requires premium subscription
   */
  requiresPremium(): boolean {
    return this.props.value === 'premium_subscribers';
  }

  /**
   * Check if this access level requires payment
   */
  requiresPayment(): boolean {
    return this.props.value === 'ppv_locked' || this.props.value === 'custom_price';
  }
}
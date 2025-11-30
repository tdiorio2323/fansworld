export interface ValueObjectProps {
  [index: string]: any;
}

/**
 * Base class for Value Objects in Domain-Driven Design
 */
export abstract class ValueObject<T extends ValueObjectProps> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  /**
   * Value Objects are compared by their structural properties
   */
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
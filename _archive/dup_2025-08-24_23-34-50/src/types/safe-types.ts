/**
 * Type-safe replacements for common 'any' patterns
 * Eliminates TypeScript any warnings while maintaining flexibility
 */

// Generic JSON-serializable types
export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

// Safe unknown record type for flexible objects
export type SafeRecord = Record<string, JsonValue>;

// API response types
export type ApiResponse<T = unknown> = {
  data?: T;
  error?: string;
  message?: string;
  status: number;
};

// Event handler types
export type SafeEventHandler<T = HTMLElement> = (event: React.SyntheticEvent<T>) => void | Promise<void>;
export type SafeChangeHandler = (value: string | number | boolean) => void;

// Form data types
export type FormData = Record<string, string | number | boolean | File | undefined>;
export type ValidationErrors = Record<string, string | string[]>;

// Async function types
export type AsyncFunction<T = void, P = void> = (params: P) => Promise<T>;
export type AsyncCallback<T = void> = () => Promise<T>;

// Redux/State types
export type Action<T = string, P = unknown> = {
  type: T;
  payload?: P;
};

export type Reducer<S, A> = (state: S, action: A) => S;

// Utility type for extracting types from promises
export type Awaited<T> = T extends Promise<infer U> ? U : T;

// Safe type guards
export const isSafeRecord = (value: unknown): value is SafeRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isJsonValue = (value: unknown): value is JsonValue => {
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return true;
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (typeof value === 'object') {
    return Object.values(value as object).every(isJsonValue);
  }
  return false;
};

// Type assertion helpers
export const assertType = <T>(value: unknown, guard: (val: unknown) => val is T): T => {
  if (!guard(value)) throw new Error('Type assertion failed');
  return value;
};

// Safe casting functions
export const toSafeRecord = (value: unknown): SafeRecord => {
  if (isSafeRecord(value)) return value;
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).reduce((acc, [k, v]) => ({
      ...acc,
      [k]: isJsonValue(v) ? v : String(v)
    }), {} as SafeRecord);
  }
  return {};
};

// Error type with cause
export type SafeError = Error & {
  cause?: unknown;
  code?: string;
  details?: SafeRecord;
};

// Response handler type
export type ResponseHandler<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: SafeError) => void;
  onFinally?: () => void;
};

// Pagination types
export type PaginationParams = {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
};

// Filter types
export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';
export type Filter = {
  field: string;
  operator: FilterOperator;
  value: JsonValue;
};

// Metadata type for flexible additional data
export type Metadata = {
  [key: string]: JsonValue;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
};
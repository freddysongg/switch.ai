export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type PrimitiveValue = string | number | boolean;

export interface HttpHeaders {
  [key: string]: string;
}

// =============================================================================
// Metadata and Error Detail Types
// =============================================================================

export interface ChatMetadata {
  responseTime?: number;
  modelVersion?: string;
  tokensUsed?: number;
  confidence?: number;
  sources?: string[];
  conversationId?: string;
  error?: boolean;
  [key: string]: PrimitiveValue | PrimitiveValue[] | undefined;
}

export interface AnalyticsMetadata {
  sessionId?: string;
  userAgent?: string;
  ip?: string;
  duration?: number;
  endpoint?: string;
  statusCode?: number;
  errorType?: string;
  [key: string]: PrimitiveValue | undefined;
}

export interface SecurityViolationDetails {
  violationType: 'XSS_ATTEMPT' | 'SQL_INJECTION' | 'MALICIOUS_SCRIPT' | 'INAPPROPRIATE_CONTENT';
  blockedContent?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore?: number;
  detectionMethod: string;
}

export interface ApiErrorDetails {
  code?: string;
  field?: string;
  resource?: string;
  suggestion?: string;
  timestamp: number;
  requestId?: string;
}

// =============================================================================
// API Configuration and Request/Response Types
// =============================================================================

export interface ApiClientConfig {
  baseURL: string;
  maxConcurrentRequests?: number;
  defaultTimeout?: number;
  retryAttempts?: number;
  retryDelayMs?: number;
  enableToastNotifications?: boolean;
}

export interface RequestConfig<T = unknown> {
  method: HttpMethod;
  url: string;
  data?: T;
  params?: Record<string, PrimitiveValue>;
  headers?: HttpHeaders;
  timeout?: number;
  retryAttempts?: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: HttpHeaders;
}

export interface QueuedRequest<T = unknown> {
  id: string;
  config: RequestConfig<T>;
  resolve: (value: ApiResponse<T>) => void;
  reject: (error: Error) => void;
  attempts: number;
  maxAttempts: number;
}

// =============================================================================
// Custom Error Types
// =============================================================================

export class SecurityViolationError extends Error {
  public readonly name = 'SecurityViolationError';
  constructor(
    message: string,
    public details?: SecurityViolationDetails
  ) {
    super(message);
  }
}

export class ValidationError extends Error {
  public readonly name = 'ValidationError';
  constructor(
    message: string,
    public details?: string[]
  ) {
    super(message);
  }
}

export class RateLimitError extends Error {
  public readonly name = 'RateLimitError';
  constructor(
    message: string,
    public retryAfter: number
  ) {
    super(message);
  }
}

export class AuthenticationError extends Error {
  public readonly name = 'AuthenticationError';
  constructor(message: string) {
    super(message);
  }
}

export class ApiError extends Error {
  public readonly name = 'ApiError';
  constructor(
    message: string,
    public status?: number,
    public details?: ApiErrorDetails
  ) {
    super(message);
  }
}

// =============================================================================
// Authentication Types
// =============================================================================

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface TokenData {
  token: string;
  refreshToken?: string;
  expiresAt: number;
  user: UserProfile;
}

export interface RefreshResponse {
  token: string;
  refreshToken?: string;
  expiresAt: number;
  user: UserProfile;
}

export type AuthEventType = 'login' | 'logout' | 'refresh' | 'expired';

export interface AuthEvent {
  type: AuthEventType;
  data?: TokenData | null;
}

export type AuthEventListener = (event: AuthEvent) => void;

export interface JWTPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  iss?: string;
  aud?: string;
  userId?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

// =============================================================================
// Chat API Types
// =============================================================================

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface SwitchSpecifications {
  switchName?: string;
  manufacturer?: string;
  type?: string;
  topHousing?: string;
  bottomHousing?: string;
  stem?: string;
  mount?: string;
  spring?: string;
  actuationForceG?: number;
  bottomOutForceG?: number;
  preTravelMm?: number;
  totalTravelMm?: number;
  factoryLubed?: string;
  additionalNotes?: string;
}

export interface MaterialAnalysis {
  materialComposition?: string;
  propertiesExplanation?: string;
  switchApplications?: string;
  soundImpact?: string;
  feelImpact?: string;
  performanceImpact?: string;
}

export interface ExampleSwitch {
  switchName?: string;
  briefOverview?: string;
  specifications?: SwitchSpecifications;
  soundProfile?: string;
  relevanceToMaterial?: string;
}

export interface ComparisonSwitchData {
  switchName?: string;
  specifications?: SwitchSpecifications;
  individualAnalysis?: string;
  recommendations?: string[];
}

export interface AnalysisResponse {
  overview: string;
  technicalSpecifications?: SwitchSpecifications;
  soundProfile?: string;
  typingFeel?: string;
  typingExperience?: string;
  recommendations?: string[];
  contextualConnection?: string;
  specificApplication?: string;
  implication?: string;
  comparedSwitches?: {
    [switchName: string]: ComparisonSwitchData;
  };
  comparativeAnalysis?: {
    feelingTactility?:
      | {
          description?: string;
          keyDifferences?: string;
          userImpact?: string;
        }
      | string;
    soundProfile?:
      | {
          description?: string;
          acousticDifferences?: string;
          environmentalConsiderations?: string;
        }
      | string;
    buildMaterialComposition?:
      | {
          materialComparison?: string;
          durabilityAssessment?: string;
          modificationPotential?: string;
        }
      | string;
    performanceAspects?:
      | {
          gamingPerformance?: string;
          typingPerformance?: string;
          consistencyReliability?: string;
          fatigueFactors?: string;
        }
      | string;
  };
  conclusion?:
    | {
        primaryDifferences?: string;
        overallAssessment?: string;
        decisionGuidance?: string;
      }
    | string;
  switchRecommendations?: {
    [switchName: string]: string[];
  };
  materialAnalysis?: MaterialAnalysis;
  materialCombinationEffects?: string;
  exampleSwitches?: ExampleSwitch[];
  housingMaterials?: string;
  forceWeighting?: string;
  travelActuation?: string;
  useCaseSuitability?: string;
  buildQuality?: string;
  durability?: string;
  modifiability?: string;
  compatibility?: string;
  frequencyResponse?: string;
  acousticProperties?: string;
  tactileCharacteristics?: string;
  ergonomicConsiderations?: string;
  manufacturingQuality?: string;
  analysis?: string;
  analysisConfidence?: string;
  dataSource?: string;
  additionalNotes?: string;
  specifications?: unknown;
  feelAndExperience?: unknown;
  comparison?: unknown;
  error?: AnalysisError;
  dataConflictResolution?: {
    conflictsFound: number;
    resolutionStrategy: string;
    conflicts: Array<{
      switchName: string;
      conflicts: Array<{
        field: string;
        databaseValue: unknown;
        llmValue: unknown;
        resolution: 'database' | 'llm' | 'both';
        reason: string;
      }>;
    }>;
    note: string;
  };
}

export interface AnalysisResponseWithExtras extends AnalysisResponse {
  requestId?: string;
  timestamp?: string;
  conversationId?: string;
}

export interface AnalysisError {
  code:
    | 'INVALID_QUERY'
    | 'INTENT_RECOGNITION_FAILED'
    | 'DATABASE_ERROR'
    | 'LLM_REQUEST_FAILED'
    | 'LLM_RESPONSE_INVALID'
    | 'RESPONSE_VALIDATION_FAILED'
    | 'TIMEOUT'
    | 'RATE_LIMITED'
    | 'INTERNAL_ERROR'
    | 'NETWORK_ERROR'
    | 'AUTHENTICATION_ERROR'
    | 'QUOTA_EXCEEDED';
  message: string;
  step?: string;
  details?: unknown;
  recoverable: boolean;
  timestamp?: Date;
  retryDelay?: number;
}

export interface ChatResponse extends AnalysisResponse {
  id: string;
  role: 'assistant';
  content: string;
}

// =============================================================================
// Error Response Types
// =============================================================================

export interface BaseApiErrorResponse {
  error: string;
  message: string;
  status?: number;
}

export interface ValidationErrorResponse extends BaseApiErrorResponse {
  error: 'VALIDATION_ERROR';
  details: string[];
}

export interface SecurityViolationResponse extends BaseApiErrorResponse {
  error: 'INPUT_SANITIZATION_VIOLATION';
  details: SecurityViolationDetails;
}

export interface RateLimitResponse extends BaseApiErrorResponse {
  error: 'RATE_LIMIT_EXCEEDED';
  retryAfter: number;
  details: {
    limit: number;
    windowMs: number;
    remaining: number;
  };
}

export interface ApiErrorResponse extends BaseApiErrorResponse {
  details?: ApiErrorDetails;
}

export type ErrorResponse =
  | ValidationErrorResponse
  | SecurityViolationResponse
  | RateLimitResponse
  | ApiErrorResponse;

// =============================================================================
// Rate Limiting Types
// =============================================================================

export interface RateLimit {
  userId: string;
  endpoint: string;
  count: number;
  resetAt: Date;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// =============================================================================
// Analytics Types
// =============================================================================

export type AnalyticsEventType =
  | 'page_view'
  | 'chat_message'
  | 'auth_login'
  | 'auth_logout'
  | 'error_occurred'
  | 'api_request'
  | 'switch_search'
  | 'conversation_created'
  | 'conversation_deleted';

export interface AnalyticsEvent {
  userId?: string;
  eventType: AnalyticsEventType;
  metadata: AnalyticsMetadata;
  timestamp?: Date;
}

// =============================================================================
// Toast Notification Types
// =============================================================================

export interface ToastNotificationConfig {
  enableRetryDelayNotifications: boolean;
  enableRateLimitNotifications: boolean;
  enableErrorNotifications: boolean;
  enableSuccessNotifications: boolean;
}

export type ToastEventType = 'retry_delay' | 'rate_limit' | 'error' | 'success';

export interface ToastEventData {
  type: ToastEventType;
  message: string;
  delay?: number;
  retryAfter?: number;
  error?: Error;
}

// =============================================================================
// Utility Types
// =============================================================================

export type ErrorType =
  | 'SecurityViolationError'
  | 'ValidationError'
  | 'RateLimitError'
  | 'AuthenticationError'
  | 'ApiError';

export interface RequestMetadata {
  id: string;
  timestamp: number;
  retryAttempt: number;
  maxRetries: number;
}

// =============================================================================
// Type Guards
// =============================================================================

export function isValidationError(error: Error): error is ValidationError {
  return error.name === 'ValidationError';
}

export function isSecurityViolationError(error: Error): error is SecurityViolationError {
  return error.name === 'SecurityViolationError';
}

export function isRateLimitError(error: Error): error is RateLimitError {
  return error.name === 'RateLimitError';
}

export function isAuthenticationError(error: Error): error is AuthenticationError {
  return error.name === 'AuthenticationError';
}

export function isApiError(error: Error): error is ApiError {
  return error.name === 'ApiError';
}

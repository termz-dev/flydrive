/**
 * Typed error taxonomy from docs/ERROR_HANDLING_RELIABILITY.md and the API error envelope
 * from docs/API_CONTRACTS.md. Domain modules throw AppError subclasses; route handlers map
 * them to the envelope. Unknown errors become INTERNAL with no detail leaked to clients.
 */
export type ErrorCategory =
  | "INVALID_INPUT"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "DEPENDENCY_UNAVAILABLE"
  | "DEPENDENCY_UNKNOWN"
  | "FEATURE_UNAVAILABLE"
  | "INVARIANT_VIOLATION"
  | "INTERNAL";

const STATUS: Record<ErrorCategory, number> = {
  INVALID_INPUT: 422,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  DEPENDENCY_UNAVAILABLE: 503,
  DEPENDENCY_UNKNOWN: 202,
  FEATURE_UNAVAILABLE: 503,
  INVARIANT_VIOLATION: 500,
  INTERNAL: 500,
};

export interface FieldError {
  field: string;
  message: string;
}

export class AppError extends Error {
  override readonly name: string = "AppError";
  constructor(
    readonly category: ErrorCategory,
    readonly code: string,
    readonly safeMessage: string,
    readonly options: { retryable?: boolean; fieldErrors?: FieldError[]; cause?: unknown } = {},
  ) {
    super(`${code}: ${safeMessage}`, { cause: options.cause });
  }

  get status(): number {
    return STATUS[this.category];
  }
}

export class FeatureUnavailableError extends AppError {
  override readonly name = "FeatureUnavailableError";
  constructor(feature: string) {
    super(
      "FEATURE_UNAVAILABLE",
      "FEATURE_UNAVAILABLE",
      `${feature} is not available yet. Nothing has been submitted or charged.`,
      { retryable: false },
    );
  }
}

export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    retryable: boolean;
    correlationId: string;
    fieldErrors: FieldError[];
  };
}

export function toErrorEnvelope(
  err: unknown,
  correlationId: string,
): { status: number; body: ErrorEnvelope } {
  if (err instanceof AppError) {
    return {
      status: err.status,
      body: {
        error: {
          code: err.code,
          message: err.safeMessage,
          retryable: err.options.retryable ?? false,
          correlationId,
          fieldErrors: err.options.fieldErrors ?? [],
        },
      },
    };
  }
  return {
    status: 500,
    body: {
      error: {
        code: "INTERNAL",
        message: "Something went wrong on our side. Please try again later.",
        retryable: false,
        correlationId,
        fieldErrors: [],
      },
    },
  };
}

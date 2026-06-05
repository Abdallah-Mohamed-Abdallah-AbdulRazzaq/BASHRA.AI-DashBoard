import { ApiError } from './api';

export function getApiErrorMessage(
  error: unknown,
  lang?: 'ar' | 'en'
): string {
  if (error instanceof ApiError) {
    return error.getDisplayMessage(lang);
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function isForbiddenError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 403;
}

export function isRateLimitError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 429;
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

export function isValidationError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 400;
}

export function isServerError(error: unknown): boolean {
  return error instanceof ApiError && error.status >= 500;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3006';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'bashra_admin_access_token',
  REFRESH_TOKEN: 'bashra_admin_refresh_token',
  ADMIN_USER: 'bashra_admin_user',
};

export class ApiError extends Error {
  status: number;
  success: false;
  message_ar?: string;
  message_en?: string;
  reason?: string;
  errors?: unknown;

  constructor(
    status: number,
    message: string,
    options?: {
      message_ar?: string;
      message_en?: string;
      reason?: string;
      errors?: unknown;
    }
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.success = false;
    this.message_ar = options?.message_ar;
    this.message_en = options?.message_en;
    this.reason = options?.reason;
    this.errors = options?.errors;
  }

  getDisplayMessage(lang?: 'ar' | 'en'): string {
    if (lang === 'ar' && this.message_ar) return this.message_ar;
    if (lang === 'en' && this.message_en) return this.message_en;
    return this.message;
  }
}

export function buildQueryString(params?: Record<string, string | number | boolean | undefined | null>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export function getAdminAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch {
    return null;
  }
}

export function setAdminAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  } catch {
    /* noop */
  }
}

export function getAdminRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch {
    return null;
  }
}

export function setAdminRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  } catch {
    /* noop */
  }
}

export function clearAdminTokens(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch {
    /* noop */
  }
}

export function getStoredAdmin<T = unknown>(): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function setStoredAdmin(admin: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(admin));
  } catch {
    /* noop */
  }
}

export function clearStoredAdmin(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
  } catch {
    /* noop */
  }
}

export function logoutAdmin(): void {
  clearAdminTokens();
  clearStoredAdmin();
}

function extractErrorMessage(body: Record<string, unknown>): string {
  return (
    (body.message_ar as string) ||
    (body.message_en as string) ||
    (body.message as string) ||
    (body.error as string) ||
    'An unexpected error occurred'
  );
}

export function isApiSuccessResponse<T>(
  res: unknown
): res is { success: true; data: T } {
  return (
    typeof res === 'object' &&
    res !== null &&
    (res as Record<string, unknown>).success === true
  );
}

export interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  auth?: boolean;
  isFormData?: boolean;
  signal?: AbortSignal;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    params,
    headers = {},
    auth = true,
    isFormData = false,
    signal,
  } = options;

  const url = `${API_BASE_URL}${endpoint}${buildQueryString(params)}`;

  const requestHeaders: Record<string, string> = { ...headers };

  if (!isFormData) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAdminAccessToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    requestBody = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    throw new ApiError(0, 'Network error. Please check your connection.', {
      reason: 'NETWORK_ERROR',
    });
  }

  const contentType = response.headers.get('content-type') || '';

  let responseBody: unknown;
  if (contentType.includes('application/json')) {
    try {
      responseBody = await response.json();
    } catch {
      if (!response.ok) {
        throw new ApiError(
          response.status,
          `Request failed with status ${response.status}`
        );
      }
      responseBody = null;
    }
  } else {
    responseBody = await response.text();
  }

  if (!response.ok) {
    const status = response.status;

    if (status === 401) {
      logoutAdmin();
    }

    if (typeof responseBody === 'object' && responseBody !== null) {
      const rb = responseBody as Record<string, unknown>;
      throw new ApiError(status, extractErrorMessage(rb), {
        message_ar: rb.message_ar as string | undefined,
        message_en: rb.message_en as string | undefined,
        reason: rb.reason as string | undefined,
        errors: rb.errors,
      });
    }

    throw new ApiError(
      status,
      typeof responseBody === 'string' ? responseBody : `Request failed with status ${status}`
    );
  }

  return responseBody as T;
}

export function apiGet<T>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'GET' });
}

export function apiPost<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'POST', body });
}

export function apiPut<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'PUT', body });
}

export function apiPatch<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'PATCH', body });
}

export function apiDelete<T>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, 'method'>
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
}

export function apiUpload<T>(
  endpoint: string,
  formData: FormData,
  options?: Omit<ApiRequestOptions, 'method' | 'body' | 'isFormData'>
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: formData,
    isFormData: true,
  });
}

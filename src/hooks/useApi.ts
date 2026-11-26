import { useCallback } from 'react';
import { useAuth } from './useAuth';

export function useApi() {
  const { token, logout } = useAuth();

  const request = useCallback(
    async <T = any>(url: string, options: RequestInit = {}): Promise<T> => {
      const headers: Record<string, string> = {
        ...((options.headers as Record<string, string>) || {}),
      };

      if (token && !token.startsWith('admin_local_')) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Only set Content-Type for non-FormData requests
      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      }

      const res = await fetch(url, {
        ...options,
        headers,
      });

      if (res.status === 401) {
        logout();
        throw new Error('Unauthorized');
      }

      const contentType = res.headers.get('content-type') || '';
      let data: any = {};
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        if (!res.ok) {
          throw new Error(`API endpoint unavailable (${res.status})`);
        }
        data = { message: text };
      }

      if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      return data as T;
    },
    [token, logout]
  );

  const apiGet = useCallback(
    <T = any>(url: string): Promise<T> => {
      return request<T>(url, { method: 'GET' });
    },
    [request]
  );

  const apiPost = useCallback(
    <T = any>(url: string, body?: any): Promise<T> => {
      return request<T>(url, {
        method: 'POST',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    },
    [request]
  );

  const apiPut = useCallback(
    <T = any>(url: string, body?: any): Promise<T> => {
      return request<T>(url, {
        method: 'PUT',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    },
    [request]
  );

  const apiDelete = useCallback(
    <T = any>(url: string): Promise<T> => {
      return request<T>(url, { method: 'DELETE' });
    },
    [request]
  );

  const uploadFile = useCallback(
    <T = any>(url: string, formData: FormData): Promise<T> => {
      return request<T>(url, {
        method: 'POST',
        body: formData,
      });
    },
    [request]
  );

  return { apiGet, apiPost, apiPut, apiDelete, uploadFile };
}

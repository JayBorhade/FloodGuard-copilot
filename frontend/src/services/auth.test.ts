import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authService } from './auth';

function response(body: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 401,
    statusText: ok ? 'OK' : 'Unauthorized',
    json: async () => body,
  } as Response;
}

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns an unauthenticated session without a token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({
      authenticated: false,
      user: null,
      message: 'No active session',
    }));
    vi.stubGlobal('fetch', fetchMock);

    const session = await authService.getSession();

    expect(session.authenticated).toBe(false);
    expect(session.user).toBeNull();
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({});
  });

  it('stores an explicit demo token and returns the demo session', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({
      authenticated: true,
      user: {
        uid: 'demo-user',
        email: null,
        display_name: 'FloodGuard Demo',
        role: 'demo',
        is_demo: true,
      },
    })));

    const session = await authService.loginDemo();

    expect(authService.getToken()).toBe('demo-token');
    expect(session.authenticated).toBe(true);
    expect(session.user?.is_demo).toBe(true);
  });

  it('clears the demo token when the backend rejects the session', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ detail: 'Unauthorized' }, false)));
    await expect(authService.loginDemo()).rejects.toThrow('Request failed: 401 Unauthorized');
    expect(authService.getToken()).toBeNull();
  });
});

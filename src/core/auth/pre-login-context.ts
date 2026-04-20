/**
 * pre-login-context.ts
 *
 * Persists data that needs to survive a full page navigation to the login
 * page and back. Uses localStorage (not sessionStorage) because some
 * browsers clear sessionStorage on cross-origin or full-page navigations.
 *
 * All keys are namespaced under "dentiq:prelogin:" to avoid collisions.
 * Data is automatically cleared after it is consumed.
 */

const KEYS = {
  provider:     'dentiq:prelogin:provider',
  oralIQResult: 'dentiq:prelogin:oralIQResult',
  oralIQSelection: 'dentiq:prelogin:oralIQSelection',
  redirectTo:   'dentiq:prelogin:redirectTo',
} as const;

// ── Save ──────────────────────────────────────────────────────────────────────

export interface PreLoginProvider {
  id: string;
  name: string;
  specialty: string;
  address?: string;
  phone?: string;
}

export interface PreLoginContext {
  provider?: PreLoginProvider;
  oralIQResult?: unknown;       // OralIQAssessment — typed as unknown to avoid circular deps
  oralIQSelection?: unknown;    // MouthModelSelection
  redirectTo?: string;
}

export function savePreLoginContext(ctx: PreLoginContext): void {
  if (typeof window === 'undefined') return;

  if (ctx.provider) {
    localStorage.setItem(KEYS.provider, JSON.stringify(ctx.provider));
  }
  if (ctx.oralIQResult) {
    localStorage.setItem(KEYS.oralIQResult, JSON.stringify(ctx.oralIQResult));
  }
  if (ctx.oralIQSelection) {
    localStorage.setItem(KEYS.oralIQSelection, JSON.stringify(ctx.oralIQSelection));
  }
  if (ctx.redirectTo) {
    localStorage.setItem(KEYS.redirectTo, ctx.redirectTo);
  }
}

// ── Read ──────────────────────────────────────────────────────────────────────

export function readPreLoginContext(): PreLoginContext {
  if (typeof window === 'undefined') return {};

  const ctx: PreLoginContext = {};

  try {
    const rawProvider = localStorage.getItem(KEYS.provider);
    if (rawProvider) ctx.provider = JSON.parse(rawProvider) as PreLoginProvider;
  } catch { /* ignore */ }

  try {
    const rawResult = localStorage.getItem(KEYS.oralIQResult);
    if (rawResult) ctx.oralIQResult = JSON.parse(rawResult);
  } catch { /* ignore */ }

  try {
    const rawSelection = localStorage.getItem(KEYS.oralIQSelection);
    if (rawSelection) ctx.oralIQSelection = JSON.parse(rawSelection);
  } catch { /* ignore */ }

  const redirectTo = localStorage.getItem(KEYS.redirectTo);
  if (redirectTo) ctx.redirectTo = redirectTo;

  return ctx;
}

// ── Clear ─────────────────────────────────────────────────────────────────────

export function clearPreLoginContext(): void {
  if (typeof window === 'undefined') return;
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}

// ── Consume (read + clear) ────────────────────────────────────────────────────

/** Read the context and immediately clear it so it is only used once. */
export function consumePreLoginContext(): PreLoginContext {
  const ctx = readPreLoginContext();
  clearPreLoginContext();
  return ctx;
}

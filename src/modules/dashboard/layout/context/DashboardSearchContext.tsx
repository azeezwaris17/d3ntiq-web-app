'use client';

/**
 * DashboardSearchContext
 *
 * Provides a single shared search query string to the entire dashboard.
 *
 * ─── How it works ────────────────────────────────────────────────────────────
 *
 *  1. DashboardLayout wraps all dashboard pages with <DashboardSearchProvider>.
 *
 *  2. DashboardTopbar calls `setQuery` whenever the user types in the search
 *     box. The topbar doesn't know or care what is being searched — it just
 *     updates the shared value.
 *
 *  3. Any page that wants to respond to the search query calls `useDashboardSearch()`
 *     and reads `query`. It then filters its own data however it sees fit.
 *     The page owns its filtering logic — the context owns nothing except the string.
 *
 * ─── How to add search to a new page ─────────────────────────────────────────
 *
 *  import { useDashboardSearch } from '@/modules/dashboard/layout/context/DashboardSearchContext';
 *
 *  export function MyNewPage() {
 *    const { query } = useDashboardSearch();
 *
 *    const filtered = myData.filter((item) =>
 *      item.name.toLowerCase().includes(query.toLowerCase())
 *    );
 *
 *    // render filtered ...
 *  }
 *
 * ─── Scalability notes ────────────────────────────────────────────────────────
 *
 *  - Adding a new searchable page = 1 line: `const { query } = useDashboardSearch()`
 *  - The topbar never needs to change when new pages are added.
 *  - The layout never needs to change when new pages are added.
 *  - When data grows too large for client-side filtering, swap the filter inside
 *    the page for a debounced API call — the context and topbar stay identical.
 *  - The query is cleared automatically on every page navigation so stale
 *    search state never carries over between pages.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

// ─── Shape of the context value ───────────────────────────────────────────────

interface DashboardSearchContextValue {
  /**
   * The current search query string typed by the user.
   * Empty string means "no search active — show everything".
   */
  query: string;

  /**
   * Update the search query.
   * Called by DashboardTopbar on every keystroke.
   */
  setQuery: (value: string) => void;

  /**
   * Convenience helper: returns true when the query is non-empty.
   * Useful for showing/hiding a "clear" button or a "no results" message.
   */
  isSearching: boolean;
}

// ─── Context creation ─────────────────────────────────────────────────────────

/**
 * The context object itself.
 * `undefined` as the default forces consumers to always be inside a Provider —
 * if they're not, `useDashboardSearch` will throw a clear error message.
 */
const DashboardSearchContext = createContext<DashboardSearchContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface DashboardSearchProviderProps {
  children: React.ReactNode;
}

export function DashboardSearchProvider({ children }: DashboardSearchProviderProps) {
  const [query, setQueryState] = useState('');
  const pathname = usePathname();

  /**
   * Clear the search query whenever the user navigates to a different page.
   *
   * Why: if a patient searches "Smith" on the appointments page and then
   * clicks over to their profile, the search box should reset to empty.
   * Without this, the stale query would silently filter the next page's data.
   *
   * We use a ref to track the previous pathname so we only clear on actual
   * navigation, not on re-renders of the same page.
   */
  const prevPathnameRef = React.useRef(pathname);
  React.useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      setQueryState('');
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  /**
   * Stable setter — wrapped in useCallback so the topbar's TextInput
   * doesn't re-render unnecessarily on every parent render.
   */
  const setQuery = useCallback((value: string) => {
    setQueryState(value);
  }, []);

  const value: DashboardSearchContextValue = {
    query,
    setQuery,
    isSearching: query.trim().length > 0,
  };

  return (
    <DashboardSearchContext.Provider value={value}>
      {children}
    </DashboardSearchContext.Provider>
  );
}

// ─── Consumer hook ────────────────────────────────────────────────────────────

/**
 * useDashboardSearch
 *
 * Call this inside any dashboard page or component to access the shared
 * search query.
 *
 * @example
 *   const { query } = useDashboardSearch();
 *   const filtered = appointments.filter(a =>
 *     a.providerName.toLowerCase().includes(query.toLowerCase())
 *   );
 *
 * @throws If called outside of <DashboardSearchProvider> (i.e. outside the
 *         dashboard layout), which is always a programming mistake.
 */
export function useDashboardSearch(): DashboardSearchContextValue {
  const context = useContext(DashboardSearchContext);

  if (context === undefined) {
    throw new Error(
      'useDashboardSearch must be used inside <DashboardSearchProvider>.\n' +
      'Make sure the component is rendered within the DashboardLayout.'
    );
  }

  return context;
}

import { QueryClient } from '@tanstack/react-query';

import { QueryKeys } from './QueryKeys';

/**
 * Dependency hierarchy of the app's query keys.
 *
 * Each entry declares what a query key *depends on* (its upstream data
 * sources). Roots (RECORDS / CATEGORIES / BUDGETS) are written directly by the
 * API and therefore depend on nothing; the derived queries are recomputed from
 * one or more roots.
 *
 *   SUMMARY          -> computed from RECORDS
 *   SUMMARY_FILTER   -> computed from RECORDS
 *   BUDGET_PROGRESS  -> computed from RECORDS + BUDGETS
 *
 * When a root's data changes, every query that (transitively) depends on it is
 * stale and must be invalidated so it refetches. `getKeysToInvalidate` walks
 * this graph to resolve those keys automatically.
 */
export const queryDependencies: Partial<Record<QueryKeys, QueryKeys[]>> = {
  [QueryKeys.SUMMARY]: [QueryKeys.RECORDS],
  [QueryKeys.SUMMARY_FILTER]: [QueryKeys.RECORDS],
  [QueryKeys.BUDGET_PROGRESS]: [QueryKeys.RECORDS, QueryKeys.BUDGETS],
};

/**
 * Given a query key whose underlying data changed, return the full set of keys
 * that should be invalidated: the changed key plus every query that depends on
 * it, directly or transitively.
 */
export const getKeysToInvalidate = (changed: QueryKeys): QueryKeys[] => {
  // Reverse the dependency map: key -> queries that depend on it.
  const dependents: Record<string, QueryKeys[]> = {};
  (Object.keys(queryDependencies) as QueryKeys[]).forEach((key) => {
    queryDependencies[key]!.forEach((dep) => {
      (dependents[dep] ??= []).push(key);
    });
  });

  const toInvalidate = new Set<QueryKeys>([changed]);
  const walk = (key: QueryKeys) => {
    (dependents[key] ?? []).forEach((dependent) => {
      if (!toInvalidate.has(dependent)) {
        toInvalidate.add(dependent);
        walk(dependent);
      }
    });
  };
  walk(changed);

  return [...toInvalidate];
};

/**
 * Invalidate, via the dependency hierarchy, every query affected by a change to
 * `changed`. Safe to call from any mutation hook's `onSuccess`/`onSettled`.
 */
export const invalidateOnChange = (
  queryClient: QueryClient,
  changed: QueryKeys
): Promise<void> => {
  const keys = getKeysToInvalidate(changed);
  return Promise.all(
    keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] }))
  ).then(() => undefined);
};

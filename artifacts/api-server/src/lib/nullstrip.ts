function normalizeValue(v: unknown): unknown {
  if (v === null) return undefined;
  if (v instanceof Date) return v.toISOString();
  return v;
}

export function stripNulls<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, normalizeValue(v)])
  ) as T;
}

export function stripNullsArray<T extends Record<string, unknown>>(arr: T[]): T[] {
  return arr.map(stripNulls);
}

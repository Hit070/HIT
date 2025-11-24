// lib/dedupeStructuredData.ts
export type Schema = Record<string, any>;

// Keep one schema per @type. If multiple schemas of the same @type exist,
// prefer the one with the larger JSON size (heuristic: likely more complete).
export default function dedupeStructuredData(schemas: Schema[] = []) {
  const map = new Map<string, Schema>();

  for (const s of schemas) {
    const t = s?.["@type"] ? String(s["@type"]) : JSON.stringify(s);
    if (!map.has(t)) {
      map.set(t, s);
      continue;
    }

    const existing = map.get(t)!;
    // prefer the schema with more properties / longer JSON representation
    if (JSON.stringify(s).length > JSON.stringify(existing).length) {
      map.set(t, s);
    }
  }

  return Array.from(map.values());
}

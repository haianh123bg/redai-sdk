import type { JsonLdLocalBusiness, BusinessMessage, RawMetadata, LookupResponse } from "../types";

/**
 * Extract JSON-LD schemas from HTML
 */
export function extractJsonLd(html: string): unknown[] {
  const results: unknown[] = [];
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html))) {
    const payload = match[1]?.trim();
    if (!payload) {
      continue;
    }

    try {
      const parsed = JSON.parse(payload);
      results.push(parsed);
    } catch {
      continue;
    }
  }

  return results;
}

/**
 * Find LocalBusiness schema in JSON-LD array
 */
export function findLocalBusiness(jsonLd: unknown[]): JsonLdLocalBusiness | null {
  for (const item of jsonLd) {
    const found = searchLocalBusiness(item);
    if (found) {
      return found;
    }
  }
  return null;
}

function searchLocalBusiness(value: unknown): JsonLdLocalBusiness | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  if (record["@type"] === "LocalBusiness") {
    return record as JsonLdLocalBusiness;
  }

  // Search in nested objects
  for (const key of Object.keys(record)) {
    const nested = record[key];
    if (Array.isArray(nested)) {
      for (const item of nested) {
        const found = searchLocalBusiness(item);
        if (found) return found;
      }
    } else if (typeof nested === "object" && nested !== null) {
      const found = searchLocalBusiness(nested);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Extract canonical URL from HTML
 */
export function extractCanonicalUrl(html: string): string | undefined {
  const match = /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i.exec(html);
  return match?.[1];
}

/**
 * Extract meta tag content by attribute
 */
export function extractMeta(html: string, attrName: string, attrValue: string): string | undefined {
  const pattern = new RegExp(
    `<meta\\s+[^>]*${attrName}=["']${attrValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*content=["']([^"']+)["']`,
    "i"
  );
  const match = pattern.exec(html);
  return match?.[1];
}

/**
 * Safe type readers
 */
export function readString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return undefined;
}

export function readNumber(value: unknown): number | undefined {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  if (typeof value === "string") {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  }
  return undefined;
}

export function readRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

export function readIdentifierValue(business: JsonLdLocalBusiness | null): string | undefined {
  if (!business?.identifier) {
    return undefined;
  }

  const id = business.identifier;
  if (typeof id === "object" && id !== null && "value" in id) {
    return readString(id.value);
  }

  return readString(id);
}

/**
 * Convert JSON-LD LocalBusiness to BusinessMessage
 */
export function convertToBusinessMessage(business: JsonLdLocalBusiness | null): BusinessMessage {
  const address = readRecord(business?.address);
  const founder = readRecord(business?.founder);
  const employees = readRecord(business?.numberOfEmployees);

  return {
    type: "business",
    tax_no: readIdentifierValue(business),
    name: readString(business?.name),
    address: readString(address?.["streetAddress"]),
    address_region: readString(address?.["addressRegion"]),
    address_country: readString(address?.["addressCountry"]),
    issued_date: readString(business?.foundingDate),
    industry: readString(business?.industry),
    department: readString(business?.department),
    rep_name: readString(founder?.["name"]),
    phone: readString(business?.telephone),
    email: readString(business?.email),
    employees: readNumber(employees?.["value"]),
    currency: readString(business?.currenciesAccepted),
    website: readString(business?.url)
  };
}

/**
 * Extract raw metadata from HTML
 */
export function extractRawMetadata(html: string, jsonLd: unknown[]): RawMetadata {
  return {
    canonical_url: extractCanonicalUrl(html),
    og_title: extractMeta(html, "property", "og:title"),
    description: extractMeta(html, "name", "description"),
    json_ld: jsonLd.length ? jsonLd : undefined
  };
}

/**
 * Main parser: Convert HTML response to LookupResponse
 */
export function parseHtmlToLookupResponse(html: string): LookupResponse {
  const jsonLd = extractJsonLd(html);
  const business = findLocalBusiness(jsonLd);
  const message = convertToBusinessMessage(business);
  const raw = extractRawMetadata(html, jsonLd);

  return {
    message,
    raw
  };
}

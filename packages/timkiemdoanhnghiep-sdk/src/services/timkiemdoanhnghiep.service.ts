import {TimkiemDoanhnghiepClient, TimkiemDoanhnghiepError} from "../client";
import type {BusinessMessage, LookupResponse} from "../types";

export class TimkiemDoanhnghiepService {
  private client: TimkiemDoanhnghiepClient;

  constructor(client: TimkiemDoanhnghiepClient) {
    this.client = client;
  }

  async lookup(taxNo: string): Promise<LookupResponse> {
    if (!taxNo) {
      throw new TimkiemDoanhnghiepError("taxNo is required");
    }

    const html = await this.client.getText(`/search/?q=${encodeURIComponent(taxNo)}`);
    return parseLookupHtml(html);
  }
}

function parseLookupHtml(html: string): LookupResponse {
  const jsonLd = extractJsonLd(html);
  const business = findLocalBusiness(jsonLd);

  const address = readRecord(business?.address);
  const founder = readRecord(business?.founder);
  const employees = readRecord(business?.numberOfEmployees);

  const message: BusinessMessage = {
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

  const raw = {
    canonical_url: extractCanonicalUrl(html),
    og_title: extractMeta(html, "property", "og:title"),
    description: extractMeta(html, "name", "description"),
    json_ld: jsonLd.length ? jsonLd : undefined
  };

  return {
    message,
    raw
  };
}

function extractJsonLd(html: string): unknown[] {
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

function findLocalBusiness(jsonLd: unknown[]): Record<string, unknown> | null {
  for (const item of jsonLd) {
    const found = searchLocalBusiness(item);
    if (found) {
      return found;
    }
  }

  return null;
}

function searchLocalBusiness(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  if (record["@type"] === "LocalBusiness") {
    return record;
  }

  const graph = record["@graph"];
  if (Array.isArray(graph)) {
    for (const entry of graph) {
      const found = searchLocalBusiness(entry);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

function readIdentifierValue(business: Record<string, unknown> | null): string | undefined {
  const identifier = business?.identifier;
  const record = readRecord(identifier);
  if (!record) {
    return undefined;
  }

  return readString(record["value"]);
}

function readString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  }

  return undefined;
}

function readRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function readNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function extractCanonicalUrl(html: string): string | undefined {
  const match = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i.exec(html);
  return readString(match?.[1]);
}

function extractMeta(html: string, attr: "name" | "property", key: string): string | undefined {
  const regex = new RegExp(
    `<meta[^>]*${attr}=["']${escapeRegExp(key)}["'][^>]*content=["']([^"']*)["'][^>]*>`,
    "i"
  );
  const match = regex.exec(html);
  return readString(match?.[1]);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

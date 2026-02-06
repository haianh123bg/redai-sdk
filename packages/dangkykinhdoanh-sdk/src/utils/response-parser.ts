import type { EnterpriseItem, SearchResponse } from "../types";

export function parseSearchResponse(rawText: string): SearchResponse {
  const jsonText = rawText.replace(/^RELOAD\s*/i, "").trim();
  
  if (!jsonText || jsonText === "[]") {
    return {
      total: 0,
      enterprises: [],
      raw: rawText
    };
  }

  try {
    const rawItems = JSON.parse(jsonText) as Array<{
      Id: string;
      Name: string;
    }>;

    const enterprises = rawItems.map(item => parseEnterpriseItem(item));

    return {
      total: enterprises.length,
      enterprises,
      raw: rawText
    };
  } catch (error) {
    throw new Error(`Failed to parse search response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function parseEnterpriseItem(item: { Id: string; Name: string }): EnterpriseItem {
  const rawName = item.Name;
  const cleanName = extractCleanName(rawName);
  const registrationNo = extractRegistrationNo(rawName);
  const taxNo = extractTaxNo(rawName);

  return {
    id: item.Id,
    name: cleanName,
    raw_name: rawName,
    registration_no: registrationNo,
    tax_no: taxNo
  };
}

function extractCleanName(html: string): string {
  const match = /<b>(.*?)<\/b>/i.exec(html);
  if (match?.[1]) {
    return decodeHtmlEntities(match[1].trim());
  }

  return stripHtmlTags(html);
}

function extractRegistrationNo(text: string): string | undefined {
  const match = /MSNB:\s*(\d+)/i.exec(text);
  return match?.[1];
}

function extractTaxNo(text: string): string | undefined {
  const match = /MSDN:\s*([\d-]+)/i.exec(text);
  return match?.[1];
}

function stripHtmlTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " "
  };

  return text.replace(/&[#\w]+;/g, (match) => entities[match] || match);
}

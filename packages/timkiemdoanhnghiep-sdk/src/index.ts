import {
  TimkiemDoanhnghiepClient,
  TimkiemDoanhnghiepError,
  type TimkiemDoanhnghiepClientOptions
} from "./client";
import { TimkiemDoanhnghiepService } from "./services/timkiemdoanhnghiep.service";
import type { LookupResponse, BusinessMessage, JsonLdLocalBusiness, RawMetadata } from "./types";
import { parseHtmlToLookupResponse } from "./utils/html-parser";

export { TimkiemDoanhnghiepClient, TimkiemDoanhnghiepError, TimkiemDoanhnghiepService };
export { parseHtmlToLookupResponse };
export type { 
  TimkiemDoanhnghiepClientOptions, 
  LookupResponse, 
  BusinessMessage,
  JsonLdLocalBusiness,
  RawMetadata
};

export async function lookupTax(
  taxNo: string,
  options?: TimkiemDoanhnghiepClientOptions
): Promise<LookupResponse> {
  const client = new TimkiemDoanhnghiepClient(options);
  const service = new TimkiemDoanhnghiepService(client);
  return service.lookup(taxNo);
}

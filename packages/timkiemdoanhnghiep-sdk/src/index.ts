import {
  TimkiemDoanhnghiepClient,
  TimkiemDoanhnghiepError,
  type TimkiemDoanhnghiepClientOptions
} from "./client";
import { TimkiemDoanhnghiepService } from "./services/timkiemdoanhnghiep.service";
import type { LookupResponse, BusinessMessage } from "./types";

export { TimkiemDoanhnghiepClient, TimkiemDoanhnghiepError, TimkiemDoanhnghiepService };
export type { TimkiemDoanhnghiepClientOptions, LookupResponse, BusinessMessage };

export async function lookupTax(
  taxNo: string,
  options?: TimkiemDoanhnghiepClientOptions
): Promise<LookupResponse> {
  const client = new TimkiemDoanhnghiepClient(options);
  const service = new TimkiemDoanhnghiepService(client);
  return service.lookup(taxNo);
}

import { MstClient, MstError, type MstClientOptions } from "./client";
import { MstService } from "./services/mst.service";
import type { LookupResponse, EnterpriseMessage } from "./types";

export { MstClient, MstError, MstService };
export type { MstClientOptions, LookupResponse, EnterpriseMessage };

export async function lookupTax(
  taxNo: string,
  options?: MstClientOptions
): Promise<LookupResponse> {
  const client = new MstClient(options);
  const service = new MstService(client);
  return service.lookup(taxNo);
}

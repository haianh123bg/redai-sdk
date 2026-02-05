import type { LookupResponse } from "../types";
import { MstClient, MstError } from "../client";

export class MstService {
  private client: MstClient;

  constructor(client: MstClient) {
    this.client = client;
  }

  async lookup(taxNo: string): Promise<LookupResponse> {
    if (!taxNo) {
      throw new MstError("taxNo is required");
    }

    return this.client.get<LookupResponse>(`/mst/lookup/${encodeURIComponent(taxNo)}`);
  }
}

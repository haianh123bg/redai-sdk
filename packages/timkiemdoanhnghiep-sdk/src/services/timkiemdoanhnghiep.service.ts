import {TimkiemDoanhnghiepClient, TimkiemDoanhnghiepError} from "../client";
import type {LookupResponse} from "../types";
import {parseHtmlToLookupResponse} from "../utils/html-parser";

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
    return parseHtmlToLookupResponse(html);
  }
}

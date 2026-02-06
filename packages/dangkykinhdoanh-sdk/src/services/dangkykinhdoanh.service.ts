import type { SearchResponse } from "../types";
import { DangKyKinhDoanhClient, DangKyKinhDoanhError } from "../client";
import { parseSearchResponse } from "../utils/response-parser";

export class DangKyKinhDoanhService {
  private client: DangKyKinhDoanhClient;
  private endpoint = "/_layouts/15/NCS.Control.QTDKDN/Ajax/SorlSearchEnterpriseName.ashx";
  private readonly hashValue = "d41d8cd98f00b204e9800998ecf8427e";

  constructor(client: DangKyKinhDoanhClient) {
    this.client = client;
  }

  async search(searchField: string, lang: string = "vn"): Promise<SearchResponse> {
    if (!searchField) {
      throw new DangKyKinhDoanhError("searchField is required");
    }

    const rawText = await this.client.post<string>(this.endpoint, {
      searchField,
      h: this.hashValue,
      lang
    });

    return parseSearchResponse(rawText);
  }
}

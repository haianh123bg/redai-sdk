import { DangKyKinhDoanhClient, DangKyKinhDoanhError, type DangKyKinhDoanhClientOptions } from "./client";
import { DangKyKinhDoanhService } from "./services/dangkykinhdoanh.service";
import type { SearchResponse, EnterpriseItem } from "./types";

export { DangKyKinhDoanhClient, DangKyKinhDoanhError, DangKyKinhDoanhService };
export type { DangKyKinhDoanhClientOptions, SearchResponse, EnterpriseItem };

export async function searchEnterprises(
  searchField: string,
  lang: string = "vn",
  options?: DangKyKinhDoanhClientOptions
): Promise<SearchResponse> {
  const client = new DangKyKinhDoanhClient(options);
  const service = new DangKyKinhDoanhService(client);
  return service.search(searchField, lang);
}

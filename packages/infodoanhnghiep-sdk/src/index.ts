import {
    InfoDoanhNghiepClient,
    InfoDoanhNghiepError,
    type InfoDoanhNghiepClientOptions,
} from "./client";
import { InfoDoanhNghiepService } from "./services/infodoanhnghiep.service";
import type { LookupResponse, CompanyInfo } from "./types";

// Export classes
export { InfoDoanhNghiepClient, InfoDoanhNghiepError, InfoDoanhNghiepService };

// Export types
export type {
    InfoDoanhNghiepClientOptions,
    LookupResponse,
    CompanyInfo,
};

/**
 * Helper function to lookup company by tax code
 * @param maSoThue - Mã số thuế cần tra cứu
 * @param options - Client options
 */
export async function lookupCompany(
    maSoThue: string,
    options?: InfoDoanhNghiepClientOptions
): Promise<LookupResponse> {
    const client = new InfoDoanhNghiepClient(options);
    const service = new InfoDoanhNghiepService(client);
    return service.lookup(maSoThue);
}

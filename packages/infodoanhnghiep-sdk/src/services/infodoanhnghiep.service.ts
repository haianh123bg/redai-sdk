import { InfoDoanhNghiepClient, InfoDoanhNghiepError } from "../client";
import type { LookupResponse, CompanyInfo } from "../types";

export class InfoDoanhNghiepService {
    private client: InfoDoanhNghiepClient;

    constructor(client: InfoDoanhNghiepClient) {
        this.client = client;
    }

    /**
     * Tra cứu doanh nghiệp theo mã số thuế
     * GET https://infodoanhnghiep.com/tim-kiem/auto/{maSoThue}/
     * @param maSoThue - Mã số thuế cần tra cứu
     */
    async lookup(maSoThue: string): Promise<LookupResponse> {
        if (!maSoThue) {
            throw new InfoDoanhNghiepError("maSoThue is required");
        }

        const html = await this.client.get<string>(
            `/tim-kiem/auto/${encodeURIComponent(maSoThue)}/`
        );

        return this.parseHtmlResponse(html);
    }

    private parseHtmlResponse(html: string): LookupResponse {
        const companies: CompanyInfo[] = [];

        // Match all company-item divs
        const companyItemRegex = /<div class="company-item">([\s\S]*?)<\/div><!-- \/\.company-item -->/g;
        let match: RegExpExecArray | null;

        while ((match = companyItemRegex.exec(html)) !== null) {
            const itemHtml = match[1];
            const companyInfo = this.parseCompanyItem(itemHtml);

            if (companyInfo) {
                companies.push(companyInfo);
            }
        }

        return {
            companies,
            totalResults: companies.length,
        };
    }

    private parseCompanyItem(itemHtml: string): CompanyInfo | null {
        // Extract company name and detail URL
        const nameMatch = itemHtml.match(
            /<h3 class="company-name"><a\s+href="([^"]+)"[^>]*>([^<]+)<\/a><\/h3>/
        );
        if (!nameMatch) {
            return null;
        }

        const detailUrl = nameMatch[1];
        const name = this.decodeHtmlEntities(nameMatch[2].trim());

        // Extract city and established date from description
        const descMatch = itemHtml.match(
            /<p class="description[^"]*">.*?<i class="icon-map-marker"><\/i>\s*([^<]+)<i class="icon-clock-o"><\/i>\s*([^<]+)<\/p>/
        );
        const city = descMatch ? this.decodeHtmlEntities(descMatch[1].trim()) : "";
        const establishedDate = descMatch ? descMatch[2].trim() : "";

        // Extract tax code and legal representative
        const taxRepMatch = itemHtml.match(
            /Mã số thuế:\s*(\d+)\s*-\s*Đại diện pháp luật:\s*([^<]+)/
        );
        const taxCode = taxRepMatch ? taxRepMatch[1] : "";
        const legalRepresentative = taxRepMatch
            ? this.decodeHtmlEntities(taxRepMatch[2].trim())
            : "";

        // Extract address
        const addressMatch = itemHtml.match(/Địa chỉ:\s*([^<]+)/);
        const address = addressMatch
            ? this.decodeHtmlEntities(addressMatch[1].trim())
            : "";

        return {
            name,
            taxCode,
            legalRepresentative,
            address,
            city,
            establishedDate,
            detailUrl,
        };
    }

    private decodeHtmlEntities(text: string): string {
        return text
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&apos;/g, "'");
    }
}

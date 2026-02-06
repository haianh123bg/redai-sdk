import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
} from "axios";

export interface InfoDoanhNghiepClientOptions {
    baseUrl?: string;
    axios?: AxiosInstance;
    headers?: Record<string, string>;
    timeoutMs?: number;
}

export class InfoDoanhNghiepError extends Error {
    status?: number;
    body?: unknown;

    constructor(message: string, options?: { status?: number; body?: unknown }) {
        super(message);
        this.name = "InfoDoanhNghiepError";
        this.status = options?.status;
        this.body = options?.body;
    }
}

const DEFAULT_BASE_URL = "https://infodoanhnghiep.com";

export class InfoDoanhNghiepClient {
    private axiosInstance: AxiosInstance;
    private headers?: Record<string, string>;
    readonly baseUrl: string;

    constructor(options: InfoDoanhNghiepClientOptions = {}) {
        const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
        this.baseUrl = baseUrl.replace(/\/$/, "");
        this.headers = options.headers;

        this.axiosInstance =
            options.axios ??
            axios.create({
                baseURL: this.baseUrl,
                timeout: options.timeoutMs,
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "User-Agent": "Mozilla/5.0 (compatible; InfoDoanhNghiepSDK/1.0)",
                    ...options.headers,
                },
            });
    }

    buildUrl(path: string): string {
        if (/^https?:\/\//i.test(path)) {
            return path;
        }

        if (!path.startsWith("/")) {
            return `${this.baseUrl}/${path}`;
        }

        return `${this.baseUrl}${path}`;
    }

    async requestRaw<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await this.axiosInstance.request<T>({
                ...config,
                headers: {
                    ...this.headers,
                    ...config.headers,
                },
            });
        } catch (err: unknown) {
            throw toInfoDoanhNghiepError(err);
        }
    }

    async request<T>(config: AxiosRequestConfig): Promise<T> {
        const res = await this.requestRaw<T>(config);
        return res.data;
    }

    async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({
            ...config,
            method: "GET",
            url: this.buildUrl(path),
        });
    }
}

function toInfoDoanhNghiepError(err: unknown): InfoDoanhNghiepError {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const body = err.response?.data ?? err.message;
        const message = status
            ? `Request failed with status ${status}`
            : "Request failed";
        return new InfoDoanhNghiepError(message, { status, body });
    }

    if (err instanceof InfoDoanhNghiepError) {
        return err;
    }

    return new InfoDoanhNghiepError("Request failed", { body: err });
}

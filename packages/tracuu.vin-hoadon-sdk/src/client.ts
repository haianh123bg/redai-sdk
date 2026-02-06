import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
} from "axios";
import FormData from "form-data";

export interface VinHoadonClientOptions {
    baseUrl?: string;
    cloudinaryCloudName?: string;
    axios?: AxiosInstance;
    headers?: Record<string, string>;
    timeoutMs?: number;
}

export class VinHoadonError extends Error {
    status?: number;
    body?: unknown;

    constructor(message: string, options?: { status?: number; body?: unknown }) {
        super(message);
        this.name = "VinHoadonError";
        this.status = options?.status;
        this.body = options?.body;
    }
}

const TRACUU_BASE_URL = "https://tracuu.vin-hoadon.com";
const CLOUDINARY_BASE_URL = "https://api.cloudinary.com/v1_1";
const DEFAULT_CLOUD_NAME = "dqqt6hlhk";
const UNSIGNED_UPLOAD_PRESET = "unsigned_upload";

export class VinHoadonClient {
    private axiosInstance: AxiosInstance;
    private headers?: Record<string, string>;
    readonly baseUrl: string;
    readonly cloudinaryCloudName: string;

    constructor(options: VinHoadonClientOptions = {}) {
        const baseUrl = options.baseUrl ?? TRACUU_BASE_URL;
        this.baseUrl = baseUrl.replace(/\/$/, "");
        this.cloudinaryCloudName = options.cloudinaryCloudName ?? DEFAULT_CLOUD_NAME;
        this.headers = options.headers;

        this.axiosInstance =
            options.axios ??
            axios.create({
                timeout: options.timeoutMs,
                headers: {
                    Accept: "application/json",
                    ...options.headers,
                },
            });
    }

    buildTracuuUrl(path: string): string {
        if (/^https?:\/\//i.test(path)) {
            return path;
        }

        if (!path.startsWith("/")) {
            return `${this.baseUrl}/${path}`;
        }

        return `${this.baseUrl}${path}`;
    }

    buildCloudinaryUrl(resourceType: "image" | "raw"): string {
        return `${CLOUDINARY_BASE_URL}/${this.cloudinaryCloudName}/${resourceType}/upload`;
    }

    async requestRaw<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await this.axiosInstance.request<T>({
                ...config,
                headers: {
                    Accept: "application/json",
                    ...this.headers,
                    ...config.headers,
                },
            });
        } catch (err: unknown) {
            throw toVinHoadonError(err);
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
            url: this.buildTracuuUrl(path),
        });
    }

    async post<T>(
        path: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        return this.request<T>({
            ...config,
            method: "POST",
            url: this.buildTracuuUrl(path),
            data,
        });
    }

    async postFormData<T>(
        url: string,
        formData: FormData,
        config?: AxiosRequestConfig
    ): Promise<T> {
        return this.request<T>({
            ...config,
            method: "POST",
            url,
            data: formData,
            headers: {
                ...config?.headers,
                ...formData.getHeaders(),
            },
        });
    }

    async uploadToCloudinary<T>(
        resourceType: "image" | "raw",
        file: string
    ): Promise<T> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UNSIGNED_UPLOAD_PRESET);

        return this.postFormData<T>(this.buildCloudinaryUrl(resourceType), formData);
    }
}

function toVinHoadonError(err: unknown): VinHoadonError {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const body = err.response?.data ?? err.message;
        const message = status
            ? `Request failed with status ${status}`
            : "Request failed";
        return new VinHoadonError(message, { status, body });
    }

    if (err instanceof VinHoadonError) {
        return err;
    }

    return new VinHoadonError("Request failed", { body: err });
}

import {
    VinHoadonClient,
    VinHoadonError,
    type VinHoadonClientOptions,
} from "./client";
import { VinHoadonService } from "./services/vin-hoadon.service";
import type {
    RefreshCaptchaResponse,
    RefreshCaptchaResult,
    TraCuuResponse,
    TraCuuResult,
    TraCuuParams,
    CloudinaryImageUploadResponse,
    CloudinaryRawUploadResponse,
    HoaDon,
    ChiTiet,
    ChungThu,
    FileData,
    AbpBaseResponse,
} from "./types";

// Export classes
export { VinHoadonClient, VinHoadonError, VinHoadonService };

// Export types
export type {
    VinHoadonClientOptions,
    RefreshCaptchaResponse,
    RefreshCaptchaResult,
    TraCuuResponse,
    TraCuuResult,
    TraCuuParams,
    CloudinaryImageUploadResponse,
    CloudinaryRawUploadResponse,
    HoaDon,
    ChiTiet,
    ChungThu,
    FileData,
    AbpBaseResponse,
};

/**
 * Helper function to refresh captcha
 */
export async function refreshCaptcha(
    options?: VinHoadonClientOptions
): Promise<RefreshCaptchaResponse> {
    const client = new VinHoadonClient(options);
    const service = new VinHoadonService(client);
    return service.refreshCaptcha();
}

/**
 * Helper function to upload image to Cloudinary
 */
export async function uploadImage(
    file: string,
    options?: VinHoadonClientOptions
): Promise<CloudinaryImageUploadResponse> {
    const client = new VinHoadonClient(options);
    const service = new VinHoadonService(client);
    return service.uploadImage(file);
}

/**
 * Helper function to look up invoice
 */
export async function traCuu(
    params: TraCuuParams,
    options?: VinHoadonClientOptions
): Promise<TraCuuResponse> {
    const client = new VinHoadonClient(options);
    const service = new VinHoadonService(client);
    return service.traCuu(params);
}

/**
 * Helper function to upload raw file to Cloudinary
 */
export async function uploadRaw(
    file: string,
    options?: VinHoadonClientOptions
): Promise<CloudinaryRawUploadResponse> {
    const client = new VinHoadonClient(options);
    const service = new VinHoadonService(client);
    return service.uploadRaw(file);
}

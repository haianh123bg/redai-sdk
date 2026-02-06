import { VinHoadonClient, VinHoadonError } from "../client";
import type {
    RefreshCaptchaResponse,
    TraCuuResponse,
    TraCuuParams,
    CloudinaryImageUploadResponse,
    CloudinaryRawUploadResponse,
} from "../types";

const REFRESH_CAPTCHA_PATH = "/api/services/hddt/TraCuuHoaDon/RefreshCaptcha";
const TRA_CUU_PATH = "/api/services/hddt/TraCuuHoaDon/TraCuu";

export class VinHoadonService {
    private client: VinHoadonClient;

    constructor(client: VinHoadonClient) {
        this.client = client;
    }

    /**
     * Refresh captcha to get a new captcha image and key
     * POST https://tracuu.vin-hoadon.com/api/services/hddt/TraCuuHoaDon/RefreshCaptcha
     */
    async refreshCaptcha(): Promise<RefreshCaptchaResponse> {
        return this.client.post<RefreshCaptchaResponse>(REFRESH_CAPTCHA_PATH);
    }

    /**
     * Upload image to Cloudinary (for captcha image storage, etc.)
     * POST https://api.cloudinary.com/v1_1/dqqt6hlhk/image/upload
     * @param file - Base64 encoded image string or URL
     */
    async uploadImage(file: string): Promise<CloudinaryImageUploadResponse> {
        if (!file) {
            throw new VinHoadonError("file is required for image upload");
        }

        return this.client.uploadToCloudinary<CloudinaryImageUploadResponse>(
            "image",
            file
        );
    }

    /**
     * TraCuu - Look up invoice with captcha verification
     * POST https://tracuu.vin-hoadon.com/api/services/hddt/TraCuuHoaDon/TraCuu
     * @param params - TraCuu parameters including key, captcha, and maSoBiMat
     */
    async traCuu(params: TraCuuParams): Promise<TraCuuResponse> {
        if (!params.key) {
            throw new VinHoadonError("key is required");
        }

        if (!params.captcha) {
            throw new VinHoadonError("captcha is required");
        }

        if (!params.maSoBiMat) {
            throw new VinHoadonError("maSoBiMat is required");
        }

        return this.client.post<TraCuuResponse>(TRA_CUU_PATH, params);
    }

    /**
     * Upload raw file to Cloudinary (for XML, PDF files, etc.)
     * POST https://api.cloudinary.com/v1_1/dqqt6hlhk/raw/upload
     * @param file - Base64 encoded file string or URL
     */
    async uploadRaw(file: string): Promise<CloudinaryRawUploadResponse> {
        if (!file) {
            throw new VinHoadonError("file is required for raw upload");
        }

        return this.client.uploadToCloudinary<CloudinaryRawUploadResponse>(
            "raw",
            file
        );
    }
}

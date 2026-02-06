# @redonvn/tracuu-vin-hoadon-sdk

TypeScript SDK for TracuuVinHoadon invoice lookup.

## Install

```bash
npm install @redonvn/tracuu-vin-hoadon-sdk
```

## Usage

### Using VinHoadonClient and VinHoadonService

```ts
import { VinHoadonClient, VinHoadonService } from "@redonvn/tracuu-vin-hoadon-sdk";

const client = new VinHoadonClient();
const service = new VinHoadonService(client);

// Step 1: Get captcha
const captchaResponse = await service.refreshCaptcha();
console.log("Captcha key:", captchaResponse.result.key);
console.log("Captcha image:", captchaResponse.result.image);

// Step 2: Upload captcha image to Cloudinary (optional)
const imageUpload = await service.uploadImage(captchaResponse.result.image);
console.log("Image URL:", imageUpload.secure_url);

// Step 3: Look up invoice with captcha
const traCuuResult = await service.traCuu({
  key: captchaResponse.result.key,
  captcha: "6241", // User-entered captcha
  maSoBiMat: "2AP7TGLT96NC"
});
console.log("Invoice:", traCuuResult.result.hoaDon);

// Step 4: Upload XML/PDF files to Cloudinary (optional)
if (traCuuResult.result.fileData) {
  const rawUpload = await service.uploadRaw(traCuuResult.result.fileData.fileData);
  console.log("File URL:", rawUpload.secure_url);
}
```

### One-off helpers

```ts
import { refreshCaptcha, traCuu, uploadImage, uploadRaw } from "@redonvn/tracuu-vin-hoadon-sdk";

// Refresh captcha
const captcha = await refreshCaptcha();
console.log(captcha.result.key);

// Look up invoice
const result = await traCuu({
  key: "2c19874e-6608-46aa-aa5f-af7e8606f536",
  captcha: "6241",
  maSoBiMat: "2AP7TGLT96NC"
});
console.log(result.result.hoaDon?.dnBan_Ten);

// Upload image to Cloudinary
const imageResponse = await uploadImage("data:image/png;base64,...");
console.log(imageResponse.secure_url);

// Upload raw file to Cloudinary
const rawResponse = await uploadRaw("data:application/xml;base64,...");
console.log(rawResponse.secure_url);
```

## Configuration

```ts
const client = new VinHoadonClient({
  baseUrl: "https://tracuu.vin-hoadon.com", // Default
  cloudinaryCloudName: "dqqt6hlhk", // Default
  timeoutMs: 30000
});
```

## API Endpoints

### 1. RefreshCaptcha
- **Method**: POST
- **URL**: `https://tracuu.vin-hoadon.com/api/services/hddt/TraCuuHoaDon/RefreshCaptcha`
- **Description**: Get a new captcha image and key for invoice lookup

### 2. TraCuu
- **Method**: POST
- **URL**: `https://tracuu.vin-hoadon.com/api/services/hddt/TraCuuHoaDon/TraCuu`
- **Description**: Look up invoice with captcha verification
- **Parameters**:
  - `key`: Captcha key from RefreshCaptcha
  - `captcha`: User-entered captcha code
  - `maSoBiMat`: Secret code from invoice

### 3. Upload Image to Cloudinary
- **Method**: POST
- **URL**: `https://api.cloudinary.com/v1_1/dqqt6hlhk/image/upload`
- **Description**: Upload image to Cloudinary using unsigned upload preset

### 4. Upload Raw to Cloudinary
- **Method**: POST
- **URL**: `https://api.cloudinary.com/v1_1/dqqt6hlhk/raw/upload`
- **Description**: Upload raw files (XML, PDF, etc.) to Cloudinary using unsigned upload preset

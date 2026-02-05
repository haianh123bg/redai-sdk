import FormData from "form-data";
import type { NeacClientOptions } from "../client";
import { NeacClient, NeacError } from "../client";
import type { NeacVerifyResponse, VerifyFileInput, VerifyFileResolved } from "../types";

export interface NeacVerifyServiceOptions extends NeacClientOptions {
  verifyUrl?: string;
}

export class NeacVerifyService {
  private client: NeacClient;
  private verifyUrl: string;

  constructor(options: NeacVerifyServiceOptions = {}) {
    this.client = new NeacClient(options);
    this.verifyUrl = options.verifyUrl ?? "https://neac.gov.vn/vi/Home/VerifyFileByNeac";
  }

  async verifyFile(input: VerifyFileInput): Promise<NeacVerifyResponse> {
    const resolved = await this.resolveInput(input);

    const formData = new FormData();
    formData.append("file", resolved.data, {
      filename: resolved.filename,
      contentType: resolved.mimeType
    });

    return this.client.request<NeacVerifyResponse>({
      method: "POST",
      url: this.verifyUrl,
      data: formData,
      headers: {
        ...formData.getHeaders()
      }
    });
  }

  private async resolveInput(input: VerifyFileInput): Promise<VerifyFileResolved> {
    if ("url" in input) {
      return this.downloadFromUrl(input.url, input.filename, input.mimeType);
    }

    const data = toBuffer(input.buffer);
    const filename = input.filename ?? "file";
    return {
      data,
      filename,
      mimeType: input.mimeType
    };
  }

  private async downloadFromUrl(
    url: string,
    filename?: string,
    mimeType?: string
  ): Promise<VerifyFileResolved> {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      throw new NeacError("Invalid url");
    }

    const res = await this.client.requestRaw<ArrayBuffer>({
      method: "GET",
      url: parsedUrl.toString(),
      responseType: "arraybuffer"
    });

    const data = toBuffer(res.data);
    const headerFilename = filenameFromContentDisposition(
      (res.headers["content-disposition"] as string | undefined) ?? ""
    );
    const resolvedFilename = filename ?? headerFilename ?? filenameFromUrl(parsedUrl);
    const resolvedMimeType = mimeType ?? (res.headers["content-type"] as string | undefined);

    return {
      data,
      filename: resolvedFilename,
      mimeType: resolvedMimeType
    };
  }
}

function toBuffer(value: Buffer | Uint8Array | ArrayBuffer): Buffer {
  if (Buffer.isBuffer(value)) {
    return value;
  }

  if (value instanceof ArrayBuffer) {
    return Buffer.from(value);
  }

  return Buffer.from(value);
}

function filenameFromContentDisposition(header: string): string | undefined {
  if (!header) {
    return undefined;
  }

  const match = /filename\*?=(?:UTF-8''|\")?([^;\"\n]+)/i.exec(header);
  if (!match?.[1]) {
    return undefined;
  }

  try {
    return decodeURIComponent(match[1].trim().replace(/"/g, ""));
  } catch {
    return match[1].trim().replace(/"/g, "");
  }
}

function filenameFromUrl(url: URL): string {
  const pathname = url.pathname || "";
  const name = pathname.split("/").filter(Boolean).pop();
  return name || "file";
}

export interface NeacVerifyResponse {
  signature: {
    data: Array<{
      issuer: {
        cn?: string | null;
        o?: string | null;
        l?: string | null;
        c?: string | null;
        mst?: string | null;
        cccd?: string | null;
      };
      signer: {
        cn?: string | null;
        o?: string | null;
        l?: string | null;
        c?: string | null;
        mst?: string | null;
        cccd?: string | null;
      };
      intact?: string;
      certificateValidity?: string;
      validity?: string;
      timestampStatus?: string;
      signedTime?: string;
      reasonInvalidity?: string;
      ocsp?: string;
      crl?: string;
    }>;
    message?: string;
    status?: number;
  };
}

export type VerifyFileInput =
  | {
      buffer: Buffer | Uint8Array | ArrayBuffer;
      filename?: string;
      mimeType?: string;
    }
  | {
      url: string;
      filename?: string;
      mimeType?: string;
    };

export interface VerifyFileResolved {
  data: Buffer;
  filename: string;
  mimeType?: string;
}

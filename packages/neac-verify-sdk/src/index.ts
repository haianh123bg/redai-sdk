import { NeacClient, NeacError, type NeacClientOptions } from "./client";
import { NeacVerifyService, type NeacVerifyServiceOptions } from "./services/neac-verify.service";
import type { NeacVerifyResponse, VerifyFileInput } from "./types";

export { NeacClient, NeacError, NeacVerifyService };
export type { NeacClientOptions, NeacVerifyServiceOptions, NeacVerifyResponse, VerifyFileInput };

export async function verifyFile(
  input: VerifyFileInput,
  options?: NeacVerifyServiceOptions
): Promise<NeacVerifyResponse> {
  const service = new NeacVerifyService(options);
  return service.verifyFile(input);
}

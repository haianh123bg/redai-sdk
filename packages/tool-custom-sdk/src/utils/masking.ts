const DEFAULT_SENSITIVE_HEADERS = new Set([
  'authorization',
  'proxy-authorization',
  'cookie',
  'set-cookie',
]);

export function maskHeaderValue(_key: string, value: string): string {
  if (!value) return value;
  return '***';
}

export function maskHeaders(
  headers: Record<string, string>,
  opts?: { additionalSensitiveHeaderNames?: string[] },
): Record<string, string> {
  const sensitive = new Set(DEFAULT_SENSITIVE_HEADERS);
  for (const h of opts?.additionalSensitiveHeaderNames ?? []) sensitive.add(h.toLowerCase());

  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    if (sensitive.has(k.toLowerCase())) out[k] = maskHeaderValue(k, v);
    else out[k] = v;
  }
  return out;
}

export function maskSecretsInVariables(
  vars: Array<{ key: string; value?: string; isSecret?: boolean }>,
): Array<{ key: string; value?: string; isSecret?: boolean }> {
  return vars.map((v) => {
    const out: { key: string; value?: string; isSecret?: boolean } = { key: v.key };
    if (v.isSecret !== undefined) {
      out.isSecret = v.isSecret;
    }
    if (v.isSecret) {
      out.value = '***';
    } else if (v.value !== undefined) {
      out.value = v.value;
    }
    return out;
  });
}

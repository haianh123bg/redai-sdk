export interface VariableSource {
  [key: string]: string | undefined;
}

const VAR_PATTERN = /\{\{\s*([a-zA-Z0-9_\-\.]+)\s*\}\}/g;

export function resolveTemplate(input: string, vars: VariableSource): string {
  return input.replace(VAR_PATTERN, (_m: string, name: string) => {
    const value = vars[name];
    return value === undefined ? '' : value;
  });
}

export function buildVariableSource(sources: Array<VariableSource | undefined>): VariableSource {
  const out: VariableSource = {};
  for (const source of sources) {
    if (!source) continue;
    for (const [key, value] of Object.entries(source)) {
      out[key] = value;
    }
  }
  return out;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function resolveDeep<T>(value: T, vars: VariableSource): T {
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    return resolveTemplate(value, vars) as T;
  }

  if (Array.isArray(value)) {
    const resolved = value.map((item: unknown) => resolveDeep(item, vars));
    return resolved as T;
  }

  if (isRecord(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      out[key] = resolveDeep(nested, vars);
    }
    return out as T;
  }

  return value;
}

import { createHash } from 'crypto';

import { AuthConfig, AuthProfile } from '../types/auth';
import {
  ApiFolder,
  ApiOperation,
  Environment,
  EnvironmentVariable,
  FileUrlRef,
  HttpMethod,
  RequestBodyDefinition,
  RequestBodyField,
  RequestDefinition,
  RequestParamItem,
} from '../types/ir';
import { Schema, SchemaType } from '../types/schema';

type PostmanKv = {
  key?: string;
  value?: string;
  disabled?: boolean;
  description?: string;
  type?: string;
  src?: string;
};

type PostmanUrl = {
  raw?: string;
  protocol?: string;
  host?: string[] | string;
  path?: string[] | string;
  variable?: PostmanKv[];
  query?: PostmanKv[];
};

type PostmanRequest = {
  method?: string;
  name?: string;
  url?: PostmanUrl | string;
  header?: PostmanKv[];
  body?: {
    mode?: string;
    raw?: string;
    urlencoded?: PostmanKv[];
    formdata?: PostmanKv[];
    file?: { src?: string };
  };
  auth?: PostmanAuth;
};

type PostmanItem = {
  name?: string;
  item?: PostmanItem[];
  request?: PostmanRequest;
  auth?: PostmanAuth;
};

type PostmanCollection = {
  item?: PostmanItem[];
  auth?: PostmanAuth;
  variable?: PostmanKv[];
};

type PostmanAuthAttribute = { key?: string; value?: string };

type PostmanAuth = {
  type?: string;
  bearer?: PostmanAuthAttribute[];
  basic?: PostmanAuthAttribute[];
  apikey?: PostmanAuthAttribute[];
  awsv4?: PostmanAuthAttribute[];
};

export interface ImportPostmanOptions {
  collectionId: string;
  versionId: string;
  defaultFolderParentId?: string;
}

export interface ImportPostmanResult {
  folders: ApiFolder[];
  operations: ApiOperation[];
  authProfiles: AuthProfile[];
  environments: Environment[];
}

export class PostmanImporter {
  import(input: { collection: PostmanCollection; options: ImportPostmanOptions }): ImportPostmanResult {
    const col = input.collection;

    const folders: ApiFolder[] = [];
    const operations: ApiOperation[] = [];
    const authProfiles: AuthProfile[] = [];
    const environments: Environment[] = [];

    const toolNameCounts = new Map<string, number>();

    const collectionAuth = mapPostmanAuth(col.auth);

    if (collectionAuth && collectionAuth.type !== 'none') {
      authProfiles.push({
        id: `${input.options.collectionId}:${input.options.versionId}:auth:default`,
        collectionId: input.options.collectionId,
        versionId: input.options.versionId,
        name: 'default',
        isDefault: true,
        enabled: true,
        config: collectionAuth,
      });
    }

    const envVars: EnvironmentVariable[] = Array.isArray(col.variable)
      ? col.variable
          .filter((v: PostmanKv) => typeof v.key === 'string')
          .map((v: PostmanKv) => createEnvironmentVariable(v))
      : [];

    if (envVars.length > 0) {
      environments.push({
        id: `${input.options.collectionId}:${input.options.versionId}:env:collection`,
        collectionId: input.options.collectionId,
        name: 'collection',
        variables: envVars,
      });
    }

    const rootItems: PostmanItem[] = Array.isArray(col.item) ? col.item : [];
    const folderOrder = new Map<string, number>();

    for (const item of rootItems) {
      const walkParams: {
        item: PostmanItem;
        collectionId: string;
        versionId: string;
        folders: ApiFolder[];
        folderOrder: Map<string, number>;
        operations: ApiOperation[];
        toolNameCounts: Map<string, number>;
        parentFolderId?: string;
        defaultAuthProfileId?: string;
      } = {
        item,
        collectionId: input.options.collectionId,
        versionId: input.options.versionId,
        folders,
        folderOrder,
        operations,
        toolNameCounts,
      };
      if (input.options.defaultFolderParentId !== undefined) {
        walkParams.parentFolderId = input.options.defaultFolderParentId;
      }
      if (authProfiles[0]?.id !== undefined) {
        walkParams.defaultAuthProfileId = authProfiles[0].id;
      }
      this.walkItem(walkParams);
    }

    return { folders, operations, authProfiles, environments };
  }

  private walkItem(params: {
    item: PostmanItem;
    parentFolderId?: string;
    collectionId: string;
    versionId: string;
    folders: ApiFolder[];
    folderOrder: Map<string, number>;
    operations: ApiOperation[];
    toolNameCounts: Map<string, number>;
    defaultAuthProfileId?: string;
  }): void {
    const item = params.item;
    const isFolder = Array.isArray(item.item);

    if (isFolder) {
      const name = String(item.name ?? 'folder');
      const folderId = `${params.collectionId}:${params.versionId}:folder:${hash(name)}:${params.folders.length + 1}`;

      if (!params.folderOrder.has(folderId)) {
        params.folderOrder.set(folderId, params.folderOrder.size + 1);
      }

      const folderAuth = mapPostmanAuth(item.auth);

      const folder: ApiFolder = {
        id: folderId,
        collectionId: params.collectionId,
        versionId: params.versionId,
        name,
        authMode: folderAuth ? 'override' : 'inherit',
      };
      if (params.parentFolderId !== undefined) {
        folder.parentId = params.parentFolderId;
      }
      const order = params.folderOrder.get(folderId);
      if (order !== undefined) {
        folder.order = order;
      }
      if (folderAuth !== undefined) {
        folder.auth = folderAuth;
      }
      if (params.defaultAuthProfileId !== undefined) {
        folder.authRefId = params.defaultAuthProfileId;
      }
      params.folders.push(folder);

      for (const child of item.item ?? []) {
        this.walkItem({
          ...params,
          item: child,
          parentFolderId: folderId,
        });
      }

      return;
    }

    const request = item.request;
    if (!request) return;

    const method = String(request.method ?? 'GET').toUpperCase() as HttpMethod;
    const { urlTemplate, pathParams, queryParams } = parsePostmanUrl(request.url);

    const headers: RequestParamItem[] = Array.isArray(request.header)
      ? request.header
          .filter((h: PostmanKv) => typeof h.key === 'string')
          .map((h: PostmanKv) => createRequestParamItem(h, { fallbackValue: '' }))
      : [];

    const body = parsePostmanBody(request.body);

    const toolNameBase = normalizeToolName(String(item.name ?? request.name ?? 'request'));
    const toolName = ensureUniqueToolName(toolNameBase, params.toolNameCounts);

    const opId = `${params.collectionId}:${params.versionId}:pm:${method}:${hash(urlTemplate)}:${toolName}`;

    const toolInputParams: {
      pathParams: RequestParamItem[];
      queryParams: RequestParamItem[];
      headers: RequestParamItem[];
      body?: RequestBodyDefinition;
    } = {
      pathParams,
      queryParams,
      headers,
    };
    if (body !== undefined) {
      toolInputParams.body = body;
    }
    const { schema: toolInputSchema } = buildToolInputSchema(toolInputParams);

    const reqAuth = mapPostmanAuth(item.auth ?? request.auth);

    const requestDefinition: RequestDefinition = {
      id: opId,
      operationId: toolName,
      urlTemplate,
      method,
      pathParams,
      queryParams,
      headers,
      authMode: reqAuth ? 'override' : 'inherit',
    };
    if (params.parentFolderId !== undefined) {
      requestDefinition.folderId = params.parentFolderId;
    }
    if (reqAuth !== undefined) {
      requestDefinition.auth = reqAuth;
    }
    if (params.defaultAuthProfileId !== undefined) {
      requestDefinition.authRefId = params.defaultAuthProfileId;
    }
    if (body !== undefined) {
      requestDefinition.body = body;
    }

    const op: ApiOperation = {
      id: opId,
      collectionId: params.collectionId,
      versionId: params.versionId,
      toolName,
      method,
      path: urlTemplate,
      name: String(item.name ?? ''),
      toolInputSchema,
      requestDefinition,
    };
    if (params.parentFolderId !== undefined) {
      op.folderId = params.parentFolderId;
    }

    params.operations.push(op);
  }
}

function parsePostmanUrl(url: PostmanUrl | string | undefined): {
  urlTemplate: string;
  pathParams: RequestParamItem[];
  queryParams: RequestParamItem[];
} {
  if (!url) {
    return { urlTemplate: '', pathParams: [], queryParams: [] };
  }

  const raw = typeof url === 'string' ? url : String(url.raw ?? buildUrlFromParts(url));

  const pathParams: RequestParamItem[] =
    typeof url === 'string' || !Array.isArray(url.variable)
      ? []
      : url.variable
          .filter((v: PostmanKv) => typeof v.key === 'string')
          .map((v: PostmanKv) => createRequestParamItem(v, { fallbackValue: '', forceEnabled: true }));

  const queryParams: RequestParamItem[] =
    typeof url === 'string' || !Array.isArray(url.query)
      ? []
      : url.query
          .filter((q: PostmanKv) => typeof q.key === 'string')
          .map((q: PostmanKv) => createRequestParamItem(q, { fallbackValue: '' }));

  return { urlTemplate: raw, pathParams, queryParams };
}

function buildUrlFromParts(url: PostmanUrl): string {
  const protocol = url.protocol ? `${url.protocol}://` : '';
  const host = Array.isArray(url.host) ? url.host.join('.') : url.host ?? '';
  const path = Array.isArray(url.path) ? `/${url.path.join('/')}` : url.path ?? '';
  return `${protocol}${host}${path}`;
}

function parsePostmanBody(
  body:
    | {
        mode?: string;
        raw?: string;
        urlencoded?: PostmanKv[];
        formdata?: PostmanKv[];
        file?: { src?: string };
      }
    | undefined,
): RequestBodyDefinition | undefined {
  if (!body || typeof body !== 'object') return undefined;

  const mode = String(body.mode ?? '').toLowerCase();

  if (mode === 'raw') {
    const rawBody: RequestBodyDefinition = {
      mode: 'raw',
    };
    if (body.raw !== undefined) {
      rawBody.rawText = body.raw;
    }
    return rawBody;
  }

  if (mode === 'urlencoded') {
    const fields: RequestBodyField[] = Array.isArray(body.urlencoded)
      ? body.urlencoded
          .filter((f: PostmanKv) => typeof f.key === 'string')
          .map((f: PostmanKv) => createRequestBodyField({ key: f.key ?? '', type: 'text', value: f.value, enabled: !f.disabled }))
      : [];

    return {
      mode: 'urlencoded',
      contentType: 'application/x-www-form-urlencoded',
      fields,
    };
  }

  if (mode === 'formdata') {
    const fields: RequestBodyField[] = Array.isArray(body.formdata)
      ? body.formdata
          .filter((f: PostmanKv) => typeof f.key === 'string')
          .map((f: PostmanKv) =>
            createRequestBodyField({
              key: f.key ?? '',
              type: f.type === 'file' ? 'file' : 'text',
              value: f.type === 'file' ? tryMapFileRef(f.src) : f.value,
              enabled: !f.disabled,
            }),
          )
      : [];

    return {
      mode: 'multipart',
      contentType: 'multipart/form-data',
      fields,
    };
  }

  if (mode === 'file') {
    const ref = tryMapFileRef(body.file?.src);
    if (!ref) return { mode: 'binary', contentType: 'application/octet-stream' };
    return { mode: 'binary', contentType: 'application/octet-stream', binary: ref };
  }

  return undefined;
}

function tryMapFileRef(src: string | undefined): FileUrlRef | undefined {
  if (!src || typeof src !== 'string') return undefined;
  if (src.startsWith('http://') || src.startsWith('https://')) return { url: src };
  return undefined;
}

function buildToolInputSchema(params: {
  pathParams: RequestParamItem[];
  queryParams: RequestParamItem[];
  headers: RequestParamItem[];
  body?: RequestBodyDefinition;
}): { schema: Schema } {
  const schema: Schema = {
    type: SchemaType.OBJECT,
    properties: {},
  };

  if (params.pathParams.length > 0) {
    schema.properties!.path = {
      type: SchemaType.OBJECT,
      additionalProperties: { type: SchemaType.STRING },
    };
  }

  if (params.queryParams.length > 0) {
    schema.properties!.query = {
      type: SchemaType.OBJECT,
      additionalProperties: { type: SchemaType.STRING },
    };
  }

  if (params.headers.length > 0) {
    schema.properties!.headers = {
      type: SchemaType.OBJECT,
      additionalProperties: { type: SchemaType.STRING },
    };
  }

  if (params.body) {
    schema.properties!.body = inferBodySchema(params.body);
  }

  return { schema };
}

function inferBodySchema(body: RequestBodyDefinition): Schema {
  if (body.mode === 'raw') {
    return {
      type: SchemaType.STRING,
      nullable: true,
    };
  }

  if (body.mode === 'urlencoded') {
    return {
      type: SchemaType.OBJECT,
      additionalProperties: { type: SchemaType.STRING },
      nullable: true,
    };
  }

  if (body.mode === 'multipart' || body.mode === 'form-data') {
    const props: { [key: string]: Schema } = {};
    for (const f of body.fields ?? []) {
      if (!f.key) continue;
      if (f.type === 'file') {
        props[f.key] = {
          type: SchemaType.OBJECT,
          properties: {
            url: { type: SchemaType.STRING },
            filename: { type: SchemaType.STRING },
          },
          required: ['url'],
        };
      } else {
        props[f.key] = { type: SchemaType.STRING };
      }
    }

    return {
      type: SchemaType.OBJECT,
      properties: props,
      nullable: true,
    };
  }

  if (body.mode === 'binary') {
    return {
      type: SchemaType.OBJECT,
      properties: {
        url: { type: SchemaType.STRING },
        filename: { type: SchemaType.STRING },
      },
      required: ['url'],
    };
  }

  return { type: SchemaType.OBJECT, additionalProperties: true, nullable: true };
}

function findAuthValue(items: PostmanAuthAttribute[] | undefined, key: string): string | undefined {
  if (!Array.isArray(items)) return undefined;
  return items.find((x: PostmanAuthAttribute) => x.key === key)?.value;
}

function mapPostmanAuth(auth: PostmanAuth | undefined): AuthConfig | undefined {
  if (!auth || typeof auth !== 'object') return undefined;

  const type = String(auth.type ?? '').toLowerCase();

  if (type === 'noauth' || type === 'none') return { type: 'none' };

  if (type === 'bearer') {
    const bearer: Extract<AuthConfig, { type: 'bearer' }> = { type: 'bearer' };
    const token = findAuthValue(auth.bearer, 'token');
    if (token !== undefined) {
      bearer.token = token;
    }
    return bearer;
  }

  if (type === 'basic') {
    const basic: Extract<AuthConfig, { type: 'basic' }> = {
      type: 'basic',
    };
    const username = findAuthValue(auth.basic, 'username');
    const password = findAuthValue(auth.basic, 'password');
    if (username !== undefined) {
      basic.username = username;
    }
    if (password !== undefined) {
      basic.password = password;
    }
    return basic;
  }

  if (type === 'apikey') {
    const key = findAuthValue(auth.apikey, 'key');
    const value = findAuthValue(auth.apikey, 'value');
    const inValue = findAuthValue(auth.apikey, 'in');

    const apiKey: Extract<AuthConfig, { type: 'apiKey' }> = {
      type: 'apiKey',
      placement: inValue === 'query' ? 'query' : 'header',
    };
    if (inValue === 'header' && key !== undefined) {
      apiKey.headerName = key;
    }
    if (inValue === 'query' && key !== undefined) {
      apiKey.queryParamName = key;
    }
    if (value !== undefined) {
      apiKey.token = value;
    }
    return apiKey;
  }

  if (type === 'awsv4') {
    const awsConfig: NonNullable<Extract<AuthConfig, { type: 'awsSigV4' }>['awsSigV4']> = {};
    const accessKeyId = findAuthValue(auth.awsv4, 'accessKey');
    const secretAccessKey = findAuthValue(auth.awsv4, 'secretKey');
    const sessionToken = findAuthValue(auth.awsv4, 'sessionToken');
    const region = findAuthValue(auth.awsv4, 'region');
    const service = findAuthValue(auth.awsv4, 'service');
    if (accessKeyId !== undefined) awsConfig.accessKeyId = accessKeyId;
    if (secretAccessKey !== undefined) awsConfig.secretAccessKey = secretAccessKey;
    if (sessionToken !== undefined) awsConfig.sessionToken = sessionToken;
    if (region !== undefined) awsConfig.region = region;
    if (service !== undefined) awsConfig.service = service;

    const aws: Extract<AuthConfig, { type: 'awsSigV4' }> = { type: 'awsSigV4' };
    if (Object.keys(awsConfig).length > 0) {
      aws.awsSigV4 = awsConfig;
    }
    return aws;
  }

  return { type: 'custom', custom: { providerId: `postman:${type}` } };
}

function normalizeToolName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_');
}

function ensureUniqueToolName(base: string, counts: Map<string, number>): string {
  const cur = counts.get(base) ?? 0;
  if (cur === 0) {
    counts.set(base, 1);
    return base;
  }

  const next = cur + 1;
  counts.set(base, next);
  return `${base}__${next}`;
}

function hash(input: string): string {
  return createHash('sha1').update(input).digest('hex').slice(0, 12);
}

function createEnvironmentVariable(source: PostmanKv): EnvironmentVariable {
  const variable: EnvironmentVariable = {
    key: source.key ?? '',
    enabled: source.disabled ? false : true,
    isSecret: false,
  };
  if (source.value !== undefined) {
    variable.value = source.value;
  }
  return variable;
}

function createRequestParamItem(source: PostmanKv, options?: { fallbackValue?: string; forceEnabled?: boolean }): RequestParamItem {
  const item: RequestParamItem = {
    key: source.key ?? '',
    enabled: options?.forceEnabled ?? (source.disabled ? false : true),
  };
  if (source.value !== undefined) {
    item.value = source.value;
  } else if (options?.fallbackValue !== undefined) {
    item.value = options.fallbackValue;
  }
  if (source.description !== undefined) {
    item.description = source.description;
  }
  return item;
}

function createRequestBodyField(input: {
  key: string;
  type: 'text' | 'file';
  value: string | FileUrlRef | undefined;
  enabled: boolean;
}): RequestBodyField {
  const field: RequestBodyField = {
    key: input.key,
    type: input.type,
    enabled: input.enabled,
  };
  if (input.value !== undefined) {
    field.value = input.value;
  }
  return field;
}

# @redonvn/event-ws-cliproxyapi-sdk

TypeScript SDK cho CLIProxyAPI, gồm:
- HTTP clients cho OpenAI/Claude/Gemini/Cliproxy/Management
- WebSocket relay provider cho endpoint `/v1/ws`

## 1) Cấu trúc dự án

```text
.
├─ src/
│  ├─ index.ts                # Barrel export toàn bộ SDK
│  ├─ openai/                 # OpenAI-compatible client
│  ├─ claude/                 # Claude-compatible client
│  ├─ gemini/                 # Gemini-compatible client
│  ├─ cliproxy/               # Client cho endpoint riêng của CLIProxyAPI
│  ├─ management/             # Client cho /v0/management/*
│  ├─ ws/                     # WebSocket client/provider + codec + types
│  └─ shared/                 # Kiểu dữ liệu dùng chung + APIError
├─ dist/                      # Output sau khi build (js + d.ts)
├─ package.json
├─ tsconfig.json
└─ README.md
```

## 2) Ý nghĩa từng folder trong `src`

- `src/openai`: request/response cho các API kiểu OpenAI (`/v1/models`, `/v1/chat/completions`, ...).
- `src/claude`: client cho endpoint Claude (`/v1/messages`, `/v1/messages/count_tokens`, ...).
- `src/gemini`: client cho endpoint Gemini (`/v1beta/models`, `v1internal:*`, ...).
- `src/cliproxy`: endpoint đặc thù của CLIProxyAPI (`/v1/cliproxy/*`, callback, keep-alive, ...).
- `src/management`: API quản trị dưới `/v0/management/*` (config, key, debug, usage, ...).
- `src/ws`: lớp WebSocket relay provider/client và các hàm encode/decode protocol.
- `src/shared`: type chung và lỗi chuẩn `APIError`.
- `src/index.ts`: export tập trung để consumer import từ package root.

## 3) Cài đặt

```bash
npm i @redonvn/event-ws-cliproxyapi-sdk
```

## 4) Yêu cầu môi trường

- Node.js 18+ (khuyến nghị, có sẵn `fetch`)
- TypeScript 5+ nếu dùng type đầy đủ

## 5) Cách dùng nhanh (HTTP)

```ts
import {
  OpenAIClient,
  ClaudeClient,
  GeminiClient,
  CliproxyClient,
  ManagementClient,
  APIError
} from '@redonvn/event-ws-cliproxyapi-sdk';

const baseUrl = 'http://127.0.0.1:8317';

const openai = new OpenAIClient({
  baseUrl,
  accessKey: process.env.ACCESS_KEY
});

const claude = new ClaudeClient({
  baseUrl,
  accessKey: process.env.ACCESS_KEY
});

const gemini = new GeminiClient({
  baseUrl,
  accessKey: process.env.ACCESS_KEY
});

const cliproxy = new CliproxyClient({
  baseUrl,
  accessKey: process.env.ACCESS_KEY,
  managementKey: process.env.MANAGEMENT_KEY,
  localPassword: process.env.LOCAL_PASSWORD
});

const management = new ManagementClient({
  baseUrl,
  managementKey: process.env.MANAGEMENT_KEY
});

try {
  const models = await openai.getModels();
  console.log(models.data.length);
} catch (err) {
  if (err instanceof APIError) {
    console.error(err.status, err.message, err.payload);
  }
}
```

## 6) Cách dùng WebSocket provider

```ts
import { CliproxyWSProvider } from '@redonvn/event-ws-cliproxyapi-sdk';

const provider = new CliproxyWSProvider({
  baseUrl: 'http://127.0.0.1:8317',
  accessKey: process.env.ACCESS_KEY
});

await provider.connect({
  onEvent: (ev) => {
    if (ev.type === 'ws:open') console.log('connected');
    if (ev.type === 'ws:close') console.log('closed', ev.code, ev.reason);
    if (ev.type === 'error') console.error(ev.error);
  },
  onRequest: async (req, ctx) => {
    if (req.url === '/health') {
      ctx.respond({ status: 200, body: 'ok' });
      return;
    }

    ctx.streamStart(200, { 'Content-Type': 'text/plain' });
    ctx.streamChunk('hello ');
    ctx.streamChunk('world');
    ctx.streamEnd();
  }
});

provider.close();
```

## 7) Auth model

- `accessKey`: cho endpoint inference/public có bảo vệ.
- `managementKey`: cho nhóm endpoint `/v0/management/*`.
- `localPassword`: cho endpoint local-protected (ví dụ `/keep-alive`).

Có thể đổi key runtime bằng:
- `setAccessKey(key?)`
- `setManagementKey(key?)`
- `setLocalPassword(value?)`

## 8) Error handling

Mọi HTTP response non-2xx sẽ throw `APIError`.

```ts
import { APIError, isOpenAIError, isManagementError } from '@redonvn/event-ws-cliproxyapi-sdk';

try {
  await management.getConfig();
} catch (err) {
  if (err instanceof APIError) {
    if (isOpenAIError(err.payload)) {
      console.error('openai error:', err.payload.error.message);
    } else if (isManagementError(err.payload)) {
      console.error('management error:', err.payload.error);
    } else {
      console.error(err.status, err.message);
    }
  }
}
```

## 9) Build & phát triển

```bash
npm i
npm run build
```

Scripts hiện có:
- `npm run build`: compile TypeScript ra `dist/`
- `npm run dev`: watch mode


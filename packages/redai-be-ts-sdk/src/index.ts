import { DynamicTableAuth } from './core/auth';
import { HttpClient } from './core/http-client';
import { DynamicTableSdkConfig, DynamicTableTokenProvider } from './core/types';
import { ApiDocsService, ApiTokensService, AttachmentsSecureService, AttachmentsService, BaseMembersService, BasesService, CachesService, CalendarDataService, CalendarsService, ColumnsService, CommandPaletteService, CommentsService, DataExportsService, DataImportsService, DataTableService, DynamicTableAuthService, FiltersService, FormsService, GalleriesService, GridsService, HooksService, InternalService, JobsMetaService, JobsService, KanbanDataService, KanbansService, MapsService, RowColorService, SortsService, SourcesService, TablesService, UserUiPreferencesService, UtilsService, ViewColumnsService, ViewsService, WorkspaceInviteLinkSettingsService, WorkspaceInviteLinksService, WorkspaceInvitesService, WorkspaceJoinRequestsService, WorkspaceMembersService, WorkspacesService } from './generated/services';

export type { ApiResponseDto, DynamicTableSdkConfig, DynamicTableTokenProvider } from './core/types';
export * from './generated';

export const createFrontendAxiosTokenProvider = (options?: {
  authStorageKey?: string;
  dtApiToken?: string | null;
  getDtApiToken?: () => string | null | undefined;
}) => {
  const authStorageKey = options?.authStorageKey ?? 'auth_data';
  return {
    getBearerToken: () => {
      const storage = (globalThis as { localStorage?: { getItem: (key: string) => string | null } }).localStorage;
      if (!storage) return null;
      try {
        const raw = storage.getItem(authStorageKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { accessToken?: string; expiresAt?: number };
        if (!parsed?.accessToken) return null;
        if (typeof parsed.expiresAt === 'number' && parsed.expiresAt <= Date.now()) return null;
        return parsed.accessToken;
      } catch {
        return null;
      }
    },
    getDtApiToken: () => options?.getDtApiToken?.() ?? options?.dtApiToken ?? null,
  } as const;
};

export const createDynamicTableSdk = (config: DynamicTableSdkConfig) => {
  const auth = new DynamicTableAuth({ bearerToken: config.bearerToken ?? null, dtApiToken: config.dtApiToken ?? null }, config.tokenProvider);
  const client = new HttpClient(config, auth);
  const viewColumns = new ViewColumnsService(client);
  return {
    auth,
    apiDocs: new ApiDocsService(client),
    apiTokens: new ApiTokensService(client),
    attachmentsSecure: new AttachmentsSecureService(client),
    attachments: new AttachmentsService(client),
    baseMembers: new BaseMembersService(client),
    bases: new BasesService(client),
    caches: new CachesService(client),
    calendarData: new CalendarDataService(client),
    calendars: new CalendarsService(client),
    columns: new ColumnsService(client),
    commandPalette: new CommandPaletteService(client),
    comments: new CommentsService(client),
    dataExports: new DataExportsService(client),
    dataImports: new DataImportsService(client),
    dataTable: new DataTableService(client),
    authService: new DynamicTableAuthService(client),
    filters: new FiltersService(client),
    forms: new FormsService(client),
    galleries: new GalleriesService(client),
    grids: new GridsService(client),
    hooks: new HooksService(client),
    internal: new InternalService(client),
    jobsMeta: new JobsMetaService(client),
    jobs: new JobsService(client),
    kanbanData: new KanbanDataService(client),
    kanbans: new KanbansService(client),
    maps: new MapsService(client),
    rowColor: new RowColorService(client),
    sorts: new SortsService(client),
    sources: new SourcesService(client),
    tables: new TablesService(client),
    userUiPreferences: new UserUiPreferencesService(client),
    utils: new UtilsService(client),
    views: new ViewsService(client),
    workspaceInviteLinkSettings: new WorkspaceInviteLinkSettingsService(client),
    workspaceInviteLinks: new WorkspaceInviteLinksService(client),
    workspaceInvites: new WorkspaceInvitesService(client),
    workspaceJoinRequests: new WorkspaceJoinRequestsService(client),
    workspaceMembers: new WorkspaceMembersService(client),
    workspaces: new WorkspacesService(client),
    formColumns: viewColumns,
    gridColumns: viewColumns,
    viewColumns,
  };
};

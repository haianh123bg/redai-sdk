/* eslint-disable */
export type ApiResponseDto<T = unknown> = import('../../core/types').ApiResponseDto<T>;



export interface AcceptWorkspaceInviteDto {
  token: string;
}
export type AclFilter = FilterPayload | FilterPayload[];
export interface AddBaseMemberDto {
  userId: number;
  role?: WorkspaceMemberRole;
}
export type AddWorkspaceInviteDto = WorkspaceMemberRoleDto & {
  email: string;
};
export type ApiTokenPermissions = TokenPermissions;
export enum AppEvents {
  PROJECT_CREATE = "base.create",
  PROJECT_INVITE = "base.invite",
  PROJECT_USER_UPDATE = "base.user.update",
  PROJECT_USER_RESEND_INVITE = "base.user.resend.invite",
  PROJECT_DELETE = "base.delete",
  PROJECT_UPDATE = "base.update",
  PROJECT_CLONE = "base.clone",
  WELCOME = "app.welcome",
  WORKSPACE_USER_INVITE = "workspace.invite",
  WORKSPACE_USER_UPDATE = "workspace.user.update",
  WORKSPACE_USER_DELETE = "workspace.user.delete",
  WORKSPACE_CREATE = "workspace.create",
  WORKSPACE_DELETE = "workspace.delete",
  WORKSPACE_UPDATE = "workspace.update",
  WORKSPACE_UPGRADE_REQUEST = "workspace.upgrade.request",
  USER_SIGNUP = "user.signup",
  USER_SIGNIN = "user.signin",
  USER_INVITE = "user.invite",
  USER_UPDATE = "user.update",
  USER_PASSWORD_RESET = "user.password.reset",
  USER_PASSWORD_CHANGE = "user.password.change",
  USER_PASSWORD_FORGOT = "user.password.forgot",
  USER_DELETE = "user.delete",
  USER_EMAIL_VERIFICATION = "user.email.verification",
  TABLE_CREATE = "table.create",
  TABLE_DELETE = "table.delete",
  TABLE_UPDATE = "table.update",
  VIEW_CREATE = "view.create",
  VIEW_DELETE = "view.delete",
  VIEW_UPDATE = "view.update",
  SHARED_VIEW_CREATE = "shared.view.create",
  SHARED_VIEW_DELETE = "shared.view.delete",
  SHARED_VIEW_UPDATE = "shared.view.update",
  FILTER_CREATE = "filter.create",
  FILTER_DELETE = "filter.delete",
  FILTER_UPDATE = "filter.update",
  SORT_CREATE = "sort.create",
  SORT_DELETE = "sort.delete",
  SORT_UPDATE = "sort.update",
  COLUMN_CREATE = "column.create",
  COLUMN_DELETE = "column.delete",
  COLUMN_UPDATE = "column.update",
  DATA_CREATE = "data.create",
  DATA_DELETE = "data.delete",
  DATA_UPDATE = "data.update",
  ORG_USER_INVITE = "org.user.invite",
  ORG_USER_RESEND_INVITE = "org.user.resend.invite",
  VIEW_COLUMN_CREATE = "view.column.create",
  VIEW_COLUMN_UPDATE = "view.column.update",
  API_TOKEN_CREATE = "api.token.create",
  API_TOKEN_DELETE = "api.token.delete",
  API_TOKEN_UPDATE = "api.token.update",
  IMAGE_UPLOAD = "image.upload",
  FORM_COLUMN_UPDATE = "form.column.update",
  FORM_CREATE = "form.create",
  FORM_UPDATE = "form.update",
  GALLERY_CREATE = "gallery.create",
  GALLERY_UPDATE = "gallery.update",
  MAP_CREATE = "map.create",
  MAP_UPDATE = "map.update",
  MAP_DELETE = "map.delete",
  KANBAN_CREATE = "kanban.create",
  KANBAN_UPDATE = "kanban.update",
  META_DIFF_SYNC = "meta.diff.sync",
  GRID_CREATE = "grid.create",
  GRID_UPDATE = "grid.update",
  GRID_COLUMN_UPDATE = "grid.column.update",
  WEBHOOK_CREATE = "webhook.create",
  WEBHOOK_UPDATE = "webhook.update",
  WEBHOOK_DELETE = "webhook.delete",
  WEBHOOK_TEST = "webhook.test",
  WEBHOOK_TRIGGER = "webhook.trigger",
  UI_ACL_UPDATE = "ui.acl.update",
  ORG_API_TOKEN_CREATE = "org.api.token.create",
  ORG_API_TOKEN_DELETE = "org.api.token.delete",
  ORG_API_TOKEN_UPDATE = "org.api.token.update",
  PLUGIN_TEST = "plugin.test",
  PLUGIN_INSTALL = "plugin.install",
  PLUGIN_UNINSTALL = "plugin.uninstall",
  SYNC_SOURCE_CREATE = "sync.source.create",
  SYNC_SOURCE_UPDATE = "sync.source.update",
  SYNC_SOURCE_DELETE = "sync.source.delete",
  RELATION_DELETE = "relation.delete",
  RELATION_CREATE = "relation.create",
  SHARED_BASE_GENERATE_LINK = "shared.base.generate.link",
  SHARED_BASE_DELETE_LINK = "shared.base.delete.link",
  ATTACHMENT_UPLOAD = "attachment.upload",
  APIS_CREATED = "apis.created",
  EXTENSION_CREATE = "extension.create",
  EXTENSION_UPDATE = "extension.update",
  EXTENSION_DELETE = "extension.delete",
  COMMENT_CREATE = "comment.create",
  COMMENT_DELETE = "comment.delete",
  COMMENT_UPDATE = "comment.update",
  INTEGRATION_DELETE = "integration.delete",
  INTEGRATION_CREATE = "integration.create",
  INTEGRATION_UPDATE = "integration.update",
  ROW_USER_MENTION = "row.user.mention",
  CALENDAR_CREATE = "calendar.create",
  FORM_DUPLICATE = "form.duplicate",
  CALENDAR_UPDATE = "calendar.update",
  CALENDAR_DELETE = "calendar.delete",
  FORM_DELETE = "form.delete",
  SOURCE_CREATE = "source.create",
  SOURCE_UPDATE = "source.update",
  SOURCE_DELETE = "source.delete",
  SHARED_BASE_REVOKE_LINK = "shared.base.revoke.link",
  GRID_DELETE = "grid.delete",
  GRID_DUPLICATE = "grid.duplicate",
  KANBAN_DELETE = "kanban.delete",
  KANBAN_DUPLICATE = "kanban.duplicate",
  GALLERY_DELETE = "gallery.delete",
  GALLERY_DUPLICATE = "gallery.duplicate",
  BASE_DUPLICATE_START = "base.duplicate.start",
  BASE_DUPLICATE_COMPLETE = "base.duplicate.complete",
  BASE_DUPLICATE_FAIL = "base.duplicate.fail",
  TABLE_DUPLICATE_START = "table.duplicate.start",
  TABLE_DUPLICATE_COMPLETE = "table.duplicate.complete",
  TABLE_DUPLICATE_FAIL = "table.duplicate.fail",
  COLUMN_DUPLICATE_START = "column.duplicate.start",
  COLUMN_DUPLICATE_COMPLETE = "column.duplicate.complete",
  COLUMN_DUPLICATE_FAIL = "column.duplicate.fail",
  VIEW_DUPLICATE_START = "view.duplicate.start",
  VIEW_DUPLICATE_COMPLETE = "view.duplicate.complete",
  VIEW_DUPLICATE_FAIL = "view.duplicate.fail",
  USER_SIGNOUT = "user.signout",
  PROJECT_USER_DELETE = "base.user.delete",
  UI_ACL = "model.role.ui.acl",
  SNAPSHOT_CREATE = "snapshot.create",
  SNAPSHOT_DELETE = "snapshot.delete",
  SNAPSHOT_RESTORE = "snapshot.restore",
  DATA_EXPORT = "data.export",
  DATA_IMPORT = "data.import",
  USER_PROFILE_UPDATE = "user.profile.update",
  SCRIPT_CREATE = "script.create",
  SCRIPT_DELETE = "script.delete",
  SCRIPT_UPDATE = "script.update",
  SCRIPT_DUPLICATE = "script.duplicate",
  DASHBOARD_CREATE = "dashboard.create",
  DASHBOARD_UPDATE = "dashboard.update",
  DASHBOARD_DELETE = "dashboard.delete",
  SHARED_DASHBOARD_GENERATE_LINK = "shared.dashboard.generate.link",
  SHARED_DASHBOARD_UPDATE_LINK = "shared.dashboard.update.link",
  SHARED_DASHBOARD_DELETE_LINK = "shared.dashboard.delete.link",
  DASHBOARD_DUPLICATE_START = "dashboard.duplicate.start",
  DASHBOARD_DUPLICATE_COMPLETE = "dashboard.duplicate.complete",
  DASHBOARD_DUPLICATE_FAIL = "dashboard.duplicate.fail",
  WIDGET_CREATE = "widget.create",
  WIDGET_UPDATE = "widget.update",
  WIDGET_DELETE = "widget.delete",
  WIDGET_DUPLICATE = "widget.duplicate",
  PERMISSION_CREATE = "permission.create",
  PERMISSION_UPDATE = "permission.update",
  PERMISSION_DELETE = "permission.delete",
}
export interface BaseMemberListResponseDto {
  list: BaseMemberResponseDto[];
  pageInfo: BaseMemberPageInfoDto;
}
export interface BaseMemberPageInfoDto {
  totalRows: number;
  page: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  offset: number;
}
export interface BaseMemberResponseDto {
  id: string;
  workspaceId: string;
  baseId: string;
  userId: number;
  role: WorkspaceMemberRole;
  invitedBy?: number | null;
  deleted: boolean;
  isActive: boolean;
  createdAt?: number | null;
  updatedAt?: number | null;
  user?: BaseMemberUserDto | null;
}
export interface BaseMemberUserDto {
  id: number;
  fullName?: string | null;
  avatar?: string | null;
}
export type BaseMeta = {
  icon?: string;
  coverImage?: string;
  color?: string;
  tags?: string[];
  defaultTableId?: string;
  defaultViewId?: string;
  isTemplate?: boolean;
  templateId?: string;
};
export interface BaseResponseDto {
  id: string;
  fkWorkspaceId: string | null;
  ownerUserId: number | null;
  title: string;
  prefix: string | null;
  status: BaseStatus | null;
  description: string | null;
  meta: BaseMeta | null;
  color: string | null;
  deleted: boolean | null;
  isMeta: boolean | null;
  order: number | null;
  uuid: string | null;
  roles: string | null;
  fkCustomUrlId: string | null;
  isSnapshot: boolean | null;
  createdAt: number | null;
  updatedAt: number | null;
}
export enum BaseStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}
export interface BulkColumnDeleteDto {
  id: string;
}
export interface BulkColumnsWithMetaDto {
  create?: BulkCreateTableFieldDto[];
  update?: BulkUpdateTableFieldDto[];
  delete?: BulkColumnDeleteDto[];
}
export type BulkCreateTableFieldDto = CreateTableFieldDto;
export type BulkDataListDto = LimitOffsetQueryDto & {
  viewId?: string;
  fields?: JsonValue;
  filters?: JsonValue;
  sorts?: JsonValue;
  includeSortFilterFields?: JsonValue;
};
export type BulkGroupDto = BulkDataListDto & {
  groupFields?: GroupFieldDto[];
};
export type BulkLinkDto = RelationUpdateDto & {
  recordId: string;
};
export type BulkUpdateTableFieldDto = UpdateTableFieldDto & {
  id: string;
};
export interface BulkUpdateViewColumnsDto {
  items: UpdateViewColumnItemDto[];
}
export type CalendarDataQueryDto = RecordListQueryDto & {
  fromDate: string;
  toDate: string;
  prevDate: string;
  nextDate: string;
  limitOverride?: number;
};
export interface CalendarViewConfigDto {
  coverImageFieldId?: string | null;
  meta?: CalendarViewMeta;
  ranges?: CalendarViewRangeDto[];
}
export interface CalendarViewDetailResponseDto {
  config: CalendarViewResponseDto;
  columns: ViewColumnResponseDto[];
}
export type CalendarViewMeta = ViewMeta & {
  timezone?: string;
  weekStart?: 'sun' | 'mon';
  defaultView?: 'month' | 'week' | 'day';
  colorByFieldId?: string;
};
export interface CalendarViewRangeDto {
  fromFieldId: string;
  toFieldId?: string | null;
}
export interface CalendarViewResponseDto {
  viewId: string;
  workspaceId: string | null;
  baseId: string | null;
  sourceId: string | null;
  coverImageFieldId: string | null;
  meta: CalendarViewMeta;
  createdAt: number;
  updatedAt: number | null;
}
export interface ColumnResponseDto {
  id: string;
  tableId: string;
  workspaceId: string | null;
  baseId: string | null;
  sourceId: string | null;
  name: string;
  keyName: string;
  description: string | null;
  columnName: string | null;
  type: FieldType;
  order: number | null;
  isPrimary: boolean | null;
  isPrimaryValue: boolean | null;
  isRequired: boolean | null;
  isUnique: boolean | null;
  isAutoIncrement: boolean | null;
  isUnsigned: boolean | null;
  isSystem: boolean | null;
  isReadonly: boolean | null;
  isVirtual: boolean | null;
  uiDataType: string | null;
  dataType: string | null;
  numericPrecision: string | null;
  numericScale: string | null;
  characterLength: string | null;
  columnDefault: string | null;
  columnType: string | null;
  columnComment: string | null;
  columnSequenceName: string | null;
  dataTypeExtra: string | null;
  dataTypeExtraPrecision: string | null;
  dataTypeExtraScale: string | null;
  autoUpdated: boolean | null;
  config: FieldConfig | null;
  meta: FieldMeta | null;
  validation: string | null;
  externalColumnName: string | null;
  externalDataType: ExternalDataType | null;
  createdAt: number | null;
  updatedAt: number | null;
  relationConfig?: RelationConfigResponseDto | null;
  lookupConfig?: LookupConfigResponseDto | null;
  rollupConfig?: RollupConfigResponseDto | null;
  inverseFieldId?: string | null;
  inverseFieldKey?: string | null;
  inverseFieldName?: string | null;
}
export interface CommandPaletteSearchQueryDto {
  q: string;
  limit?: number;
  workspaceId?: string;
}
export interface CommentCountItemResponseDto {
  rowId: string;
  count: number;
}
export interface CommentReactionResponseDto {
  id: string;
  fkWorkspaceId: string | null;
  baseId: string | null;
  fkCommentId: string | null;
  fkUserId: string | null;
  reaction: string;
  createdAt: number | null;
  updatedAt: number | null;
}
export interface CommentResponseDto {
  id: string;
  fkWorkspaceId: string | null;
  baseId: string | null;
  fkModelId: string | null;
  fkUserId: string | null;
  rowId: string;
  commentText: string;
  isDeleted: boolean | null;
  isEdit: boolean | null;
  createdAt: number | null;
  updatedAt: number | null;
  reactions: CommentReactionResponseDto[];
}
export interface CountCommentsQueryDto {
  fkModelId: string;
  ids: string[];
}
export interface CreateApiTokenDto {
  fkWorkspaceId?: string | null;
  fkBaseId?: string | null;
  description?: string | null;
  permissions?: ApiTokenPermissions | null;
  expiryAt?: string | null;
}
export interface CreateBaseDto {
  title: string;
  fkWorkspaceId?: string | null;
  prefix?: string | null;
  status?: BaseStatus | null;
  description?: string | null;
  meta?: BaseMeta | null;
  color?: string | null;
  deleted?: boolean | null;
  isMeta?: boolean | null;
  order?: number | null;
  uuid?: string | null;
  password?: string | null;
  roles?: string | null;
  fkCustomUrlId?: string | null;
  isSnapshot?: boolean | null;
  ownerUserId?: number | null;
}
export type CreateCalendarViewDto = CreateViewDto & {
  coverImageFieldId?: string | null;
  ranges?: CalendarViewRangeDto[];
};
export interface CreateColumnDto {
  name: string;
  keyName: string;
  type: FieldType;
  description?: string | null;
  config?: FieldConfig;
  isPrimary?: boolean;
  isRequired?: boolean;
  isUnique?: boolean;
  isAutoIncrement?: boolean;
  isUnsigned?: boolean;
  isSystem?: boolean;
  isReadonly?: boolean;
  isVirtual?: boolean;
  orderIndex?: number;
  uiDataType?: string | null;
  dataType?: string | null;
  meta?: Record<string, JsonValue>;
  externalColumnName?: string | null;
  externalDataType?: ExternalDataType | null;
}
export interface CreateCommentDto {
  workspaceId: string;
  baseId?: string;
  fkModelId: string;
  rowId: string;
  commentText: string;
}
export interface CreateCommentReactionDto {
  reaction: string;
}
export type CreateFormViewDto = CreateViewDto & {
  heading?: string | null;
  subheading?: string | null;
  successMessage?: string | null;
  redirectUrl?: string | null;
  redirectAfterSecs?: number | null;
  email?: string | null;
  submitAnotherForm?: boolean;
  showBlankForm?: boolean;
};
export type CreateGalleryViewDto = CreateViewDto & {
  coverImageFieldId?: string | null;
};
export type CreateGridViewDto = CreateViewDto & {
  rowHeight?: GridRowHeight | null;
};
export interface CreateHookDto {
  title: string;
  description?: string;
  env?: HookEnvironment;
  type?: HookType;
  event: AppEvents;
  operation: HookOperation;
  async?: boolean;
  payload?: unknown;
  url?: string;
  headers?: Record<string, string>;
  secret?: string;
  notification?: HookNotificationDto;
  condition?: boolean;
  retries?: number;
  retryInterval?: number;
  timeout?: number;
  active?: boolean;
  version?: HookVersion;
  triggerFields?: string[];
}
export type CreateKanbanViewDto = CreateViewDto & {
  groupFieldId?: string | null;
  coverImageFieldId?: string | null;
};
export type CreateMapViewDto = CreateViewDto & {
  geoDataFieldId?: string | null;
  mapType?: MapProviderType | null;
  mapApiKey?: string | null;
};
export interface CreatePresignedUrlDto {
  path: string;
  ttlSeconds?: number;
  workspaceId?: string;
  baseId?: string;
  integrationId?: string;
}
export interface CreateRowColorConditionDto {
  fieldId: string;
  operator: string;
  value?: string | null;
  color?: string | null;
  backgroundColor?: string | null;
  order?: number | null;
}
export interface CreateSourceDto {
  fkWorkspaceId?: string | null;
  baseId?: string | null;
  alias?: string | null;
  type: SourceType;
  config?: SourceConfig | null;
  enabled?: boolean | null;
  isMeta?: boolean | null;
  order?: number | null;
  inflectionColumn?: string | null;
  inflectionTable?: string | null;
  meta?: SourceMeta | null;
  deleted?: boolean | null;
  fkIntegrationId?: string | null;
}
export interface CreateTableDto {
  workspaceId: string;
  name: string;
  slug: string;
  baseId?: string | null;
  sourceId?: string | null;
  type?: ModelType | null;
  storageMode?: StorageMode | null;
  description?: string | null;
  order?: number | null;
  meta?: TableMeta;
  settings?: TableSettings;
  fields?: CreateTableFieldDto[];
}
export type CreateTableFieldDto = CreateColumnDto & {
  type: FieldType;
  relationConfig?: RelationConfigDto;
  lookupConfig?: LookupConfigDto;
  rollupConfig?: RollupConfigDto;
};
export interface CreateViewColumnDto {
  fieldId: string;
  show?: boolean;
  order?: number | null;
  width?: string | null;
  align?: GridColumnAlign | null;
  groupBy?: boolean;
  groupByOrder?: number | null;
  groupBySort?: string | null;
  aggregation?: string | null;
  label?: string | null;
  helpText?: string | null;
  placeholder?: string | null;
  required?: boolean;
  description?: string | null;
}
export interface CreateViewDto {
  name: string;
  description?: string | null;
  type?: ViewType;
  order?: number | null;
  show?: boolean;
  showSystemFields?: boolean;
  lockType?: ViewLockType | null;
  rowColoringMode?: RowColoringMode | null;
  customUrlId?: string | null;
  meta?: ViewMeta;
  ownedBy?: number | null;
  isDefault?: boolean;
}
export interface CreateViewFilterDto {
  fieldId?: string | null;
  parentId?: string | null;
  comparisonOp?: FilterComparisonOp | null;
  comparisonSubOp?: FilterComparisonSubOp | null;
  value?: string | null;
  isGroup?: boolean;
  logicalOp?: FilterLogicalOp | null;
  order?: number | null;
}
export interface CreateViewSortDto {
  fieldId: string;
  direction?: ViewSortDirection;
  order?: number | null;
  pushToTop?: boolean;
}
export interface CreateWorkspaceDto {
  name: string;
  slug: string;
  description?: string | null;
  settings?: WorkspaceSettings;
  isActive?: boolean;
}
export type CreateWorkspaceInviteLinkDto = WorkspaceMemberRoleScopeDto;
export interface DynamicTableTokenExchangeResponseDto {
  token: string;
  expiresInSeconds: number;
}
export enum ExportFormatEnum {
  CSV = 'csv',
  XLSX = 'xlsx',
  JSON = 'json',
}
export interface ExportOptionsDto {
  delimiter?: string;
  encoding?: string;
  includeByteOrderMark?: boolean;
  filenameTimeZone?: string;
  filters?: JsonValue;
  sorts?: JsonValue;
  includeSortFilterFields?: boolean;
}
export interface ExportStartResponseDto {
  jobId: string;
}
export enum ExternalDataType {
  VARCHAR = 'VARCHAR',
  CHAR = 'CHAR',
  TEXT = 'TEXT',
  NVARCHAR = 'NVARCHAR',
  NCHAR = 'NCHAR',
  LONGTEXT = 'LONGTEXT',
  MEDIUMTEXT = 'MEDIUMTEXT',
  TINYTEXT = 'TINYTEXT',
  INTEGER = 'INTEGER',
  INT = 'INT',
  SMALLINT = 'SMALLINT',
  BIGINT = 'BIGINT',
  TINYINT = 'TINYINT',
  MEDIUMINT = 'MEDIUMINT',
  SERIAL = 'SERIAL',
  BIGSERIAL = 'BIGSERIAL',
  DECIMAL = 'DECIMAL',
  NUMERIC = 'NUMERIC',
  FLOAT = 'FLOAT',
  DOUBLE = 'DOUBLE',
  REAL = 'REAL',
  MONEY = 'MONEY',
  SMALLMONEY = 'SMALLMONEY',
  BOOLEAN = 'BOOLEAN',
  BIT = 'BIT',
  DATE = 'DATE',
  TIME = 'TIME',
  DATETIME = 'DATETIME',
  DATETIME2 = 'DATETIME2',
  SMALLDATETIME = 'SMALLDATETIME',
  TIMESTAMP = 'TIMESTAMP',
  TIMESTAMPTZ = 'TIMESTAMPTZ',
  YEAR = 'YEAR',
  BINARY = 'BINARY',
  VARBINARY = 'VARBINARY',
  BLOB = 'BLOB',
  BYTEA = 'BYTEA',
  IMAGE = 'IMAGE',
  JSON = 'JSON',
  JSONB = 'JSONB',
  ARRAY = 'ARRAY',
  UUID = 'UUID',
  UNIQUEIDENTIFIER = 'UNIQUEIDENTIFIER',
  GEOMETRY = 'GEOMETRY',
  GEOGRAPHY = 'GEOGRAPHY',
  POINT = 'POINT',
  XML = 'XML',
  ENUM = 'ENUM',
  SET = 'SET',
  OBJECT_ID = 'OBJECT_ID',
  DOCUMENT = 'DOCUMENT',
  INTERVAL = 'INTERVAL',
  CIDR = 'CIDR',
  INET = 'INET',
  MACADDR = 'MACADDR',
  HSTORE = 'HSTORE',
  CUSTOM = 'CUSTOM',
}
export interface ExternalSyncConfig {
  source: 'google_sheets' | 'airtable' | 'notion' | 'api';
  sourceId?: string;
  syncInterval?: number;
  lastSyncAt?: Date;
}
export interface FieldConfig {
  options?: { id: string; label: string; color?: string }[];
  precision?: number;
  currencySymbol?: string;
  currencyCode?: string;
  percentFormat?: 'decimal' | 'whole';
  maxRating?: number;
  ratingIcon?: 'star' | 'heart' | 'thumb';
  prefix?: string;
  startNumber?: number;
  digitCount?: number;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  includeTime?: boolean;
  timezone?: string;
  durationFormat?: 'h:mm' | 'h:mm:ss' | 'days';
  targetTableId?: string;
  allowMultiple?: boolean;
  symmetricFieldId?: string;
  relationFieldId?: string;
  lookupFieldId?: string;
  rollupRelationFieldId?: string;
  rollupFieldId?: string;
  rollupFunction?: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'counta' | 'countall';
  formulaExpression?: string;
  outputType?: 'number' | 'text' | 'date' | 'boolean';
  enableRichText?: boolean;
  maxLength?: number;
  defaultCountryCode?: string;
  urlType?: 'any' | 'image' | 'video';
  allowMultipleUsers?: boolean;
  notifyOnAssign?: boolean;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  qrValueFieldId?: string;
  barcodeValueFieldId?: string;
  barcodeFormat?: string;
  buttonLabel?: string;
  buttonType?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  buttonActionType?: 'url' | 'api' | 'script' | 'email' | 'page';
  buttonActionConfig?: Record<string, any>;
  buttonIcon?: string;
  buttonTooltip?: string;
  buttonWidth?: number;
  buttonConfirmation?: string;
  aiPrompt?: string;
  aiModel?: string;
  aiConfig?: Record<string, any>;
}
export type FieldMeta = {
  placeholder?: string;
  helpText?: string;
  icon?: string;
  color?: string;
  display?: {
    width?: number;
    hidden?: boolean;
    order?: number;
  };
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
};
export enum FieldType {
  TEXT = 'text',
  LONG_TEXT = 'long_text',
  EMAIL = 'email',
  PHONE = 'phone',
  URL = 'url',
  NUMBER = 'number',
  CURRENCY = 'currency',
  PERCENT = 'percent',
  RATING = 'rating',
  AUTONUMBER = 'autonumber',
  ORDER = 'order',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  DURATION = 'duration',
  RELATION = 'relation',
  LINK_TO_ANOTHER_RECORD = 'link_to_another_record',
  LINKS = 'links',
  LOOKUP = 'lookup',
  ROLLUP = 'rollup',
  FORMULA = 'formula',
  CREATED_TIME = 'created_time',
  MODIFIED_TIME = 'modified_time',
  CREATED_BY = 'created_by',
  MODIFIED_BY = 'modified_by',
  ATTACHMENT = 'attachment',
  QR_CODE = 'qrcode',
  BARCODE = 'barcode',
  BUTTON = 'button',
  USER = 'user',
  AI = 'ai',
}
export enum FilterComparisonOp {
  EQ = 'eq',
  NEQ = 'neq',
  LIKE = 'like',
  NLIKE = 'nlike',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  EMPTY = 'empty',
  NOT_EMPTY = 'notempty',
  NULL = 'null',
  NOT_NULL = 'notnull',
  BLANK = 'blank',
  NOT_BLANK = 'notblank',
  ALL_OF = 'allof',
  ANY_OF = 'anyof',
  NOT_ALL_OF = 'nallof',
  NOT_ANY_OF = 'nanyof',
  CHECKED = 'checked',
  NOT_CHECKED = 'notchecked',
  IS_WITHIN = 'isWithin',
  IS = 'is',
  IS_NOT = 'isnot',
  BETWEEN = 'btw',
  NOT_BETWEEN = 'nbtw',
  GROUP_BY_EQ = 'gbEq',
  GROUP_BY_NULL = 'gbNull',
}
export type FilterComparisonOperator = FilterComparisonOp;
export enum FilterComparisonSubOp {
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  YESTERDAY = 'yesterday',
  ONE_WEEK_AGO = 'oneWeekAgo',
  ONE_WEEK_FROM_NOW = 'oneWeekFromNow',
  ONE_MONTH_AGO = 'oneMonthAgo',
  ONE_MONTH_FROM_NOW = 'oneMonthFromNow',
  DAYS_AGO = 'daysAgo',
  DAYS_FROM_NOW = 'daysFromNow',
  EXACT_DATE = 'exactDate',
  PAST_WEEK = 'pastWeek',
  PAST_MONTH = 'pastMonth',
  PAST_YEAR = 'pastYear',
  NEXT_WEEK = 'nextWeek',
  NEXT_MONTH = 'nextMonth',
  NEXT_YEAR = 'nextYear',
  PAST_NUMBER_OF_DAYS = 'pastNumberOfDays',
  NEXT_NUMBER_OF_DAYS = 'nextNumberOfDays',
}
export type FilterConditionPayload = {
  fieldId?: string;
  field?: string;
  columnId?: string;
  operator?: FilterComparisonOperator | string;
  op?: FilterComparisonOperator | string;
  comparisonOp?: FilterComparisonOperator | string;
  comparison?: string;
  condition?: string;
  comparisonSubOp?: FilterComparisonSubOp | string;
  logicalOp?: FilterLogicalOperator;
  logical?: FilterLogicalOperator;
  value?: JsonValue;
};
export type FilterGroupPayload = {
  isGroup: true;
  logicalOp?: FilterLogicalOperator;
  children?: FilterPayload[];
};
export enum FilterLogicalOp {
  AND = 'and',
  OR = 'or',
  NOT = 'not',
}
export type FilterLogicalOperator = FilterLogicalOp;
export type FilterLogicalPayload = {
  and?: FilterPayload[];
  or?: FilterPayload[];
  not?: FilterPayload[];
};
export type FilterPayload = FilterConditionPayload | FilterGroupPayload | FilterLogicalPayload;
export interface FilterResponseDto {
  id: string;
  viewId: string | null;
  parentId: string | null;
  fieldId: string | null;
  operator: string | null;
  value: JsonValue | null;
  order: number | null;
  isGroup: boolean | null;
  createdAt: number | null;
  updatedAt: number | null;
}
export interface FormViewConfigDto {
  heading?: string | null;
  subheading?: string | null;
  successMessage?: string | null;
  redirectUrl?: string | null;
  redirectAfterSecs?: number | null;
  email?: string | null;
  submitAnotherForm?: boolean;
  showBlankForm?: boolean;
  meta?: FormViewMeta;
}
export interface FormViewDetailResponseDto {
  config: FormViewResponseDto;
  columns: ViewColumnResponseDto[];
}
export type FormViewMeta = ViewMeta & {
  theme?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  submitButtonLabel?: string;
  showBranding?: boolean;
};
export interface FormViewResponseDto {
  viewId: string;
  workspaceId: string | null;
  baseId: string | null;
  sourceId: string | null;
  heading: string | null;
  subheading: string | null;
  successMessage: string | null;
  redirectUrl: string | null;
  redirectAfterSecs: number | null;
  email: string | null;
  submitAnotherForm: boolean;
  showBlankForm: boolean;
  meta: FormViewMeta;
  createdAt: number;
  updatedAt: number | null;
}
export interface GalleryViewConfigDto {
  coverImageFieldId?: string | null;
  meta?: GalleryViewMeta;
}
export interface GalleryViewDetailResponseDto {
  config: GalleryViewResponseDto;
  columns: ViewColumnResponseDto[];
}
export type GalleryViewMeta = ViewMeta & {
  cardSize?: 'small' | 'medium' | 'large';
  showCover?: boolean;
  showEmptyCover?: boolean;
};
export interface GalleryViewResponseDto {
  viewId: string;
  workspaceId: string | null;
  baseId: string | null;
  sourceId: string | null;
  coverImageFieldId: string | null;
  meta: GalleryViewMeta;
  createdAt: number;
  updatedAt: number | null;
}
export interface GetUserUiPreferencesResponseDto {
  raw: UserUiPreferencesRawDto;
  resolved: UserUiPreferencesResolvedDto;
}
export enum GridColumnAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}
export enum GridRowHeight {
  SHORT = 'short',
  MEDIUM = 'medium',
  TALL = 'tall',
  EXTRA = 'extra',
}
export interface GridViewConfigDto {
  rowHeight?: GridRowHeight | null;
  meta?: GridViewMeta;
}
export type GridViewMeta = ViewMeta & {
  wrapText?: boolean;
  showEmptyFields?: boolean;
  frozenColumnIds?: string[];
  hiddenColumnIds?: string[];
  columnWidths?: Array<{ fieldId: string; width: number }>;
};
export interface GridViewResponseDto {
  viewId: string;
  workspaceId: string | null;
  baseId: string | null;
  sourceId: string | null;
  rowHeight: GridRowHeight | null;
  meta: GridViewMeta;
  createdAt: number;
  updatedAt: number | null;
}
export type GroupedListItem = {
  key: JsonValue | null;
  value: PagedResponse<TableRecord>;
};
export interface GroupFieldDto {
  fieldId: string;
  direction?: 'asc' | 'desc';
}
export enum HookEnvironment {
  DEV = 'dev',
  STAGING = 'staging',
  PROD = 'prod',
  TEST = 'test',
}
export interface HookLogResponseDto {
  id: string;
  hookId?: string | null;
  workspaceId?: string | null;
  baseId?: string | null;
  sourceId?: string | null;
  tableId?: string | null;
  event?: AppEvents | null;
  status?: HookLogStatus | null;
  responseCode?: number | null;
  responseBody?: string | null;
  errorMessage?: string | null;
  payload?: unknown;
  url?: string | null;
  executionTime?: number | null;
  triggeredAt?: Date | null;
  createdAt?: number | null;
  updatedAt?: number | null;
}
export enum HookLogStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
}
export interface HookNotificationDto {
  type?: string;
  payload?: HookNotificationPayloadDto;
}
export interface HookNotificationHeaderDto {
  name: string;
  value?: string;
  enabled?: boolean;
}
export interface HookNotificationPayloadDto {
  path?: string;
  method?: string;
  headers?: HookNotificationHeaderDto[];
  body?: unknown;
}
export enum HookOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  READ = 'read',
}
export interface HookResponseDto {
  id: string;
  workspaceId?: string | null;
  baseId?: string | null;
  sourceId?: string | null;
  tableId?: string | null;
  title?: string | null;
  description?: string | null;
  env?: HookEnvironment | null;
  type?: HookType | null;
  event?: AppEvents | null;
  operation?: HookOperation | null;
  async?: boolean | null;
  payload?: unknown;
  url?: string | null;
  headers?: unknown;
  hasSecret?: boolean | null;
  notification?: unknown;
  condition?: boolean | null;
  retries?: number | null;
  retryInterval?: number | null;
  timeout?: number | null;
  active?: boolean | null;
  version?: HookVersion | null;
  triggerFields: string[];
  createdAt?: number | null;
  updatedAt?: number | null;
}
export enum HookType {
  WEBHOOK = 'webhook',
  SCRIPT = 'script',
}
export enum HookVersion {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3',
}
export interface ImportFieldMappingDto {
  source: string;
  targetFieldId?: string;
  targetFieldKey?: string;
}
export enum ImportFileFormat {
  CSV = 'csv',
  XLSX = 'xlsx',
  JSON = 'json',
}
export interface ImportFromUrlDto {
  url: string;
  workspaceId?: string;
  baseId?: string;
}
export interface ImportJobResponseDto {
  id: string;
  status: JobStatus;
  progress: number | null;
  result: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
}
export enum ImportMode {
  APPEND = 'append',
}
export interface ImportPreviewColumnDto {
  source: string;
  inferredType: string;
}
export interface ImportPreviewResponseDto {
  columns: ImportPreviewColumnDto[];
  sampleRows: Array<Record<string, unknown>>;
}
export interface ImportStartResponseDto {
  jobId: string;
}
export interface ImportUploadResponseDto {
  fileId: string;
  fileName: string;
  mimeType: string | null;
  size: number | null;
}
export interface InternalOperationDto {
  payload?: Record<string, unknown>;
}
export interface InvalidateCacheDto {
  tableIds?: string[];
  viewIds?: string[];
  records?: string[];
  reason?: string;
}
export interface JobListenDataDto {
  id: string;
}
export interface JobListenDto {
  _mid?: number;
  data: JobListenDataDto;
}
export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELED = 'canceled',
}
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;
export interface KanbanViewConfigDto {
  groupFieldId?: string | null;
  coverImageFieldId?: string | null;
  meta?: KanbanViewMeta;
}
export interface KanbanViewDetailResponseDto {
  config: KanbanViewResponseDto;
  columns: ViewColumnResponseDto[];
}
export type KanbanViewMeta = ViewMeta & {
  laneOrder?: string[];
  showEmptyLanes?: boolean;
  cardFields?: string[];
};
export interface KanbanViewResponseDto {
  viewId: string;
  workspaceId: string | null;
  baseId: string | null;
  sourceId: string | null;
  groupFieldId: string | null;
  coverImageFieldId: string | null;
  meta: KanbanViewMeta;
  createdAt: number;
  updatedAt: number | null;
}
export interface LimitOffsetQueryDto {
  limit?: number;
  offset?: number;
}
export interface ListApiTokensQueryDto {
  workspaceId?: string;
  baseId?: string;
  revoked?: boolean;
}
export type ListBaseMembersQueryDto = PaginationQueryDto & {
  role?: WorkspaceMemberRole;
  isActive?: boolean;
  deleted?: boolean;
};
export type ListBasesQueryDto = PaginationQueryDto & {
  workspaceId?: string;
  status?: BaseStatus;
  isMeta?: boolean;
  deleted?: boolean;
};
export interface ListCommentsQueryDto {
  workspaceId?: string;
  baseId?: string;
  fkModelId: string;
  rowId: string;
}
export type ListHookLogsQueryDto = PaginationQueryDto & {
  status?: HookLogStatus;
  event?: AppEvents;
};
export type ListHooksQueryDto = PaginationQueryDto & {
  event?: AppEvents;
  operation?: HookOperation;
  active?: boolean;
};
export type ListJobsQueryDto = LimitOffsetQueryDto & {
  workspaceId?: string;
  baseId?: string;
  job?: string;
  status?: JobStatus;
};
export type ListSourcesQueryDto = PaginationQueryDto & {
  workspaceId?: string;
  baseId?: string;
  type?: SourceType;
  enabled?: boolean;
  deleted?: boolean;
};
export type ListTablesQueryDto = PaginationQueryDto & {
  workspaceId?: string;
  baseId?: string;
  includeFields?: boolean;
  includeViews?: boolean;
  includeDeleted?: boolean;
};
export interface ListViewsQueryDto {
  includeConfig?: boolean;
  includeColumns?: boolean;
}
export type ListWorkspaceJoinRequestsQueryDto = PaginationQueryDto;
export type ListWorkspaceMembersQueryDto = PaginationQueryDto & {
  role?: WorkspaceMemberRole;
  isActive?: boolean;
};
export type ListWorkspacesQueryDto = PaginationQueryDto & {
  isActive?: boolean;
};
export interface LookupConfigDto {
  relationFieldRef: RelationFieldRefDto;
  lookupFieldId: string;
}
export interface LookupConfigResponseDto {
  relationFieldId: string | null;
  lookupFieldId: string | null;
}
export enum MapProviderType {
  OSM = 'osm',
  GOOGLE = 'google',
  MAPBOX = 'mapbox',
}
export interface MapViewConfigDto {
  geoDataFieldId?: string | null;
  mapType?: MapProviderType | null;
  mapApiKey?: string | null;
  meta?: MapViewMeta;
}
export interface MapViewDetailResponseDto {
  config: MapViewResponseDto;
  columns: ViewColumnResponseDto[];
}
export type MapViewMeta = ViewMeta & {
  defaultZoom?: number;
  center?: { lat: number; lng: number };
  markerColor?: string;
  showCluster?: boolean;
};
export interface MapViewResponseDto {
  viewId: string;
  workspaceId: string | null;
  baseId: string | null;
  sourceId: string | null;
  geoDataFieldId: string | null;
  meta: MapViewMeta;
  mapType: MapProviderType | null;
  mapApiKey: string | null;
  createdAt: number;
  updatedAt: number | null;
}
export enum MembershipScope {
  WORKSPACE = 'workspace',
  BASE = 'base',
  TEAM = 'team',
}
export enum ModelType {
  TABLE = 'table',
  VIEW = 'view',
  DASHBOARD = 'dashboard',
}
export interface PagedResponse<T> {
  list: T[];
  pageInfo: PageInfo;
}
export type PageInfo = {
  totalRows: number;
  page: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  offset: number;
};
export interface PaginationQueryDto {
  page?: number;
  pageSize?: number;
  sort?: string;
  s?: string;
  filter?: string;
}
export type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'share' | 'export' | 'admin';
export interface PinCommandPaletteDto {
  type: 'table' | 'view' | 'action';
  id: string;
  label: string;
}
export interface PreviewImportDto {
  fileId: string;
  format: ImportFileFormat;
  sheet?: string;
  delimiter?: string;
  hasHeader?: boolean;
  sampleSize?: number;
}
export type RecordAggregateQueryDto = RecordListQueryDto & {
  aggregations?: string;
};
export type RecordIdPayload = { id: string | number };
export type RecordListQueryDto = LimitOffsetQueryDto & {
  viewId?: string;
  fields?: string;
  filters?: string;
  sorts?: string;
  groupFields?: string;
  includeSortFilterFields?: string;
};
export interface RecordMoveDto {
  beforeRecordId?: string | null;
  viewId?: string;
}
export enum ReferentialAction {
  NO_ACTION = 'NO ACTION',
  CASCADE = 'CASCADE',
  RESTRICT = 'RESTRICT',
  SET_NULL = 'SET NULL',
  SET_DEFAULT = 'SET DEFAULT',
}
export interface RelationConfigDto {
  relationType: RelationType;
  relatedTableId: string;
  relatedBaseId?: string | null;
  relatedSourceId?: string | null;
  onUpdate?: ReferentialAction | null;
  onDelete?: ReferentialAction | null;
  isVirtual?: boolean;
  targetViewId?: string | null;
  mmTableId?: string | null;
  mmBaseId?: string | null;
  mmSourceId?: string | null;
  mmChildFieldId?: string | null;
  mmParentFieldId?: string | null;
}
export interface RelationConfigResponseDto {
  relationType: RelationType;
  relatedTableId: string | null;
  relatedBaseId: string | null;
  relatedSourceId: string | null;
  onUpdate: ReferentialAction | null;
  onDelete: ReferentialAction | null;
  isVirtual: boolean | null;
  targetViewId: string | null;
  parentFieldId: string | null;
  childFieldId: string | null;
  mmTableId: string | null;
  mmBaseId: string | null;
  mmSourceId: string | null;
  mmChildFieldId: string | null;
  mmParentFieldId: string | null;
}
export interface RelationFieldRefDto {
  fieldId?: string;
  fieldKey?: string;
}
export enum RelationType {
  HAS_MANY = 'hm',
  BELONGS_TO = 'bt',
  MANY_TO_MANY = 'mm',
  ONE_TO_ONE = 'oo',
}
export interface RelationUpdateDto {
  refRowIds: string[];
}
export interface ReorderColumnItemDto {
  columnId: string;
  orderIndex: number;
}
export interface ReorderColumnsDto {
  items: ReorderColumnItemDto[];
}
export interface ReorderTableItemDto {
  tableId: string;
  order: number;
}
export interface ReorderTablesDto {
  items: ReorderTableItemDto[];
}
export interface ReorderViewSortsDto {
  sortIds: string[];
}
export interface RequestJoinByInviteLinkDto {
  token: string;
}
export interface RollupConfigDto {
  relationFieldRef: RelationFieldRefDto;
  rollupFieldId: string;
  rollupFunction?: RollupFunction | null;
}
export interface RollupConfigResponseDto {
  relationFieldId: string | null;
  rollupFieldId: string | null;
  rollupFunction: RollupFunction | null;
}
export enum RollupFunction {
  COUNT = 'count',
  SUM = 'sum',
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max',
  COUNT_DISTINCT = 'countDistinct',
  SUM_DISTINCT = 'sumDistinct',
  AVG_DISTINCT = 'avgDistinct',
}
export interface RowColorConditionResponseDto {
  id: string;
  viewId: string;
  fieldId: string | null;
  operator: string | null;
  value: JsonValue | null;
  color: string | null;
  backgroundColor: string | null;
  order: number | null;
  createdAt: number | null;
  updatedAt: number | null;
}
export interface RowColorConfigResponseDto {
  mode: RowColoringMode | null;
  conditions: RowColorConditionResponseDto[];
}
export enum RowColoringMode {
  FILTER = 'filter',
  SELECT = 'select',
}
export interface SecureAttachmentTokenDto {
  ttlSeconds?: number;
}
export interface SlackIntegrationConfig {
  webhookUrl?: string;
  channelId?: string;
}
export interface SortResponseDto {
  id: string;
  viewId: string;
  fieldId: string | null;
  direction: string | null;
  order: number | null;
  createdAt: number | null;
  updatedAt: number | null;
}
export type SourceConfig = {
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;
  poolSize?: number;
  connectionTimeout?: number;
  idleTimeout?: number;
  schema?: string;
  [key: string]: JsonValue | undefined;
};
export type SourceMeta = {
  schema?: string;
  version?: string;
  driver?: string;
  lastSyncedAt?: number;
  note?: string;
  readOnlySchema?: boolean;
  readOnlyData?: boolean;
};
export interface SourceResponseDto {
  id: string;
  fkWorkspaceId: string | null;
  baseId: string | null;
  alias: string | null;
  type: SourceType | null;
  config: SourceConfig | null;
  enabled: boolean | null;
  isMeta: boolean | null;
  order: number | null;
  inflectionColumn: string | null;
  inflectionTable: string | null;
  meta: SourceMeta | null;
  deleted: boolean | null;
  fkIntegrationId: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}
export enum SourceType {
  POSTGRESQL = 'POSTGRESQL',
  MYSQL = 'MYSQL',
  MSSQL = 'MSSQL',
  MONGODB = 'MONGODB',
  ORACLE = 'ORACLE',
  MARIADB = 'MARIADB',
  SQLITE = 'SQLITE',
}
export interface StartExportDto {
  workspaceId: string;
  baseId: string;
  viewId?: string;
  exportAs: ExportFormatEnum;
  options?: ExportOptionsDto;
}
export interface StartImportDto {
  workspaceId: string;
  baseId: string;
  tableId: string;
  fileId: string;
  format: ImportFileFormat;
  mode?: ImportMode;
  mapping?: ImportFieldMappingDto[];
  options?: StartImportOptionsDto;
}
export interface StartImportOptionsDto {
  hasHeader?: boolean;
  delimiter?: string;
  sheet?: string;
  chunkSize?: number;
}
export enum StorageMode {
  JSONB = 'JSONB',
  EAV = 'EAV',
  PHYSICAL = 'PHYSICAL',
}
export type TableMeta = {
  icon?: string;
  color?: string;
  coverImage?: string;
  tags?: string[];
  primaryFieldId?: string;
  displayFieldId?: string;
  isTemplate?: boolean;
};
export type TableRecord = Record<string, JsonValue> & { id?: string | number };
export type TableRecordInput = TableRecord & { recordId?: string | number };
export interface TableResponseDto {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description: string | null;
  baseId: string | null;
  sourceId: string | null;
  tableName: string | null;
  type: ModelType | null;
  storageMode: StorageMode | null;
  order: number | null;
  meta: TableMeta;
  settings: TableSettings;
  isManyToMany: boolean | null;
  isSynced: boolean | null;
  isDeleted: boolean | null;
  externalSchemaName: string | null;
  externalTableName: string | null;
  createdAt: number;
  updatedAt: number | null;
  fields?: ColumnResponseDto[];
  views?: ViewResponseDto[];
}
export interface TableSettings {
  icon?: string;
  color?: string;
  coverImage?: string;
  defaultViewId?: string;
  allowPublicAccess?: boolean;
  allowAnonymousSubmit?: boolean;
  recordPrefix?: string;
  enableComments?: boolean;
  enableHistory?: boolean;
  enableAttachments?: boolean;
  enableWebhooks?: boolean;
  enableAutomations?: boolean;
  externalSyncEnabled?: boolean;
  externalSyncConfig?: ExternalSyncConfig;
  maxRecords?: number;
  maxAttachmentSize?: number;
}
export interface TestHookDto {
  hook: CreateHookDto;
  rowId?: string;
  payload?: Record<string, unknown>;
}
export type TokenPermissions = {
  actions?: PermissionAction[];
  scopes?: string[];
  resources?: TokenResourceScope;
  filters?: AclFilter;
  readOnly?: boolean;
};
export type TokenResourceScope = {
  workspaces?: string[];
  bases?: string[];
  tables?: string[];
  views?: string[];
  fields?: string[];
};
export type UpdateApiTokenDto = Partial<CreateApiTokenDto> & {
  revoked?: boolean | null;
};
export type UpdateBaseDto = Partial<CreateBaseDto>;
export type UpdateBaseMemberDto = Partial<AddBaseMemberDto> & {
  isActive?: boolean;
  deleted?: boolean;
};
export type UpdateCalendarViewDto = Partial<CalendarViewConfigDto>;
export interface UpdateCommentDto {
  commentText: string;
}
export type UpdateFormViewDto = Partial<FormViewConfigDto>;
export type UpdateGalleryViewDto = Partial<GalleryViewConfigDto>;
export type UpdateGridViewDto = Partial<GridViewConfigDto>;
export type UpdateHookDto = Partial<CreateHookDto>;
export type UpdateKanbanViewDto = Partial<KanbanViewConfigDto>;
export type UpdateMapViewDto = Partial<MapViewConfigDto>;
export interface UpdateRecordFieldDto {
  value: JsonValue;
}
export type UpdateRowColorConditionDto = Partial<CreateRowColorConditionDto>;
export interface UpdateRowColorModeDto {
  rowColoringMode: RowColoringMode;
}
export type UpdateSourceDto = Partial<CreateSourceDto>;
export interface UpdateTableDto {
  workspaceId?: string;
  name?: string;
  slug?: string;
  baseId?: string | null;
  sourceId?: string | null;
  type?: ModelType | null;
  storageMode?: StorageMode | null;
  description?: string | null;
  order?: number | null;
  meta?: TableMeta;
  settings?: TableSettings;
}
export type UpdateTableFieldDto = Partial<CreateTableFieldDto>;
export interface UpdateUserUiPreferencesDto {
  defaultWorkspaceId?: string | null;
  defaultBaseId?: string | null;
}
export type UpdateViewColumnDto = Partial<CreateViewColumnDto>;
export type UpdateViewColumnItemDto = UpdateViewColumnDto & {
  columnId: string;
};
export type UpdateViewDto = Partial<CreateViewDto>;
export type UpdateViewFilterDto = Partial<CreateViewFilterDto>;
export type UpdateViewSortDto = Partial<CreateViewSortDto>;
export type UpdateWorkspaceDto = Partial<CreateWorkspaceDto>;
export interface UpdateWorkspaceInviteLinkSettingsDto {
  defaultExpiryDays?: number;
  defaultMaxUses?: number;
}
export type UpdateWorkspaceMemberDto = Partial<WorkspaceMemberRoleDto> & {
  starred?: boolean | null;
  hidden?: boolean | null;
  order?: number | null;
  isActive?: boolean | null;
  deleted?: boolean | null;
};
export interface UploadAttachmentDto {
  filename: string;
  path: string;
  sourceUrl?: string;
  fileUrl?: string;
  mime?: string;
  size?: number;
  fkWorkspaceId?: string;
  baseId?: string;
  sourceId?: string;
  fkModelId?: string;
  fkColumnId?: string;
}
export interface UploadImportFileDto {
  workspaceId?: string;
  baseId?: string;
}
export interface UserUiPreferencesRawDto {
  defaultWorkspaceId: string | null;
  defaultBaseId: string | null;
}
export interface UserUiPreferencesResolvedDto {
  defaultWorkspaceId: string | null;
  defaultBaseId: string | null;
  isValid: boolean;
  reason?: string;
}
export interface ViewColumnResponseDto {
  id: string;
  viewId: string;
  workspaceId: string | null;
  baseId: string | null;
  sourceId: string | null;
  fieldId: string;
  show: boolean | null;
  order: number | null;
  width: string | null;
  align: GridColumnAlign | null;
  groupBy: boolean | null;
  groupByOrder: number | null;
  groupBySort: string | null;
  aggregation: string | null;
  label: string | null;
  helpText: string | null;
  placeholder: string | null;
  required: boolean | null;
  description: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}
export type ViewDetailQueryDto = ListViewsQueryDto;
export enum ViewLockType {
  COLLABORATIVE = 'collaborative',
  LOCKED = 'locked',
  PERSONAL = 'personal',
}
export type ViewMeta = {
  icon?: string;
  color?: string;
  coverImage?: string;
  tags?: string[];
  isPinned?: boolean;
  layout?: {
    width?: number;
    height?: number;
    density?: 'compact' | 'normal' | 'comfortable';
  };
};
export interface ViewResponseDto {
  id: string;
  tableId: string;
  workspaceId: string | null;
  baseId: string | null;
  sourceId: string | null;
  name: string;
  description: string | null;
  type: ViewType;
  show: boolean;
  order: number | null;
  lockType: ViewLockType | null;
  uuid: string | null;
  showSystemFields: boolean;
  meta: ViewMeta;
  rowColoringMode: RowColoringMode | null;
  createdBy: number | null;
  ownedBy: number | null;
  customUrlId: string | null;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number | null;
}
export enum ViewSortDirection {
  ASC = 'asc',
  DESC = 'desc',
  COUNT_ASC = 'count-asc',
  COUNT_DESC = 'count-desc',
}
export enum ViewType {
  FORM = 'form',
  GALLERY = 'gallery',
  GRID = 'grid',
  KANBAN = 'kanban',
  CALENDAR = 'calendar',
  MAP = 'map',
}
export interface WarmupCacheDto {
  tableIds?: string[];
  ttlSeconds?: number;
}
export interface WorkspaceInviteLinkResponseDto {
  id: string;
  workspaceId: string;
  role: WorkspaceMemberRole;
  scope: MembershipScope;
  baseId: string | null;
  teamId: string | null;
  roles: string | null;
  expiresAt: number;
  maxUses: number;
  usedCount: number;
  createdBy: number;
  status: WorkspaceInviteLinkStatus;
  createdAt: number | null;
  updatedAt: number | null;
  url?: string;
}
export interface WorkspaceInviteLinkSettingsResponseDto {
  id: string;
  workspaceId: string;
  defaultExpiryDays: number;
  defaultMaxUses: number;
  createdAt: number | null;
  updatedAt: number | null;
}
export enum WorkspaceInviteLinkStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  DISABLED = 'DISABLED',
}
export interface WorkspaceInviteResponseDto {
  id: string;
  workspaceId: string;
  email: string;
  role: WorkspaceMemberRole;
  scope: MembershipScope;
  baseId: string | null;
  teamId: string | null;
  roles: string | null;
  invitedBy: number;
  status: WorkspaceInviteStatus;
  expiresAt: number;
  acceptedBy: number | null;
  acceptedAt: number | null;
  createdAt: number;
  updatedAt: number;
}
export enum WorkspaceInviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}
export interface WorkspaceJoinRequestResponseDto {
  id: string;
  workspaceId: string;
  userId: number;
  inviteLinkId: string;
  status: WorkspaceJoinRequestStatus;
  requestedAt: number;
  approvedBy: number | null;
  approvedAt: number | null;
  rejectedBy: number | null;
  rejectedAt: number | null;
  createdAt: number | null;
  updatedAt: number | null;
}
export enum WorkspaceJoinRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
export interface WorkspaceMemberListResponseDto {
  list: WorkspaceMemberResponseDto[];
  pageInfo: WorkspaceMemberPageInfoDto;
}
export interface WorkspaceMemberPageInfoDto {
  totalRows: number;
  page: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  offset: number;
}
export interface WorkspaceMemberResponseDto {
  id: string;
  workspaceId: string;
  userId: number;
  role: WorkspaceMemberRole;
  starred?: boolean | null;
  order?: number | null;
  hidden?: boolean | null;
  isMigrated?: boolean | null;
  deleted: boolean;
  invitedBy?: number | null;
  joinedAt: number;
  createdAt?: number | null;
  updatedAt?: number | null;
  isActive: boolean;
  user?: WorkspaceMemberUserDto | null;
}
export enum WorkspaceMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  COMMENTER = 'commenter',
  VIEWER = 'viewer',
}
export interface WorkspaceMemberRoleDto {
  role?: WorkspaceMemberRole;
}
export type WorkspaceMemberRoleScopeDto = WorkspaceMemberRoleDto & {
  scope?: MembershipScope;
  baseId?: string | null;
  teamId?: string | null;
};
export interface WorkspaceMemberUserDto {
  id: number;
  fullName?: string | null;
  avatar?: string | null;
}
export interface WorkspaceResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  settings: WorkspaceSettings;
  isActive: boolean;
  ownerId: number;
  createdAt: number;
}
export interface WorkspaceSettings {
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  theme?: 'light' | 'dark' | 'system';
  defaultMemberRole?: WorkspaceMemberRole;
  allowPublicTables?: boolean;
  requireApproval?: boolean;
  emailNotifications?: boolean;
  slackIntegration?: SlackIntegrationConfig;
  maxTables?: number;
  maxMembers?: number;
  maxStorageBytes?: number;
  enableAuditLog?: boolean;
  enableApiAccess?: boolean;
  enableExport?: boolean;
  enableImport?: boolean;
  customDomain?: string;
  customDomainVerified?: boolean;
}

export interface AbortImportJobParams {
  jobId: string;
}
export interface AcceptInviteParams {
  body: AcceptWorkspaceInviteDto;
}
export interface AddBaseMemberParams {
  baseId: string;
  body: AddBaseMemberDto;
}
export interface AddMemberParams {
  workspaceId: string;
  body: AddWorkspaceInviteDto;
}
export interface AddReactionParams {
  commentId: string;
  body: CreateCommentReactionDto;
}
export interface AggregateRecordsParams {
  tableId: string;
  query?: RecordAggregateQueryDto;
}
export interface ApproveRequestParams {
  workspaceId: string;
  requestId: string;
}
export interface BulkColumnsParams {
  tableId: string;
  body: BulkColumnsWithMetaDto;
}
export interface BulkDataListParams {
  tableId: string;
  body: BulkDataListDto;
}
export interface BulkGroupByParams {
  tableId: string;
  body: BulkGroupDto;
}
export interface BulkUpdateViewColumnsParams {
  viewId: string;
  body: BulkUpdateViewColumnsDto;
}
export interface CancelJobParams {
  jobId: string;
}
export interface ClearRowColorParams {
  viewId: string;
}
export interface CountByDateParams {
  tableId: string;
  viewId: string;
  query?: CalendarDataQueryDto;
}
export interface CountCommentsParams {
  query?: CountCommentsQueryDto;
}
export interface CountRangeParams {
  tableId: string;
  viewId: string;
  query?: CalendarDataQueryDto;
}
export interface CountRecordsParams {
  tableId: string;
  query?: RecordListQueryDto;
}
export interface CreateApiTokenParams {
  body: CreateApiTokenDto;
}
export interface CreateBaseParams {
  workspaceId: string;
  body: CreateBaseDto;
}
export interface CreateCalendarViewParams {
  tableId: string;
  body: CreateCalendarViewDto;
}
export interface CreateColumnParams {
  tableId: string;
  body: CreateTableFieldDto;
}
export interface CreateCommentParams {
  body: CreateCommentDto;
}
export interface CreateFilterParams {
  viewId: string;
  body: CreateViewFilterDto;
}
export interface CreateFormViewParams {
  tableId: string;
  body: CreateFormViewDto;
}
export interface CreateGalleryViewParams {
  tableId: string;
  body: CreateGalleryViewDto;
}
export interface CreateGridViewParams {
  tableId: string;
  body: CreateGridViewDto;
}
export interface CreateInviteLinkParams {
  workspaceId: string;
  body: CreateWorkspaceInviteLinkDto;
}
export interface CreateKanbanViewParams {
  tableId: string;
  body: CreateKanbanViewDto;
}
export interface CreateMapViewParams {
  tableId: string;
  body: CreateMapViewDto;
}
export interface CreatePresignedUrlParams {
  body: CreatePresignedUrlDto;
}
export interface CreateRecordsParams {
  tableId: string;
  body: TableRecordInput | TableRecordInput[];
}
export interface CreateRowColorConditionParams {
  viewId: string;
  body: CreateRowColorConditionDto;
}
export interface CreateSecureTokenParams {
  attachmentId: string;
  body: SecureAttachmentTokenDto;
}
export interface CreateSortParams {
  viewId: string;
  body: CreateViewSortDto;
}
export interface CreateSourceParams {
  baseId: string;
  body: CreateSourceDto;
}
export interface CreateTableParams {
  body: CreateTableDto;
}
export interface CreateViewColumnParams {
  viewId: string;
  body: CreateViewColumnDto;
}
export interface CreateViewParams {
  tableId: string;
  body: CreateViewDto;
}
export interface CreateWorkspaceParams {
  body: CreateWorkspaceDto;
}
export interface DeleteApiTokenParams {
  tokenId: string;
}
export interface DeleteAttachmentParams {
  attachmentId: string;
}
export interface DeleteBaseParams {
  baseId: string;
}
export interface DeleteColumnParams {
  columnId: string;
}
export interface DeleteCommentParams {
  commentId: string;
}
export interface DeleteFilterParams {
  filterId: string;
}
export interface DeleteRecordsParams {
  tableId: string;
  body: string | string[] | RecordIdPayload | RecordIdPayload[];
}
export interface DeleteRowColorConditionParams {
  viewId: string;
  id: string;
}
export interface DeleteSettingsParams {
  workspaceId: string;
}
export interface DeleteSortParams {
  sortId: string;
}
export interface DeleteSourceParams {
  sourceId: string;
}
export interface DeleteTableParams {
  tableId: string;
}
export interface DeleteViewParams {
  viewId: string;
}
export interface DeleteWorkspaceParams {
  workspaceId: string;
}
export interface DuplicateViewParams {
  viewId: string;
}
export interface EnumsParams {
  _?: never;
}
export interface ExchangeTokenParams {
  _?: never;
}
export interface GetAttachmentParams {
  attachmentId: string;
}
export interface GetBaseParams {
  baseId: string;
}
export interface GetCalendarViewParams {
  calendarViewId: string;
}
export interface GetColumnParams {
  columnId: string;
}
export interface GetColumnsHashParams {
  tableId: string;
}
export interface GetFilterParams {
  filterId: string;
}
export interface GetFormViewParams {
  formViewId: string;
}
export interface GetGalleryViewParams {
  galleryViewId: string;
}
export interface GetImportJobParams {
  jobId: string;
}
export interface GetInviteLinkParams {
  workspaceId: string;
}
export interface GetJobParams {
  jobId: string;
}
export interface GetKanbanViewParams {
  kanbanViewId: string;
}
export interface GetMapViewParams {
  mapViewId: string;
}
export interface GetMeUiPreferencesParams {
  _?: never;
}
export interface GetOrCreateInviteLinkParams {
  workspaceId: string;
}
export interface GetRecordParams {
  tableId: string;
  recordId: string;
}
export interface GetRowColorParams {
  viewId: string;
}
export interface GetSecureAttachmentParams {
  attachmentId: string;
}
export interface GetSettingsParams {
  workspaceId: string;
}
export interface GetSortParams {
  sortId: string;
}
export interface GetSourceParams {
  sourceId: string;
}
export interface GetTableParams {
  tableId: string;
  query?: ListTablesQueryDto;
}
export interface GetViewParams {
  viewId: string;
  query?: ViewDetailQueryDto;
}
export interface GetWorkspaceBySlugParams {
  slug: string;
}
export interface GetWorkspaceParams {
  workspaceId: string;
}
export interface GroupByParams {
  tableId: string;
  query?: RecordListQueryDto;
}
export interface HealthParams {
  _?: never;
}
export interface HideViewParams {
  viewId: string;
}
export interface HookCreateParams {
  tableId: string;
  body: CreateHookDto;
}
export interface HookDeleteParams {
  hookId: string;
}
export interface HookFilterCreateParams {
  hookId: string;
  body: CreateViewFilterDto;
}
export interface HookFilterDeleteParams {
  hookId: string;
  filterId: string;
}
export interface HookFilterListParams {
  hookId: string;
}
export interface HookFilterUpdateParams {
  hookId: string;
  filterId: string;
  body: UpdateViewFilterDto;
}
export interface HookListParams {
  tableId: string;
  query?: ListHooksQueryDto;
}
export interface HookLogListParams {
  hookId: string;
  query?: ListHookLogsQueryDto;
}
export interface HookTestParams {
  tableId: string;
  body: TestHookDto;
}
export interface HookTriggerParams {
  hookId: string;
  rowId: string;
}
export interface HookUpdateParams {
  hookId: string;
  body: UpdateHookDto;
}
export interface ImportFromUrlParams {
  body: ImportFromUrlDto;
}
export interface InvalidateParams {
  body: InvalidateCacheDto;
}
export interface LinkRecordsBulkParams {
  tableId: string;
  fieldId: string;
  body: BulkLinkDto;
}
export interface LinkRecordsParams {
  tableId: string;
  fieldId: string;
  recordId: string;
  body: RelationUpdateDto;
}
export interface ListApiTokensParams {
  query?: ListApiTokensQueryDto;
}
export interface ListBaseMembersParams {
  baseId: string;
  query?: ListBaseMembersQueryDto;
}
export interface ListBasesParams {
  workspaceId: string;
  query?: ListBasesQueryDto;
}
export interface ListCalendarRecordsParams {
  tableId: string;
  viewId: string;
  query?: CalendarDataQueryDto;
}
export interface ListChildrenParams {
  filterParentId: string;
}
export interface ListCommentsParams {
  query?: ListCommentsQueryDto;
}
export interface ListenParams {
  body: JobListenDto;
}
export interface ListFiltersParams {
  viewId: string;
}
export interface ListGridColumnsParams {
  gridViewId: string;
}
export interface ListGroupedRecordsParams {
  tableId: string;
  viewId: string;
  query?: RecordListQueryDto;
}
export interface ListJobsParams {
  query?: ListJobsQueryDto;
}
export interface ListLinkedRecordsParams {
  tableId: string;
  fieldId: string;
  recordId: string;
}
export interface ListMembersParams {
  workspaceId: string;
  query?: ListWorkspaceMembersQueryDto;
}
export interface ListRecordsByFieldIdsParams {
  tableId: string;
  query?: RecordListQueryDto;
}
export interface ListRecordsParams {
  tableId: string;
  query?: RecordListQueryDto;
}
export interface ListRequestsParams {
  workspaceId: string;
  query?: ListWorkspaceJoinRequestsQueryDto;
}
export interface ListSortsParams {
  viewId: string;
}
export interface ListSourcesParams {
  baseId: string;
  query?: ListSourcesQueryDto;
}
export interface ListTablesParams {
  query?: ListTablesQueryDto;
}
export interface ListViewColumnsParams {
  viewId: string;
}
export interface ListViewsParams {
  tableId: string;
  query?: ListViewsQueryDto;
}
export interface ListWorkspacesParams {
  query?: ListWorkspacesQueryDto;
}
export interface MoveRecordParams {
  tableId: string;
  recordId: string;
  body: RecordMoveDto;
}
export interface OpenApiJsonParams {
  _?: never;
}
export interface PermissionsParams {
  _?: never;
}
export interface PinParams {
  body: PinCommandPaletteDto;
}
export interface PreviewImportFileParams {
  body: PreviewImportDto;
}
export interface RecentParams {
  _?: never;
}
export interface RecordAuditParams {
  recordId: string;
}
export interface RedocParams {
  _?: never;
}
export interface ReindexTableParams {
  tableId: string;
}
export interface RejectRequestParams {
  workspaceId: string;
  requestId: string;
}
export interface RemoveBaseMemberParams {
  baseId: string;
  baseMemberId: string;
}
export interface RemoveMemberParams {
  workspaceId: string;
  memberId: string;
}
export interface RemoveReactionParams {
  commentId: string;
  reaction: string;
}
export interface ReorderColumnsParams {
  tableId: string;
  body: ReorderColumnsDto;
}
export interface ReorderSortsParams {
  viewId: string;
  body: ReorderViewSortsDto;
}
export interface ReorderTablesParams {
  tableId: string;
  body: ReorderTablesDto;
}
export interface RequestJoinParams {
  linkId: string;
  body: RequestJoinByInviteLinkDto;
}
export interface RetryJobParams {
  jobId: string;
}
export interface RunOperationParams {
  name: string;
  body: InternalOperationDto;
}
export interface SearchParams {
  query?: CommandPaletteSearchQueryDto;
}
export interface SetDefaultViewParams {
  viewId: string;
}
export interface SetPrimaryColumnParams {
  columnId: string;
}
export interface ShowViewParams {
  viewId: string;
}
export interface StartExportParams {
  tableId: string;
  body: StartExportDto;
}
export interface StartImportParams {
  body: StartImportDto;
}
export interface StatsParams {
  _?: never;
}
export interface SwaggerParams {
  _?: never;
}
export interface TableSampleDataParams {
  tableId: string;
  event: AppEvents;
  operation: HookOperation;
  version: HookVersion;
  query?: string;
}
export interface UnlinkRecordsBulkParams {
  tableId: string;
  fieldId: string;
  body: BulkLinkDto;
}
export interface UnlinkRecordsParams {
  tableId: string;
  fieldId: string;
  recordId: string;
  body: RelationUpdateDto;
}
export interface UpdateApiTokenParams {
  tokenId: string;
  body: UpdateApiTokenDto;
}
export interface UpdateBaseMemberParams {
  baseId: string;
  baseMemberId: string;
  body: UpdateBaseMemberDto;
}
export interface UpdateBaseParams {
  baseId: string;
  body: UpdateBaseDto;
}
export interface UpdateCalendarViewParams {
  calendarViewId: string;
  body: UpdateCalendarViewDto;
}
export interface UpdateColumnParams {
  columnId: string;
  body: UpdateTableFieldDto;
}
export interface UpdateCommentParams {
  commentId: string;
  body: UpdateCommentDto;
}
export interface UpdateFilterParams {
  filterId: string;
  body: UpdateViewFilterDto;
}
export interface UpdateFormColumnParams {
  formViewColumnId: string;
  body: UpdateViewColumnDto;
}
export interface UpdateFormViewParams {
  formViewId: string;
  body: UpdateFormViewDto;
}
export interface UpdateGalleryViewParams {
  galleryViewId: string;
  body: UpdateGalleryViewDto;
}
export interface UpdateGridColumnParams {
  gridViewColumnId: string;
  body: UpdateViewColumnDto;
}
export interface UpdateGridViewParams {
  viewId: string;
  body: UpdateGridViewDto;
}
export interface UpdateKanbanViewParams {
  kanbanViewId: string;
  body: UpdateKanbanViewDto;
}
export interface UpdateMapViewParams {
  mapViewId: string;
  body: UpdateMapViewDto;
}
export interface UpdateMemberParams {
  workspaceId: string;
  memberId: string;
  body: UpdateWorkspaceMemberDto;
}
export interface UpdateMeUiPreferencesParams {
  body: UpdateUserUiPreferencesDto;
}
export interface UpdateRecordFieldParams {
  tableId: string;
  recordId: string;
  fieldId: string;
  body: UpdateRecordFieldDto;
}
export interface UpdateRecordsParams {
  tableId: string;
  body: TableRecordInput | TableRecordInput[];
}
export interface UpdateRowColorConditionParams {
  viewId: string;
  id: string;
  body: UpdateRowColorConditionDto;
}
export interface UpdateRowColorModeParams {
  viewId: string;
  body: UpdateRowColorModeDto;
}
export interface UpdateSortParams {
  sortId: string;
  body: UpdateViewSortDto;
}
export interface UpdateSourceParams {
  sourceId: string;
  body: UpdateSourceDto;
}
export interface UpdateTableParams {
  tableId: string;
  body: UpdateTableDto;
}
export interface UpdateViewColumnParams {
  viewId: string;
  columnId: string;
  body: UpdateViewColumnDto;
}
export interface UpdateViewParams {
  viewId: string;
  body: UpdateViewDto;
}
export interface UpdateWorkspaceParams {
  workspaceId: string;
  body: UpdateWorkspaceDto;
}
export interface UploadImportFileParams {
  body: UploadImportFileDto;
}
export interface UploadParams {
  body: UploadAttachmentDto;
}
export interface UpsertSettingsParams {
  workspaceId: string;
  body: UpdateWorkspaceInviteLinkSettingsDto;
}
export interface VersionParams {
  _?: never;
}
export interface WarmupParams {
  body: WarmupCacheDto;
}

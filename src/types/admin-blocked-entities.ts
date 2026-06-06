// ============================================================
// Admin Blocked Entities Types — Batch 10
// Source of truth: docs/admin-batch-10-blocked-entities-cross-security/01-blocked-entities-api-docs.md
// ============================================================

export type BlockPagination = {
  total?: number;
  page: number;
  limit: number;
  totalPages?: number;
  hasMore?: boolean;
};

// ---- Blocked Entity Record ----

export type BlockedEntity = {
  id: number;
  blocked_user_id?: number | null;
  blocked_doctor_id?: number | null;
  blocked_assistant_id?: number | null;
  blocked_admin_id?: number | null;
  blocked_by_admin_id?: number | null;
  entity_type?: 'user' | 'doctor' | 'assistant' | 'admin' | string | null;
  block_type?: 'temporary' | 'permanent' | 'warning' | string;
  blocked_until?: string | null;
  reason?: string | null;
  is_active: boolean | number;
  removed_at?: string | null;
  removed_by_admin_id?: number | null;
  created_at: string;
  [key: string]: unknown;
};

// ---- List Endpoint ----

export type GetBlockedEntitiesParams = {
  page?: number;
  limit?: number;
  entity_type?: string;
  block_type?: string;
  is_active?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: string;
};

export type GetBlockedEntitiesResponse = {
  success: boolean;
  data?: BlockedEntity[];
  pagination?: BlockPagination;
};

// ---- Statistics Endpoint ----

export type BlockedStatsSummary = {
  total_blocks?: number;
  active_blocks?: number;
  removed_blocks?: number;
  blocked_users?: number;
  blocked_doctors?: number;
  blocked_assistants?: number;
  blocked_admins?: number;
  temporary_blocks?: number;
  permanent_blocks?: number;
  warning_blocks?: number;
  blocks_last_week?: number;
  blocks_last_month?: number;
  unblocks_last_week?: number;
  expiring_soon?: number;
  [key: string]: unknown;
};

export type TopBlockingAdmin = {
  admin_id: number;
  count: number;
  [key: string]: unknown;
};

export type GetBlockedEntitiesStatsResponse = {
  success: boolean;
  data?: {
    summary?: BlockedStatsSummary;
    top_blocking_admins?: TopBlockingAdmin[];
  };
};

// ---- Check Endpoint ----

export type CheckBlockedEntityParams = {
  entity_id: number;
  entity_type: string;
};

export type CheckBlockedEntityResponse = {
  success: boolean;
  is_blocked: boolean;
  block_info?: {
    id: number;
    block_type?: string;
    blocked_until?: string | null;
    reason?: string;
    blocked_at?: string;
    blocked_by?: string | number;
    [key: string]: unknown;
  } | null;
};

// ---- Details Endpoint ----

export type GetBlockDetailsResponse = {
  success: boolean;
  message_en?: string;
  message_ar?: string;
  data?: {
    block?: BlockedEntity;
    entity?: Record<string, unknown>;
  };
};

// ---- History Endpoint ----

export type GetBlockHistoryParams = {
  entity_type: string;
  entity_id: number;
  page?: number;
  limit?: number;
};

export type GetBlockHistoryResponse = {
  success: boolean;
  message_en?: string;
  message_ar?: string;
  data?: {
    entity?: Record<string, unknown>;
    history?: BlockedEntity[];
    pagination?: BlockPagination;
  };
};

// ---- Mutation Payloads & Responses ----

export type BlockEntityPayload = {
  entity_id: number;
  entity_type: 'user' | 'doctor' | 'assistant' | 'admin' | string;
  block_type: 'temporary' | 'permanent' | 'warning' | string;
  blocked_until?: string | null;
  reason: string;
};

export type BlockEntityResponse = {
  success: boolean;
  message_ar?: string;
  message_en?: string;
  data?: {
    block_id?: number;
    entity_id?: number;
    entity_type?: string;
    block_type?: string;
    blocked_until?: string | null;
    blocked_by?: number;
    [key: string]: unknown;
  };
  existing_block?: BlockedEntity;
};

export type UnblockEntityPayload = {
  entity_id: number;
  entity_type: 'user' | 'doctor' | 'assistant' | 'admin' | string;
  reason?: string;
};

export type UnblockEntityResponse = {
  success: boolean;
  message_ar?: string;
  message_en?: string;
  data?: {
    entity_id?: number;
    entity_type?: string;
    previous_block?: {
      block_type?: string;
      blocked_at?: string;
      blocked_by?: number;
    };
  };
};

export type UpdateBlockPayload = {
  block_type?: 'temporary' | 'permanent' | 'warning' | string;
  blocked_until?: string | null;
  reason?: string;
};

export type UpdateBlockResponse = {
  success: boolean;
  message_ar?: string;
  message_en?: string;
  data?: {
    block_id?: string | number;
    old_values?: Record<string, unknown>;
    new_values?: Record<string, unknown>;
  };
};

export type BulkEntityItem = {
  entity_id: number;
  entity_type: 'user' | 'doctor' | 'assistant' | 'admin' | string;
};

export type BulkBlockPayload = {
  entities: BulkEntityItem[];
  block_type: 'temporary' | 'permanent' | 'warning' | string;
  blocked_until?: string | null;
  reason: string;
};

export type BulkBlockResponse = {
  success: boolean;
  message_ar?: string;
  message_en?: string;
  data?: {
    success?: BulkEntityItem[];
    failed?: BulkEntityItem[];
  };
};

export type BulkUnblockPayload = {
  entities: BulkEntityItem[];
  reason?: string;
};

export type BulkUnblockResponse = {
  success: boolean;
  message_ar?: string;
  message_en?: string;
  data?: {
    success?: BulkEntityItem[];
    failed?: BulkEntityItem[];
  };
};

export type AutoUnblockResponse = {
  success: boolean;
  message_ar?: string;
  message_en?: string;
  unblocked_count?: number;
};

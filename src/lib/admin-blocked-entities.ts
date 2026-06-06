// ============================================================
// Admin Blocked Entities Service — Batch 10
// Covers all /api/admin/blocked-entities/* endpoints.
// Source of truth: docs/admin-batch-10-blocked-entities-cross-security/01-blocked-entities-api-docs.md
// ============================================================

import { apiGet, apiPost, apiPatch, buildQueryString } from './api';
import type {
  GetBlockedEntitiesParams,
  GetBlockedEntitiesResponse,
  GetBlockedEntitiesStatsResponse,
  CheckBlockedEntityParams,
  CheckBlockedEntityResponse,
  GetBlockDetailsResponse,
  GetBlockHistoryParams,
  GetBlockHistoryResponse,
  BlockEntityPayload,
  BlockEntityResponse,
  UnblockEntityPayload,
  UnblockEntityResponse,
  UpdateBlockPayload,
  UpdateBlockResponse,
  BulkBlockPayload,
  BulkBlockResponse,
  BulkUnblockPayload,
  BulkUnblockResponse,
  AutoUnblockResponse,
} from '@/types/admin-blocked-entities';

/**
 * GET /api/admin/blocked-entities
 * List all blocked entities with filtering and pagination.
 * Permission: Any Admin
 */
export async function getBlockedEntitiesList(
  params?: GetBlockedEntitiesParams
): Promise<GetBlockedEntitiesResponse> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | undefined | null>);
  return apiGet<GetBlockedEntitiesResponse>(`/api/admin/blocked-entities${qs}`);
}

/**
 * GET /api/admin/blocked-entities/statistics
 * Get blocked entities statistics and summary.
 * Permission: Any Admin
 */
export async function getBlockedEntitiesStats(): Promise<GetBlockedEntitiesStatsResponse> {
  return apiGet<GetBlockedEntitiesStatsResponse>('/api/admin/blocked-entities/statistics');
}

/**
 * GET /api/admin/blocked-entities/check
 * Check block status of a single entity.
 * Permission: Any Admin
 */
export async function checkBlockedEntity(
  params: CheckBlockedEntityParams
): Promise<CheckBlockedEntityResponse> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | undefined | null>);
  return apiGet<CheckBlockedEntityResponse>(`/api/admin/blocked-entities/check${qs}`);
}

/**
 * GET /api/admin/blocked-entities/:blockId
 * Get details of a specific block record.
 * Permission: Any Admin
 */
export async function getBlockDetails(blockId: string | number): Promise<GetBlockDetailsResponse> {
  return apiGet<GetBlockDetailsResponse>(`/api/admin/blocked-entities/${blockId}`);
}

/**
 * GET /api/admin/blocked-entities/history/:entity_type/:entity_id
 * Get the history of blocks for a specific entity.
 * Permission: Any Admin
 */
export async function getBlockHistory(
  params: GetBlockHistoryParams
): Promise<GetBlockHistoryResponse> {
  const { entity_type, entity_id, page, limit } = params;
  const qs = buildQueryString({ page, limit } as Record<string, string | number | boolean | undefined | null>);
  return apiGet<GetBlockHistoryResponse>(`/api/admin/blocked-entities/history/${entity_type}/${entity_id}${qs}`);
}

/**
 * POST /api/admin/blocked-entities/block
 * Create a new block record for an entity.
 * Permission: System Admin or Super Admin
 */
export async function createBlockEntity(payload: BlockEntityPayload): Promise<BlockEntityResponse> {
  return apiPost<BlockEntityResponse>('/api/admin/blocked-entities/block', payload);
}

/**
 * POST /api/admin/blocked-entities/unblock
 * Unblock an entity.
 * Permission: System Admin or Super Admin
 */
export async function unblockEntity(payload: UnblockEntityPayload): Promise<UnblockEntityResponse> {
  return apiPost<UnblockEntityResponse>('/api/admin/blocked-entities/unblock', payload);
}

/**
 * PATCH /api/admin/blocked-entities/:blockId
 * Update an existing block record.
 * Permission: System Admin or Super Admin
 */
export async function updateBlockRecord(
  blockId: string | number,
  payload: UpdateBlockPayload
): Promise<UpdateBlockResponse> {
  return apiPatch<UpdateBlockResponse>(`/api/admin/blocked-entities/${blockId}`, payload);
}

/**
 * POST /api/admin/blocked-entities/bulk/block
 * Bulk block multiple entities.
 * Permission: System Admin or Super Admin
 */
export async function bulkBlockEntities(payload: BulkBlockPayload): Promise<BulkBlockResponse> {
  return apiPost<BulkBlockResponse>('/api/admin/blocked-entities/bulk/block', payload);
}

/**
 * POST /api/admin/blocked-entities/bulk/unblock
 * Bulk unblock multiple entities.
 * Permission: System Admin or Super Admin
 */
export async function bulkUnblockEntities(payload: BulkUnblockPayload): Promise<BulkUnblockResponse> {
  return apiPost<BulkUnblockResponse>('/api/admin/blocked-entities/bulk/unblock', payload);
}

/**
 * POST /api/admin/blocked-entities/auto-unblock
 * Auto unblock all expired temporary blocks.
 * Permission: System Admin or Super Admin
 */
export async function autoUnblockExpired(): Promise<AutoUnblockResponse> {
  return apiPost<AutoUnblockResponse>('/api/admin/blocked-entities/auto-unblock', {});
}

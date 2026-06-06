import { apiGet, apiPut, apiDelete, apiPost } from "./api";
import { ApiSuccessResponse } from "@/types/api";
import {
  FileEntity,
  GetFilesParams,
  FileStatistics,
  UpdateFileMetadataBody,
  BulkDeleteFilesBody,
} from "@/types/admin-files";

const BASE_PATH = "/api/files";

export const AdminFilesService = {
  getFiles: async (
    params?: GetFilesParams
  ): Promise<ApiSuccessResponse<FileEntity[]> & { count?: number; total?: number; pagination?: any }> => {
    return apiGet<ApiSuccessResponse<FileEntity[]> & { count?: number; total?: number; pagination?: any }>(BASE_PATH, { params: params as Record<string, any> });
  },

  getFileStatistics: async (
    entityType?: string,
    entityId?: number
  ): Promise<ApiSuccessResponse<FileStatistics>> => {
    const params: Record<string, any> = {};
    if (entityType) params.entityType = entityType;
    if (entityId) params.entityId = entityId;

    return apiGet<ApiSuccessResponse<FileStatistics>>(`${BASE_PATH}/statistics`, { params });
  },

  getFileByUuid: async (uuid: string): Promise<ApiSuccessResponse<FileEntity>> => {
    return apiGet<ApiSuccessResponse<FileEntity>>(`${BASE_PATH}/${uuid}`);
  },

  getFilesByUploader: async (
    entityType: string,
    entityId: number,
    params?: { fileCategory?: string; limit?: number; offset?: number }
  ): Promise<ApiSuccessResponse<FileEntity[]>> => {
    return apiGet<ApiSuccessResponse<FileEntity[]>>(`${BASE_PATH}/uploader/${entityType}/${entityId}`, { params: params as Record<string, any> });
  },

  getFilesByRelated: async (
    relatedToType: string,
    relatedToId: number,
    params?: { fileCategory?: string; limit?: number; offset?: number }
  ): Promise<ApiSuccessResponse<FileEntity[]>> => {
    return apiGet<ApiSuccessResponse<FileEntity[]>>(`${BASE_PATH}/related/${relatedToType}/${relatedToId}`, { params: params as Record<string, any> });
  },

  updateFileMetadata: async (
    uuid: string,
    data: UpdateFileMetadataBody
  ): Promise<ApiSuccessResponse<FileEntity>> => {
    return apiPut<ApiSuccessResponse<FileEntity>>(`${BASE_PATH}/${uuid}`, data);
  },

  deleteFile: async (uuid: string, deleteFromDisk: boolean = false): Promise<ApiSuccessResponse<null>> => {
    return apiDelete<ApiSuccessResponse<null>>(`${BASE_PATH}/${uuid}`, {
      params: { deleteFromDisk },
    });
  },

  restoreFile: async (uuid: string): Promise<ApiSuccessResponse<null>> => {
    return apiPost<ApiSuccessResponse<null>>(`${BASE_PATH}/${uuid}/restore`);
  },

  cleanupExpiredFiles: async (): Promise<ApiSuccessResponse<null>> => {
    return apiPost<ApiSuccessResponse<null>>(`${BASE_PATH}/cleanup/expired`);
  },

  bulkDeleteFiles: async (data: BulkDeleteFilesBody): Promise<ApiSuccessResponse<null>> => {
    return apiPost<ApiSuccessResponse<null>>(`${BASE_PATH}/bulk-delete`, data);
  },
};

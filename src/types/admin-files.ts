export interface FileMetadata {
  reviewed_by?: string;
  [key: string]: unknown;
}

export interface FileEntity {
  uuid: string;
  original_name?: string;
  file_name?: string;
  file_url?: string;
  path?: string;
  mime_type?: string;
  size?: number;
  entity_type?: string;
  entity_id?: number;
  is_public?: boolean;
  virus_scan_status?: string;
  virus_scan_date?: string;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: FileMetadata;
}

export interface GetFilesParams {
  page?: number;
  limit?: number;
  entityType?: string;
  entityId?: number;
  fileCategory?: string;
  relatedToType?: string;
  relatedToId?: number;
  virusScanStatus?: string;
  isPublic?: string | boolean;
  storageProvider?: string;
  searchTerm?: string;
}

export interface FileStatistics {
  overall: Record<string, unknown>;
  byCategory: Record<string, unknown>;
  byVirusScan: Record<string, unknown>;
  byStorageProvider: Record<string, unknown>;
}

export interface UpdateFileMetadataBody {
  is_public?: boolean;
  metadata?: FileMetadata;
  virus_scan_status?: string;
  virus_scan_date?: string;
  expires_at?: string;
}

export interface BulkDeleteFilesBody {
  uuids: string[];
  deleteFromDisk?: boolean;
}

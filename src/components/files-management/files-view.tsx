"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AdminFilesService } from "@/lib/admin-files";
import { FileEntity } from "@/types/admin-files";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { MoreVerticalIcon, SearchIcon, TrashIcon } from "@/components/ui/icons/dashboard-icons";
import { RefreshCw } from "lucide-react";
import { getApiErrorMessage } from "@/lib/error-utils";

interface FilesViewProps {
  t: any;
  lang: string;
}

export default function FilesView({ t, lang }: FilesViewProps) {
  const [files, setFiles] = useState<FileEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setAccessDenied(false);

      const res = await AdminFilesService.getFiles({
        page,
        limit,
        searchTerm: searchTerm || undefined,
      });

      if (res.success) {
        setFiles(Array.isArray(res.data) ? res.data : ((res.data as any).files || []));
      } else {
        setError(res.message || t.files_management?.action_failed || "Failed to load files");
      }
    } catch (err: any) {
      if (err?.status === 403 || err?.status === 401) {
        setAccessDenied(true);
      } else {
        setError(getApiErrorMessage(err, lang as "en" | "ar") || "Failed to load files");
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, lang, t]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDelete = async (uuid: string, hardDelete: boolean = false) => {
    if (!confirm(hardDelete ? t.files_management?.confirm_hard_delete : t.files_management?.confirm_delete)) return;
    
    try {
      setLoading(true);
      const res = await AdminFilesService.deleteFile(uuid, hardDelete);
      if (res.success) {
        await fetchFiles();
      } else {
        alert(res.message || t.files_management?.action_failed);
      }
    } catch (err) {
      alert(getApiErrorMessage(err, lang as "en" | "ar"));
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (uuid: string) => {
    try {
      setLoading(true);
      const res = await AdminFilesService.restoreFile(uuid);
      if (res.success) {
        await fetchFiles();
      } else {
        alert(res.message || t.files_management?.action_failed);
      }
    } catch (err) {
      alert(getApiErrorMessage(err, lang as "en" | "ar"));
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    if (!confirm(t.files_management?.confirm_cleanup)) return;
    try {
      setLoading(true);
      const res = await AdminFilesService.cleanupExpiredFiles();
      if (res.success) {
        await fetchFiles();
      } else {
        alert(res.message || t.files_management?.action_failed);
      }
    } catch (err) {
      alert(getApiErrorMessage(err, lang as "en" | "ar"));
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to page 1 on search
  };

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <TrashIcon />
        </div>
        <h2 className="text-xl font-bold text-[#0A1B39] mb-2">{t.address?.permission_denied || "Permission Denied"}</h2>
        <p className="text-[#6C7688] max-w-md">
          {t.files_management?.access_denied_desc || "You do not have the required permissions to view or manage files. Super admin access is required."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#E7E8EB]">
        <div>
          <h1 className="text-[20px] font-bold text-[#0A1B39]">{t.files_management?.title || "Files Management"}</h1>
          <span className="text-[13px] text-[#6C7688]">{files.length} {t.files_management?.all_files || "Files"}</span>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-[300px]">
            <input
              type="text"
              placeholder={t.files_management?.search_files || "Search files..."}
              className="w-full h-10 pl-10 pr-4 rounded-[8px] border border-[#E7E8EB] bg-[#F5F6F8] focus:bg-white focus:border-[#2E37A4] outline-none text-[13px] transition-all"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Enter' && fetchFiles()}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]">
              <SearchIcon />
            </div>
          </div>
          
          <button 
            onClick={handleCleanup}
            className="flex items-center gap-2 h-10 px-4 rounded-[8px] bg-red-50 text-red-600 font-semibold text-[13px] hover:bg-red-100 transition-colors"
          >
            <TrashIcon />
            <span className="hidden sm:inline">{t.files_management?.cleanup_expired || "Cleanup Expired"}</span>
          </button>

          <button 
            onClick={fetchFiles}
            className="w-10 h-10 flex items-center justify-center rounded-[8px] border border-[#E7E8EB] text-[#6C7688] hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex flex-col items-center justify-center min-h-[200px]">
          <p className="mb-4">{error}</p>
          <button onClick={fetchFiles} className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md font-medium text-sm transition-colors">
            {t.address?.retry || "Retry"}
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden min-h-[400px]">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-[#FAFBFC]">
                <tr className="border-b border-[#E7E8EB]">
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39]">{t.files_management?.original_name || "Name"}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39]">{t.files_management?.mime_type || "Type"}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39]">{t.files_management?.size || "Size"}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39]">{t.files_management?.entity_type || "Entity"}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39]">{t.files_management?.created_at || "Date"}</th>
                  <th className="py-4 px-6 text-center text-[13px] font-bold text-[#0A1B39]">{t.files_management?.virus_scan_status || "Scan Status"}</th>
                  <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39]"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[13px] text-[#6C7688]">{t.common?.loading || "Loading..."}</span>
                      </div>
                    </td>
                  </tr>
                ) : files.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[14px] text-[#6C7688]">
                      {t.files_management?.no_files_found || "No files found."}
                    </td>
                  </tr>
                ) : (
                  files.map((file) => (
                    <tr key={file.uuid} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            {file.file_url ? (
                              file.mime_type?.startsWith('image/') ? (
                                <Image src={file.file_url} alt={file.original_name || 'File'} width={40} height={40} className="w-full h-full object-cover rounded-lg" unoptimized />
                              ) : (
                                <span className="text-xs font-bold text-gray-500">{file.mime_type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                              )
                            ) : (
                                <span className="text-xs font-bold text-gray-500">N/A</span>
                            )}
                          </div>
                          <div className="flex flex-col max-w-[200px]">
                            <span className="text-[14px] font-bold text-[#0A1B39] truncate" title={file.original_name || file.file_name}>{file.original_name || file.file_name || 'Unnamed'}</span>
                            {file.is_public && <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded w-max mt-1">{t.files_management?.is_public || "Public"}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-[13px] text-[#6C7688]">{file.mime_type || 'N/A'}</td>
                      <td className="py-3 px-6 text-[13px] text-[#6C7688]">
                        {file.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-[#0A1B39]">{file.entity_type || 'N/A'}</span>
                          <span className="text-[11px] text-[#6C7688]">ID: {file.entity_id || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-[13px] text-[#6C7688]" dir="ltr">
                        {file.created_at ? new Date(file.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${
                          file.virus_scan_status === 'clean' ? 'bg-green-100 text-green-700' :
                          file.virus_scan_status === 'infected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {file.virus_scan_status === 'clean' ? (t.files_management?.clean || "Clean") : 
                           file.virus_scan_status === 'infected' ? (t.files_management?.infected || "Infected") : 
                           (t.files_management?.pending || "Pending")}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-end">
                        <CustomDropdown 
                          trigger={
                            <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                              <MoreVerticalIcon />
                            </button>
                          }
                          items={[
                            { label: t.files_management?.restore || "Restore", onClick: () => handleRestore(file.uuid) },
                            { label: t.files_management?.delete || "Soft Delete", onClick: () => handleDelete(file.uuid, false), className: "text-[#EF1E1E] hover:bg-[#FEF2F2]" },
                            { label: t.files_management?.hard_delete || "Hard Delete", onClick: () => handleDelete(file.uuid, true), className: "text-[#EF1E1E] hover:bg-[#FEF2F2]" }
                          ]}
                          width="w-32"
                          align="end"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Simple Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E7E8EB] bg-[#FAFBFC]">
            <span className="text-[13px] text-[#6C7688]">
              {t.clinic?.page || "Page"} {page}
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-3 py-1 text-[13px] border border-[#E7E8EB] rounded bg-white disabled:opacity-50 hover:bg-gray-50"
              >
                {t.clinic?.previous || "Previous"}
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={files.length < limit || loading}
                className="px-3 py-1 text-[13px] border border-[#E7E8EB] rounded bg-white disabled:opacity-50 hover:bg-gray-50"
              >
                {t.clinic?.next || "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

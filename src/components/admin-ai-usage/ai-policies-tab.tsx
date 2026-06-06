"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getAIUsagePolicies, createAIUsagePolicy, updateAIUsagePolicy, updateAIUsagePolicyStatus } from "@/lib/admin-ai-usage";
import { getApiErrorMessage } from "@/lib/error-utils";
import type { AIUsagePolicy, AIPolicyScopeType } from "@/types/admin-ai-usage";
import { Plus, CheckCircle, XCircle, MoreVertical, Edit } from "lucide-react";

interface AIPoliciesTabProps {
  t: any;
  lang: string;
}

export function AIPoliciesTab({ t, lang }: AIPoliciesTabProps) {
  const [policies, setPolicies] = useState<AIUsagePolicy[]>([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [scopeTypeFilter, setScopeTypeFilter] = useState<string>("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<AIUsagePolicy | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form states
  const [fName, setFName] = useState("");
  const [fScope, setFScope] = useState<AIPolicyScopeType>("global");
  const [fUserId, setFUserId] = useState<string>("");
  const [fPackageId, setFPackageId] = useState<string>("");
  const [fActive, setFActive] = useState(true);
  const [fPriority, setFPriority] = useState<number>(100);
  const [fReq, setFReq] = useState<string>("");
  const [fChat, setFChat] = useState<string>("");
  const [fImg, setFImg] = useState<string>("");
  const [fDoc, setFDoc] = useState<string>("");
  const [fFiles, setFFiles] = useState<string>("");
  const [fTokens, setFTokens] = useState<string>("");

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit: 10 };
      if (scopeTypeFilter) params.scope_type = scopeTypeFilter;
      if (isActiveFilter === "true") params.is_active = true;
      if (isActiveFilter === "false") params.is_active = false;

      const result = await getAIUsagePolicies(params);
      setPolicies(result.policies || []);
      setPagination(result.pagination || { current_page: 1, total_pages: 1 });
    } catch (err) {
      setError(getApiErrorMessage(err, lang as "ar" | "en"));
    } finally {
      setLoading(false);
    }
  }, [lang, scopeTypeFilter, isActiveFilter]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const openCreateModal = () => {
    setEditingPolicy(null);
    setFName("");
    setFScope("global");
    setFUserId("");
    setFPackageId("");
    setFActive(true);
    setFPriority(100);
    setFReq("");
    setFChat("");
    setFImg("");
    setFDoc("");
    setFFiles("");
    setFTokens("");
    setIsModalOpen(true);
  };

  const openEditModal = (p: AIUsagePolicy) => {
    setEditingPolicy(p);
    setFName(p.policy_name || "");
    setFScope(p.scope_type || "global");
    setFUserId(p.user_id ? p.user_id.toString() : "");
    setFPackageId(p.package_id ? p.package_id.toString() : "");
    setFActive(p.is_active !== undefined ? p.is_active : true);
    setFPriority(p.priority ?? 100);
    setFReq(p.limits?.max_total_requests_per_month?.toString() ?? "");
    setFChat(p.limits?.max_chat_messages_per_month?.toString() ?? "");
    setFImg(p.limits?.max_image_analyses_per_month?.toString() ?? "");
    setFDoc(p.limits?.max_document_analyses_per_month?.toString() ?? "");
    setFFiles(p.limits?.max_files_per_session?.toString() ?? "");
    setFTokens(p.limits?.max_tokens_per_request?.toString() ?? "");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!fName || fName.length < 3) {
      alert(t.ai_usage?.action_failed || "Name must be at least 3 characters.");
      return;
    }
    if (fScope === "user" && !fUserId) {
      alert(t.ai_usage?.action_failed || "User ID is required for user scope.");
      return;
    }
    if (fScope === "package" && !fPackageId) {
      alert(t.ai_usage?.action_failed || "Package ID is required for package scope.");
      return;
    }

    setModalLoading(true);
    try {
      const payload: any = {
        policy_name: fName,
        scope_type: fScope,
        is_active: fActive,
        priority: fPriority
      };
      
      if (fScope === "user") payload.user_id = parseInt(fUserId);
      if (fScope === "package") payload.package_id = parseInt(fPackageId);
      if (fScope === "global") {
        payload.user_id = null;
        payload.package_id = null;
      }
      
      if (fReq) payload.max_total_requests_per_month = parseInt(fReq);
      if (fChat) payload.max_chat_messages_per_month = parseInt(fChat);
      if (fImg) payload.max_image_analyses_per_month = parseInt(fImg);
      if (fDoc) payload.max_document_analyses_per_month = parseInt(fDoc);
      if (fFiles) payload.max_files_per_session = parseInt(fFiles);
      if (fTokens) payload.max_tokens_per_request = parseInt(fTokens);

      if (editingPolicy) {
        await updateAIUsagePolicy(editingPolicy.id, payload);
      } else {
        await createAIUsagePolicy(payload);
      }
      
      setIsModalOpen(false);
      fetchData(pagination.current_page);
      alert(t.ai_usage?.action_success || "Saved successfully");
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, lang as "ar" | "en"));
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async (p: AIUsagePolicy) => {
    if (!confirm(t.ai_usage?.confirm_action || "Are you sure?")) return;
    try {
      await updateAIUsagePolicyStatus(p.id, { is_active: !p.is_active });
      fetchData(pagination.current_page);
      alert(t.ai_usage?.action_success || "Updated successfully");
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, lang as "ar" | "en"));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-[12px] border border-[#E7E8EB]">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={scopeTypeFilter}
            onChange={(e) => setScopeTypeFilter(e.target.value)}
            className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] focus:outline-none"
          >
            <option value="">{t.ai_usage?.scope_type || "All Scopes"}</option>
            <option value="global">{t.ai_usage?.global || "Global"}</option>
            <option value="user">{t.ai_usage?.user || "User"}</option>
            <option value="package">{t.ai_usage?.package || "Package"}</option>
          </select>
          <select
            value={isActiveFilter}
            onChange={(e) => setIsActiveFilter(e.target.value)}
            className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] focus:outline-none"
          >
            <option value="">{t.ai_usage?.status || "All Statuses"}</option>
            <option value="true">{t.ai_usage?.activate || "Active"}</option>
            <option value="false">{t.ai_usage?.deactivate || "Inactive"}</option>
          </select>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[6px] hover:bg-[#252D88]"
        >
          <Plus className="w-4 h-4" />
          {t.ai_usage?.create_policy || "Create Policy"}
        </button>
      </div>

      <div className="bg-white border border-[#E7E8EB] rounded-[12px] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-[#EF1E1E]">{error}</div>
        ) : policies.length === 0 ? (
          <div className="p-8 text-center text-[#6C7688]">{t.ai_usage?.no_ai_usage_found || "No policies found."}</div>
        ) : (
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F6F8] border-b border-[#E7E8EB]">
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.policy_name || "Policy Name"}</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.scope_type || "Scope"}</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.status || "Status"}</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.max_total_requests_per_month || "Requests/Mo"}</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.priority || "Priority"}</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39] text-center">{t.clinic?.actions || "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((p) => (
                  <tr key={p.id} className="border-b border-[#E7E8EB] hover:bg-[#F9FAFB]">
                    <td className="px-6 py-4 text-[14px] text-[#0A1B39]">{p.policy_name}</td>
                    <td className="px-6 py-4 text-[14px] text-[#0A1B39]">
                      <span className="capitalize">{p.scope_type}</span>
                      {p.scope_type === 'user' && p.user_id && ` (#${p.user_id})`}
                      {p.scope_type === 'package' && p.package_id && ` (#${p.package_id})`}
                    </td>
                    <td className="px-6 py-4">
                      {p.is_active ? (
                        <span className="text-[#27AE60] bg-[#E8F8EE] px-2 py-1 rounded-[6px] text-[12px] font-medium">{t.ai_usage?.activate || "Active"}</span>
                      ) : (
                        <span className="text-[#EF1E1E] bg-[#FDE8E8] px-2 py-1 rounded-[6px] text-[12px] font-medium">{t.ai_usage?.deactivate || "Inactive"}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#0A1B39]">{p.limits?.max_total_requests_per_month || "—"}</td>
                    <td className="px-6 py-4 text-[14px] text-[#0A1B39]">{p.priority}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal(p)} className="p-1 text-[#2E37A4] hover:bg-[#F5F6F8] rounded" title={t.clinic?.edit || "Edit"}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleToggleStatus(p)} className="p-1 text-[#6C7688] hover:bg-[#F5F6F8] rounded" title="Toggle Status">
                          {p.is_active ? <XCircle className="w-4 h-4 text-[#EF1E1E]" /> : <CheckCircle className="w-4 h-4 text-[#27AE60]" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {pagination.total_pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[#E7E8EB]">
            <button
              disabled={pagination.current_page <= 1}
              onClick={() => fetchData(pagination.current_page - 1)}
              className="px-4 py-2 text-[13px] font-medium text-[#0A1B39] border border-[#E7E8EB] rounded-[6px] disabled:opacity-50"
            >
              {t.clinic?.previous || "Previous"}
            </button>
            <span className="text-[13px] text-[#6C7688]">
              {pagination.current_page} / {pagination.total_pages}
            </span>
            <button
              disabled={pagination.current_page >= pagination.total_pages}
              onClick={() => fetchData(pagination.current_page + 1)}
              className="px-4 py-2 text-[13px] font-medium text-[#0A1B39] border border-[#E7E8EB] rounded-[6px] disabled:opacity-50"
            >
              {t.clinic?.next || "Next"}
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[12px] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-xl">
            <h3 className="text-[18px] font-bold text-[#0A1B39] mb-4">
              {editingPolicy ? t.ai_usage?.update_policy || "Update Policy" : t.ai_usage?.create_policy || "Create Policy"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.policy_name || "Policy Name"} *</label>
                <input
                  type="text"
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.scope_type || "Scope Type"} *</label>
                <select
                  value={fScope}
                  onChange={(e) => setFScope(e.target.value as AIPolicyScopeType)}
                  className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px]"
                >
                  <option value="global">{t.ai_usage?.global || "Global"}</option>
                  <option value="user">{t.ai_usage?.user || "User"}</option>
                  <option value="package">{t.ai_usage?.package || "Package"}</option>
                </select>
              </div>

              {fScope === "user" && (
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.user_id || "User ID"} *</label>
                  <input
                    type="number"
                    value={fUserId}
                    onChange={(e) => setFUserId(e.target.value)}
                    className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px]"
                  />
                </div>
              )}

              {fScope === "package" && (
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.package_id || "Package ID"} *</label>
                  <input
                    type="number"
                    value={fPackageId}
                    onChange={(e) => setFPackageId(e.target.value)}
                    className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px]"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.priority || "Priority"}</label>
                <input
                  type="number"
                  value={fPriority}
                  onChange={(e) => setFPriority(parseInt(e.target.value))}
                  className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.is_active || "Is Active"}</label>
                <select
                  value={fActive ? "true" : "false"}
                  onChange={(e) => setFActive(e.target.value === "true")}
                  className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px]"
                >
                  <option value="true">{t.ai_usage?.activate || "Yes"}</option>
                  <option value="false">{t.ai_usage?.deactivate || "No"}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.max_total_requests_per_month || "Max Requests/Mo"}</label>
                <input
                  type="number"
                  value={fReq}
                  onChange={(e) => setFReq(e.target.value)}
                  className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.max_chat_messages_per_month || "Max Chat/Mo"}</label>
                <input
                  type="number"
                  value={fChat}
                  onChange={(e) => setFChat(e.target.value)}
                  className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.max_image_analyses_per_month || "Max Image/Mo"}</label>
                <input
                  type="number"
                  value={fImg}
                  onChange={(e) => setFImg(e.target.value)}
                  className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.max_document_analyses_per_month || "Max Doc/Mo"}</label>
                <input
                  type="number"
                  value={fDoc}
                  onChange={(e) => setFDoc(e.target.value)}
                  className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.max_tokens_per_request || "Max Tokens/Req"}</label>
                <input
                  type="number"
                  value={fTokens}
                  onChange={(e) => setFTokens(e.target.value)}
                  className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.max_files_per_session || "Max Files/Session"}</label>
                <input
                  type="number"
                  value={fFiles}
                  onChange={(e) => setFFiles(e.target.value)}
                  className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px]"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#F5F6F8] text-[#6C7688] text-[13px] font-medium rounded-[6px]"
              >
                {t.clinic?.close || "Cancel"}
              </button>
              <button
                onClick={handleSave}
                disabled={modalLoading}
                className="px-4 py-2 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[6px] disabled:opacity-50"
              >
                {modalLoading ? "..." : (t.clinic?.apply || "Save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

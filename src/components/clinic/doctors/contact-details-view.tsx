"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getAllDoctorContactDetails } from "@/lib/admin-doctors";
import { getApiErrorMessage } from "@/lib/error-utils";
import type { DoctorContactDetailsData } from "@/types/admin-doctors";
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownSmall, SearchIcon } from "@/components/ui/icons/dashboard-icons";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomDropdown } from "@/components/ui/custom-dropdown";

interface ContactDetailsViewProps {
  t: any;
}

const DEFAULT_LIMIT = 20;

export default function ContactDetailsView({ t }: ContactDetailsViewProps) {
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  const [contacts, setContacts] = useState<DoctorContactDetailsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllDoctorContactDetails({
        page,
        limit,
        search: debouncedSearch || undefined,
      });
      setContacts(res.data || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(res.pagination?.totalPages || 0);
    } catch (err) {
      setError(getApiErrorMessage(err, "en"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, limit, debouncedSearch]);

  const handleExportCSV = () => {
    if (!contacts.length) return;
    const headers = ["Doctor ID", "Email", "Phone", "WhatsApp", "Emergency Phone"];
    const rows = contacts.map(c => [
      c.doctor_id,
      c.email || "—",
      c.phone || "—",
      c.whatsapp_number || "—",
      c.emergency_contact_phone || "—"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "doctors_contact_details.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const rowsOptions = [
    { label: "10", onClick: () => { setLimit(10); setPage(1); } },
    { label: "20", onClick: () => { setLimit(20); setPage(1); } },
    { label: "50", onClick: () => { setLimit(50); setPage(1); } },
  ];

  return (
    <div className="flex flex-col items-start gap-6 w-full p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#0A1B39] tracking-tight">
            {t.clinic?.all_doctors_contact_details || "Doctor Contact Details"}
          </h1>
          <p className="text-[14px] text-[#6C7688] mt-1">
            {t.clinic?.all_doctors_contact_details_desc || "View all registered doctors' contact information."}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-[280px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6C7688] w-4 h-4">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder={t.clinic?.search_doctors || "Search doctors..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] focus:ring-1 focus:ring-[#2E37A4] transition-all shadow-sm"
            />
          </div>
          <button
            onClick={handleExportCSV}
            disabled={contacts.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#0A1B39] text-[13px] font-bold rounded-[8px] border border-[#E7E8EB] hover:bg-[#F5F6F8] transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {t.clinic?.export_csv || "Export CSV"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col w-full bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {loading ? (
          <div className="flex flex-col w-full min-h-[400px] items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col w-full min-h-[400px] items-center justify-center gap-4">
            <span className="text-[14px] text-[#EF1E1E]">{error}</span>
            <button onClick={fetchContacts} className="px-5 py-2 bg-[#2E37A4] text-white text-[13px] font-semibold rounded-[8px]">
              {t.dashboard?.retry || "Retry"}
            </button>
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col w-full min-h-[400px] items-center justify-center">
            <span className="text-[14px] text-[#6C7688]">No contact details found</span>
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-auto min-h-[400px] rounded-t-[12px]"> 
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-[#E7E8EB] bg-white">
                    <th className="text-start py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[15%]">Doctor ID</th>
                    <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.clinic?.email || "Email"}</th>
                    <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.clinic?.phone || "Phone"}</th>
                    <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.clinic?.whatsapp || "WhatsApp"}</th>
                    <th className="text-start py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.clinic?.emergency_contact || "Emergency Contact"}</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((doc) => (
                    <tr key={doc.doctor_id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3 px-6">
                        <a href={`/${lang}/clinic/doctors/details?id=${doc.doctor_id}`} className="text-[13px] font-bold text-[#2E37A4] hover:underline">
                          #{doc.doctor_id}
                        </a>
                      </td>
                      <td className="py-3 px-4"><span className="text-[13px] text-[#0A1B39] font-medium">{doc.email || "—"}</span></td>
                      <td className="py-3 px-4"><span className="text-[13px] text-[#6C7688]" dir="ltr">{doc.phone || "—"}</span></td>
                      <td className="py-3 px-4"><span className="text-[13px] text-[#6C7688]" dir="ltr">{doc.whatsapp_number || "—"}</span></td>
                      <td className="py-3 px-6"><span className="text-[13px] text-[#6C7688]" dir="ltr">{doc.emergency_contact_phone || "—"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[#E7E8EB] bg-[#FAFBFC] gap-4 rounded-b-[12px]">
              <div className="flex items-center gap-3 text-[13px] text-[#6C7688] font-medium">
                <span>{t.clinic.row_per_page || "Rows per page"}</span>
                <CustomDropdown 
                  trigger={
                    <button className="flex items-center justify-between w-[65px] h-[34px] px-2.5 bg-white border border-[#E7E8EB] rounded-[6px] text-[#0A1B39] font-bold text-[13px] hover:border-[#2E37A4] transition-all shadow-sm">
                      {limit}
                      <span className="w-4 h-4 text-[#6C7688] flex items-center justify-center">
                        <ChevronDownSmall />
                      </span>
                    </button>
                  }
                  items={rowsOptions}
                  width="w-[65px]"
                  align="start" 
                />
                <span>Total {total} entries</span>
              </div>

              {totalPages > 0 && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 transition-all shadow-sm"
                  >
                    <ChevronLeftIcon />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-[6px] text-[13px] font-medium transition-all shadow-sm",
                        page === p 
                          ? "bg-[#2E37A4] text-white border border-[#2E37A4] shadow-indigo-200" 
                          : "bg-white border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4]"
                      )}
                    >
                      {p}
                    </button>
                  ))}

                  <button 
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 transition-all shadow-sm"
                  >
                    <ChevronRightIcon />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

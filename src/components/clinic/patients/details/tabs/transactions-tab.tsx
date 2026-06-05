"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { 
  SearchIcon, 
  FilterIcon, 
  CalendarSmallIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownSmall,
  WalletOutlineIcon,
  GenderIcon,
  AlertCircleOutlineIcon
} from "@/components/ui/icons/dashboard-icons";

interface TransactionsTabProps {
  t: any;
  patient: any;
}

export const TransactionsTab = ({ t, patient }: TransactionsTabProps) => {
  const transactions = patient.transactionsData || [];
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(transactions.length / rowsPerPage) || 1;
  const currentData = transactions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const rowsOptions = [
    { label: "10", onClick: () => { setRowsPerPage(10); setCurrentPage(1); } },
    { label: "20", onClick: () => { setRowsPerPage(20); setCurrentPage(1); } },
    { label: "50", onClick: () => { setRowsPerPage(50); setCurrentPage(1); } },
  ];

  // Helper for Status Colors (Matched with the uploaded image)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-[#27AE60] bg-[#F0FDF4] border-[#27AE60]/20";
      case "pending": case "processing": return "text-[#2F80ED] bg-[#EFF6FF] border-[#2F80ED]/20"; // Blue as in image
      case "failed": case "cancelled": return "text-[#EF1E1E] bg-[#FEF2F2] border-[#EF1E1E]/20";
      case "refunded": return "text-[#6B21A8] bg-[#F3E8FF] border-[#6B21A8]/20";
      default: return "text-[#6C7688] bg-[#F5F6F8] border-[#E7E8EB]";
    }
  };

  return (
    <div className="flex flex-col w-full bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      
      {/* --- 1. Top Action Bar --- */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b border-[#E7E8EB] gap-4 bg-[#FAFBFC]">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-[250px]">
            <input 
              type="text" 
              placeholder={t.clinic.search || "Search..."} 
              className="w-full pl-4 pr-10 rtl:pr-4 rtl:pl-10 py-2 bg-white border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
            <span className="absolute right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]"><SearchIcon /></span>
          </div>
          {/* Date Picker */}
          <div className="relative w-full sm:w-[220px]">
            <input 
              type="text" 
              placeholder="22 Feb 26 - 22 Feb 26" 
              className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 bg-white border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#6C7688] focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
            <span className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-[#9DA4B0]"><CalendarSmallIcon /></span>
          </div>
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E7E8EB] rounded-[6px] text-[13px] font-medium text-[#0A1B39] hover:bg-[#F5F6F8] transition-colors w-full md:w-auto justify-center">
          <FilterIcon /> {t.clinic.filters || "Filters"}
        </button>
      </div>

      {/* --- 2. Data Table --- */}
      <div className="w-full overflow-x-auto min-h-[400px]">
        <table className="w-full min-w-[900px]">
          <thead className="bg-white border-b border-[#E7E8EB]">
            <tr>
              <th className="text-start py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.transaction_id}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.clinic.description}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.paid_date}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.payment_method}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.amount}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.clinic.status || "Status"}</th>
              <th className="text-center py-4 px-4 w-[5%]"></th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? currentData.map((txn: any) => {
              const isExpanded = expandedId === txn.id;
              
              return (
                <React.Fragment key={txn.id}>
                  {/* Standard Row */}
                  <tr 
                    onClick={() => setExpandedId(isExpanded ? null : txn.id)}
                    className={cn(
                      "border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer group",
                      isExpanded ? "bg-[#FAFBFC]" : ""
                    )}
                  >
                    <td className="py-4 px-6 text-[13px] font-semibold text-[#6C7688]" dir="ltr">{txn.transactionId}</td>
                    <td className="py-4 px-4 text-[13px] font-medium text-[#2E37A4]">{txn.description}</td>
                    <td className="py-4 px-4 text-[13px] text-[#6C7688]" dir="ltr">{txn.paidDate}</td>
                    <td className="py-4 px-4 text-[13px] text-[#6C7688]">{txn.paymentMethod}</td>
                    <td className="py-4 px-4 text-[14px] font-bold text-[#0A1B39]">{txn.currency} {txn.amount}</td>
                    <td className="py-4 px-4">
                      <span className={cn("px-2.5 py-1 rounded-[6px] text-[11px] font-bold border capitalize", getStatusColor(txn.status))}>
                        {t.clinic[`status_${txn.status}`] || txn.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                       <div className={cn("text-[#9DA4B0] transition-transform duration-300 inline-block", isExpanded ? "rotate-180" : "rotate-0")}>
                          <ChevronDownSmall />
                       </div>
                    </td>
                  </tr>

                  {/* Expanded Detailed Row (SQL Data) */}
                  {isExpanded && (
                    <tr className="bg-[#FAFBFC] border-b border-[#E7E8EB]">
                      <td colSpan={7} className="p-0">
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-200 shadow-inner">
                          
                          {/* Col 1: Financial Breakdown */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[14px] font-bold text-[#2E37A4] flex items-center gap-2 border-b border-[#E7E8EB] pb-2">
                              <WalletOutlineIcon /> {t.clinic.financial_breakdown}
                            </h4>
                            <div className="flex justify-between items-center text-[13px]">
                              <span className="text-[#6C7688]">{t.clinic.amount}</span>
                              <span className="font-semibold text-[#0A1B39]">{txn.currency} {txn.amount}</span>
                            </div>
                            <div className="flex justify-between items-center text-[13px]">
                              <span className="text-[#6C7688]">{t.clinic.processing_fee}</span>
                              <span className="font-semibold text-[#EF1E1E]">- {txn.currency} {txn.processingFee}</span>
                            </div>
                            <div className="flex justify-between items-center text-[14px] pt-2 border-t border-dashed border-[#E7E8EB]">
                              <span className="font-bold text-[#0A1B39]">{t.clinic.net_amount}</span>
                              <span className="font-bold text-[#27AE60]">{txn.currency} {txn.netAmount}</span>
                            </div>
                          </div>

                          {/* Col 2: Gateway Details */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[14px] font-bold text-[#2E37A4] flex items-center gap-2 border-b border-[#E7E8EB] pb-2">
                              <GenderIcon /> {t.clinic.payment_gateway}
                            </h4>
                            <div className="flex flex-col gap-1">
                              <span className="text-[12px] font-semibold text-[#9DA4B0]">{t.clinic.payment_gateway}</span>
                              <span className="text-[13px] font-bold text-[#0A1B39] uppercase">{txn.paymentGateway || "-"}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[12px] font-semibold text-[#9DA4B0]">{t.clinic.gateway_txn_id}</span>
                              <span className="text-[12px] text-[#6C7688] font-mono break-all">{txn.gatewayTransactionId || "-"}</span>
                            </div>
                            <div className="text-[10px] text-[#9DA4B0] font-mono mt-auto">UUID: {txn.uuid}</div>
                          </div>

                          {/* Col 3: Refund Details (Only show if refunded) */}
                          {txn.refundAmount > 0 && (
                            <div className="flex flex-col gap-4">
                              <h4 className="text-[14px] font-bold text-[#EF1E1E] flex items-center gap-2 border-b border-[#E7E8EB] pb-2">
                                <AlertCircleOutlineIcon /> {t.clinic.refund_details}
                              </h4>
                              <div className="flex justify-between items-center text-[13px] bg-[#FEF2F2] p-2 rounded-[6px] border border-[#EF1E1E]/20">
                                <span className="text-[#EF1E1E] font-bold">{t.clinic.refund_amount}</span>
                                <span className="font-bold text-[#EF1E1E]">{txn.currency} {txn.refundAmount}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[12px] font-semibold text-[#9DA4B0]">{t.clinic.refund_reason}</span>
                                <span className="text-[13px] text-[#6C7688] italic">{txn.refundReason || "-"}</span>
                              </div>
                              <div className="flex justify-end text-[11px] text-[#9DA4B0] font-medium mt-auto" dir="ltr">
                                {txn.refundedAt}
                              </div>
                            </div>
                          )}

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            }) : (
              <tr><td colSpan={7} className="py-12 text-center text-[#9DA4B0]">No transactions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- 3. Pagination Footer --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[#E7E8EB] bg-[#FAFBFC] gap-4">
        <div className="flex items-center gap-3 text-[13px] text-[#6C7688] font-medium">
          <span>{t.clinic.row_per_page || "Row Per Page"}</span>
          <CustomDropdown 
            trigger={
              <button className="flex items-center justify-between w-[60px] h-[32px] px-2 bg-white border border-[#E7E8EB] rounded-[6px] text-[#0A1B39] font-bold text-[13px] hover:border-[#2E37A4] transition-all">
                {rowsPerPage}
                  <span className="w-4 h-4 text-[#6C7688] flex items-center justify-center">
                    <ChevronDownSmall />
                  </span>
              </button>
            }
            items={rowsOptions}
            width="w-[60px]"
            align="start"
          />
          <span>{t.clinic.entries || "Entries"}</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 transition-all shadow-sm"
          >
            <ChevronLeftIcon />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn("w-8 h-8 flex items-center justify-center rounded-[6px] text-[13px] font-medium transition-all shadow-sm",
                currentPage === page ? "bg-[#2E37A4] text-white" : "bg-white border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4]"
              )}
            >
              {page}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 transition-all shadow-sm"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
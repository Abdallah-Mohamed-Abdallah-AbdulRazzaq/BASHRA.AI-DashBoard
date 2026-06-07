import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface DoctorActionModalProps {
  t: any;
  actionType: string;
  onClose: () => void;
  onConfirm: (reason: string, status?: string) => void;
}

export const DoctorActionModal = ({ t, actionType, onClose, onConfirm }: DoctorActionModalProps) => {
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("active");

  const getTitle = () => {
    switch (actionType) {
      case "approve": return "Approve Doctor";
      case "reject": return "Reject Doctor";
      case "suspend": return "Suspend Doctor";
      case "verify": return "Verify Profile";
      case "unverify": return "Unverify Profile";
      case "update_status": return "Update Status";
      default: return "Doctor Action";
    }
  };

  const isDestructive = actionType === "reject" || actionType === "suspend" || actionType === "unverify";

  const handleConfirm = () => {
    onConfirm(reason, actionType === "update_status" ? status : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[12px] shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-4 border-b border-[#E7E8EB]">
          <h3 className="text-[16px] font-bold text-[#0A1B39]">{getTitle()}</h3>
          <button onClick={onClose} className="text-[#6C7688] hover:text-[#0A1B39] transition-colors">
            ✕
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          
          {actionType === "update_status" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">Select Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E7E8EB] rounded-[8px] text-[14px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="pending_verification">Pending Verification</option>
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0A1B39]">Reason</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for this action..."
              className="w-full min-h-[100px] p-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[14px] text-[#0A1B39] resize-y focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#E7E8EB] bg-[#FAFBFC]">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-semibold text-[#6C7688] hover:text-[#0A1B39] hover:bg-[#E7E8EB] rounded-[8px] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className={cn(
              "px-4 py-2 text-[13px] font-semibold text-white rounded-[8px] transition-all disabled:opacity-50",
              isDestructive ? "bg-[#EF1E1E] hover:bg-[#D91B1B]" : "bg-[#2E37A4] hover:bg-[#252E8A]"
            )}
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
};

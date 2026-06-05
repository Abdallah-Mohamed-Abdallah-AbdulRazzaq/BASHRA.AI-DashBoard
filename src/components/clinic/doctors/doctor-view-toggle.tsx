import React from "react";
import { cn } from "@/lib/utils";
import { ListLayoutIcon, GridLayoutIcon } from "@/components/ui/icons/dashboard-icons";

interface DoctorViewToggleProps {
  view: "list" | "grid";
  onChange: (view: "list" | "grid") => void;
}

export const DoctorViewToggle = ({ view, onChange }: DoctorViewToggleProps) => {
  return (
    <div className="flex items-center bg-white border border-[#E7E8EB] rounded-[8px] p-1">
      <button
        onClick={() => onChange("list")}
        className={cn(
          "p-1.5 rounded-[6px] transition-all",
          view === "list" ? "bg-[#F5F6F8] text-[#2E37A4]" : "text-[#6C7688] hover:bg-gray-50"
        )}
      >
        <ListLayoutIcon />
      </button>
      <button
        onClick={() => onChange("grid")}
        className={cn(
          "p-1.5 rounded-[6px] transition-all",
          view === "grid" ? "bg-[#F5F6F8] text-[#2E37A4]" : "text-[#6C7688] hover:bg-gray-50"
        )}
      >
        <GridLayoutIcon />
      </button>
    </div>
  );
};
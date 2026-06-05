"use client";

import React, { useState } from "react";
import { PackageFeatureModal } from "./package-feature-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { cn } from "@/lib/utils";
import { 
  PlusIcon, 
  MoreVerticalIcon,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Package
} from "lucide-react";

interface PackageFeaturesViewProps {
  t: any;
}

export default function PackageFeaturesView({ t }: PackageFeaturesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("all");

  // --- Dummy Data (From DB) ---
  const packagesList = [
    { id: "1", name_en: "Basic Plan", name_ar: "الباقة الأساسية" },
    { id: "2", name_en: "Pro Plan", name_ar: "الباقة الاحترافية" },
    { id: "3", name_en: "Enterprise Plan", name_ar: "باقة الشركات" }
  ];

  const featuresList = [
    { id: "f1", name_en: "Doctor Accounts", name_ar: "حسابات الأطباء", unit_en: "Accounts" },
    { id: "f2", name_en: "Cloud Storage", name_ar: "التخزين السحابي", unit_en: "GB" },
    { id: "f3", name_en: "AI Diagnosis Scans", name_ar: "فحوصات الذكاء الاصطناعي", unit_en: "Scans" },
  ];

  // Dummy Mapping Data (Matching `package_features` SQL Table)
  const [mappings, setMappings] = useState([
    { id: 1, package_id: "1", feature_id: "f1", feature_value: "3", is_included: true },
    { id: 2, package_id: "1", feature_id: "f2", feature_value: "10", is_included: true },
    { id: 3, package_id: "1", feature_id: "f3", feature_value: "Not Included", is_included: false },
    { id: 4, package_id: "2", feature_id: "f1", feature_value: "10", is_included: true },
    { id: 5, package_id: "2", feature_id: "f2", feature_value: "50", is_included: true },
    { id: 6, package_id: "2", feature_id: "f3", feature_value: "100", is_included: true },
  ]);

  const handleAddNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (mapping: any) => {
    setEditingData(mapping);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to remove this feature from the package?")) {
      setMappings(mappings.filter(m => m.id !== id));
    }
  };

  const handleToggleInclude = (id: number) => {
    setMappings(mappings.map(m => m.id === id ? { ...m, is_included: !m.is_included } : m));
  };

  // Filter mappings based on selected package
  const filteredMappings = selectedPackageId === "all" 
    ? mappings 
    : mappings.filter(m => m.package_id === selectedPackageId);

  // Helper to get names
  const getPackageName = (id: string) => packagesList.find(p => p.id === id)?.name_en;
  const getFeatureName = (id: string) => featuresList.find(f => f.id === id);

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. Header & Package Filter Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full bg-white p-5 border border-[#E7E8EB] rounded-[12px] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#E0E2F4] text-[#2E37A4] flex items-center justify-center shrink-0">
            <LinkIcon size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0A1B39] leading-tight">{t.packages.mapping_title}</h2>
            <span className="text-[12px] font-medium text-[#6C7688]">Total mapped: {filteredMappings.length}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Smart Package Filter */}
          <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E7E8EB] rounded-[8px] p-1 w-full sm:w-auto">
            <div className="pl-3 rtl:pr-3 rtl:pl-0 text-[#9DA4B0]"><Package size={16} /></div>
            <select 
              value={selectedPackageId} 
              onChange={(e) => setSelectedPackageId(e.target.value)}
              className="h-8 bg-transparent text-[13px] text-[#0A1B39] font-medium focus:outline-none pr-8 cursor-pointer"
            >
              <option value="all">{t.packages.all_packages}</option>
              {packagesList.map(pkg => (
                <option key={pkg.id} value={pkg.id}>{pkg.name_en}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleAddNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-[#2E37A4] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#252D88] transition-colors shadow-sm shrink-0 h-10"
          >
            <PlusIcon size={16} /> {t.packages.assign_feature}
          </button>
        </div>
      </div>

      {/* 2. Data Table */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                {selectedPackageId === "all" && <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[20%]">Package Name</th>}
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[30%]">Feature Name</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.packages.feature_value}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.packages.is_included}</th>
                <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[5%]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredMappings.map((mapping) => {
                const feature = getFeatureName(mapping.feature_id);
                return (
                  <tr key={mapping.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                    
                    {selectedPackageId === "all" && (
                      <td className="py-4 px-6">
                        <span className="text-[13px] font-bold text-[#2E37A4] bg-[#E0E2F4]/30 px-3 py-1 rounded-[6px]">{getPackageName(mapping.package_id)}</span>
                      </td>
                    )}

                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-bold text-[#0A1B39]">{feature?.name_en}</span>
                        <span className="text-[12px] font-medium text-[#6C7688]">{feature?.name_ar}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-[14px] font-bold text-[#0A1B39] bg-[#F5F6F8] px-3 py-1.5 rounded-[6px] border border-[#E7E8EB]">
                        {mapping.feature_value} {feature?.unit_en && <span className="text-[11px] text-[#6C7688] ml-1">{feature.unit_en}</span>}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <button 
                        onClick={() => handleToggleInclude(mapping.id)}
                        className={cn("flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-[12px] font-bold border transition-colors",
                          mapping.is_included ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20 hover:bg-[#E2F7EB]" : "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20 hover:bg-[#FDE2E2]"
                        )}
                      >
                        {mapping.is_included ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {mapping.is_included ? t.packages.included : t.packages.not_included}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-end">
                      <CustomDropdown 
                        trigger={
                          <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                            <MoreVerticalIcon size={16} />
                          </button>
                        }
                        items={[
                          { label: t.packages.edit_mapping, onClick: () => handleEdit(mapping) },
                          { label: t.common?.delete || "Delete", onClick: () => handleDelete(mapping.id), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" }
                        ]}
                        width="w-32"
                        align="end"
                      />
                    </td>

                  </tr>
                );
              })}
              
              {filteredMappings.length === 0 && (
                <tr>
                  <td colSpan={selectedPackageId === "all" ? 5 : 4} className="py-12 text-center text-[14px] text-[#6C7688]">
                    No features mapped for this package yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. The Modal */}
      <PackageFeatureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        t={t} 
        editData={editingData} 
        packagesList={packagesList}
        featuresList={featuresList}
      />

    </div>
  );
}
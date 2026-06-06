"use client";

import React, { useState, useEffect } from "react";
import { PackageFeatureModal } from "./package-feature-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { cn } from "@/lib/utils";
import { 
  PlusIcon, 
  MoreVerticalIcon,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Package,
  RefreshCw,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { 
  getAdminPackages, 
  getAdminFeatures, 
  getPackageFeatures, 
  deletePackageFeature 
} from "@/lib/admin-packages";
import { AdminPackage, AdminFeature, PackageFeatureRelation } from "@/types/admin-packages";
import { getApiErrorMessage } from "@/lib/error-utils";

interface PackageFeaturesViewProps {
  t: any;
}

export default function PackageFeaturesView({ t }: PackageFeaturesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<PackageFeatureRelation | null>(null);
  
  const [packagesList, setPackagesList] = useState<AdminPackage[]>([]);
  const [featuresList, setFeaturesList] = useState<AdminFeature[]>([]);
  
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [mappings, setMappings] = useState<PackageFeatureRelation[]>([]);
  
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true);
  const [isLoadingMappings, setIsLoadingMappings] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [mappingsError, setMappingsError] = useState<string | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mappingToDelete, setMappingToDelete] = useState<PackageFeatureRelation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingPackages(true);
      setIsLoadingFeatures(true);
      setError(null);
      try {
        const [pkgsRes, featsRes] = await Promise.all([
          getAdminPackages({ is_active: true }),
          getAdminFeatures({ is_active: true })
        ]);
        
        if (pkgsRes.success && pkgsRes.data) {
          setPackagesList(pkgsRes.data);
          if (pkgsRes.data.length > 0) {
            setSelectedPackageId(pkgsRes.data[0].id.toString());
          }
        }
        
        if (featsRes.success && featsRes.data) {
          setFeaturesList(featsRes.data);
        }
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setIsLoadingPackages(false);
        setIsLoadingFeatures(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const fetchMappings = async (pkgId: string) => {
    if (!pkgId) {
      setMappings([]);
      return;
    }
    
    setIsLoadingMappings(true);
    setMappingsError(null);
    try {
      const res = await getPackageFeatures(parseInt(pkgId));
      if (res.success && res.data) {
        setMappings(res.data);
      } else {
        setMappingsError(res.message || "Failed to fetch mappings");
      }
    } catch (err) {
      setMappingsError(getApiErrorMessage(err));
    } finally {
      setIsLoadingMappings(false);
    }
  };

  useEffect(() => {
    if (selectedPackageId) {
      fetchMappings(selectedPackageId);
    }
  }, [selectedPackageId]);

  const handleAddNew = () => {
    if (!selectedPackageId) {
      alert("Please select a package first.");
      return;
    }
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (mapping: PackageFeatureRelation) => {
    setEditingData(mapping);
    setIsModalOpen(true);
  };

  const confirmDelete = (mapping: PackageFeatureRelation) => {
    setMappingToDelete(mapping);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!mappingToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deletePackageFeature(mappingToDelete.id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        fetchMappings(selectedPackageId);
      } else {
        setDeleteError(res.message || "Failed to remove feature from package");
      }
    } catch (err) {
      setDeleteError(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const getFeature = (id: number) => featuresList.find(f => f.id === id);

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. Header & Package Filter Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full bg-white p-5 border border-[#E7E8EB] rounded-[12px] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#E0E2F4] text-[#2E37A4] flex items-center justify-center shrink-0">
            <LinkIcon size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0A1B39] leading-tight">{t.packages?.mapping_title || "Package Features Mapping"}</h2>
            <span className="text-[12px] font-medium text-[#6C7688]">
              {selectedPackageId ? `Mapped features: ${mappings.length}` : "Select a package to view features"}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {error && (
            <div className="text-[12px] text-[#EF1E1E] mr-2">
              {error}
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E7E8EB] rounded-[8px] p-1 w-full sm:w-auto min-w-[200px]">
            <div className="pl-3 rtl:pr-3 rtl:pl-0 text-[#9DA4B0]"><Package size={16} /></div>
            <select 
              value={selectedPackageId} 
              onChange={(e) => setSelectedPackageId(e.target.value)}
              disabled={isLoadingPackages}
              className="h-8 bg-transparent w-full text-[13px] text-[#0A1B39] font-medium focus:outline-none pr-8 cursor-pointer disabled:opacity-50"
            >
              <option value="" disabled>{t.packages?.select_package || "Select Package"}</option>
              {packagesList.map(pkg => (
                <option key={pkg.id} value={pkg.id.toString()}>{pkg.name_en || pkg.name_ar}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleAddNew}
            disabled={!selectedPackageId || isLoadingPackages}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-[#2E37A4] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#252D88] transition-colors shadow-sm shrink-0 h-10 disabled:opacity-50"
          >
            <PlusIcon size={16} /> {t.packages?.assign_feature || "Assign Feature"}
          </button>
        </div>
      </div>

      {/* 2. Data Table */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          {!selectedPackageId ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-[#6C7688]">
              <Package className="mb-4 text-[#9DA4B0]" size={48} />
              <p>{t.packages?.please_select_package || "Please select a package from the dropdown above to view or manage its features."}</p>
            </div>
          ) : isLoadingMappings ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-[#6C7688]">
              <RefreshCw className="animate-spin mb-2" size={24} />
              <p>{t.common?.loading || "Loading..."}</p>
            </div>
          ) : mappingsError ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-[#EF1E1E]">
              <AlertTriangle className="mb-2" size={24} />
              <p className="mb-4">{mappingsError}</p>
              <button 
                onClick={() => fetchMappings(selectedPackageId)}
                className="px-4 py-2 bg-[#F9FAFB] border border-[#E7E8EB] text-[#0A1B39] rounded-[8px] text-[13px] font-semibold hover:bg-[#F3F4F6] transition-colors"
              >
                {t.common?.retry || "Retry"}
              </button>
            </div>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#FAFBFC]">
                <tr className="border-b border-[#E7E8EB]">
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[40%]">{t.packages?.feature_name_en || "Feature Name"}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[30%]">{t.packages?.feature_value || "Value"}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.packages?.is_included || "Included"}</th>
                  <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[10%]"></th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((mapping) => {
                  const featureInfo = mapping.feature || getFeature(mapping.feature_id);
                  return (
                    <tr key={mapping.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                      
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[14px] font-bold text-[#0A1B39]">{featureInfo?.name_en || featureInfo?.name_ar || `Feature #${mapping.feature_id}`}</span>
                          {featureInfo?.name_en && featureInfo?.name_ar && <span className="text-[12px] font-medium text-[#6C7688]">{featureInfo.name_ar}</span>}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-[14px] font-bold text-[#0A1B39] bg-[#F5F6F8] px-3 py-1.5 rounded-[6px] border border-[#E7E8EB] inline-flex items-center gap-2">
                          {mapping.feature_value || "—"} 
                          {featureInfo?.unit_en && <span className="text-[11px] text-[#6C7688]">{featureInfo.unit_en}</span>}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span 
                          className={cn("flex w-fit items-center gap-1.5 px-3 py-1 rounded-[6px] text-[12px] font-bold border",
                            mapping.is_included ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20" : "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20"
                          )}
                        >
                          {mapping.is_included ? <CheckCircle size={14} /> : <XCircle size={14} />}
                          {mapping.is_included ? (t.packages?.included || "Included") : (t.packages?.not_included || "Not Included")}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-end">
                        <CustomDropdown 
                          trigger={
                            <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                              <MoreVerticalIcon size={16} />
                            </button>
                          }
                          items={[
                            { label: t.packages?.edit_mapping || "Edit", onClick: () => handleEdit(mapping) },
                            { label: t.common?.remove || "Remove", onClick: () => confirmDelete(mapping), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" }
                          ]}
                          width="w-32"
                          align="end"
                        />
                      </td>

                    </tr>
                  );
                })}
                
                {mappings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[14px] text-[#6C7688]">
                      {t.packages?.no_package_features_found || "No features mapped for this package yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 3. Modal */}
      {isModalOpen && (
        <PackageFeatureModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchMappings(selectedPackageId);
          }}
          t={t} 
          editData={editingData} 
          selectedPackageId={selectedPackageId}
          featuresList={featuresList}
        />
      )}

      {/* 4. Delete Confirmation Modal */}
      {isDeleteModalOpen && mappingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[400px] p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#EF1E1E] mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-[18px] font-bold text-[#0A1B39] mb-2">{t.packages?.remove_feature || "Remove Feature"}</h3>
            <p className="text-[14px] text-[#6C7688] mb-6 leading-relaxed">
              {t.packages?.remove_feature_confirm || "Are you sure you want to remove this feature from the package?"}
              <br/><br/>
              <strong>{getFeature(mappingToDelete.feature_id)?.name_en || getFeature(mappingToDelete.feature_id)?.name_ar || `Feature ID: ${mappingToDelete.feature_id}`}</strong>
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#EF1E1E]/20 text-[#EF1E1E] text-[13px] rounded-[8px]">
                {deleteError}
              </div>
            )}

            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-white border border-[#E7E8EB] text-[#0A1B39] font-bold rounded-[8px] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
              >
                {t.common?.cancel || "Cancel"}
              </button>
              <button 
                onClick={executeDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-[#EF1E1E] text-white font-bold rounded-[8px] hover:bg-[#DC1414] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? <RefreshCw className="animate-spin" size={16} /> : null}
                {t.common?.remove || "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

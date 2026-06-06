"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropUtils";
import { LinkIcon, UploadCloudIcon, CropIcon, TrashIcon, CheckCircleSolidIcon, XCircleSolidIcon } from "@/components/ui/icons/dashboard-icons";
import { AdminLocationsService } from "@/lib/admin-locations";
import { getApiErrorMessage } from "@/lib/error-utils";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
  lang?: string;
  levelType: "country" | "city" | "region" | "district";
  editData?: any | null;
  parentOptions?: { id: number | string; name: string }[];
  onSuccess?: () => void;
}

export const AddressModal = ({ isOpen, onClose, t, lang = "en", levelType, editData, parentOptions = [], onSuccess }: AddressModalProps) => {
  const [formData, setFormData] = useState({ name_ar: "", name_en: "", parent_id: "" });
  const [imageMode, setImageMode] = useState<"url" | "upload">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [originalImageForCrop, setOriginalImageForCrop] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        name_ar: editData.name_ar || "",
        name_en: editData.name_en || "",
        parent_id: editData.parent_id?.toString() || ""
      });
      setImageMode("upload");
      setPreviewImage(editData.image || null);
      setOriginalImageForCrop(editData.image || null);
    } else {
      setFormData({ name_ar: "", name_en: "", parent_id: "" });
      setUploadedFile(null);
      setPreviewImage(null);
      setOriginalImageForCrop(null);
      setIsCropping(false);
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!editData;
  const title = isEditing ? (t.address?.edit || "Edit") : (t.address?.add_new || "Add New");

  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setOriginalImageForCrop(result); 
      };
      reader.readAsDataURL(file);
    } else {
      alert(t.address?.invalid_image || "Please upload a valid image file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setUploadedFile(null);
    setPreviewImage(null);
    setOriginalImageForCrop(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleApplyCrop = async () => {
    try {
      if (originalImageForCrop && croppedAreaPixels) {
        const croppedImageBase64 = await getCroppedImg(originalImageForCrop, croppedAreaPixels);
        setPreviewImage(croppedImageBase64); 
        // We also need to update uploadedFile to this cropped image
        const file = dataURLtoFile(croppedImageBase64, "cropped_image.jpeg");
        setUploadedFile(file);
        setIsCropping(false);
      }
    } catch (e) {
      console.error("Error cropping image", e);
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
    const mime = match ? match[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const payload: any = {
        name_en: formData.name_en,
        name_ar: formData.name_ar,
        level_type: levelType,
      };

      if (levelType !== 'country' && formData.parent_id) {
        payload.parent_id = parseInt(formData.parent_id);
      }

      if (uploadedFile) {
        payload.image = uploadedFile;
      }

      let res;
      if (isEditing) {
        res = await AdminLocationsService.updateLocation(editData.id, payload);
      } else {
        res = await AdminLocationsService.createLocation(payload);
      }

      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert(res.message || t.address?.action_failed);
      }
    } catch (err) {
      alert(getApiErrorMessage(err, lang as "en" | "ar"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={!loading ? onClose : undefined} />
      
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-hidden z-10 relative flex flex-col animate-in zoom-in-95 duration-200">
        
        {isCropping && originalImageForCrop && (
          <div className="flex flex-col w-full h-[65vh] min-h-[450px] bg-[#0A1B39] z-50 animate-in fade-in duration-300">
            <div className="relative flex-1 w-full bg-black/50">
              <Cropper
                image={originalImageForCrop}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3} 
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="p-5 bg-white flex flex-col gap-4 border-t border-[#E7E8EB]">
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-bold text-[#0A1B39] shrink-0">{t.address?.zoom || "Zoom"}</span>
                <input 
                  type="range" 
                  value={zoom} 
                  min={1} 
                  max={3} 
                  step={0.1} 
                  aria-labelledby="Zoom" 
                  onChange={(e) => setZoom(Number(e.target.value))} 
                  className="w-full accent-[#2E37A4]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsCropping(false)}
                  className="px-5 py-2.5 bg-[#F5F6F8] text-[#6C7688] text-[13px] font-bold rounded-[8px] hover:bg-[#E7E8EB] transition-colors"
                >
                  {t.address?.cancel_crop || "Cancel"}
                </button>
                <button 
                  type="button" 
                  onClick={handleApplyCrop}
                  className="px-5 py-2.5 bg-[#2E37A4] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm"
                >
                  {t.address?.apply_crop || "Apply Crop"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={cn("flex flex-col h-full overflow-y-auto custom-scrollbar", isCropping ? "hidden" : "flex")}>
          <div className="px-6 py-4 border-b border-[#E7E8EB] bg-[#FAFBFC] sticky top-0 z-20 flex justify-between items-center">
            <h3 className="text-[18px] font-bold text-[#0A1B39]">{title}</h3>
            <button onClick={!loading ? onClose : undefined} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E7E8EB] text-[#6C7688] hover:text-[#EF1E1E] hover:border-[#EF1E1E] transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#0A1B39]">{t.address?.name_en || "English Name"} <span className="text-[#EF1E1E]">*</span></label>
                <input type="text" required value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" placeholder="e.g. Cairo" disabled={loading} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#0A1B39]">{t.address?.name_ar || "Arabic Name"} <span className="text-[#EF1E1E]">*</span></label>
                <input type="text" required value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" placeholder="مثال: القاهرة" dir="rtl" disabled={loading} />
              </div>
            </div>

            {levelType !== "country" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#0A1B39]">{t.address?.parent || "Parent"} <span className="text-[#EF1E1E]">*</span></label>
                <select required value={formData.parent_id} onChange={e => setFormData({...formData, parent_id: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" disabled={loading}>
                  <option value="" disabled>{t.clinic?.select_option || "Select Option"}</option>
                  {parentOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="w-full border-t border-dashed border-[#E7E8EB]"></div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <label className="text-[14px] font-bold text-[#0A1B39]">{t.address?.image_source || "Image"}</label>
              </div>

              <div className="w-full animate-in fade-in duration-300">
                <div className="flex flex-col gap-3">
                  {!previewImage ? (
                    <div 
                      onDragOver={!loading ? (e) => { e.preventDefault(); setIsDragging(true); } : undefined}
                      onDragLeave={!loading ? (e) => { e.preventDefault(); setIsDragging(false); } : undefined}
                      onDrop={!loading ? handleDrop : undefined}
                      onClick={!loading ? () => fileInputRef.current?.click() : undefined}
                      className={cn(
                        "w-full h-[140px] border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center gap-2 transition-all bg-[#FAFBFC]",
                        !loading ? "cursor-pointer" : "opacity-50 cursor-not-allowed",
                        isDragging ? "border-[#2E37A4] bg-[#F8F9FF]" : "border-[#D1D5DB] hover:border-[#2E37A4] hover:bg-[#F8F9FF]"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2E37A4] mb-1"><UploadCloudIcon /></div>
                      <p className="text-[13px] font-semibold text-[#0A1B39]">{t.address?.drag_drop || "Click or Drag to Upload"}</p>
                      <p className="text-[11px] text-[#9DA4B0]">{t.address?.supported_files || "JPG, PNG, WEBP"}</p>
                      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/jpeg, image/png, image/webp" className="hidden" disabled={loading} />
                    </div>
                  ) : (
                    <div className="w-full rounded-[12px] border border-[#E7E8EB] overflow-hidden bg-white">
                      <div className="w-full h-[200px] bg-[#F5F6F8] relative flex items-center justify-center group overflow-hidden">
                        <img src={previewImage} alt="Preview" className="max-w-full max-h-full object-contain" />
                        
                        {!loading && uploadedFile && (
                          <div className="absolute inset-0 bg-[#0A1B39]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button 
                               type="button"
                               onClick={() => setIsCropping(true)}
                               className="px-4 py-2 bg-white text-[#0A1B39] text-[12px] font-bold rounded-[8px] flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                             >
                               <CropIcon /> {t.address?.crop_image || "Crop Image"}
                             </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-[#FAFBFC] border-t border-[#E7E8EB]">
                        <span className="text-[12px] text-[#6C7688] font-medium truncate max-w-[200px]" dir="ltr">
                          {uploadedFile?.name || "current_image.jpg"}
                        </span>
                        {!loading && (
                          <button 
                            type="button" 
                            onClick={handleRemoveImage}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF2F2] border border-[#EF1E1E]/20 text-[#EF1E1E] text-[12px] font-semibold rounded-[6px] hover:bg-[#EF1E1E] hover:text-white transition-colors shadow-sm"
                          >
                            <TrashIcon /> {t.address?.remove_image || "Remove"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2 pt-5 border-t border-[#E7E8EB]">
              <button type="button" onClick={onClose} disabled={loading} className="px-6 py-2.5 bg-[#F5F6F8] text-[#6C7688] text-[13px] font-medium rounded-[8px] hover:bg-[#E7E8EB] transition-colors disabled:opacity-50">
                {t.clinic?.close || "Close"}
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {isEditing ? (t.clinic?.save_changes || "Save Changes") : (t.address?.add_new || "Create Location")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
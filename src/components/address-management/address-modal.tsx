"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropUtils";
import { LinkIcon, UploadCloudIcon, CropIcon, TrashIcon, CheckCircleSolidIcon, XCircleSolidIcon } from "@/components/ui/icons/dashboard-icons";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
  levelType: "country" | "city" | "region" | "district";
  editData?: any | null;
  parentOptions?: { id: number | string; name: string }[];
}

export const AddressModal = ({ isOpen, onClose, t, levelType, editData, parentOptions = [] }: AddressModalProps) => {
  // --- 1. Hooks ---
  const [formData, setFormData] = useState({ name_ar: "", name_en: "", parent_id: "" });
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [urlInput, setUrlInput] = useState("");
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
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
        parent_id: editData.parent_id || ""
      });
      if (editData.image && editData.image.startsWith("http")) {
        setImageMode("url");
        setUrlInput(editData.image);
        setIsUrlValid(true);
      } else {
        setImageMode("upload");
        setPreviewImage(editData.image || null);
        setOriginalImageForCrop(editData.image || null);
      }
    } else {
      setFormData({ name_ar: "", name_en: "", parent_id: "" });
      setUrlInput("");
      setIsUrlValid(null);
      setUploadedFile(null);
      setPreviewImage(null);
      setOriginalImageForCrop(null);
      setIsCropping(false); // إعادة ضبط حالة القص عند فتح إغلاق المودال
    }
  }, [editData, isOpen]);

  // --- 2. Early Return ---
  if (!isOpen) return null;

  const isEditing = !!editData;
  const title = isEditing ? t.address.edit : t.address.add_new;

  // --- 3. Functions ---
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrlInput(val);
    if (val === "") { setIsUrlValid(null); return; }
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    setIsUrlValid(urlPattern.test(val));
  };

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
      alert("Please upload a valid image file.");
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
        setIsCropping(false);
      }
    } catch (e) {
      console.error("Error cropping image", e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      level_type: levelType,
      image: imageMode === "url" ? urlInput : previewImage 
    };
    console.log("Submitting Data:", finalData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-hidden z-10 relative flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* ------------------------------------------------------------- */}
        {/* 1. Cropper View (الحل هنا: إعطاء ارتفاع ثابت بدلاً من absolute) */}
        {/* ------------------------------------------------------------- */}
        {isCropping && originalImageForCrop && (
          <div className="flex flex-col w-full h-[65vh] min-h-[450px] bg-[#0A1B39] z-50 animate-in fade-in duration-300">
            {/* Cropper Area */}
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
            {/* Cropper Controls */}
            <div className="p-5 bg-white flex flex-col gap-4 border-t border-[#E7E8EB]">
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-bold text-[#0A1B39] shrink-0">{t.address.zoom}</span>
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
                  {t.address.cancel_crop || "Cancel"}
                </button>
                <button 
                  type="button" 
                  onClick={handleApplyCrop}
                  className="px-5 py-2.5 bg-[#2E37A4] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm"
                >
                  {t.address.apply_crop || "Apply Crop"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 2. Main Form View */}
        {/* ------------------------------------------------------------- */}
        <div className={cn("flex flex-col h-full overflow-y-auto custom-scrollbar", isCropping ? "hidden" : "flex")}>
          <div className="px-6 py-4 border-b border-[#E7E8EB] bg-[#FAFBFC] sticky top-0 z-20 flex justify-between items-center">
            <h3 className="text-[18px] font-bold text-[#0A1B39]">{title}</h3>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E7E8EB] text-[#6C7688] hover:text-[#EF1E1E] hover:border-[#EF1E1E] transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#0A1B39]">{t.address.name_en} <span className="text-[#EF1E1E]">*</span></label>
                <input type="text" required value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" placeholder="e.g. Cairo" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#0A1B39]">{t.address.name_ar} <span className="text-[#EF1E1E]">*</span></label>
                <input type="text" required value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" placeholder="مثال: القاهرة" dir="rtl" />
              </div>
            </div>

            {levelType !== "country" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#0A1B39]">{t.address.parent} <span className="text-[#EF1E1E]">*</span></label>
                <select required value={formData.parent_id} onChange={e => setFormData({...formData, parent_id: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors">
                  <option value="" disabled>{t.clinic.select_option || "Select Option"}</option>
                  {parentOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="w-full border-t border-dashed border-[#E7E8EB]"></div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <label className="text-[14px] font-bold text-[#0A1B39]">{t.address.image_source}</label>
                
                <div className="flex items-center bg-[#F5F6F8] p-1 rounded-[8px] border border-[#E7E8EB]">
                  <button 
                    type="button" 
                    onClick={() => setImageMode("url")}
                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-semibold transition-all", imageMode === "url" ? "bg-white text-[#2E37A4] shadow-sm" : "text-[#6C7688] hover:text-[#0A1B39]")}
                  >
                    <LinkIcon /> {t.address.url}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setImageMode("upload")}
                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-semibold transition-all", imageMode === "upload" ? "bg-white text-[#2E37A4] shadow-sm" : "text-[#6C7688] hover:text-[#0A1B39]")}
                  >
                    <UploadCloudIcon /> {t.address.upload_file}
                  </button>
                </div>
              </div>

              <div className="w-full animate-in fade-in duration-300">
                {imageMode === "url" && (
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <input 
                        type="url" 
                        value={urlInput} 
                        onChange={handleUrlChange} 
                        className={cn(
                          "w-full h-10 pl-10 pr-10 rtl:pr-10 rtl:pl-10 bg-white border rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none transition-colors",
                          isUrlValid === false ? "border-[#EF1E1E] focus:border-[#EF1E1E]" : "border-[#E7E8EB] focus:border-[#2E37A4]"
                        )} 
                        placeholder={t.address.enter_url_placeholder}
                        dir="ltr"
                      />
                      <span className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-[#9DA4B0]"><LinkIcon /></span>
                      {isUrlValid === true && <span className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2"><CheckCircleSolidIcon /></span>}
                      {isUrlValid === false && <span className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2"><XCircleSolidIcon /></span>}
                    </div>
                    {isUrlValid === false && <span className="text-[11px] text-[#EF1E1E] font-medium mt-1">{t.address.invalid_url}</span>}
                    
                    {isUrlValid && urlInput && (
                      <div className="mt-2 w-24 h-16 rounded-[8px] border border-[#E7E8EB] overflow-hidden bg-[#F5F6F8]">
                        <img src={urlInput} alt="Preview" className="w-full h-full object-cover" onError={() => setIsUrlValid(false)} />
                      </div>
                    )}
                  </div>
                )}

                {imageMode === "upload" && (
                  <div className="flex flex-col gap-3">
                    {!previewImage ? (
                      <div 
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "w-full h-[140px] border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-[#FAFBFC]",
                          isDragging ? "border-[#2E37A4] bg-[#F8F9FF]" : "border-[#D1D5DB] hover:border-[#2E37A4] hover:bg-[#F8F9FF]"
                        )}
                      >
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2E37A4] mb-1"><UploadCloudIcon /></div>
                        <p className="text-[13px] font-semibold text-[#0A1B39]">{t.address.drag_drop}</p>
                        <p className="text-[11px] text-[#9DA4B0]">{t.address.supported_files}</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/jpeg, image/png, image/webp" className="hidden" />
                      </div>
                    ) : (
                      <div className="w-full rounded-[12px] border border-[#E7E8EB] overflow-hidden bg-white">
                        <div className="w-full h-[200px] bg-[#F5F6F8] relative flex items-center justify-center group overflow-hidden">
                          <img src={previewImage} alt="Preview" className="max-w-full max-h-full object-contain" />
                          
                          <div className="absolute inset-0 bg-[#0A1B39]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button 
                               type="button"
                               onClick={() => setIsCropping(true)}
                               className="px-4 py-2 bg-white text-[#0A1B39] text-[12px] font-bold rounded-[8px] flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                             >
                               <CropIcon /> {t.address.crop_image}
                             </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-[#FAFBFC] border-t border-[#E7E8EB]">
                          <span className="text-[12px] text-[#6C7688] font-medium truncate max-w-[200px]" dir="ltr">
                            {uploadedFile?.name || "image_cropped.jpg"}
                          </span>
                          <button 
                            type="button" 
                            onClick={handleRemoveImage}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF2F2] border border-[#EF1E1E]/20 text-[#EF1E1E] text-[12px] font-semibold rounded-[6px] hover:bg-[#EF1E1E] hover:text-white transition-colors shadow-sm"
                          >
                            <TrashIcon /> {t.address.remove_image}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2 pt-5 border-t border-[#E7E8EB]">
              <button type="button" onClick={onClose} className="px-6 py-2.5 bg-[#F5F6F8] text-[#6C7688] text-[13px] font-medium rounded-[8px] hover:bg-[#E7E8EB] transition-colors">
                {t.clinic.close || "Close"}
              </button>
              <button type="submit" className="px-6 py-2.5 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm">
                {isEditing ? "Save Changes" : "Create Location"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
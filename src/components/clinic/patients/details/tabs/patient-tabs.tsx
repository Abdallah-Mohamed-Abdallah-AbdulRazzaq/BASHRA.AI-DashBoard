"use client";

import React from "react";

interface PlaceholderTabProps {
  t: any;
  patient?: any;
}

const PlaceholderTab = ({ t }: PlaceholderTabProps) => (
  <div className="flex items-center justify-center min-h-[300px] bg-white border border-[#E7E8EB] rounded-[12px]">
    <div className="flex flex-col items-center gap-3 text-center px-6">
      <p className="text-[14px] font-medium text-[#6C7688]">
        {t.clinic.will_connect_later || "This section will be connected in the next development phase"}
      </p>
    </div>
  </div>
);

export const PatientGeneralTab = ({ t }: PlaceholderTabProps) => <PlaceholderTab t={t} />;
export const PatientMedicalTab = ({ t }: PlaceholderTabProps) => <PlaceholderTab t={t} />;
export const PatientPrescriptionsTab = ({ t }: PlaceholderTabProps) => <PlaceholderTab t={t} />;

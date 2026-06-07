"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons/dashboard-icons";
import { getAdminAppointments, getAppointmentStatistics } from "@/lib/admin-appointments";
import { getDoctors, getPendingDoctors } from "@/lib/admin-doctors";
import type { AppointmentListItem, AppointmentStatisticsData } from "@/types/admin-appointments";
import type { DoctorListItem } from "@/types/admin-doctors";

interface DashboardWidgetsProps {
  t: any;
}

// ----------------------------------------------------------------------
// Shared Loading & Error
// ----------------------------------------------------------------------
const WidgetLoading = () => (
  <div className="flex items-center justify-center w-full h-[200px] text-[#9DA4B0] text-[14px]">
    Loading...
  </div>
);

const WidgetError = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center w-full h-[200px] text-[#EF1E1E] text-[14px]">
    {message}
  </div>
);

const WidgetEmpty = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center w-full h-[150px] text-[#6C7688] text-[14px] bg-[#F9FAFB] rounded-lg border border-dashed border-[#E7E8EB]">
    {message}
  </div>
);

// ----------------------------------------------------------------------
// 1. Appointment Statistics
// ----------------------------------------------------------------------
export const AppointmentStatistics = ({ t }: DashboardWidgetsProps) => {
  const [stats, setStats] = useState<AppointmentStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAppointmentStatistics()
      .then(res => {
        if (res.success && res.data) {
          setStats(res.data);
        } else {
          setError("Failed to load statistics");
        }
      })
      .catch(err => setError(err.message || "Error loading statistics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-5 bg-white border border-[#E7E8EB] rounded-[10px] w-full"><WidgetLoading /></div>;
  if (error) return <div className="p-5 bg-white border border-[#E7E8EB] rounded-[10px] w-full"><WidgetError message={error} /></div>;
  if (!stats) return null;

  const total = stats.total || 0;
  const metrics = [
    { label: t.dashboard?.completed || "Completed", value: stats.completed || 0, color: "bg-[#27AE60]" },
    { label: t.dashboard?.pending || "Pending", value: stats.pending || 0, color: "bg-[#F2994A]" },
    { label: t.dashboard?.confirmed || "Confirmed", value: stats.confirmed || 0, color: "bg-[#2E37A4]" },
    { label: t.dashboard?.cancelled || "Cancelled", value: stats.cancelled || 0, color: "bg-[#EF1E1E]" },
  ];

  return (
    <div className="flex flex-col p-5 bg-white border border-[#E7E8EB] rounded-[10px] shadow-sm w-full gap-6">
      <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.dashboard?.appt_statistics || "Appointment Statistics"}</h3>
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end border-b border-[#E7E8EB] pb-3">
          <div className="flex flex-col">
            <span className="text-[12px] text-[#6C7688]">{t.dashboard?.all_appointments || "Total Appointments"}</span>
            <span className="text-[24px] font-bold text-[#0A1B39]">{total}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[12px] text-[#6C7688]">{t.dashboard?.revenue || "Total Revenue"}</span>
            <span className="text-[18px] font-bold text-[#27AE60]">${stats.total_revenue || 0}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {metrics.map((m, i) => {
            const percent = total > 0 ? Math.round((m.value / total) * 100) : 0;
            return (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#0A1B39] font-medium">{m.label}</span>
                  <span className="text-[#6C7688]">{m.value} ({percent}%)</span>
                </div>
                <div className="w-full bg-[#F5F6F8] rounded-full h-2 overflow-hidden">
                  <div className={cn("h-full rounded-full", m.color)} style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. Doctors Overview (replaces PopularDoctors)
// ----------------------------------------------------------------------
export const PopularDoctors = ({ t }: DashboardWidgetsProps) => {
  const [doctors, setDoctors] = useState<DoctorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDoctors({ limit: 5 })
      .then(res => {
        if (res.success && res.data) {
          setDoctors(res.data);
        } else {
          setError("Failed to load doctors");
        }
      })
      .catch(err => setError(err.message || "Error loading doctors"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-5 bg-white border border-[#E7E8EB] rounded-[10px] w-full"><WidgetLoading /></div>;
  if (error) return <div className="p-5 bg-white border border-[#E7E8EB] rounded-[10px] w-full"><WidgetError message={error} /></div>;

  return (
    <div className="flex flex-col p-5 bg-white border border-[#E7E8EB] rounded-[10px] shadow-sm w-full gap-5 h-full">
      <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.dashboard?.doctors || "Doctors Overview"}</h3>
      
      {doctors.length === 0 ? (
        <WidgetEmpty message={t.dashboard?.no_data || "No doctors found"} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="flex items-center p-3 bg-white border border-[#E7E8EB] rounded-[10px] hover:shadow-md transition-all">
              <div className="relative mr-3 rtl:ml-3 rtl:mr-0">
                {doc.profile_picture_url ? (
                  <Image src={doc.profile_picture_url} alt={doc.full_name || "Doctor"} width={40} height={40} className="w-10 h-10 rounded-full object-cover border border-[#E7E8EB]" unoptimized />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#F5F6F8] flex items-center justify-center text-[#6C7688] text-[14px] font-bold border border-[#E7E8EB]">
                    {doc.full_name?.charAt(0) || "D"}
                  </div>
                )}
                <span className={cn(
                  "absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full",
                  doc.status === 'active' ? "bg-[#27AE60]" : "bg-[#9DA4B0]"
                )} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[13px] font-bold text-[#0A1B39] truncate">{doc.full_name || "Unknown"}</span>
                <span className="text-[11px] text-[#6C7688] truncate">{doc.specialty || "General"}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-[4px] font-medium",
                    doc.is_verified ? "bg-[#27AE60]/10 text-[#27AE60]" : "bg-[#F2994A]/10 text-[#F2994A]"
                  )}>
                    {doc.is_verified ? (t.dashboard?.verified || "Verified") : (t.dashboard?.unverified || "Unverified")}
                  </span>
                  {doc.rating_average && (
                    <span className="text-[10px] font-medium text-[#0A1B39]">⭐ {doc.rating_average}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// 3. Pending Doctors Widget
// ----------------------------------------------------------------------
export const PendingDoctorsWidget = ({ t }: DashboardWidgetsProps) => {
  const [doctors, setDoctors] = useState<DoctorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPendingDoctors({ limit: 5 })
      .then(res => {
        if (res.success && res.data) {
          setDoctors(res.data);
        } else {
          setError("Failed to load pending doctors");
        }
      })
      .catch(err => setError(err.message || "Error loading doctors"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 bg-white border border-[#E7E8EB] rounded-[12px] w-full"><WidgetLoading /></div>;
  if (error) return <div className="p-6 bg-white border border-[#E7E8EB] rounded-[12px] w-full"><WidgetError message={error} /></div>;

  return (
    <div className="flex flex-col p-6 bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm w-full h-full gap-6">
      <h3 className="text-[18px] font-bold text-[#0A1B39]">{t.dashboard?.pending_doctors || "Pending Approval"}</h3>
      
      {doctors.length === 0 ? (
        <WidgetEmpty message={t.dashboard?.no_pending_doctors || "No pending doctors"} />
      ) : (
        <div className="flex flex-col gap-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border border-[#E7E8EB] rounded-lg">
              <div className="flex items-center gap-3">
                 {doc.profile_picture_url ? (
                  <Image src={doc.profile_picture_url} alt={doc.full_name || "Doctor"} width={40} height={40} className="w-10 h-10 rounded-full object-cover border border-[#E7E8EB]" unoptimized />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#F5F6F8] flex items-center justify-center text-[#6C7688] text-[14px] font-bold border border-[#E7E8EB]">
                    {doc.full_name?.charAt(0) || "D"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-[#0A1B39]">{doc.full_name}</span>
                  <span className="text-[12px] text-[#6C7688]">{doc.email}</span>
                </div>
              </div>
              <span className="text-[12px] px-2 py-1 bg-[#F2994A]/10 text-[#F2994A] rounded-[4px] font-medium">
                {t.dashboard?.pending || "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// ----------------------------------------------------------------------
// 4. Appointments Widget (Calendar)
// ----------------------------------------------------------------------
export const AppointmentsWidget = ({ t }: DashboardWidgetsProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const fetchAppointments = () => {
    setLoading(true);
    // Fetch for the entire current month
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const lastDay = new Date(year, month, 0).getDate();
    
    const from_date = `${year}-${String(month).padStart(2, '0')}-01`;
    const to_date = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    getAdminAppointments({ from_date, to_date, limit: 100 })
      .then(res => {
        if (res.success && res.data) {
          setAppointments(res.data);
        }
      })
      .catch(console.error) // Silently fail in widget but keep old data
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const emptySlots = Array(firstDayIndex).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return [...emptySlots, ...days];
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Filter appointments for the selected day
  const selectedDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  
  const dayAppointments = appointments.filter(app => {
    if (!app.scheduled_date) return false;
    // API returns YYYY-MM-DD or ISO string
    return app.scheduled_date.startsWith(selectedDateStr);
  });

  return (
    <div className="flex flex-col p-6 bg-white border border-[#E7E8EB] rounded-[10px] shadow-sm w-full h-full gap-6">
      <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.dashboard?.appointments || "Appointments"}</h3>

      {/* Calendar */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-2">
           <button onClick={handlePrevMonth} className="text-[#9DA4B0] hover:text-[#0A1B39]"><ChevronLeftIcon /></button>
           <span className="text-[14px] font-bold text-[#0A1B39]">
             {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
           </span>
           <button onClick={handleNextMonth} className="text-[#9DA4B0] hover:text-[#0A1B39]"><ChevronRightIcon /></button>
        </div>
        
        <div className="flex flex-col gap-2 relative">
            {loading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                <div className="w-5 h-5 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <div className="grid grid-cols-7 text-center">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                  <span key={d} className="text-[12px] text-[#9DA4B0] font-medium py-1">{d}</span>
              ))}
            </div>
            
            <div className="grid grid-cols-7 text-center gap-y-2">
            {getCalendarDays().map((day, index) => {
                if (day === null) return <div key={`empty-${index}`} />;
                const isSelected = day === selectedDay;
                // Highlight days that have appointments
                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasAppointments = appointments.some(a => a.scheduled_date?.startsWith(dateStr));

                return (
                    <button 
                        key={day} 
                        onClick={() => setSelectedDay(day as number)}
                        className={cn(
                        "relative h-8 w-8 mx-auto flex items-center justify-center rounded-[6px] text-[13px] transition-all font-medium",
                        isSelected ? "bg-[#2E37A4] text-white shadow-md" : "text-[#0A1B39] hover:bg-[#F5F6F8]"
                        )}
                    >
                        {day}
                        {hasAppointments && !isSelected && (
                          <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-[#EF1E1E]" />
                        )}
                    </button>
                );
            })}
            </div>
        </div>
      </div>

      {/* Appointments List for Day */}
      <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-dashed border-[#E7E8EB] min-h-[150px]">
        {loading ? (
          <div className="flex-1 flex justify-center items-center text-[13px] text-[#9DA4B0]">Loading appointments...</div>
        ) : dayAppointments.length === 0 ? (
          <div className="flex-1 flex justify-center items-center text-[13px] text-[#9DA4B0] bg-[#F9FAFB] rounded-lg border border-dashed border-[#E7E8EB]">
             {t.dashboard?.no_appointments || "No appointments for this day."}
          </div>
        ) : (
          dayAppointments.map(app => (
            <div key={app.id} className="flex justify-between items-center p-3 bg-[#F9FAFB] rounded-[8px] border border-[#F3F4F6]">
              <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-bold text-[#0A1B39]">{app.patient?.full_name || "Unknown Patient"}</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6C7688]">
                    <span>📅</span> {app.scheduled_start_time || "N/A"} - {app.status}
                  </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[11px] text-[#2E37A4] font-medium">{app.appointment_type}</span>
                <span className="text-[10px] text-[#6C7688]">Dr. {app.doctor?.full_name}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 5. All Appointments Table
// ----------------------------------------------------------------------
const StatusBadge = ({ status }: { status: string }) => {
  let styles = "";
  switch (status?.toLowerCase()) {
    case "confirmed": styles = "text-[#27AE60] border-[#27AE60] bg-[#27AE60]/10"; break;
    case "cancelled": styles = "text-[#EF1E1E] border-[#EF1E1E] bg-[#EF1E1E]/10"; break;
    case "completed": styles = "text-[#00D3C7] border-[#00D3C7] bg-[#00D3C7]/10"; break;
    case "pending": styles = "text-[#F2994A] border-[#F2994A] bg-[#F2994A]/10"; break;
    case "in_progress": styles = "text-[#2F80ED] border-[#2F80ED] bg-[#2F80ED]/10"; break;
    default: styles = "text-[#6C7688] border-[#E7E8EB] bg-gray-50";
  }
  return (
    <span className={cn("px-2.5 py-1 rounded-[4px] border text-[11px] font-medium uppercase tracking-wide", styles)}>
      {status || "UNKNOWN"}
    </span>
  );
};

export const AllAppointmentsTable = ({ t }: DashboardWidgetsProps) => {
  const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminAppointments({ limit: 5 })
      .then(res => {
        if (res.success && res.data) {
          setAppointments(res.data);
        } else {
          setError("Failed to load appointments");
        }
      })
      .catch(err => setError(err.message || "Error loading appointments"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 bg-white border border-[#E7E8EB] rounded-[12px] w-full"><WidgetLoading /></div>;
  if (error) return <div className="p-6 bg-white border border-[#E7E8EB] rounded-[12px] w-full"><WidgetError message={error} /></div>;

  return (
    <div className="flex flex-col p-6 bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm w-full gap-6">
      <div className="flex justify-between items-center w-full">
        <h3 className="text-[18px] font-bold text-[#0A1B39]">{t.dashboard?.recent_appointments || "Recent Appointments"}</h3>
      </div>

      {appointments.length === 0 ? (
        <WidgetEmpty message={t.dashboard?.no_appointments || "No recent appointments"} />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-[#E7E8EB]">
                <th className="text-start py-4 px-4 text-[13px] font-semibold text-[#6C7688] w-[25%]">{t.dashboard?.doctor || "Doctor"}</th>
                <th className="text-start py-4 px-4 text-[13px] font-semibold text-[#6C7688] w-[25%]">{t.dashboard?.patient || "Patient"}</th>
                <th className="text-start py-4 px-4 text-[13px] font-semibold text-[#6C7688] w-[20%]">{t.dashboard?.date_time || "Date & Time"}</th>
                <th className="text-start py-4 px-4 text-[13px] font-semibold text-[#6C7688] w-[15%]">{t.dashboard?.type || "Type"}</th>
                <th className="text-start py-4 px-4 text-[13px] font-semibold text-[#6C7688] w-[15%]">{t.dashboard?.status || "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {item.doctor?.profile_picture_url ? (
                        <Image src={item.doctor.profile_picture_url} alt="doc" width={36} height={36} className="w-9 h-9 rounded-full object-cover border border-[#E7E8EB]" unoptimized />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#F5F6F8] flex items-center justify-center text-[12px] font-bold border border-[#E7E8EB]">D</div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-[#0A1B39]" dir="ltr">{item.doctor?.full_name || "Unknown"}</span>
                        <span className="text-[12px] text-[#6C7688]">{item.doctor?.specialty || "General"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-[#0A1B39]" dir="ltr">{item.patient?.full_name || "Unknown"}</span>
                      <span className="text-[12px] text-[#6C7688]" dir="ltr">{item.patient?.phone || item.patient?.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-[#0A1B39]" dir="ltr">{item.scheduled_date}</span>
                      <span className="text-[11px] text-[#6C7688]" dir="ltr">{item.scheduled_start_time}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[13px] font-medium text-[#6C7688]">{item.appointment_type}</span>
                  </td>
                  <td className="py-4 px-4 text-start">
                    <StatusBadge status={item.status || ""} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

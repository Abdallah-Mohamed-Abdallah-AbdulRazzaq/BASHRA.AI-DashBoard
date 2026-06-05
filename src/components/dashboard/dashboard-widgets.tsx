"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronDownSmall, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from "@/components/ui/icons/dashboard-icons";
import { StripeIcon, PaypalIcon } from "@/components/ui/icons/dashboard-icons";
import { CheckIcon, XIcon } from "@/components/ui/icons/dashboard-icons";

// --- Types ---
interface DashboardWidgetsProps {
  t: any; // Dictionary
}

// ----------------------------------------------------------------------
// Shared Components
// ----------------------------------------------------------------------

const FilterDropdown = ({ options, label, onChange }: { options: string[], label: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 border border-[#E7E8EB] rounded-[6px] text-[12px] text-[#6C7688] hover:bg-gray-50 transition-colors bg-white"
      >
        {selected} <ChevronDownSmall />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-32 bg-white border border-[#E7E8EB] rounded-[6px] shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { setSelected(opt); setIsOpen(false); onChange(opt); }}
                className={cn(
                  "w-full text-left px-3 py-2 text-[12px] hover:bg-gray-50 transition-colors",
                  selected === opt ? "text-[#2E37A4] font-semibold" : "text-[#6C7688]"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// 1. Appointment Statistics
// ----------------------------------------------------------------------

const StatBadge = ({ color, label, value }: { color: string, label: string, value: string }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-[#F5F6F8]/50 rounded-lg border border-[#E7E8EB] min-w-[90px] flex-1 hover:bg-white hover:shadow-sm transition-all duration-300">
    <div className="flex items-center gap-1.5 mb-1">
      <span className={cn("w-2 h-2 rounded-full", color)} />
      <span className="text-[12px] text-[#6C7688] font-medium whitespace-nowrap">{label}</span>
    </div>
    <span className="text-[16px] font-bold text-[#0A1B39]">{value}</span>
  </div>
);

export const AppointmentStatistics = ({ t }: DashboardWidgetsProps) => {
  const [activeDataIndex, setActiveDataIndex] = useState<number | null>(null);
  
  const chartData = [
    { m: "Jan", h1: 30, h2: 20, h3: 15 },
    { m: "Feb", h1: 40, h2: 25, h3: 10 },
    { m: "Mar", h1: 50, h2: 30, h3: 20 },
    { m: "Apr", h1: 45, h2: 35, h3: 15 },
    { m: "May", h1: 60, h2: 20, h3: 20 },
    { m: "Jun", h1: 20, h2: 15, h3: 10 },
    { m: "Jul", h1: 35, h2: 25, h3: 15 },
    { m: "Aug", h1: 50, h2: 30, h3: 25 },
    { m: "Sep", h1: 55, h2: 35, h3: 10 },
    { m: "Oct", h1: 40, h2: 20, h3: 20 },
    { m: "Nov", h1: 30, h2: 25, h3: 15 },
    { m: "Dec", h1: 45, h2: 30, h3: 10 },
  ];

  return (
    <div className="flex flex-col p-5 bg-white border border-[#E7E8EB] rounded-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] w-full gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.dashboard.appt_statistics}</h3>
        <FilterDropdown label={t.dashboard.monthly} options={[t.dashboard.monthly, t.dashboard.weekly]} onChange={() => {}} />
      </div>

      {/* Stats Badges */}
      <div className="flex flex-wrap gap-3">
        <StatBadge color="bg-[#2E37A4]" label={t.dashboard.all_appointments} value="6314" />
        <StatBadge color="bg-[#EF1E1E]" label={t.dashboard.cancelled} value="456" />
        <StatBadge color="bg-[#F2994A]" label={t.dashboard.reschedule} value="745" />
        <StatBadge color="bg-[#27AE60]" label={t.dashboard.completed} value="4578" />
      </div>

      {/* Chart Container */}
      <div className="relative h-[240px] w-full mt-2">
        
        {/* 1. Y-Axis Labels (Left) - Ends at bottom-6 (0K line) */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-[#9DA4B0] font-medium z-0">
          <span>5K</span><span>4K</span><span>3K</span><span>2K</span><span>1K</span><span>0K</span>
        </div>

        {/* 2. Grid Lines - Ends at bottom-6 (0K line) */}
        <div className="absolute left-8 right-0 top-2 bottom-6 flex flex-col justify-between z-0">
           {[...Array(6)].map((_, i) => <div key={i} className="w-full border-t border-dashed border-[#E7E8EB]" />)}
        </div>
        
        {/* 3. Bars Container - Adjusted to sit exactly on bottom-6 */}
        <div className="absolute left-8 right-0 top-2 bottom-6 flex justify-between items-end pl-2 pr-2 z-10">
           {chartData.map((d, i) => (
             <div 
                key={i} 
                className="relative flex flex-col items-center justify-end h-full group w-[24px]"
                onMouseEnter={() => setActiveDataIndex(i)}
                onMouseLeave={() => setActiveDataIndex(null)}
             >
                {/* Tooltip */}
                {activeDataIndex === i && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#0A1B39] text-white text-[10px] p-2 rounded-md shadow-xl z-20 w-[100px] pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex justify-between"><span>Comp:</span><span>{d.h1}%</span></div>
                    <div className="flex justify-between"><span>Ong:</span><span>{d.h2}%</span></div>
                    <div className="flex justify-between"><span>Res:</span><span>{d.h3}%</span></div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0A1B39] rotate-45" />
                  </div>
                )}

                {/* Stacked Bar */}
                <div 
                  className="w-full bg-[#F5F6F8] rounded-[6px] flex flex-col justify-end overflow-hidden transition-all duration-300 group-hover:scale-y-105 origin-bottom"
                  style={{ height: `${d.h1 + d.h2 + d.h3 + 10}%`, gap: '4px' }}
                >
                  {/* Top: Indigo */}
                  <div style={{ height: `${d.h3}%` }} className="w-full bg-[#3538CD] rounded-[2px]" />
                  {/* Middle: Cyan */}
                  <div style={{ height: `${d.h2}%` }} className="w-full bg-[#06AED4] rounded-[2px]" />
                  {/* Bottom: Teal */}
                  <div style={{ height: `${d.h1}%` }} className="w-full bg-[#00D3C7] rounded-[2px]" />
                </div>

                {/* X-Axis Label (Positioned Absolutely Below the Bar area) */}
                <span className={cn(
                  "absolute -bottom-6 text-[11px] font-medium transition-colors whitespace-nowrap",
                  activeDataIndex === i ? "text-[#0A1B39] font-bold" : "text-[#6C7688]"
                )}>
                  {d.m}
                </span>
             </div>
           ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-1">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-[3px] bg-[#00D3C7]" /><span className="text-[12px] text-[#6C7688] font-medium">{t.dashboard.completed}</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-[3px] bg-[#06AED4]" /><span className="text-[12px] text-[#6C7688] font-medium">Ongoing</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-[3px] bg-[#3538CD]" /><span className="text-[12px] text-[#6C7688] font-medium">{t.dashboard.reschedule}</span></div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. Popular Doctors
// ----------------------------------------------------------------------

const DoctorCard = ({ name, role, bookings, image }: any) => (
  <div className="flex items-center p-4 bg-white border border-[#E7E8EB] rounded-[10px] flex-1 min-w-[240px] hover:border-[#2E37A4]/30 hover:shadow-md transition-all duration-300 cursor-pointer group">
    <div className="relative mr-3 rtl:ml-3 rtl:mr-0">
      <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
      <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#27AE60] border-2 border-white rounded-full"></span>
    </div>
    <div className="flex flex-col">
      <h4 className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{name}</h4>
      <span className="text-[12px] text-[#6C7688]">{role}</span>
      <div className="mt-1.5 flex items-center gap-1">
        <span className="text-[14px] font-bold text-[#0A1B39]">{bookings}</span> 
        <span className="text-[12px] font-normal text-[#9DA4B0]">Bookings</span>
      </div>
    </div>
  </div>
);

export const PopularDoctors = ({ t }: DashboardWidgetsProps) => {
  return (
    <div className="flex flex-col p-5 bg-white border border-[#E7E8EB] rounded-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] w-full gap-5">
      <div className="flex justify-between items-center">
        <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.dashboard.popular_doctors}</h3>
        <FilterDropdown label={t.dashboard.weekly} options={[t.dashboard.weekly, t.dashboard.monthly]} onChange={() => {}} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         <DoctorCard name="Dr. Alex Morgan" role="Cardiologist" bookings="258" image="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop" />
         <DoctorCard name="Dr. Emily Carter" role="Pediatrician" bookings="125" image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop" />
         <DoctorCard name="Dr. David Lee" role="Gynecologist" bookings="115" image="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop" />
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 3. Appointments Widget (Corrected Calendar Logic)
// ----------------------------------------------------------------------

export const AppointmentsWidget = ({ t }: DashboardWidgetsProps) => {
  // 1. تثبيت التاريخ كما في الصورة (أبريل 2026)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // Month index 3 = April
  const [selectedDay, setSelectedDay] = useState<number>(5);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // 2. منطق حساب الأيام الدقيق (Handling Logic)
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // اليوم الأول في الشهر (0 = الأحد, 1 = الإثنين, ... 3 = الأربعاء)
    const firstDayIndex = new Date(year, month, 1).getDay();
    
    // عدد أيام الشهر
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // مصفوفة الأيام (فراغات + أرقام)
    // نملأ الفراغات بـ null للحفاظ على التنسيق
    const emptySlots = Array(firstDayIndex).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return [...emptySlots, ...days];
  };

  const calendarItems = getCalendarDays();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="flex flex-col p-6 bg-white border border-[#E7E8EB] rounded-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] w-full h-full gap-6">
      
      {/* Widget Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.dashboard.appointments}</h3>
        <FilterDropdown label={t.dashboard.all_type} options={[t.dashboard.all_type, "Urgent", "Routine"]} onChange={() => {}} />
      </div>

      {/* Calendar Section */}
      <div className="flex flex-col gap-4">
        
        {/* Month Navigation */}
        <div className="flex justify-between items-center px-2">
           <button onClick={handlePrevMonth} className="text-[#9DA4B0] hover:text-[#0A1B39] transition-colors"><ChevronLeftIcon /></button>
           <span className="text-[14px] font-bold text-[#0A1B39]">
             {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
           </span>
           <button onClick={handleNextMonth} className="text-[#9DA4B0] hover:text-[#0A1B39] transition-colors"><ChevronRightIcon /></button>
        </div>
        
        {/* Grid Container */}
        <div className="flex flex-col gap-2">
            {/* Days Header (Su, Mo...) */}
            <div className="grid grid-cols-7 text-center">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <span key={d} className="text-[12px] text-[#9DA4B0] font-medium py-1">{d}</span>
            ))}
            </div>
            
            {/* Days Grid (The fix is here) */}
            <div className="grid grid-cols-7 text-center gap-y-2">
            {calendarItems.map((day, index) => {
                if (day === null) {
                    return <div key={`empty-${index}`} />; // خلية فارغة للحفاظ على الترتيب
                }
                const isSelected = day === selectedDay;
                return (
                    <button 
                        key={day} 
                        onClick={() => setSelectedDay(day as number)}
                        className={cn(
                        "h-8 w-8 mx-auto flex items-center justify-center rounded-[6px] text-[13px] transition-all font-medium",
                        isSelected 
                            ? "bg-[#2E37A4] text-white shadow-md font-semibold" // Selected Style
                            : "text-[#0A1B39] hover:bg-[#F5F6F8]" // Normal Style
                        )}
                    >
                        {day}
                    </button>
                );
            })}
            </div>
        </div>
      </div>

      {/* Appointments List (Static for Design) */}
      <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-dashed border-[#E7E8EB]">
        
        {/* Item 1 */}
        <div className="flex justify-between items-center p-3 bg-[#F9FAFB] rounded-[8px] border border-[#F3F4F6] hover:border-[#E5E7EB] transition-colors cursor-pointer group">
           <div className="flex flex-col gap-1">
              <span className="text-[13px] font-bold text-[#0A1B39]">{t.dashboard.general_visit}</span>
              <div className="flex items-center gap-1.5 text-[11px] text-[#6C7688]">
                 <span className="grayscale group-hover:grayscale-0 transition-all">📅</span> Wed, {selectedDay} {monthNames[currentDate.getMonth()].slice(0,3)}, 06:30 PM
              </div>
           </div>
           <div className="flex -space-x-2 rtl:space-x-reverse">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop" className="w-7 h-7 rounded-full border-2 border-white" alt="p1" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop" className="w-7 h-7 rounded-full border-2 border-white" alt="p2" />
           </div>
        </div>

        {/* Item 2 */}
        <div className="flex justify-between items-center p-3 bg-[#FFF5F5] rounded-[8px] border border-[#FFEAEA] hover:border-[#FECACA] transition-colors cursor-pointer group">
           <div className="flex flex-col gap-1">
              <span className="text-[13px] font-bold text-[#0A1B39]">{t.dashboard.general_visit}</span>
              <div className="flex items-center gap-1.5 text-[11px] text-[#6C7688]">
                 <span className="grayscale group-hover:grayscale-0 transition-all">📅</span> Wed, {selectedDay} {monthNames[currentDate.getMonth()].slice(0,3)}, 04:10 PM
              </div>
           </div>
           <div className="flex -space-x-2 rtl:space-x-reverse">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop" className="w-7 h-7 rounded-full border-2 border-white" alt="p3" />
           </div>
        </div>

        {/* Item 3 (Blueish) */}
        <div className="flex justify-between items-center p-3.5 bg-[#F0F9FF] rounded-[8px] border border-[#E0F2FE] hover:border-[#BAE6FD] transition-colors cursor-pointer">
           <div className="flex flex-col gap-1">
              <span className="text-[13px] font-bold text-[#0A1B39]">{t.dashboard.general_visit}</span>
              <div className="flex items-center gap-1.5 text-[11px] text-[#6C7688]">
                 <span>📅</span> Wed, {selectedDay} {monthNames[currentDate.getMonth()].slice(0,3)}, 10:00 AM
              </div>
           </div>
           <div className="flex -space-x-2 rtl:space-x-reverse">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop" className="w-8 h-8 rounded-full border-2 border-white" alt="p4" />
              <img src="https://images.unsplash.com/photo-1554151228-14d9def656ec?w=64&h=64&fit=crop" className="w-8 h-8 rounded-full border-2 border-white" alt="p5" />
           </div>
        </div>


      {/* Footer Button */}
      <button className="w-full py-2.5 bg-[#F5F6F8] text-[#0A1B39] text-[13px] font-semibold rounded-[6px] hover:bg-[#E7E8EB] transition-colors mt-auto border border-transparent hover:border-[#D1D5DB]">
        {t.dashboard.view_all_appointments}
      </button>


      </div>
    </div>
  );
};



// ----------------------------------------------------------------------
// 4. Top 3 Departments (Interactive SVG Donut Chart - Pro Version)
// ----------------------------------------------------------------------

export const TopDepartments = ({ t }: DashboardWidgetsProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // البيانات مع الألوان المستوحاة من الصورة التي أرسلتها
  // Blue, Light Purple, Dark Purple
  const data = [
    { label: "Cardiology", value: 214, color: "#696FBD", percent: 35 }, 
    { label: "Dental", value: 150, color: "#A64DA6", percent: 25 },     
    { label: "Neurology", value: 121, color: "#6DA6F2", percent: 40 }   
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  
  // إعدادات الـ SVG
  const size = 260; // حجم مناسب داخل الكارت
  const strokeWidth = 45; // سماكة الدائرة
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col p-6 bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] w-full h-full gap-6 items-center justify-between">
      
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <h3 className="text-[18px] font-bold text-[#0A1B39]">{t.dashboard.top_departments}</h3>
        <FilterDropdown label={t.dashboard.weekly} options={[t.dashboard.weekly, t.dashboard.monthly]} onChange={() => {}} />
      </div>

      {/* Chart Container */}
      <div className="relative flex items-center justify-center">
        {/* SVG Layer */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 overflow-visible">
          {data.map((item, index) => {
            const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += item.percent;

            const isHovered = hoveredIndex === index;
            const isDimmed = hoveredIndex !== null && !isHovered;

            return (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-500 ease-out cursor-pointer"
                style={{ 
                  transformOrigin: 'center',
                  // 1. التكبير: العنصر المحدد يكبر، الباقي يظل كما هو
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  // 2. الشفافية: العناصر غير المحددة تصبح باهتة جداً
                  opacity: isDimmed ? 0.3 : 1,
                  // 3. الظل: إضافة ظل ناعم للعنصر المحدد ليبرز فوق الباقين
                  filter: isHovered ? 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))' : 'none',
                  // 4. رفع الطبقة: العنصر المحدد يظهر فوق البقية بصرياً
                  zIndex: isHovered ? 10 : 1
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center Info (Dynamic Text) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
           <span className={cn(
             "text-[14px] text-[#6C7688] font-medium mb-1 transition-all duration-300",
             hoveredIndex !== null ? "scale-110 text-[#0A1B39]" : ""
           )}>
             {hoveredIndex !== null ? data[hoveredIndex].label : t.dashboard.total_patient}
           </span>
           
           <span className={cn(
             "text-[32px] font-bold text-[#0A1B39] transition-all duration-300",
             hoveredIndex !== null ? "scale-110 text-[#2E37A4]" : ""
           )}>
             {hoveredIndex !== null ? data[hoveredIndex].value : total}
           </span>
        </div>
      </div>

      {/* Legend (Interactive) */}
      <div className="flex flex-wrap justify-center gap-6 w-full mt-2">
        {data.map((item, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex items-center gap-2 transition-all duration-300 cursor-pointer px-2 py-1 rounded-md hover:bg-gray-50",
              // التفاعل: إخفاء العناصر غير المحددة في القائمة أيضاً
              hoveredIndex !== null && hoveredIndex !== idx ? "opacity-30 grayscale" : "opacity-100"
            )}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
            <span className="text-[15px] font-bold text-[#0A1B39]">{item.value}</span>
            <span className="text-[12px] font-medium text-[#6C7688]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 5. Doctors Schedule (List Widget - Pro Version)
// ----------------------------------------------------------------------

const ScheduleStat = ({ value, label, color }: { value: string, label: string, color?: string }) => (
  <div className="flex flex-col items-center group cursor-default">
    <span className="text-[12px] text-[#9DA4B0] mb-1 font-medium group-hover:text-[#2E37A4] transition-colors">{label}</span>
    <span className={cn("text-[20px] font-bold transition-transform group-hover:scale-110", color || "text-[#0A1B39]")}>
      {value}
    </span>
  </div>
);

export const DoctorsSchedule = ({ t }: DashboardWidgetsProps) => {
  const doctors = [
    { name: "Dr. Sarah Johnson", role: "Orthopedic Surgeon", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop" },
    { name: "Dr. Emily Carter", role: "Pediatrician", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&auto=format&fit=crop" },
    { name: "Dr. David Lee", role: "Gynecologist", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop" },
    { name: "Dr. Michael Smith", role: "Cardiologist", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop" },
  ];

  return (
    <div className="flex flex-col p-6 bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] w-full h-full gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-bold text-[#0A1B39]">{t.dashboard.doctors_schedule}</h3>
        <button className="px-3 py-1.5 border border-[#E7E8EB] rounded-[6px] text-[12px] text-[#6C7688] font-medium hover:bg-gray-50 hover:text-[#0A1B39] hover:border-[#D1D5DB] transition-all">
          {t.dashboard.view_all}
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-[#E7E8EB] pb-5">
        <ScheduleStat label={t.dashboard.available} value="48" color="text-[#27AE60]" /> {/* Green for Available */}
        <div className="w-[1px] h-10 bg-[#E7E8EB]" />
        <ScheduleStat label={t.dashboard.unavailable} value="28" color="text-[#EF1E1E]" /> {/* Red for Unavailable */}
        <div className="w-[1px] h-10 bg-[#E7E8EB]" />
        <ScheduleStat label={t.dashboard.leave} value="12" color="text-[#F2994A]" /> {/* Orange for Leave */}
      </div>

      {/* List */}
      <div className="flex flex-col gap-4 mt-2">
        {doctors.map((doc, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-3 -mx-3 rounded-[10px] hover:bg-[#F9FAFB] transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#F3F4F6]"
          >
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img 
                  src={doc.img} 
                  alt={doc.name} 
                  className="w-11 h-11 rounded-full object-cover border-[2px] border-white shadow-sm group-hover:scale-105 transition-transform duration-300" 
                />
                {/* Online Status Dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#27AE60] border-[1.5px] border-white rounded-full"></span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{doc.name}</span>
                <span className="text-[12px] text-[#6C7688] font-medium">{doc.role}</span>
              </div>
            </div>
            
            {/* Button - Subtle initially, pops on hover */}
            <button className="px-3.5 py-1.5 bg-[#2E37A4]/10 text-[#2E37A4] text-[11px] font-bold rounded-[6px] 
              group-hover:bg-[#2E37A4] group-hover:text-white group-hover:shadow-md group-hover:shadow-indigo-200 
              transition-all duration-300 transform group-hover:-translate-x-1">
              {t.dashboard.book_now}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 6. Income By Treatment (List Widget - Pro Version)
// ----------------------------------------------------------------------

export const IncomeByTreatment = ({ t }: DashboardWidgetsProps) => {
  const treatments = [
    { name: "Cardiology", count: "4,556", price: "$5,985" },
    { name: "Radiology", count: "4,125", price: "$5,194" },
    { name: "Dental Surgery", count: "1,796", price: "$2,716" },
    { name: "Orthopaedics", count: "3,827", price: "$4,682" },
    { name: "General Medicine", count: "9,894", price: "$9,450" },
  ];

  return (
    <div className="flex flex-col p-6 bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] w-full h-full gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-bold text-[#0A1B39]">{t.dashboard.income_treatment}</h3>
        <FilterDropdown label={t.dashboard.weekly} options={[t.dashboard.weekly, t.dashboard.monthly]} onChange={() => {}} />
      </div>

      {/* List */}
      <div className="flex flex-col gap-3 mt-2">
        {treatments.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-3.5 rounded-[10px] bg-[#FFFFFF] border border-[#F3F4F6] hover:border-[#E5E7EB] hover:bg-[#F9FAFB] hover:shadow-sm transition-all duration-300 group cursor-default"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{item.name}</span>
              <span className="text-[12px] text-[#9DA4B0] font-medium">{item.count} Appointments</span>
            </div>
            
            {/* Price Badge - Pops on hover */}
            <span className="text-[14px] font-bold text-[#0A1B39] bg-[#F5F6F8] px-3 py-1.5 rounded-[8px] 
              group-hover:bg-[#2E37A4] group-hover:text-white group-hover:shadow-md 
              transition-all duration-300 min-w-[70px] text-center">
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};



// ----------------------------------------------------------------------
// 7. All Appointments Table (Fixed RTL & Layout)
// ----------------------------------------------------------------------

const StatusBadge = ({ status }: { status: string }) => {
  let styles = "";
  
  switch (status) {
    case "Confirmed":
      styles = "text-[#27AE60] border-[#27AE60] bg-[#27AE60]/5";
      break;
    case "Cancelled":
      styles = "text-[#EF1E1E] border-[#EF1E1E] bg-[#EF1E1E]/5";
      break;
    case "Checked Out":
      styles = "text-[#00D3C7] border-[#00D3C7] bg-[#00D3C7]/5";
      break;
    case "Schedule":
      styles = "text-[#2F80ED] border-[#2F80ED] bg-[#2F80ED]/5";
      break;
    default:
      styles = "text-[#6C7688] border-[#E7E8EB]";
  }

  return (
    <span className={cn("px-3 py-1 rounded-[4px] border text-[12px] font-medium transition-all hover:bg-opacity-15 whitespace-nowrap", styles)}>
      {status}
    </span>
  );
};

export const AllAppointmentsTable = ({ t }: DashboardWidgetsProps) => {
  const appointments = [
    {
      id: 1,
      doctor: { name: "Dr. John Smith", role: "Neurosurgeon", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop" },
      patient: { name: "Jesus Adams", id: "+1 41254 45214", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop" },
      date: "28 May 2025 - 11:15 AM",
      mode: "Online",
      status: "Confirmed"
    },
    {
      id: 2,
      doctor: { name: "Dr. Lisa White", role: "Oncologist", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&auto=format&fit=crop" },
      patient: { name: "Ezra Belcher", id: "+1 65895 41247", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop" },
      date: "29 May 2025 - 11:30 AM",
      mode: "In-Person",
      status: "Cancelled"
    },
    {
      id: 3,
      doctor: { name: "Dr. Patricia Brown", role: "Pulmonologist", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop" },
      patient: { name: "Glen Lentz", id: "+1 62458 45845", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop" },
      date: "30 May 2025 - 09:30 AM",
      mode: "Online",
      status: "Confirmed"
    },
    {
      id: 4,
      doctor: { name: "Dr. Rachel Green", role: "Urologist", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop" },
      patient: { name: "Bernard Griffith", id: "+1 61422 45214", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop" },
      date: "30 May 2025 - 10:00 AM",
      mode: "Online",
      status: "Checked Out"
    },
    {
      id: 5,
      doctor: { name: "Dr. Michael Smith", role: "Cardiologist", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop" },
      patient: { name: "John Elsass", id: "+1 47851 26371", img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop" },
      date: "30 May 2025 - 11:00 AM",
      mode: "Online",
      status: "Schedule"
    },
  ];

  return (
    <div className="flex flex-col p-6 bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] w-full gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <h3 className="text-[18px] font-bold text-[#0A1B39]">{t.dashboard.all_appointments_list}</h3>
        <button className="px-4 py-2 border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#6C7688] font-medium hover:bg-gray-50 hover:text-[#0A1B39] transition-colors">
          {t.dashboard.view_all}
        </button>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-[#E7E8EB]">
              {/* Use text-start for RTL support */}
              <th className="text-start py-4 px-4 text-[13px] font-semibold text-[#0A1B39] w-[25%]">{t.dashboard.doctor}</th>
              <th className="text-start py-4 px-4 text-[13px] font-semibold text-[#0A1B39] w-[25%]">{t.dashboard.patient}</th>
              <th className="text-start py-4 px-4 text-[13px] font-semibold text-[#0A1B39] w-[20%]">{t.dashboard.date_time}</th>
              <th className="text-start py-4 px-4 text-[13px] font-semibold text-[#0A1B39] w-[15%]">{t.dashboard.mode}</th>
              <th className="text-start py-4 px-4 text-[13px] font-semibold text-[#0A1B39] w-[15%]">{t.dashboard.status}</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                
                {/* Doctor - Force LTR inside for English Names or keep text-start */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img src={item.doctor.img} alt={item.doctor.name} className="w-10 h-10 rounded-full object-cover border border-[#F3F4F6]" />
                    <div className="flex flex-col items-start">
                      <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors" dir="ltr">{item.doctor.name}</span>
                      <span className="text-[12px] text-[#6C7688]">{item.doctor.role}</span>
                    </div>
                  </div>
                </td>

                {/* Patient */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img src={item.patient.img} alt={item.patient.name} className="w-10 h-10 rounded-full object-cover border border-[#F3F4F6]" />
                    <div className="flex flex-col items-start">
                      <span className="text-[14px] font-bold text-[#0A1B39]" dir="ltr">{item.patient.name}</span>
                      <span className="text-[12px] text-[#6C7688]" dir="ltr">{item.patient.id}</span>
                    </div>
                  </div>
                </td>

                {/* Date & Time - Force LTR to fix number ordering in Arabic */}
                <td className="py-4 px-4">
                  <span className="text-[13px] font-medium text-[#6C7688]" dir="ltr">{item.date}</span>
                </td>

                {/* Mode */}
                <td className="py-4 px-4">
                  <span className={cn("text-[13px] font-medium", item.mode === "Online" ? "text-[#2E37A4]" : "text-[#6C7688]")}>
                    {item.mode}
                  </span>
                </td>

                {/* Status */}
                <td className="py-4 px-4">
                  <StatusBadge status={item.status} />
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



// ----------------------------------------------------------------------
// 8. Top 5 Patients (List Widget)
// ----------------------------------------------------------------------

export const TopPatients = ({ t }: DashboardWidgetsProps) => {
  const patients = [
    { name: "Jesus Adams", paid: "$6589", count: "80", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop" },
    { name: "Ezra Belcher", paid: "$5632", count: "60", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop" },
    { name: "Glen Lentz", paid: "$4125", count: "40", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop" },
    { name: "Bernard Griffith", paid: "$3140", count: "25", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop" },
    { name: "John Elsass", paid: "$2654", count: "25", img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop" },
  ];

  return (
    <div className="flex flex-col p-6 bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] w-full h-full gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-bold text-[#0A1B39]">{t.dashboard.top_patients}</h3>
        <button className="px-3 py-1.5 border border-[#E7E8EB] rounded-[6px] text-[12px] text-[#6C7688] font-medium hover:bg-gray-50 hover:text-[#0A1B39] transition-all">
          {t.dashboard.view_all}
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-5 mt-2">
        {patients.map((p, idx) => (
          <div key={idx} className="flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-3">
              <img src={p.img} alt={p.name} className="w-11 h-11 rounded-full object-cover border-2 border-transparent group-hover:border-[#2E37A4] transition-all" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{p.name}</span>
                <span className="text-[12px] text-[#9DA4B0] font-medium">{t.dashboard.total_paid} : <span className="text-[#6C7688]">{p.paid}</span></span>
              </div>
            </div>
            {/* Badge */}
            <span className="px-3 py-1.5 border border-[#696FBD] text-[#696FBD] text-[11px] font-semibold rounded-[6px] bg-[#696FBD]/5 group-hover:bg-[#696FBD] group-hover:text-white transition-all duration-300">
              {p.count} {t.dashboard.appointments_count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 9. Recent Transactions (List Widget)
// ----------------------------------------------------------------------


export const RecentTransactions = ({ t }: DashboardWidgetsProps) => {
  const transactions = [
    { title: "General Check-up", id: "#INV5889", amount: "+ $234", type: "stripe", color: "bg-[#6366F1]" },
    { title: "Online Consultation", id: "#INV7874", amount: "+ $234", type: "paypal", color: "bg-[#003087]" },
    { title: "Purchase Product", id: "#INV4458", amount: "- $69", type: "stripe", color: "bg-[#6366F1]", isNegative: true },
    { title: "Online Consultation", id: "#INV5456", amount: "+ $234", type: "paypal", color: "bg-[#003087]" },
    { title: "Online Consultation", id: "#INV4557", amount: "+ $234", type: "stripe", color: "bg-[#6366F1]" },
  ];

  return (
    <div className="flex flex-col p-6 bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] w-full h-full gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-bold text-[#0A1B39]">{t.dashboard.recent_transactions}</h3>
        <FilterDropdown label={t.dashboard.weekly} options={[t.dashboard.weekly, t.dashboard.monthly]} onChange={() => {}} />
      </div>

      {/* List */}
      <div className="flex flex-col gap-5 mt-2">
        {transactions.map((tr, idx) => (
          <div key={idx} className="flex items-center justify-between group cursor-pointer hover:bg-[#F9FAFB] p-2 -mx-2 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              {/* Icon Container */}
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-white", tr.color)}>
                 {tr.type === 'stripe' ? <StripeIcon /> : <PaypalIcon />}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{tr.title}</span>
                <span className="text-[12px] text-[#2E37A4] font-medium">{tr.id}</span>
              </div>
            </div>
            {/* Amount Badge */}
            <span className={cn(
              "px-3 py-1.5 text-[12px] font-bold rounded-[6px] text-white shadow-sm min-w-[60px] text-center",
              tr.isNegative ? "bg-[#EF1E1E]" : "bg-[#27AE60]"
            )}>
              {tr.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 10. Leave Requests (List Widget)
// ----------------------------------------------------------------------


export const LeaveRequests = ({ t }: DashboardWidgetsProps) => {
  const requests = [
    { name: "James Allaire", duration: "4 Days", reason: "Personal Reason", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" },
    { name: "Esther Schmidt", duration: "2 Days", reason: "Going to Hospital", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop" },
    { name: "Valerie Padgett", duration: "1 Day", reason: "Changing Account", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop" },
    { name: "Diane Nash", duration: "1 Day", reason: "Not Well", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop" },
    { name: "Sally Cavazos", duration: "2 Days", reason: "Going to Checkup", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop" },
  ];

  return (
    <div className="flex flex-col p-6 bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] w-full h-full gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-bold text-[#0A1B39]">{t.dashboard.leave_requests}</h3>
        <FilterDropdown label={t.dashboard.today} options={[t.dashboard.today, t.dashboard.weekly]} onChange={() => {}} />
      </div>

      {/* List */}
      <div className="flex flex-col gap-5 mt-2">
        {requests.map((req, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={req.img} alt={req.name} className="w-11 h-11 rounded-full object-cover border-[2px] border-[#F5F6F8]" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold text-[#0A1B39]">{req.name}</span>
                <span className="text-[12px] text-[#6C7688] font-medium">{req.duration} - <span className="font-normal">{req.reason}</span></span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-[#FFF5F5] text-[#EF1E1E] hover:bg-[#EF1E1E] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md" title={t.dashboard.reject}>
                <XIcon />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-[#F0FDF4] text-[#27AE60] hover:bg-[#27AE60] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md" title={t.dashboard.approve}>
                <CheckIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
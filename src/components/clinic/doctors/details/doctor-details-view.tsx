"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { DoctorDetailsHeader } from "./doctor-details-header";
import { GeneralInfoTab } from "./tabs/general-info-tab";


// استيراد باقي التبويبات (كملفات مبدئية سيتم بناء محتواها لاحقاً)
import { ContactDetailsTab } from "./tabs/contact-details-tab";
import { SubscriptionsTab } from "./tabs/subscriptions-tab";
import { SchedulesTab } from "./tabs/schedules-tab";
import { ProfileDetailsTab } from "./tabs/profile-details-tab";

interface DoctorDetailsViewProps {
  t: any;
}

export default function DoctorDetailsView({ t }: DoctorDetailsViewProps) {
  // --- Dummy Data (Centralized here to pass to tabs) ---
  const doctorData = {
    id: "DT2002",
    name: "Dr. John Smith",
    specialty: "Cardiology",
    degrees: "MBBS, M.D, Cardiology",
    clinic: "Downtown Medical Clinic",
    status: "available",
    charge: "$499",
    session_duration: "30 Min",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop",
    bio: "Dr. John Smith has been practicing family medicine for over 10 years...",
    about: {
      license: "ML566659898", phone: "+1 54546 45648", email: "john@example.com",
      location: "4150 Hiney Road, Las Vegas, NV 89109", dob: "25 Jan 1990",
      experience: "15+ Years", gender: "Male", nationality: "American",
      languages: "English, Spanish, Arabic", rating: "4.8", total_consultations: "1,250+"
    },
    schedule: {
      "Monday": ["11:30 AM - 12:30 PM", "12:30 PM - 01:30 PM", "02:30 PM - 03:30 PM"],
      "Tuesday": ["10:00 AM - 12:00 PM", "01:00 PM - 03:00 PM"],
      "Wednesday": ["09:00 AM - 11:00 AM"],
      "Thursday": ["11:30 AM - 12:30 PM"],
      "Friday": ["08:00 AM - 01:00 PM"],
    },
    education: [
      { degree: "Boston Medicine Institution - MD", date: "25 May 1990 - 29 Jan 1992" },
      { degree: "Harvard Medical School - MBBS", date: "25 May 1985 - 29 Jan 1990" }
    ],
      awards: [{ title: "Top Doctor Award (2023)", desc: "Recognized by U.S. News." }],
    
      certifications: [{ title: "American Board of Family Medicine", desc: "Demonstrates mastery." }],
      contactDetails: {
      whatsapp: "+1 555 019 8888",
      additionalPhone: "+1 555 019 9999",
      personalEmail: "dr.john.smith.personal@gmail.com",
      notes: "Please only use the personal email for emergency cases or urgent administrative matters. WhatsApp can be used for quick inquiries during off-hours, but expect a delay in response.",
      updatedAt: "20 Jan 2025 - 10:30 AM"
    },
    subscriptions: {
      currentSubscription: {
        status: "active", // active, pending, expired, canceled
        isTrial: false,
        startDate: "01 Jan 2025",
        endDate: "31 Dec 2025",
        packageName: "Premium Elite Package", // من جدول packages
        secondaryName: "Best for top-tier doctors",
        durationDays: 365,
        price: "$1,200.00",
        features: [ // من جدول package_features + features
          { name: "Online Video Consultations", value: "Unlimited", unit: "", isIncluded: true },
          { name: "Staff Accounts", value: "10", unit: "Accounts", isIncluded: true },
          { name: "SMS Reminders", value: "5000", unit: "SMS/Mo", isIncluded: true },
          { name: "Priority Support", value: "24/7", unit: "", isIncluded: true },
          { name: "Advanced Analytics", value: "", unit: "", isIncluded: true },
          { name: "White-label Branding", value: "", unit: "", isIncluded: false },
        ]
      },
      history: [ // سجل قديم
        { packageName: "Basic Standard Package", startDate: "01 Jan 2024", endDate: "31 Dec 2024", price: "$499.00", status: "expired" },
        { packageName: "Free Trial Package", startDate: "15 Dec 2023", endDate: "31 Dec 2023", price: "$0.00", status: "expired" },
      ]
    },
    
    schedulesData: {
      onlineSchedule: {
        isActive: true,
        duration: "30 Min",
        price: "$150.00",
        schedule: {
          "Monday": ["09:00 AM - 12:00 PM", "06:00 PM - 09:00 PM"],
          "Wednesday": ["05:00 PM - 08:00 PM"],
          "Friday": ["10:00 AM - 01:00 PM"]
        }
      },
      clinics: [
        {
          id: 1,
          name: "Trustcare Medical Center",
          isMain: true,
          status: "active",
          address: "4150 Hiney Road, Las Vegas, NV 89109, United States",
          phone: "+1 54554 54584",
          image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop", // من جدول clinic_images
          sessionDuration: "45 Min",
          sessionPrice: "$250.00",
          schedule: {
            "Tuesday": ["10:00 AM - 02:00 PM", "04:00 PM - 08:00 PM"],
            "Thursday": ["10:00 AM - 04:00 PM"]
          }
        },
        {
          id: 2,
          name: "Downtown Health Clinic",
          isMain: false,
          status: "active",
          address: "128 Downtown Avenue, New York, NY 10001",
          phone: "+1 98765 43210",
          image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&auto=format&fit=crop",
          sessionDuration: "30 Min",
          sessionPrice: "$180.00",
          schedule: {
            "Saturday": ["08:00 AM - 01:00 PM", "02:00 PM - 06:00 PM"],
            "Sunday": ["09:00 AM - 01:00 PM"]
          }
        }
      ]
    },
    profileDetails: {
      // من جدول doctor_profiles
      licenseNumber: "ML-566659898-USA",
      yearsOfExperience: 15,
      medicalSchool: "Harvard Medical School, Boston",
      graduationYear: "2010",
      boardCertifications: ["American Board of Internal Medicine", "Cardiovascular Disease Certification"],
      languagesSpoken: ["English", "Spanish", "Arabic"],
      isVerified: true,
      verificationDate: "12 Oct 2024 - 09:30 AM",
      approvalStatus: "approved", // approved, pending, rejected
      dob: "25 Jan 1985",
      gender: "male",
      nationality: "American",
      emergencyPhone: "+1 555 987 6543",
      timezone: "America/New_York (UTC-5)",
      languagePreference: "en",

      // من جدول doctor_profile_translations
      fullName: "Dr. John Smith",
      specialty: "Cardiology",
      subSpecialty: "Interventional Cardiology",
      emergencyContactName: "Sarah Smith",
      emergencyRelationship: "Spouse",
    }    
  };

  // --- Tabs Configuration ---
  const tabs = [
    { id: "general", label: t.clinic.tab_general_info },
    { id: "contact", label: t.clinic.tab_contact_details },
    { id: "subscriptions", label: t.clinic.tab_subscriptions },
    { id: "schedules", label: t.clinic.tab_schedules },
    { id: "profile", label: t.clinic.tab_profile_details },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. Header Section */}
      <DoctorDetailsHeader t={t} doctor={doctorData} />

      {/* 2. Tabs Navigation */}
      <div className="w-full border-b border-[#E7E8EB] flex items-center gap-6 overflow-x-auto custom-scrollbar mt-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-3 text-[14px] font-bold whitespace-nowrap border-b-2 transition-all",
              activeTab === tab.id 
                ? "border-[#2E37A4] text-[#2E37A4]" 
                : "border-transparent text-[#6C7688] hover:text-[#0A1B39]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Tab Content Area */}
      <div className="w-full mt-2">
        {activeTab === "general" && <GeneralInfoTab t={t} doctor={doctorData} />}
        {activeTab === "contact" && <ContactDetailsTab t={t} doctor={doctorData} />}
        {/* {activeTab === "contact" && <div className="p-10 bg-white rounded-[12px] border border-[#E7E8EB] text-center text-gray-400">Contact Details Content (Next Step)</div>} */}
        {activeTab === "subscriptions" && <SubscriptionsTab t={t} doctor={doctorData} />}
        {/* {activeTab === "subscriptions" && <div className="p-10 bg-white rounded-[12px] border border-[#E7E8EB] text-center text-gray-400">Subscriptions Content (Next Step)</div>} */}
        {activeTab === "schedules" && <SchedulesTab t={t} doctor={doctorData} />}
        {/* {activeTab === "schedules" && <div className="p-10 bg-white rounded-[12px] border border-[#E7E8EB] text-center text-gray-400">Schedules Content (Next Step)</div>} */}
        {activeTab === "profile" && <ProfileDetailsTab t={t} doctor={doctorData} />}
        {/* {activeTab === "profile" && <div className="p-10 bg-white rounded-[12px] border border-[#E7E8EB] text-center text-gray-400">Profile Details Content (Next Step)</div>} */}
      </div>

    </div>
  );
}
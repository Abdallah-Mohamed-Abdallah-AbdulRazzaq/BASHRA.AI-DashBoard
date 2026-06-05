"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { PatientDetailsHeader } from "./patient-details-header";
import { GeneralInfoTab } from "./tabs/general-info-tab";
import { MedicalRecordsTab } from "./tabs/medical-records-tab";
import { PrescriptionsTab } from "./tabs/prescriptions-tab";
import { PatientProfilesTab } from "./tabs/patient-profiles-tab";
import { AiDiagnosisTab } from "./tabs/ai-diagnosis-tab";
import { AppointmentsTab } from "./tabs/appointments-tab";
import { TransactionsTab } from "./tabs/transactions-tab";

interface PatientDetailsViewProps {
  t: any;
}

export default function PatientDetailsView({ t }: PatientDetailsViewProps) {
  
  const patientData = {
    patientId: "#PT-1002", name: "Emma Watson", age: "29 Years", gender: "Female", bloodGroup: "AB-", phone: "+1 555 123 4567", status: "Active",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop",
    vitals: { weight: "65", height: "170", bloodPressure: "120/80", heartRate: "72" },
    
    generalInfo: {
      account: { // جدول users
        uuid: "550e8400-e29b-41d4-a716-446655440000",
        email: "emma.watson@example.com",
        phone: "+1 555 123 4567",
        isEmailVerified: true,
        isPhoneVerified: true,
        isIdVerified: false, // لم يقم بتوثيق الهوية
        status: "active", // active, inactive, suspended, pending_verification
        lastLogin: "22 Feb 2026 - 10:30 AM",
        lastActivity: "22 Feb 2026 - 02:15 PM"
      },
      profile: { // جدول user_profiles
        dob: "15 April 1996",
        gender: "female", // male, female, other, prefer_not_to_say
        nationality: "American",
        emergencyContactPhone: "+1 555 987 6543",
        timezone: "America/New_York",
        languagePreference: "en"
      },
      translations: { // جدول user_profile_translations
        fullName: "Emma Watson",
        emergencyContactName: "John Watson",
        emergencyContactRelationship: "Husband"
      }
    },
    medicalRecords: [
      {
        id: 1,
        uuid: "rec-550e8400-e29b-41d4",
        visitDate: "15 Feb 2026 - 09:30 AM",
        doctorName: "Dr. John Smith",
        status: "final", // draft, final, amended
        severity: "moderate", // mild, moderate, severe
        response: "good", // excellent, good, fair, poor, unknown
        consent: true,
        nextAppointmentRecommended: true,
        followUpDate: "15 Mar 2026",
        vitalSigns: { bp: "120/80", hr: 72, temp: "37.1 C" },
        affectedAreas: ["Face", "Right Arm"],
        translations: {
          chiefComplaint: "Patient complains of severe itching and redness on the right arm and face.",
          hpi: "Symptoms started 3 days ago after exposure to an unknown allergen in the garden. Over-the-counter creams did not help.",
          physicalExam: "Erythematous plaques with excoriation noted on the right forearm and left cheek. No signs of systemic infection.",
          assessment: "Acute allergic contact dermatitis.",
          diagnosis: "Contact Dermatitis (L23.9)",
          differentialDiagnosis: "Atopic dermatitis, Eczema",
          treatmentPlan: "Prescribed topical corticosteroids (Hydrocortisone 1%) to be applied twice daily for 7 days. Prescribed oral antihistamines for itching.",
          followUp: "Return to clinic if symptoms worsen or do not improve in 7 days.",
          doctorNotes: "Advised patient to avoid the suspected garden area and wear long sleeves. Patient understood the instructions clearly."
        }
      },
      {
        id: 2,
        uuid: "rec-660e8400-e29b-41d5",
        visitDate: "10 Nov 2025 - 11:15 AM",
        doctorName: "Dr. Sarah Johnson",
        status: "amended",
        severity: "mild",
        response: "excellent",
        consent: true,
        nextAppointmentRecommended: false,
        followUpDate: null,
        affectedAreas: ["Scalp"],
        translations: {
          chiefComplaint: "Mild flaking and itching on the scalp.",
          hpi: "Ongoing for 2 weeks, exacerbated by cold weather.",
          physicalExam: "Mild diffuse scaling on the scalp, no erythema.",
          assessment: "Seborrheic dermatitis.",
          diagnosis: "Seborrheic Dermatitis (L21.0)",
          differentialDiagnosis: "Psoriasis",
          treatmentPlan: "Ketoconazole 2% shampoo, use twice a week.",
          followUp: "Follow up only if symptoms persist after 4 weeks.",
          doctorNotes: "Patient prefers medical shampoo over natural remedies."
        }
      }
    ],
    prescriptionsData: [
      {
        id: 1,
        uuid: "rx-550e8400-e29b-41d4",
        medicationName: "Amoxicillin Trihydrate",
        prescriptionNumber: "RX-2026-98765",
        dosage: "500 mg",
        frequency: "Every 8 hours",
        duration: "7 Days",
        quantity: "21 Capsules",
        routeOfAdministration: "Oral",
        refillsAllowed: 0,
        refillsUsed: 0,
        isGenericAllowed: true,
        status: "active", // active, filled, expired, cancelled, replaced
        prescribedDate: "15 Feb 2026",
        expiryDate: "22 Feb 2026",
        translations: {
          instructions: "Take one capsule by mouth every 8 hours with food. Complete the entire course.",
          indication: "Bacterial Infection (Upper Respiratory)",
          pharmacyNotes: "Patient has a mild sensitivity to standard Penicillin, observe closely."
        }
      },
      {
        id: 2,
        uuid: "rx-660e8400-e29b-41d5",
        medicationName: "Lisinopril",
        prescriptionNumber: "RX-2025-12345",
        dosage: "10 mg",
        frequency: "Once daily",
        duration: "30 Days",
        quantity: "30 Tablets",
        routeOfAdministration: "Oral",
        refillsAllowed: 3,
        refillsUsed: 3,
        isGenericAllowed: false,
        status: "filled",
        prescribedDate: "10 Nov 2025",
        expiryDate: "10 May 2026",
        translations: {
          instructions: "Take one tablet by mouth daily in the morning to control blood pressure.",
          indication: "Hypertension",
          pharmacyNotes: "Dispense exactly as written. No generics without doctor's approval."
        }
      }
    ],
    patientProfile: {
      data: { // جدول patient_profiles
        bloodType: "AB-",
        height: "170.00",
        weight: "65.50",
        smokingStatus: "former", // never, former, current, unknown
        alcoholConsumption: "rarely", // never, rarely, occasionally, regularly, unknown
        exerciseFrequency: "regularly", // never, rarely, sometimes, regularly, daily, unknown
        insuranceProvider: "Allianz Global Health",
        insurancePolicyNumber: "POL-8849-XYZ",
        preferredDoctorName: "Dr. Sarah Johnson" // (تم جلب الاسم بناءً على الـ preferred_doctor_id)
      },
      translations: { // جدول patient_profile_translations
        medicalHistory: "Patient had a normal childhood with no major illnesses. Diagnosed with mild asthma at age 12, currently well-controlled. Appendectomy performed in 2018 without complications.",
        currentMedications: "Loratadine 10mg, Albuterol Inhaler (PRN)", // مفصولة بفاصلة لعرضها كـ Badges
        allergies: "Penicillin, Peanuts, Dust Mites", // مفصولة بفاصلة لعرضها كـ Badges
        chronicConditions: "Mild Asthma, Seasonal Allergic Rhinitis",
        familyMedicalHistory: "Father: Hypertension, Type 2 Diabetes. Mother: Hypothyroidism. No known family history of cancer."
      }
    },
    aiDiagnoses: [
      {
        id: 1,
        uuid: "ai-990e8400-e29b-41d4",
        createdAt: "15 Feb 2026 - 09:15 AM",
        aiModelVersion: "DermNet-v4.2.1",
        processingTimeMs: 1245,
        confidenceScore: 0.9450, // 95%
        severityAssessment: "moderate", // mild, moderate, severe, urgent
        secondaryDiagnoses: ["Atopic Eczema", "Psoriasis (low probability)"],
        riskFactors: ["History of allergies", "Recent outdoor exposure"],
        recommendedActions: ["Prescribe topical corticosteroids", "Recommend allergy testing"],
        doctorReviewed: true,
        doctorAgreement: "agree", // agree, partially_agree, disagree, not_reviewed
        reviewedBy: "105",
        reviewedAt: "15 Feb 2026 - 09:40 AM",
        translations: {
          primaryDiagnosis: "Acute Contact Dermatitis",
          doctorNotes: "AI assessment is highly accurate. The lesions strictly match contact dermatitis patterns. Proceeding with the AI recommended treatment plan."
        }
      },
      {
        id: 2,
        uuid: "ai-880e8400-e29b-41d5",
        createdAt: "10 Nov 2025 - 11:00 AM",
        aiModelVersion: "DermNet-v4.1.0",
        processingTimeMs: 890,
        confidenceScore: 0.6520, // 65%
        severityAssessment: "mild",
        secondaryDiagnoses: ["Seborrheic Dermatitis", "Fungal Infection"],
        riskFactors: [],
        recommendedActions: ["Microscopic examination of skin scrapings"],
        doctorReviewed: true,
        doctorAgreement: "partially_agree",
        reviewedBy: "102",
        reviewedAt: "10 Nov 2025 - 11:30 AM",
        translations: {
          primaryDiagnosis: "Tinea Capitis (Suspected)",
          doctorNotes: "AI suggested fungal infection due to scaling, but clinical presentation aligns more with Seborrheic Dermatitis. Opted for Ketoconazole trial first."
        }
      },
      {
        id: 3,
        uuid: "ai-770e8400-e29b-41d6",
        createdAt: "22 Feb 2026 - 08:00 AM",
        aiModelVersion: "DermNet-v4.2.1",
        processingTimeMs: 1050,
        confidenceScore: 0.8800, // 88%
        severityAssessment: "urgent",
        secondaryDiagnoses: ["Cellulitis"],
        riskFactors: ["Diabetes Type 2", "Open wound on lower leg"],
        recommendedActions: ["Immediate antibiotics", "Wound swab for culture"],
        doctorReviewed: false, // 👈 لم تتم مراجعته بعد
        doctorAgreement: "not_reviewed",
        reviewedBy: null,
        reviewedAt: null,
        translations: {
          primaryDiagnosis: "Severe Bacterial Cellulitis",
          doctorNotes: null
        }
      }
    ],
    appointmentsData: [
      {
        id: 1,
        uuid: "apt-111e8400-e29b-41d4",
        scheduledDate: "30 Apr 2025",
        scheduledTime: "09:30 AM",
        doctorName: "Dr. Mick Thompson",
        doctorSpecialty: "Cardiologist",
        doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop",
        appointmentType: "consultation", // consultation, follow_up, urgent, routine
        status: "completed", // pending, confirmed, in_progress, completed, cancelled, no_show, rescheduled
        urgencyLevel: "medium", // low, medium, high, emergency
        durationMinutes: 45,
        fee: "150.00",
        currency: "USD",
        paymentStatus: "paid", // pending, paid, refunded, failed
        translations: {
          chiefComplaint: "Routine heart checkup.",
          symptoms: "Occasional mild chest tightness after exercise.",
          cancellationReason: null
        }
      },
      {
        id: 2,
        uuid: "apt-222e8400-e29b-41d5",
        scheduledDate: "15 Apr 2025",
        scheduledTime: "11:20 AM",
        doctorName: "Dr. Sarah Johnson",
        doctorSpecialty: "Orthopedic Surgeon",
        doctorImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&auto=format&fit=crop",
        appointmentType: "follow_up",
        status: "in_progress",
        urgencyLevel: "low",
        durationMinutes: 30,
        fee: "100.00",
        currency: "USD",
        paymentStatus: "pending",
        translations: {
          chiefComplaint: "Follow up on knee surgery.",
          symptoms: "Doing well, no pain reported.",
          cancellationReason: null
        }
      },
      {
        id: 3,
        uuid: "apt-333e8400-e29b-41d6",
        scheduledDate: "02 Apr 2025",
        scheduledTime: "08:15 AM",
        doctorName: "Dr. Emily Carter",
        doctorSpecialty: "Pediatrician",
        doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop",
        appointmentType: "urgent",
        status: "cancelled",
        urgencyLevel: "emergency",
        durationMinutes: 60,
        fee: "250.00",
        currency: "USD",
        paymentStatus: "refunded",
        translations: {
          chiefComplaint: "High fever and rash.",
          symptoms: "Temp 39.5C, red spots on back.",
          cancellationReason: "Patient went directly to the ER instead."
        }
      }
    ],
    transactionsData: [
      {
        id: 1,
        uuid: "pay-111e8400-e29b-41d4",
        transactionId: "#TNX0025",
        description: "General Consultation", // يمكن استنتاجها من الـ appointment_id
        paidDate: "30 Apr 2025",
        paymentMethod: "PayPal", // credit_card, debit_card, paypal, cash, insurance
        amount: "800.00",
        currency: "$",
        status: "completed", // pending, processing, completed, failed, cancelled, refunded
        processingFee: "24.00",
        netAmount: "776.00",
        paymentGateway: "PayPal Checkout",
        gatewayTransactionId: "PAYID-M9X8H7G6F5",
        refundAmount: "0.00",
        refundReason: null,
        refundedAt: null
      },
      {
        id: 2,
        uuid: "pay-222e8400-e29b-41d5",
        transactionId: "#TNX0024",
        description: "Dental Cleaning",
        paidDate: "15 Apr 2025",
        paymentMethod: "Debit Card",
        amount: "930.00",
        currency: "$",
        status: "pending",
        processingFee: "0.00",
        netAmount: "0.00",
        paymentGateway: "Stripe",
        gatewayTransactionId: "pi_1M9X8H7G6F5",
        refundAmount: "0.00",
        refundReason: null,
        refundedAt: null
      },
      {
        id: 3,
        uuid: "pay-333e8400-e29b-41d6",
        transactionId: "#TNX0023",
        description: "Eye Checkup",
        paidDate: "02 Apr 2025",
        paymentMethod: "Credit Card",
        amount: "850.00",
        currency: "$",
        status: "refunded",
        processingFee: "15.00",
        netAmount: "835.00",
        paymentGateway: "Stripe",
        gatewayTransactionId: "pi_1L8W7G6F5E4",
        refundAmount: "850.00",
        refundReason: "Patient cancelled the appointment before 24 hours.",
        refundedAt: "01 Apr 2025 - 10:00 AM"
      }
    ]
  };

  const tabs = [
    { id: "general", label: t.clinic.tab_general_info },
    { id: "medical_records", label: t.clinic.tab_medical_records },
    { id: "prescriptions", label: t.clinic.tab_prescriptions },
    { id: "profiles", label: t.clinic.tab_patient_profiles },
    { id: "ai_diagnosis", label: t.clinic.tab_ai_diagnosis },
    { id: "appointments", label: t.clinic.tab_appointments },
    { id: "transactions", label: t.clinic.tab_transactions }
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      <PatientDetailsHeader t={t} patient={patientData} />

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

      <div className="w-full mt-2">
        {/* 👈 3. عرض المكون الجديد هنا */}
        {activeTab === "general" && <GeneralInfoTab t={t} patient={patientData} />}
        {activeTab === "medical_records" && <MedicalRecordsTab t={t} patient={patientData} />}
        {activeTab === "prescriptions" && <PrescriptionsTab t={t} patient={patientData} />}
        {activeTab === "profiles" && <PatientProfilesTab t={t} patient={patientData} />}
        {activeTab === "ai_diagnosis" && <AiDiagnosisTab t={t} patient={patientData} />}
        {activeTab === "appointments" && <AppointmentsTab t={t} patient={patientData} />}
        {activeTab === "transactions" && <TransactionsTab t={t} patient={patientData} />}


        {/* {activeTab === "medical_records" && <div className="p-8 bg-white rounded-xl border border-[#E7E8EB] text-center text-[#6C7688]">Medical Records Tab Ready</div>} */}
        {/* {activeTab === "prescriptions" && <div className="p-8 bg-white rounded-xl border border-[#E7E8EB] text-center text-[#6C7688]">Prescriptions Tab Ready</div>} */}
        {/* {activeTab === "profiles" && <div className="p-8 bg-white rounded-xl border border-[#E7E8EB] text-center text-[#6C7688]">Patient Profiles Tab Ready</div>} */}
        {/* {activeTab === "ai_diagnosis" && <div className="p-8 bg-white rounded-xl border border-[#E7E8EB] text-center text-[#6C7688]">AI Diagnosis Tab Ready</div>} */}
        {/* {activeTab === "appointments" && <div className="p-8 bg-white rounded-xl border border-[#E7E8EB] text-center text-[#6C7688]">Appointments Tab Ready</div>} */}
        {/* {activeTab === "transactions" && <div className="p-8 bg-white rounded-xl border border-[#E7E8EB] text-center text-[#6C7688]">Transactions Tab Ready</div>} */}
      </div>

    </div>
  );
}
"use client";

import { useWorkspace } from "@/lib/useWorkspace";
import { api } from "@v1/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Edit2,
  HelpCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { EmployeeHeader } from "../../employee-header";

interface AddEmployeeFormData {
  // Step 1: Basic Information
  employeeNumberSeries: string;
  employeeNo: string;
  firstName: string;
  lastName: string;
  name: string;
  dateOfBirth: string;
  aadhaarNumber: string;
  gender: "Male" | "Female" | "Others";
  reportingManager: string;
  status: "Confirmed" | "Probation" | "Contract";
  dateOfJoining: string;
  referredBy: string;
  probationPeriod: string;
  confirmationDate: string;
  email: string;
  mobileNumber: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  fatherName: string;
  spouseName: string;
  allowEmployeeFillInfo: boolean;

  // Step 2: Employee Position
  division: string;
  costCenter: string;
  grade: string;
  designation: string;
  location: string;
  department: string;

  // Step 3: Statutory Info
  panNumber: string;
  includePf: boolean;
  pfNumber: string;
  uanNumber: string;
  includeEsi: boolean;
  esicNumber: string;
  includeLwf: boolean;

  // Step 4: Payment Mode
  paymentType: "Bank Transfer" | "Cash" | "Cheque" | "Demand Draft";
  bankAccountHolderName: string;
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  ifscCode: string;
  ddPayableAt: string;
}

const INITIAL_FORM_DATA: AddEmployeeFormData = {
  employeeNumberSeries: "GENERAL",
  employeeNo: "",
  firstName: "",
  lastName: "",
  name: "",
  dateOfBirth: "",
  aadhaarNumber: "",
  gender: "Male",
  reportingManager: "",
  status: "Probation",
  dateOfJoining: new Date().toISOString().split("T")[0] ?? "",
  referredBy: "",
  probationPeriod: "180",
  confirmationDate: "",
  email: "",
  mobileNumber: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  fatherName: "",
  spouseName: "",
  allowEmployeeFillInfo: false,

  division: "Corporate",
  costCenter: "General",
  grade: "Level 1",
  designation: "",
  location: "Bangalore",
  department: "",

  panNumber: "",
  includePf: true,
  pfNumber: "",
  uanNumber: "",
  includeEsi: false,
  esicNumber: "",
  includeLwf: false,

  paymentType: "Bank Transfer",
  bankAccountHolderName: "",
  bankName: "",
  bankBranch: "",
  accountNumber: "",
  ifscCode: "",
  ddPayableAt: "",
};

export default function AddEmployeeWizardPage() {
  const router = useRouter();
  const { current, workspaces } = useWorkspace();
  const effectiveWorkspaceId = current ?? workspaces[0]?._id;
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<AddEmployeeFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addEmployeeMutation = useMutation(api.employees.add);

  const updateField = (key: keyof AddEmployeeFormData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "name") {
        const parts = String(value).trim().split(" ");
        updated.firstName = parts[0] || "";
        updated.lastName = parts.slice(1).join(" ") || "Employee";
      }
      return updated;
    });
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        errs.name = "Please enter employee name!";
      }
      if (!formData.email.trim()) {
        errs.email = "Please enter employee email!";
      } else if (!formData.email.includes("@")) {
        errs.email = "Please enter a valid email address!";
      }
      if (!formData.employeeNo.trim()) {
        errs.employeeNo = "Please enter employee number!";
      }
      if (!formData.dateOfJoining) {
        errs.dateOfJoining = "Date of joining is required!";
      }
    } else if (step === 2) {
      if (!formData.designation.trim()) {
        errs.designation = "Please select or enter designation!";
      }
      if (!formData.department.trim()) {
        errs.department = "Please select or enter department!";
      }
    } else if (step === 3) {
      if (formData.panNumber.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.trim().toUpperCase())) {
        errs.panNumber = "Invalid PAN format (e.g. ABCDE1234F)!";
      }
    } else if (step === 4) {
      if (formData.paymentType === "Bank Transfer") {
        if (!formData.bankName.trim()) {
          errs.bankName = "Please select valid bank name!";
        }
        if (!formData.accountNumber.trim()) {
          errs.accountNumber = "Please enter bank account number!";
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as any);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (!effectiveWorkspaceId) {
      toast.error("No active workspace found.");
      return;
    }

    setIsSubmitting(true);
    try {
      const parts = formData.name.trim().split(" ");
      const fName = parts[0] || formData.firstName || "Employee";
      const lName = parts.slice(1).join(" ") || formData.lastName || "New";

      await addEmployeeMutation({
        workspaceId: effectiveWorkspaceId,
        firstName: fName,
        lastName: lName,
        email: formData.email.trim().toLowerCase(),
        phone: formData.mobileNumber.trim() || undefined,
        department: formData.department.trim() || undefined,
        designation: formData.designation.trim() || undefined,
        employeeIdNumber: formData.employeeNo.trim() ? formData.employeeNo.trim().toUpperCase() : undefined,
        joiningDate: formData.dateOfJoining.trim() || undefined,
        bankAccountHolderName: formData.name.trim() || undefined,
        bankName: formData.bankName.trim() || undefined,
        bankAccountNumber: formData.accountNumber.trim() || undefined,
        ifscCode: formData.ifscCode.trim() || undefined,
        pan: formData.panNumber.trim() ? formData.panNumber.trim().toUpperCase() : undefined,
        uan: formData.uanNumber.trim() || undefined,
        esicIpNumber: formData.esicNumber.trim() || undefined,
        pfMemberId: formData.pfNumber.trim() || undefined,
        isPfMember: formData.includePf,
        isEsiMember: formData.includeEsi,
      });

      toast.success("Employee added successfully!");
      router.push("/admin/employee/main/directory");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to add employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <EmployeeHeader currentCategory="admin" currentPageTitle="Add Employee" />

      <main className="max-w-[1240px] mx-auto py-6 px-4 sm:px-6">
        {/* Horizontal Progress Indicator */}
        <div className="relative mb-8 pt-4 pb-2">
          {/* Progress Connecting Line */}
          <div className="absolute top-[34px] left-[12%] right-[12%] h-[2px] bg-[#E2E8F0] -z-0" />

          <div className="grid grid-cols-4 relative z-10 text-center">
            {/* Step 1 */}
            <div
              onClick={() => setCurrentStep(1)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  currentStep === 1
                    ? "bg-[#00a854] ring-4 ring-[#d4edda] text-white"
                    : currentStep > 1
                    ? "bg-[#9cd69c] text-white"
                    : "bg-white border-2 border-[#CBD5E0] text-[#718096]"
                }`}
              >
                {currentStep > 1 ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
              <span
                className={`mt-2 text-[12px] font-bold tracking-wider uppercase ${
                  currentStep === 1
                    ? "text-[#0284C7]"
                    : currentStep > 1
                    ? "text-[#718096]"
                    : "text-[#A0AEC0]"
                }`}
              >
                BASIC INFORMATION
              </span>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => (currentStep > 2 || validateStep(1)) && setCurrentStep(2)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  currentStep === 2
                    ? "bg-[#00a854] ring-4 ring-[#d4edda] text-white"
                    : currentStep > 2
                    ? "bg-[#9cd69c] text-white"
                    : "bg-white border-2 border-[#CBD5E0] text-[#718096]"
                }`}
              >
                {currentStep > 2 ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      currentStep === 2 ? "bg-white" : "bg-transparent"
                    }`}
                  />
                )}
              </div>
              <span
                className={`mt-2 text-[12px] font-bold tracking-wider uppercase ${
                  currentStep === 2
                    ? "text-[#0284C7]"
                    : currentStep > 2
                    ? "text-[#718096]"
                    : "text-[#A0AEC0]"
                }`}
              >
                EMPLOYEE POSITION
              </span>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => (currentStep > 3 || (validateStep(1) && validateStep(2))) && setCurrentStep(3)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  currentStep === 3
                    ? "bg-[#00a854] ring-4 ring-[#d4edda] text-white"
                    : currentStep > 3
                    ? "bg-[#9cd69c] text-white"
                    : "bg-white border-2 border-[#CBD5E0] text-[#718096]"
                }`}
              >
                {currentStep > 3 ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      currentStep === 3 ? "bg-white" : "bg-transparent"
                    }`}
                  />
                )}
              </div>
              <span
                className={`mt-2 text-[12px] font-bold tracking-wider uppercase ${
                  currentStep === 3
                    ? "text-[#0284C7]"
                    : currentStep > 3
                    ? "text-[#718096]"
                    : "text-[#A0AEC0]"
                }`}
              >
                STATUTORY INFO
              </span>
            </div>

            {/* Step 4 */}
            <div
              onClick={() => (validateStep(1) && validateStep(2) && validateStep(3)) && setCurrentStep(4)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  currentStep === 4
                    ? "bg-[#00a854] ring-4 ring-[#d4edda] text-white"
                    : "bg-white border-2 border-[#CBD5E0] text-[#718096]"
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentStep === 4 ? "bg-white" : "bg-transparent"
                  }`}
                />
              </div>
              <span
                className={`mt-2 text-[12px] font-bold tracking-wider uppercase ${
                  currentStep === 4 ? "text-[#0284C7]" : "text-[#A0AEC0]"
                }`}
              >
                PAYMENT MODE
              </span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
          <h2 className="text-[17px] font-bold text-[#2D3748] mb-6">
            Step {currentStep}:{" "}
            {currentStep === 1
              ? "Basic Information"
              : currentStep === 2
              ? "Employee Position"
              : currentStep === 3
              ? "Statutory Info"
              : "Payment Mode"}
          </h2>

          {/* ═══════════ STEP 1: BASIC INFORMATION ═══════════ */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 text-sm">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Employee Number Series */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right sm:text-right pr-2">
                    Employee Number Series
                  </label>
                  <div className="sm:col-span-2">
                    <select
                      value={formData.employeeNumberSeries}
                      onChange={(e) => updateField("employeeNumberSeries", e.target.value)}
                      className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm bg-white focus:outline-none focus:border-[#0284C7]"
                    >
                      <option value="GENERAL">---Select---</option>
                      <option value="EMP">EMP (Standard Series)</option>
                    </select>
                    <Link
                      href="/admin/system-settings/employee/emp-no-series"
                      className="text-xs text-[#0284C7] hover:underline mt-1 inline-block"
                    >
                      Manage Employee Number Series
                    </Link>
                  </div>
                </div>

                {/* Employee No */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Employee No <span className="text-red-500">*</span>
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.employeeNo}
                      onChange={(e) => updateField("employeeNo", e.target.value)}
                      placeholder="e.g. EMP001"
                      className={`w-full h-9 rounded border px-3 text-sm focus:outline-none ${
                        errors.employeeNo ? "border-red-500 bg-red-50" : "border-[#CBD5E0] focus:border-[#0284C7]"
                      }`}
                    />
                    {errors.employeeNo && (
                      <span className="text-xs text-red-500">{errors.employeeNo}</span>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g. John Doe"
                      className={`w-full h-9 rounded border px-3 text-sm focus:outline-none ${
                        errors.name ? "border-red-500 bg-red-50" : "border-[#CBD5E0] focus:border-[#0284C7]"
                      }`}
                    />
                    {errors.name && (
                      <span className="text-xs text-red-500">{errors.name}</span>
                    )}
                  </div>
                </div>

                {/* Date Of Birth */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Date Of Birth
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField("dateOfBirth", e.target.value)}
                      className="w-full sm:w-44 h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                {/* Aadhaar Number */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Aadhaar Number
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      maxLength={12}
                      value={formData.aadhaarNumber}
                      onChange={(e) => updateField("aadhaarNumber", e.target.value)}
                      placeholder="12-digit Aadhaar"
                      className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="sm:col-span-2 flex items-center gap-4">
                    {(["Male", "Female", "Others"] as const).map((g) => (
                      <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          checked={formData.gender === g}
                          onChange={() => updateField("gender", g)}
                          className="accent-[#00a854]"
                        />
                        <span>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Reporting Manager */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Reporting Manager
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.reportingManager}
                      onChange={(e) => updateField("reportingManager", e.target.value)}
                      placeholder="Select Manager"
                      className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Status
                  </label>
                  <div className="sm:col-span-2">
                    <select
                      value={formData.status}
                      onChange={(e) => updateField("status", e.target.value as any)}
                      className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm bg-white focus:outline-none focus:border-[#0284C7]"
                    >
                      <option value="Probation">Probation</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                </div>

                {/* Date Of Joining */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Date Of Joining <span className="text-red-500">*</span>
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="date"
                      value={formData.dateOfJoining}
                      onChange={(e) => updateField("dateOfJoining", e.target.value)}
                      className={`w-full sm:w-44 h-9 rounded border px-3 text-sm focus:outline-none ${
                        errors.dateOfJoining ? "border-red-500 bg-red-50" : "border-[#CBD5E0] focus:border-[#0284C7]"
                      }`}
                    />
                  </div>
                </div>

                {/* Referred By */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Referred By
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.referredBy}
                      onChange={(e) => updateField("referredBy", e.target.value)}
                      placeholder="Referred employee name"
                      className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                {/* Allow employee to fill info checkbox */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <div className="sm:col-start-2 sm:col-span-2">
                    <label className="flex items-start gap-2 cursor-pointer text-xs text-[#4A5568]">
                      <input
                        type="checkbox"
                        checked={formData.allowEmployeeFillInfo}
                        onChange={(e) => updateField("allowEmployeeFillInfo", e.target.checked)}
                        className="accent-[#00a854] mt-0.5"
                      />
                      <span>Allow the employee to fill in their information</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Probation Period */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Probation Period
                  </label>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.probationPeriod}
                      onChange={(e) => updateField("probationPeriod", e.target.value)}
                      className="w-24 h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                    <span className="text-[#718096]">Days</span>
                  </div>
                </div>

                {/* Confirmation Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Confirmation Date
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="date"
                      value={formData.confirmationDate}
                      onChange={(e) => updateField("confirmationDate", e.target.value)}
                      className="w-full sm:w-44 h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="e.g. employee@company.com"
                      className={`w-full h-9 rounded border px-3 text-sm focus:outline-none ${
                        errors.email ? "border-red-500 bg-red-50" : "border-[#CBD5E0] focus:border-[#0284C7]"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500">{errors.email}</span>
                    )}
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Mobile Number
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => updateField("mobileNumber", e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                {/* Emergency Contact Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Emergency Contact Name
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => updateField("emergencyContactName", e.target.value)}
                      className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                {/* Emergency Contact Number */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Emergency Contact Number
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="tel"
                      value={formData.emergencyContactNumber}
                      onChange={(e) => updateField("emergencyContactNumber", e.target.value)}
                      className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                {/* Father's Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Father's name
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => updateField("fatherName", e.target.value)}
                      className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                {/* Spouse Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    Spouse Name
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.spouseName}
                      onChange={(e) => updateField("spouseName", e.target.value)}
                      className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ STEP 2: EMPLOYEE POSITION ═══════════ */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto space-y-4 text-sm py-4">
              {/* Division */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                <label className="text-[#4A5568] font-medium text-right pr-2">
                  Division
                </label>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <select
                    value={formData.division}
                    onChange={(e) => updateField("division", e.target.value)}
                    className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm bg-white focus:outline-none focus:border-[#0284C7]"
                  >
                    <option value="Corporate">Corporate</option>
                    <option value="Operations">Operations</option>
                    <option value="Technology">Technology</option>
                  </select>
                  <button type="button" className="text-[#718096] hover:text-[#0284C7]">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cost Center */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                <label className="text-[#4A5568] font-medium text-right pr-2">
                  Cost Center
                </label>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <select
                    value={formData.costCenter}
                    onChange={(e) => updateField("costCenter", e.target.value)}
                    className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm bg-white focus:outline-none focus:border-[#0284C7]"
                  >
                    <option value="General">General</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Administration">Administration</option>
                  </select>
                  <button type="button" className="text-[#718096] hover:text-[#0284C7]">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                <label className="text-[#4A5568] font-medium text-right pr-2">
                  Grade
                </label>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <select
                    value={formData.grade}
                    onChange={(e) => updateField("grade", e.target.value)}
                    className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm bg-white focus:outline-none focus:border-[#0284C7]"
                  >
                    <option value="Level 1">Level 1</option>
                    <option value="Level 2">Level 2</option>
                    <option value="Executive">Executive</option>
                    <option value="Senior Executive">Senior Executive</option>
                  </select>
                  <button type="button" className="text-[#718096] hover:text-[#0284C7]">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                <label className="text-[#4A5568] font-medium text-right pr-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => updateField("designation", e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className={`w-full h-9 rounded border px-3 text-sm focus:outline-none ${
                      errors.designation ? "border-red-500 bg-red-50" : "border-[#CBD5E0] focus:border-[#0284C7]"
                    }`}
                  />
                  <button type="button" className="text-[#718096] hover:text-[#0284C7]">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                <label className="text-[#4A5568] font-medium text-right pr-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <select
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm bg-white focus:outline-none focus:border-[#0284C7]"
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                  <button type="button" className="text-[#718096] hover:text-[#0284C7]">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Department */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                <label className="text-[#4A5568] font-medium text-right pr-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => updateField("department", e.target.value)}
                    placeholder="e.g. Engineering"
                    className={`w-full h-9 rounded border px-3 text-sm focus:outline-none ${
                      errors.department ? "border-red-500 bg-red-50" : "border-[#CBD5E0] focus:border-[#0284C7]"
                    }`}
                  />
                  <button type="button" className="text-[#718096] hover:text-[#0284C7]">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ STEP 3: STATUTORY INFO ═══════════ */}
          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto space-y-5 text-sm py-4">
              {/* PAN Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                <label className="text-[#4A5568] font-medium text-right pr-2">
                  PAN Number
                </label>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.panNumber}
                    onChange={(e) => updateField("panNumber", e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    className={`w-full h-9 rounded border px-3 text-sm focus:outline-none ${
                      errors.panNumber ? "border-red-500 bg-red-50" : "border-[#CBD5E0] focus:border-[#0284C7]"
                    }`}
                  />
                  {errors.panNumber && (
                    <span className="text-xs text-red-500 mt-1 block">{errors.panNumber}</span>
                  )}
                </div>
              </div>

              {/* Checkboxes row: Include PF, Include ESI, Include LWF */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                <div className="sm:col-start-2 sm:col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#4A5568]">
                    <input
                      type="checkbox"
                      checked={formData.includePf}
                      onChange={(e) => updateField("includePf", e.target.checked)}
                      className="accent-[#00a854]"
                    />
                    <span>Include PF</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#4A5568]">
                    <input
                      type="checkbox"
                      checked={formData.includeEsi}
                      onChange={(e) => updateField("includeEsi", e.target.checked)}
                      className="accent-[#00a854]"
                    />
                    <span>Include ESI</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#4A5568]">
                    <input
                      type="checkbox"
                      checked={formData.includeLwf}
                      onChange={(e) => updateField("includeLwf", e.target.checked)}
                      className="accent-[#00a854]"
                    />
                    <span>Include LWF</span>
                  </label>
                </div>
              </div>

              {/* PF Details */}
              {formData.includePf && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-start gap-3">
                    <label className="text-[#4A5568] font-medium text-right pr-2 pt-2">
                      PF Number
                    </label>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={formData.pfNumber}
                        onChange={(e) => updateField("pfNumber", e.target.value)}
                        placeholder="__/____/____/____"
                        className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                      />
                      <p className="text-[11px] text-[#718096] mt-1 leading-relaxed">
                        Format : (Region Code/Office Code/Est Code/Extn No/Member Acc No) Example: HR/FBD/0003256/000/0000125.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                    <label className="text-[#4A5568] font-medium text-right pr-2">
                      UAN Number
                    </label>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        maxLength={12}
                        value={formData.uanNumber}
                        onChange={(e) => updateField("uanNumber", e.target.value)}
                        placeholder="12-digit UAN"
                        className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ESI Details */}
              {formData.includeEsi && (
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                  <label className="text-[#4A5568] font-medium text-right pr-2">
                    ESIC IP Number
                  </label>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      maxLength={17}
                      value={formData.esicNumber}
                      onChange={(e) => updateField("esicNumber", e.target.value)}
                      placeholder="17-digit ESIC IP number"
                      className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════ STEP 4: PAYMENT MODE ═══════════ */}
          {currentStep === 4 && (
            <div className="max-w-2xl mx-auto space-y-4 text-sm py-4">
              {/* Payment Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                <label className="text-[#4A5568] font-medium text-right pr-2">
                  Payment Type
                </label>
                <div className="sm:col-span-2">
                  <select
                    value={formData.paymentType}
                    onChange={(e) => updateField("paymentType", e.target.value as any)}
                    className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm bg-white focus:outline-none focus:border-[#0284C7]"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Demand Draft">Demand Draft</option>
                  </select>
                </div>
              </div>

              {/* Bank Transfer fields */}
              {formData.paymentType === "Bank Transfer" && (
                <>
                  {/* Bank Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                    <label className="text-[#4A5568] font-medium text-right pr-2">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <select
                        value={formData.bankName}
                        onChange={(e) => updateField("bankName", e.target.value)}
                        className={`w-full h-9 rounded border px-3 text-sm bg-white focus:outline-none ${
                          errors.bankName ? "border-red-500" : "border-[#CBD5E0] focus:border-[#0284C7]"
                        }`}
                      >
                        <option value="">---Select---</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                      <button type="button" className="text-[#718096] hover:text-[#0284C7]">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {errors.bankName && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-start-2 sm:col-span-2 text-xs text-red-500">
                        {errors.bankName}
                      </div>
                    </div>
                  )}

                  {/* Bank Branch */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                    <label className="text-[#4A5568] font-medium text-right pr-2">
                      Bank Branch
                    </label>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <select
                        value={formData.bankBranch}
                        onChange={(e) => updateField("bankBranch", e.target.value)}
                        className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm bg-white focus:outline-none focus:border-[#0284C7]"
                      >
                        <option value="">---Select---</option>
                        <option value="Main Branch">Main Branch</option>
                        <option value="Indiranagar">Indiranagar</option>
                        <option value="Koramangala">Koramangala</option>
                      </select>
                      <button type="button" className="text-[#718096] hover:text-[#0284C7]">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                    <label className="text-[#4A5568] font-medium text-right pr-2">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => updateField("accountNumber", e.target.value)}
                        placeholder="Account Number"
                        className={`w-full h-9 rounded border px-3 text-sm focus:outline-none ${
                          errors.accountNumber ? "border-red-500 bg-red-50" : "border-[#CBD5E0] focus:border-[#0284C7]"
                        }`}
                      />
                      {errors.accountNumber && (
                        <span className="text-xs text-red-500">{errors.accountNumber}</span>
                      )}
                    </div>
                  </div>

                  {/* IFSC Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                    <label className="text-[#4A5568] font-medium text-right pr-2">
                      IFSC Code
                    </label>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={formData.ifscCode}
                        onChange={(e) => updateField("ifscCode", e.target.value.toUpperCase())}
                        placeholder="e.g. HDFC0001234"
                        className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Demand Draft fields */}
              {formData.paymentType === "Demand Draft" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                    <label className="text-[#4A5568] font-medium text-right pr-2">
                      Bank Name
                    </label>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => updateField("bankName", e.target.value)}
                        placeholder="Bank Name"
                        className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                    <label className="text-[#4A5568] font-medium text-right pr-2">
                      DD Payable At
                    </label>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={formData.ddPayableAt}
                        onChange={(e) => updateField("ddPayableAt", e.target.value)}
                        placeholder="City / Branch"
                        className="w-full h-9 rounded border border-[#CBD5E0] px-3 text-sm focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══════════ ACTION BUTTONS BAR ═══════════ */}
          <div className="mt-8 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center gap-1.5 h-9 px-4 rounded border border-[#CBD5E0] bg-white text-sm font-medium text-[#4A5568] hover:bg-[#F7FAFC] transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/employee/main/directory"
                className="h-9 px-4 rounded border border-[#CBD5E0] bg-white text-sm font-medium text-[#4A5568] hover:bg-[#F7FAFC] transition flex items-center justify-center"
              >
                Cancel
              </Link>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 h-9 px-5 rounded bg-[#0284C7] text-white text-sm font-medium hover:bg-[#0369A1] transition shadow-xs"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 h-9 px-6 rounded bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1D4ED8] disabled:opacity-50 transition shadow-xs"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

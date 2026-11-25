"use client";

import { api } from "@v1/backend/convex/_generated/api";
import type { Id } from "@v1/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  Clock,
  FileText,
  KeyRound,
  Loader2,
  RefreshCw,
  Shield,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AdminTopbar } from "../../admin-topbar";
import { ChangePasswordModal } from "./change-password-modal";
import { EditInfoModal } from "./edit-info-modal";
import { LoginHistoryTab } from "./login-history-tab";

export default function MyProfileSettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab =
    searchParams.get("tab") === "login-history" ? "login-history" : "profile";

  const [activeTab, setActiveTab] = useState<"profile" | "login-history">(
    initialTab,
  );

  // Synchronize URL tab parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "login-history" || tabParam === "profile") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: "profile" | "login-history") => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  };

  const user = useQuery(api.users.getUser);

  // Modals state
  const [editInfoOpen, setEditInfoOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // Image Upload Handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateUserImage = useMutation(api.users.updateUserImage);
  const removeUserImage = useMutation(api.users.removeUserImage);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format: JPG, JPEG, PNG
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setImageError("Only .jpg, .jpeg, and .png files are accepted.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5MB.");
      return;
    }

    setImageError(null);
    setUploadingImage(true);

    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      await updateUserImage({ imageId: storageId as Id<"_storage"> });
    } catch (err) {
      console.error("Failed to upload image:", err);
      setImageError("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    setUploadingImage(true);
    try {
      await removeUserImage({});
    } catch (err) {
      console.error("Failed to remove photo:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Dynamic user data
  type UserProfile = {
    name?: string;
    username?: string;
    email?: string;
    image?: string;
    timezone?: string;
    biography?: string;
    avatarUrl?: string;
  };

  const userProfile = user as unknown as UserProfile | undefined;
  const displayName =
    userProfile?.name ||
    userProfile?.username ||
    "Javeria";
  const displayEmail =
    userProfile?.email ||
    "fatheema@networkershome.com";
  const displayTimezone = userProfile?.timezone || "-";
  const displayBiography = userProfile?.biography || "-";
  const avatarUrl = userProfile?.avatarUrl || userProfile?.image;

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-800 antialiased select-none pb-20">
      <AdminTopbar />

      <main className="mx-auto max-w-5xl px-6 py-6">
        {/* Breadcrumb matching greytHR: Home > My profile */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
          <button
            type="button"
            className="hover:text-slate-700 cursor-pointer"
            onClick={() => router.push("/admin")}
          >
            Home
          </button>
          <span className="text-slate-400">&gt;</span>
          <span className="text-slate-800">My profile</span>
        </div>

        {/* Tab Navigation: Profile | Login History */}
        <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "profile"}
            onClick={() => handleTabChange("profile")}
            className={`relative pb-3 text-sm font-bold transition ${
              activeTab === "profile"
                ? "text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Profile
            {activeTab === "profile" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "login-history"}
            onClick={() => handleTabChange("login-history")}
            className={`relative pb-3 text-sm font-bold transition ${
              activeTab === "login-history"
                ? "text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Login History
            {activeTab === "login-history" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab 1: Profile */}
        {activeTab === "profile" && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-bold text-slate-900">
                Account Details
              </h2>
            </div>

            <div className="p-6">
              {/* Profile Image & Upload Section */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-slate-100">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden text-slate-400 shadow-inner">
                  {uploadingImage ? (
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  ) : avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-slate-300" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                    >
                      <Upload className="h-3.5 w-3.5 text-slate-500" />
                      <span>Upload</span>
                    </button>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={uploadingImage}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Accepts .jpg, .jpeg, .png files
                  </p>
                  {imageError && (
                    <p className="text-[11px] font-semibold text-red-600">
                      {imageError}
                    </p>
                  )}
                </div>
              </div>

              {/* Information Grid: Name, Email Address, Timezone, Biography */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 py-6 text-xs border-b border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-500 mb-1">
                    Name
                  </label>
                  <p className="font-bold text-slate-900 text-sm">
                    {displayName}
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 mb-1">
                    Email Address
                  </label>
                  <p className="font-bold text-slate-900 text-sm">
                    {displayEmail}
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 mb-1">
                    Timezone
                  </label>
                  <p className="font-bold text-slate-900 text-sm">
                    {displayTimezone}
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 mb-1">
                    Biography
                  </label>
                  <p className="font-bold text-slate-900 text-sm whitespace-pre-wrap">
                    {displayBiography}
                  </p>
                </div>
              </div>

              {/* Bottom Actions: Change Password | Edit Info */}
              <div className="flex items-center justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setChangePasswordOpen(true)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                  Change Password
                </button>

                <button
                  type="button"
                  onClick={() => setEditInfoOpen(true)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-sm"
                >
                  Edit Info
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Login History */}
        {activeTab === "login-history" && <LoginHistoryTab />}
      </main>

      {/* Edit Info Modal */}
      <EditInfoModal
        isOpen={editInfoOpen}
        onClose={() => setEditInfoOpen(false)}
        initialData={{
          name: displayName,
          email: displayEmail,
          timezone: displayTimezone !== "-" ? displayTimezone : undefined,
          biography: displayBiography !== "-" ? displayBiography : undefined,
        }}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        userEmail={displayEmail}
      />
    </div>
  );
}

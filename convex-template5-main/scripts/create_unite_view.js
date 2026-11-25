const fs = require('fs');

const content = `"use client";

import { useState } from "react";
import {
  Search,
  Star,
  CheckCircle2,
  Bell,
  Clock,
  Sparkles,
  ArrowUpDown,
  X,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UniteHeader } from "./unite-header";
import { PromotionalCarousel } from "./promotional-carousel";
import { BookDemoModal } from "./book-demo-modal";
import { TakeTourModal } from "./take-tour-modal";
import { AppDetailsModal, type MarketplaceAppDetailsItem } from "./app-details-modal";

const CATEGORIES = [
  "All",
  "Background Verification",
  "Corporate Gifting",
  "Advance Salary",
  "Connectors",
  "Corporate Insurance",
  "Digital Lending",
  "Employee Engagement",
  "Flexible Benefits",
  "Learning & Development",
  "Recruitment",
  "Relocation",
  "Rewards & Recognition",
  "Tax",
  "Wellness",
];

export function UniteMarketplaceView() {
  const [activeTab, setActiveTab] = useState<"all" | "my_apps" | "notifications">("all");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"a_z" | "z_a" | "popular">("a_z");

  const [bookDemoOpen, setBookDemoOpen] = useState(false);
  const [takeTourOpen, setTakeTourOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<MarketplaceAppDetailsItem | null>(null);

  const workspaces = useQuery(api.workspaces.listWorkspaces);
  const currentWorkspace = workspaces?.[0];
  const workspaceId = currentWorkspace?._id as Id<"workspaces"> | undefined;

  const catalogApps = useQuery(
    api.marketplace.getCatalog,
    workspaceId
      ? {
          workspaceId,
          category: selectedCategory === "All" ? undefined : selectedCategory,
          search: searchQuery.trim() || undefined,
          sort: sortOption,
        }
      : "skip"
  );

  const myApps = useQuery(
    api.marketplace.getMyApps,
    workspaceId ? { workspaceId } : "skip"
  );

  const interestedApps = useQuery(
    api.marketplace.getInterestedApps,
    workspaceId ? { workspaceId } : "skip"
  );

  const notifications = useQuery(
    api.marketplace.getNotifications,
    workspaceId ? { workspaceId } : "skip"
  );

  const toggleInterested = useMutation(api.marketplace.toggleInterestedApp);
  const markNotificationRead = useMutation(api.marketplace.markNotificationAsRead);
  const markAllRead = useMutation(api.marketplace.markAllNotificationsAsRead);

  const handleToggleInterested = async (appId: string) => {
    if (!workspaceId) return;
    try {
      await toggleInterested({ workspaceId, appId });
    } catch (err) {
      console.error("Failed to toggle interested app:", err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!workspaceId) return;
    try {
      await markAllRead({ workspaceId });
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  };

  const getAppStatus = (appId: string) => {
    const found = myApps?.find((m) => m.appId === appId);
    return found?.status ?? "available";
  };

  const isAppInterested = (appId: string) => {
    return Boolean(interestedApps?.some((a) => a.appId === appId));
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F6F9] text-slate-800 antialiased select-none pb-20">
      <UniteHeader
        onBookDemoClick={() => setBookDemoOpen(true)}
        onTakeTourClick={() => setTakeTourOpen(true)}
      />

      <main className="mx-auto max-w-[1440px] px-6 py-6">
        <div className="relative rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <h1 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
                Welcome to Unite by IndiaPay
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
              Suite of third-party products and services curated specially for you and your employees. Discover, request, and integrate background checks, advance salary, corporate insurance, and ERP connectors with automated sync.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setTakeTourOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Take A Tour</span>
            </button>
            <button
              type="button"
              onClick={() => setBookDemoOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm active:scale-95"
            >
              <span>Book A Demo</span>
            </button>
          </div>
        </div>

        <PromotionalCarousel onExploreClick={() => setSelectedCategory("Background Verification")} />

        {interestedApps && interestedApps.length > 0 && activeTab === "all" && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Interested Apps ({interestedApps.length})
                </h3>
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                  Saved for You
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {interestedApps.map((app) => (
                <div
                  key={app.appId}
                  className="rounded-xl bg-white p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {app.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleInterested(app.appId)}
                        title="Remove from Interested"
                        className="text-slate-400 hover:text-rose-500 transition"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-black text-base text-blue-700">
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{app.name}</h4>
                        <p className="text-[11px] text-slate-500">{app.provider}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {app.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{app.rating.toFixed(1)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedApp(app as any)}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Explore Apps that you can&apos;t miss!
            </h2>
            <p className="text-xs text-slate-500">
              Discover verified enterprise integrations built for Indian statutory and workforce workflows.
            </p>
          </div>

          <div className="flex items-center rounded-xl bg-slate-200/80 p-1 text-xs font-bold self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-4 py-1.5 transition ${
                activeTab === "all"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Apps ({catalogApps?.length ?? 27})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("my_apps")}
              className={`rounded-lg px-4 py-1.5 transition ${
                activeTab === "my_apps"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              My Apps ({myApps?.length ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`relative rounded-lg px-4 py-1.5 transition ${
                activeTab === "notifications"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Notifications</span>
              {notifications && notifications.filter((n) => !n.isRead).length > 0 && (
                <span className="ml-1.5 rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "all" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by app, provider, feature, or keyword..."
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 shrink-0">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                <span>Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="a_z">A - Z</option>
                  <option value="z_a">Z - A</option>
                  <option value="popular">Most Popular</option>
                </select>

                {selectedCategory !== "All" && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("All")}
                    className="ml-2 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mb-6 pb-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {!catalogApps ? (
              <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-white border border-slate-200">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="text-xs font-semibold text-slate-500">Loading catalog...</span>
                </div>
              </div>
            ) : catalogApps.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center border border-slate-200">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">No applications found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  No marketplace apps match &quot;{searchQuery}&quot; under &quot;{selectedCategory}&quot;. Try resetting your filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="rounded-lg bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                >
                  Reset Search & Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {catalogApps.map((app) => {
                  const status = getAppStatus(app.appId);
                  const interested = isAppInterested(app.appId);

                  return (
                    <div
                      key={app.appId}
                      className="group rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                            {app.category}
                          </span>
                          {app.offerBadge && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                              {app.offerBadge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-start gap-3.5 mb-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 font-black text-lg text-blue-700 border border-blue-100/80">
                            {app.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition leading-snug">
                              {app.name}
                            </h3>
                            <p className="text-[11px] font-semibold text-slate-500">{app.provider}</p>
                            <div className="flex items-center gap-1.5 mt-1 text-xs">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-slate-700">{app.rating.toFixed(1)}/5</span>
                              <span className="text-[10px] text-slate-400">({app.ratingCount})</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                          {app.tagline}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {app.supportedFeatures.slice(0, 2).map((feat, i) => (
                            <span
                              key={i}
                              className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-100"
                            >
                              ✓ {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          {status === "active" || status === "installed" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Active</span>
                            </span>
                          ) : status === "pending_approval" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                              <Clock className="h-3 w-3" />
                              <span>Requested</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleInterested(app.appId)}
                              className="text-[11px] font-semibold text-slate-400 hover:text-amber-500 transition"
                            >
                              {interested ? "★ Saved" : "☆ Save"}
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedApp(app as any)}
                          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition active:scale-95"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "my_apps" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Installed & Requested Applications ({myApps?.length ?? 0})
                </h3>
                <p className="text-xs text-slate-500">
                  Track the lifecycle of third-party integrations across your organization.
                </p>
              </div>
            </div>

            {!myApps || myApps.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center border border-slate-200">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">No Applications Requested Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Explore our curated catalog of 27 verified enterprise apps and request access for your organization.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  Browse All Apps
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myApps.map((orgApp) => (
                  <div
                    key={orgApp._id}
                    className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                          {orgApp.app?.category ?? "Integration"}
                        </span>
                        {orgApp.status === "active" || orgApp.status === "installed" ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                            Installed & Active
                          </span>
                        ) : orgApp.status === "pending_approval" ? (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                            Pending Approval
                          </span>
                        ) : orgApp.status === "approved" ? (
                          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                            Approved (Ready to Config)
                          </span>
                        ) : (
                          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800">
                            Declined
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-black text-base text-blue-700">
                          {orgApp.app?.name?.charAt(0) ?? "A"}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{orgApp.app?.name ?? orgApp.appId}</h4>
                          <p className="text-[11px] text-slate-500">{orgApp.app?.provider}</p>
                        </div>
                      </div>

                      {orgApp.requestReason && (
                        <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 text-xs text-slate-600 mb-3">
                          <span className="font-semibold text-slate-700">Justification:</span> &ldquo;{orgApp.requestReason}&rdquo;
                        </div>
                      )}

                      <div className="text-[11px] text-slate-400 space-y-0.5 mb-2">
                        {orgApp.requestedAt && (
                          <p>Requested: {new Date(orgApp.requestedAt).toLocaleDateString()}</p>
                        )}
                        {orgApp.contactEmail && (
                          <p>Contact: {orgApp.contactEmail}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-semibold">
                        Type: {orgApp.app?.integrationType ?? "Enterprise"}
                      </span>
                      {orgApp.app && (
                        <button
                          type="button"
                          onClick={() => setSelectedApp(orgApp.app as any)}
                          className="rounded-lg bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                        >
                          Manage App
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Marketplace Notifications</h3>
                <p className="text-xs text-slate-500">Real-time alerts for application approvals, requests, and updates.</p>
              </div>
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
              >
                Mark all as read
              </button>
            </div>

            {!notifications || notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p className="text-xs font-medium">No marketplace notifications yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((note) => (
                  <div
                    key={note._id}
                    className={`py-3.5 flex items-start justify-between gap-4 transition ${
                      !note.isRead ? "bg-blue-50/30 px-3 rounded-xl" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          note.type === "request_approved"
                            ? "bg-emerald-100 text-emerald-600"
                            : note.type === "request_rejected"
                            ? "bg-rose-100 text-rose-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <Bell className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{note.title}</h4>
                          {!note.isRead && (
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{note.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {!note.isRead && (
                      <button
                        type="button"
                        onClick={() => markNotificationRead({ workspaceId: note.workspaceId, notificationId: note._id })}
                        className="text-[11px] font-semibold text-blue-600 hover:underline shrink-0"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {workspaceId && (
        <>
          <BookDemoModal
            isOpen={bookDemoOpen}
            onClose={() => setBookDemoOpen(false)}
            workspaceId={workspaceId}
          />

          <TakeTourModal
            isOpen={takeTourOpen}
            onClose={() => setTakeTourOpen(false)}
            workspaceId={workspaceId}
          />

          <AppDetailsModal
            isOpen={Boolean(selectedApp)}
            onClose={() => setSelectedApp(null)}
            app={selectedApp}
            workspaceId={workspaceId}
            currentStatus={selectedApp ? getAppStatus(selectedApp.appId) : "available"}
            isInterested={selectedApp ? isAppInterested(selectedApp.appId) : false}
            onToggleInterested={handleToggleInterested}
          />
        </>
      )}
    </div>
  );
}
`;

fs.writeFileSync("C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/unite-marketplace-view.tsx", content, "utf8");
console.log("Successfully created unite-marketplace-view.tsx");

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownSmall } from "@/components/ui/icons/dashboard-icons";
import { Globe, Map, Navigation, Compass, Network, Loader2, AlertCircle } from "lucide-react";
import { AdminLocationsService } from "@/lib/admin-locations";
import { LocationEntity } from "@/types/admin-locations";
import { getApiErrorMessage } from "@/lib/error-utils";

/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */

type LevelType = "country" | "city" | "region" | "district";

interface TreeNodeData extends LocationEntity {
  level_type: LevelType;
}

interface NodeState {
  isOpen: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  children: TreeNodeData[];
  error: string | null;
}

/* ─────────────────────────────────────────────────────────────────
   Level visual config
───────────────────────────────────────────────────────────────── */

const LEVEL_CONFIG: Record<LevelType, {
  icon: React.ElementType;
  label: string;
  color: string;
  bg: string;
  activeBorder: string;
  badgeBg: string;
  badgeText: string;
  connectorColor: string;
}> = {
  country: {
    icon: Globe,
    label: "Country",
    color: "text-[#2E37A4]",
    bg: "bg-[#F8F9FF]",
    activeBorder: "border-[#2E37A4]",
    badgeBg: "bg-[#E0E2F4]",
    badgeText: "text-[#2E37A4]",
    connectorColor: "bg-[#2E37A4]/30",
  },
  city: {
    icon: Map,
    label: "City",
    color: "text-[#27AE60]",
    bg: "bg-white",
    activeBorder: "border-[#27AE60]",
    badgeBg: "bg-[#F0FDF4]",
    badgeText: "text-[#27AE60]",
    connectorColor: "bg-[#27AE60]/30",
  },
  region: {
    icon: Navigation,
    label: "Region",
    color: "text-[#F2994A]",
    bg: "bg-[#FAFBFC]",
    activeBorder: "border-[#F2994A]",
    badgeBg: "bg-[#FFF9F2]",
    badgeText: "text-[#F2994A]",
    connectorColor: "bg-[#F2994A]/30",
  },
  district: {
    icon: Compass,
    label: "District",
    color: "text-[#6C7688]",
    bg: "bg-white",
    activeBorder: "border-[#C5CAD5]",
    badgeBg: "bg-[#F5F6F8]",
    badgeText: "text-[#6C7688]",
    connectorColor: "bg-[#E7E8EB]",
  },
};

const CHILD_LEVEL: Partial<Record<LevelType, LevelType>> = {
  country: "city",
  city: "region",
  region: "district",
};

/* ─────────────────────────────────────────────────────────────────
   API fetcher: uses the CORRECT specific endpoints
   country  → getCities(id)
   city     → getRegions(id)
   region   → getDistricts(id)
   district → no children
───────────────────────────────────────────────────────────────── */

async function loadChildren(node: TreeNodeData, lang: "ar" | "en"): Promise<TreeNodeData[]> {
  const id = node.id!;
  let res;

  switch (node.level_type) {
    case "country":
      res = await AdminLocationsService.getCities(id, lang);
      break;
    case "city":
      res = await AdminLocationsService.getRegions(id, lang);
      break;
    case "region":
      res = await AdminLocationsService.getDistricts(id, lang);
      break;
    default:
      return [];
  }

  if (res.success && Array.isArray(res.data)) {
    return res.data as TreeNodeData[];
  }
  return [];
}

/* ─────────────────────────────────────────────────────────────────
   TreeNode — lazy-loads children on first expand
───────────────────────────────────────────────────────────────── */

interface TreeNodeProps {
  node: TreeNodeData;
  lang: "ar" | "en";
  t: Record<string, any>;
  globalExpand: number;   // bumped when "Expand All" is clicked
  globalCollapse: number; // bumped when "Collapse All" is clicked
  depth?: number;
}

function TreeNode({ node, lang, t, globalExpand, globalCollapse, depth = 0 }: TreeNodeProps) {
  const cfg = LEVEL_CONFIG[node.level_type] ?? LEVEL_CONFIG.district;
  const Icon = cfg.icon;
  const hasChildren = node.level_type !== "district";

  const [state, setState] = useState<NodeState>({
    isOpen: false,
    isLoading: false,
    isLoaded: false,
    children: [],
    error: null,
  });

  const prevExpand = useRef(globalExpand);
  const prevCollapse = useRef(globalCollapse);

  /* ── helpers ── */
  const doLoadChildren = useCallback(async () => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const kids = await loadChildren(node, lang);
      setState(s => ({ ...s, isLoading: false, isLoaded: true, children: kids }));
    } catch (err) {
      setState(s => ({
        ...s,
        isLoading: false,
        isLoaded: true,
        error: getApiErrorMessage(err, lang) || "Failed to load",
      }));
    }
  }, [node, lang]);

  /* ── global expand signal ── */
  useEffect(() => {
    if (globalExpand !== prevExpand.current) {
      prevExpand.current = globalExpand;
      if (!hasChildren) return;
      setState(s => ({ ...s, isOpen: true }));
      setState(s => {
        if (!s.isLoaded && !s.isLoading) {
          doLoadChildren();
        }
        return s;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalExpand]);

  /* ── global collapse signal ── */
  useEffect(() => {
    if (globalCollapse !== prevCollapse.current) {
      prevCollapse.current = globalCollapse;
      setState(s => ({ ...s, isOpen: false }));
    }
  }, [globalCollapse]);

  /* ── user click ── */
  const handleToggle = useCallback(async () => {
    if (!hasChildren) return;
    const willOpen = !state.isOpen;
    setState(s => ({ ...s, isOpen: willOpen }));
    if (willOpen && !state.isLoaded && !state.isLoading) {
      await doLoadChildren();
    }
  }, [hasChildren, state.isOpen, state.isLoaded, state.isLoading, doLoadChildren]);

  const displayName = lang === "ar" ? node.name_ar : node.name_en;
  const altName    = lang === "ar" ? node.name_en : node.name_ar;
  const isLeaf = !hasChildren;

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-200">

      {/* ── Row ── */}
      <div
        role={hasChildren ? "button" : undefined}
        onClick={hasChildren ? handleToggle : undefined}
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-[10px] border-l-[3px] rtl:border-l-0 rtl:border-r-[3px] border border-[#E7E8EB] transition-all duration-200 select-none",
          cfg.bg,
          hasChildren && "cursor-pointer hover:shadow-sm",
          state.isOpen && hasChildren
            ? `${cfg.activeBorder} shadow-sm`
            : "border-l-transparent rtl:border-l-[1px] rtl:border-r-transparent",
          isLeaf && "opacity-90"
        )}
      >
        {/* Left: icon + names */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm",
            cfg.badgeBg,
            cfg.badgeText
          )}>
            <Icon size={16} />
          </div>

          <div className="flex flex-col min-w-0">
            <span className={cn(
              "text-[14px] font-bold text-[#0A1B39] truncate leading-tight",
              hasChildren && "group-hover:text-[#2E37A4]"
            )}>
              {displayName}
              {altName && (
                <>
                  <span className="text-[#C5CAD5] font-normal mx-1.5">/</span>
                  <span className="text-[13px] font-normal text-[#6C7688]">{altName}</span>
                </>
              )}
            </span>
            <span className={cn("text-[10px] font-semibold uppercase tracking-wider mt-0.5", cfg.color)}>
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Right: badge + chevron */}
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {state.isLoading && (
            <Loader2 size={15} className="animate-spin text-[#6C7688]" />
          )}

          {!state.isLoading && state.isLoaded && state.children.length > 0 && (
            <span className={cn(
              "px-2 py-0.5 text-[10px] font-bold rounded-full",
              cfg.badgeBg, cfg.badgeText
            )}>
              {state.children.length}
            </span>
          )}

          {hasChildren && !state.isLoading && (
            <div className={cn(
              "w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300",
              state.isOpen ? cfg.badgeBg : "bg-[#F5F6F8]",
              cfg.badgeText
            )}>
              <div className={cn("transition-transform duration-300", state.isOpen ? "rotate-180" : "rotate-0")}>
                <ChevronDownSmall />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Error message ── */}
      {state.error && (
        <div className="mt-1 ml-10 flex items-center gap-1.5 text-[12px] text-red-500">
          <AlertCircle size={12} />
          {state.error}
        </div>
      )}

      {/* ── Children panel ── */}
      {hasChildren && (
        <div className={cn(
          "grid transition-all duration-300 ease-in-out",
          state.isOpen && (state.children.length > 0 || state.isLoading)
            ? "grid-rows-[1fr] opacity-100 mt-2 mb-1"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        )}>
          <div className="overflow-hidden">
            <div className="flex flex-col gap-2 pl-9 rtl:pl-0 rtl:pr-9 relative">
              {/* vertical connector line */}
              <div className={cn(
                "absolute top-0 bottom-0 left-[18px] rtl:left-auto rtl:right-[18px] w-[2px] rounded-full",
                cfg.connectorColor
              )} />

              {/* loading skeleton rows */}
              {state.isLoading && !state.isLoaded && (
                [1, 2, 3].map(i => (
                  <div key={i} className="relative">
                    <div className={cn("absolute top-[18px] left-[-11px] rtl:left-auto rtl:right-[-11px] w-[11px] h-[2px]", cfg.connectorColor)} />
                    <div className="h-[52px] bg-[#F5F6F8] rounded-[10px] animate-pulse border border-[#E7E8EB]" />
                  </div>
                ))
              )}

              {/* actual children */}
              {!state.isLoading && state.children.map(child => (
                <div key={child.id} className="relative">
                  <div className={cn("absolute top-[22px] left-[-11px] rtl:left-auto rtl:right-[-11px] w-[11px] h-[2px]", cfg.connectorColor)} />
                  <TreeNode
                    node={child}
                    lang={lang}
                    t={t}
                    globalExpand={globalExpand}
                    globalCollapse={globalCollapse}
                    depth={depth + 1}
                  />
                </div>
              ))}

              {/* no children found */}
              {!state.isLoading && state.isLoaded && state.children.length === 0 && !state.error && (
                <div className="py-3 px-4 text-[12px] text-[#9DA4B0] italic">
                  {t.address?.no_children || "No sub-locations found."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Page component
───────────────────────────────────────────────────────────────── */

interface AddressHierarchyViewProps {
  t: any;
  lang?: string;
}

export default function AddressHierarchyView({ t, lang = "en" }: AddressHierarchyViewProps) {
  const language = (lang === "ar" ? "ar" : "en") as "ar" | "en";

  const [countries, setCountries] = useState<TreeNodeData[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState<string | null>(null);

  // global signals for expand/collapse all
  const [expandSignal, setExpandSignal]     = useState(0);
  const [collapseSignal, setCollapseSignal] = useState(0);
  const isExpanded = expandSignal > collapseSignal;

  /* ── fetch countries on mount / lang change ── */
  const fetchCountries = useCallback(async () => {
    setCountriesLoading(true);
    setCountriesError(null);
    try {
      const res = await AdminLocationsService.getCountries(language);
      if (res.success && Array.isArray(res.data)) {
        setCountries(res.data as TreeNodeData[]);
      } else {
        setCountriesError(t.address?.action_failed || "Failed to load countries.");
      }
    } catch (err) {
      setCountriesError(getApiErrorMessage(err, language) || t.address?.action_failed);
    } finally {
      setCountriesLoading(false);
    }
  }, [language, t]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const handleExpandAll = () => {
    setExpandSignal(s => s + 1);
  };

  const handleCollapseAll = () => {
    setCollapseSignal(s => s + 1);
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-[#E7E8EB] rounded-[12px] shadow-sm">
        <div>
          <h2 className="text-[20px] font-bold text-[#0A1B39]">
            {t.sidebar?.address_hierarchy || "Address Hierarchy"}
          </h2>
          <p className="text-[13px] text-[#6C7688] mt-1">
            {t.address?.hierarchy_desc || "View the complete structure of locations. Click any location to expand its children."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* legend */}
          <div className="hidden sm:flex items-center gap-3 mr-2">
            {(["country", "city", "region", "district"] as LevelType[]).map(lvl => {
              const c = LEVEL_CONFIG[lvl];
              const Ic = c.icon;
              return (
                <div key={lvl} className="flex items-center gap-1.5">
                  <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", c.badgeBg, c.badgeText)}>
                    <Ic size={11} />
                  </div>
                  <span className={cn("text-[11px] font-semibold", c.color)}>{c.label}</span>
                </div>
              );
            })}
          </div>

          {/* expand / collapse button */}
          {!countriesLoading && countries.length > 0 && (
            <button
              onClick={isExpanded ? handleCollapseAll : handleExpandAll}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E7E8EB] text-[#0A1B39] rounded-[8px] text-[13px] font-semibold hover:bg-[#F5F6F8] hover:border-[#2E37A4] transition-all shadow-sm"
            >
              <Network size={15} className="text-[#2E37A4]" />
              {isExpanded
                ? (t.address?.collapse_all || "Collapse All")
                : (t.address?.expand_all   || "Expand All")}
            </button>
          )}
        </div>
      </div>

      {/* ── Tree panel ── */}
      <div className="bg-white p-6 border border-[#E7E8EB] rounded-[12px] shadow-sm min-h-[400px]">

        {/* loading countries */}
        {countriesLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-[3px] border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
            <span className="text-[14px] text-[#6C7688]">{t.common?.loading || "Loading countries…"}</span>
          </div>
        )}

        {/* error loading countries */}
        {!countriesLoading && countriesError && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-red-600">
            <AlertCircle size={24} />
            <p className="text-[14px]">{countriesError}</p>
            <button
              onClick={fetchCountries}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-[8px] text-[13px] font-semibold transition-colors"
            >
              {t.address?.retry || "Retry"}
            </button>
          </div>
        )}

        {/* no countries */}
        {!countriesLoading && !countriesError && countries.length === 0 && (
          <div className="flex items-center justify-center py-16 text-[#9DA4B0] text-[14px]">
            {t.address?.no_countries_found || "No countries found."}
          </div>
        )}

        {/* tree */}
        {!countriesLoading && !countriesError && countries.length > 0 && (
          <div className="flex flex-col gap-3">
            {countries.map(country => (
              <TreeNode
                key={country.id}
                node={country}
                lang={language}
                t={t}
                globalExpand={expandSignal}
                globalCollapse={collapseSignal}
                depth={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
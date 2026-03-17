// ─── Filter State ───────────────────────────────────────────────────────────
export interface FilterState {
  period: 'YTD' | 'QTD' | 'MTD' | 'CUSTOM';
  segment: 'ALL' | 'UPSTREAM' | 'MIDSTREAM' | 'DOWNSTREAM';
  region: 'ALL' | 'PERMIAN' | 'GULF' | 'NORTHSEA' | 'OFFSHORE';
  scope: 'ALL' | 'S1' | 'S2';
}

// ─── KPI Snapshot ────────────────────────────────────────────────────────────
export interface KpiSnapshot {
  scope1: number;
  scope2: number;
  methane: number;
  carbonIntensity: number;
  scope1Trend: number;
  scope2Trend: number;
  methaneTrend: number;
  ciTrend: number;
}

// ─── Alert ───────────────────────────────────────────────────────────────────
export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  detail: string;
  time: string;
}

// ─── Asset ───────────────────────────────────────────────────────────────────
export type AssetStatus = 'CRITICAL' | 'WARNING' | 'NORMAL';
export interface Asset {
  id: string;
  segment: string;
  region: string;
  kgco2: number;
  ogmpLevel: number;
  status: AssetStatus;
}

// ─── Chat Message ─────────────────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavTab {
  id: string;
  label: string;
  dotClass: string;
  pages: string[];
}

export interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  id: string;
  icon: string;
  label: string;
  badge?: string | number;
}

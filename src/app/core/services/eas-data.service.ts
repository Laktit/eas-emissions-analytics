import { Injectable, signal, computed } from '@angular/core';
import { FilterState, KpiSnapshot, Alert, Asset } from '../models/eas.models';

// ─── Raw data tables ───────────────────────────────────────────────────────
const DATA: Record<string, Record<string, KpiSnapshot>> = {
  YTD: {
    ALL:        { scope1:1.24, scope2:0.38, methane:0.14, carbonIntensity:18.4, scope1Trend:-7.3, scope2Trend:-12.1, methaneTrend:0.02,  ciTrend:-3.1 },
    UPSTREAM:   { scope1:0.74, scope2:0.19, methane:0.17, carbonIntensity:16.2, scope1Trend:-6.1, scope2Trend:-9.4,  methaneTrend:0.04,  ciTrend:-2.8 },
    MIDSTREAM:  { scope1:0.31, scope2:0.12, methane:0.11, carbonIntensity:21.1, scope1Trend:-8.2, scope2Trend:-14.0, methaneTrend:-0.01, ciTrend:-3.8 },
    DOWNSTREAM: { scope1:0.19, scope2:0.07, methane:0.09, carbonIntensity:23.4, scope1Trend:-9.1, scope2Trend:-13.5, methaneTrend:-0.02, ciTrend:-4.2 },
  },
  QTD: {
    ALL:        { scope1:0.29, scope2:0.09, methane:0.13, carbonIntensity:17.8, scope1Trend:-9.4, scope2Trend:-15.2, methaneTrend:0.01,  ciTrend:-4.2 },
    UPSTREAM:   { scope1:0.17, scope2:0.04, methane:0.16, carbonIntensity:15.9, scope1Trend:-8.1, scope2Trend:-12.0, methaneTrend:0.03,  ciTrend:-3.9 },
    MIDSTREAM:  { scope1:0.07, scope2:0.03, methane:0.10, carbonIntensity:20.2, scope1Trend:-10.1,scope2Trend:-17.0, methaneTrend:-0.02, ciTrend:-5.1 },
    DOWNSTREAM: { scope1:0.05, scope2:0.02, methane:0.08, carbonIntensity:22.8, scope1Trend:-10.8,scope2Trend:-16.5, methaneTrend:-0.03, ciTrend:-5.6 },
  },
  MTD: {
    ALL:        { scope1:0.10, scope2:0.03, methane:0.15, carbonIntensity:18.1, scope1Trend:-4.2, scope2Trend:-8.0,  methaneTrend:0.03,  ciTrend:-2.0 },
    UPSTREAM:   { scope1:0.06, scope2:0.01, methane:0.18, carbonIntensity:16.0, scope1Trend:-3.8, scope2Trend:-6.0,  methaneTrend:0.05,  ciTrend:-1.8 },
    MIDSTREAM:  { scope1:0.03, scope2:0.01, methane:0.12, carbonIntensity:20.8, scope1Trend:-4.8, scope2Trend:-9.2,  methaneTrend:0.01,  ciTrend:-2.3 },
    DOWNSTREAM: { scope1:0.01, scope2:0.01, methane:0.10, carbonIntensity:23.1, scope1Trend:-5.1, scope2Trend:-8.8,  methaneTrend:-0.01, ciTrend:-2.5 },
  },
  CUSTOM: {
    ALL:        { scope1:1.24, scope2:0.38, methane:0.14, carbonIntensity:18.4, scope1Trend:-7.3, scope2Trend:-12.1, methaneTrend:0.02,  ciTrend:-3.1 },
    UPSTREAM:   { scope1:0.74, scope2:0.19, methane:0.17, carbonIntensity:16.2, scope1Trend:-6.1, scope2Trend:-9.4,  methaneTrend:0.04,  ciTrend:-2.8 },
    MIDSTREAM:  { scope1:0.31, scope2:0.12, methane:0.11, carbonIntensity:21.1, scope1Trend:-8.2, scope2Trend:-14.0, methaneTrend:-0.01, ciTrend:-3.8 },
    DOWNSTREAM: { scope1:0.19, scope2:0.07, methane:0.09, carbonIntensity:23.4, scope1Trend:-9.1, scope2Trend:-13.5, methaneTrend:-0.02, ciTrend:-4.2 },
  }
};

const ALL_ASSETS: Asset[] = [
  { id:'C-07-PB',  segment:'UPSTREAM',   region:'PERMIAN',  kgco2:3847, ogmpLevel:4, status:'CRITICAL' },
  { id:'P-14-GC',  segment:'MIDSTREAM',  region:'GULF',     kgco2:2102, ogmpLevel:4, status:'WARNING'  },
  { id:'R-02-ML',  segment:'DOWNSTREAM', region:'PERMIAN',  kgco2:1654, ogmpLevel:3, status:'WARNING'  },
  { id:'W-08-NS',  segment:'UPSTREAM',   region:'NORTHSEA', kgco2:987,  ogmpLevel:5, status:'NORMAL'   },
  { id:'T-11-OF',  segment:'MIDSTREAM',  region:'OFFSHORE', kgco2:612,  ogmpLevel:4, status:'NORMAL'   },
  { id:'C-02-PB',  segment:'UPSTREAM',   region:'PERMIAN',  kgco2:543,  ogmpLevel:4, status:'NORMAL'   },
  { id:'W-14-GC',  segment:'UPSTREAM',   region:'GULF',     kgco2:498,  ogmpLevel:3, status:'NORMAL'   },
  { id:'P-07-NS',  segment:'MIDSTREAM',  region:'NORTHSEA', kgco2:421,  ogmpLevel:5, status:'NORMAL'   },
];

const ALL_ALERTS: Alert[] = [
  { id:'a1', severity:'CRITICAL', title:'Methane Breach — C-07-PB, Permian Basin', detail:'3,847 kgCO₂e/hr · 340% above OGMP L4 · Auto-remediation triggered', time:'09:41' },
  { id:'a2', severity:'CRITICAL', title:'Sensor Offline — SNS-R02-11',             detail:'Power interruption · 34 min offline · Emissions gap in reporting', time:'09:08' },
  { id:'a3', severity:'WARNING',  title:'SEC Deadline — 34 Days Remaining',         detail:'Q1 2026 Climate Disclosure · 3 fields pending · CFO sign-off needed', time:'08:15' },
  { id:'a4', severity:'WARNING',  title:'Pipeline Anomaly — P-14-GC, Gulf Coast',  detail:'2,102 kgCO₂e/hr · 12% above baseline · Monitoring', time:'07:32' },
  { id:'a5', severity:'INFO',     title:'GHGSat Aerial Sync — 67% Complete',       detail:'Satellite overpass processing · ETA 18 minutes', time:'09:30' },
];

@Injectable({ providedIn: 'root' })
export class EasDataService {
  // ── Filter state ──────────────────────────────────────────────────────────
  readonly filters = signal<FilterState>({
    period: 'YTD', segment: 'ALL', region: 'ALL', scope: 'ALL'
  });

  // ── Derived KPI snapshot (re-computes on every filter change) ─────────────
  readonly kpi = computed<KpiSnapshot>(() => {
    const f = this.filters();
    const seg = (f.segment === 'ALL') ? 'ALL' : f.segment;
    const base = DATA[f.period]?.[seg] ?? DATA['YTD']['ALL'];

    // Region multiplier — fine-tune numbers per region
    const regionMult: Record<string, number> = {
      ALL:1, PERMIAN:1.08, GULF:0.94, NORTHSEA:0.81, OFFSHORE:0.72
    };
    const m = regionMult[f.region] ?? 1;

    return {
      ...base,
      scope1: +(base.scope1 * m).toFixed(2),
      scope2: +(base.scope2 * m).toFixed(2),
      carbonIntensity: +(base.carbonIntensity * (m * 0.96)).toFixed(1),
    };
  });

  // ── Filtered assets ────────────────────────────────────────────────────────
  readonly assets = computed<Asset[]>(() => {
    const f = this.filters();
    return ALL_ASSETS.filter(a => {
      if (f.segment !== 'ALL' && a.segment !== f.segment) return false;
      if (f.region !== 'ALL') {
        const regionMap: Record<string, string> = {
          PERMIAN:'PERMIAN', GULF:'GULF', NORTHSEA:'NORTHSEA', OFFSHORE:'OFFSHORE'
        };
        if (a.region !== regionMap[f.region]) return false;
      }
      return true;
    });
  });

  // ── Alerts (filtered by region/segment context) ────────────────────────────
  readonly alerts = computed<Alert[]>(() => ALL_ALERTS);

  // ── Setters ────────────────────────────────────────────────────────────────
  setFilter<K extends keyof FilterState>(key: K, val: FilterState[K]): void {
    this.filters.update(f => ({ ...f, [key]: val }));
  }

  // ── Chart data (12-month trend) ────────────────────────────────────────────
  getChartData(): { month: string; upstream: number; midstream: number; downstream: number }[] {
    const months = ['M','A','M','J','J','A','S','O','N','D','J','F'];
    return months.map((m, i) => ({
      month: m,
      upstream:   +(0.065 + Math.sin(i * 0.5) * 0.008 + Math.random() * 0.004).toFixed(4),
      midstream:  +(0.030 + Math.cos(i * 0.4) * 0.004 + Math.random() * 0.002).toFixed(4),
      downstream: +(0.018 + Math.sin(i * 0.3) * 0.002 + Math.random() * 0.001).toFixed(4),
    }));
  }

  // ── Forecast data ─────────────────────────────────────────────────────────
  getForecastData() {
    return {
      proj2026: 1.09, proj2027: 0.91, netZero: 2041, confidence: 87,
      trend2026: -12, trend2027: -26
    };
  }

  // ── Benchmarking data ─────────────────────────────────────────────────────
  getBenchmarkData() {
    return [
      { name:'PEER A',    value:16.3, highlight:false },
      { name:'OUR CO. ★', value:18.4, highlight:true  },
      { name:'EQUINOR',   value:19.8, highlight:false },
      { name:'SHELL',     value:20.8, highlight:false },
      { name:'CHEVRON',   value:21.9, highlight:false },
      { name:'BP',        value:23.4, highlight:false },
      { name:'IND. AVG',  value:24.1, highlight:false },
      { name:'EXXON',     value:27.2, highlight:false },
    ];
  }
}

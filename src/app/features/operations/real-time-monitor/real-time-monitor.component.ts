import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EasDataService } from '../../../core/services/eas-data.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card.component';

@Component({
  selector: 'eas-real-time-monitor',
  standalone: true,
  imports: [CommonModule, KpiCardComponent],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Real-Time Monitor</div>
        <div class="page-subtitle">LIVE SENSOR DATA · 847 ASSETS · <span>1.2s LATENCY</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost">↓ Export</button>
        <button class="btn btn-primary">Configure Alerts</button>
      </div>
    </div>

    <div class="status-bar">
      <div class="status-pill pill-green"><div class="pill-dot"></div>847 / 851 SENSORS ACTIVE</div>
      <div class="status-pill pill-amber"><div class="pill-dot"></div>2,341 EVENTS/MIN</div>
      <div class="status-pill pill-red"><div class="pill-dot"></div>2 CRITICAL ALERTS</div>
      <div class="status-pill pill-blue"><div class="pill-dot"></div>SAP ERP SYNCED · 2m AGO</div>
    </div>

    <!-- KPI Row -->
    <div class="grid-4">
      <eas-kpi-card
        label="SCOPE 1"
        [value]="kpi().scope1"
        unit="MtCO₂e"
        [trend]="kpi().scope1Trend"
        sublabel="YTD direct emissions"
        cardClass="card-red">
      </eas-kpi-card>
      <eas-kpi-card
        label="SCOPE 2"
        [value]="kpi().scope2"
        unit="MtCO₂e"
        [trend]="kpi().scope2Trend"
        sublabel="YTD indirect emissions"
        cardClass="card-amber">
      </eas-kpi-card>
      <eas-kpi-card
        label="METHANE INTENSITY"
        [value]="kpi().methane"
        unit="%"
        [trend]="kpi().methaneTrend"
        sublabel="▲ 0.02% vs target"
        [invertTrend]="true"
        valueClass="text-amber">
      </eas-kpi-card>
      <eas-kpi-card
        label="CARBON INTENSITY"
        [value]="kpi().carbonIntensity"
        unit="kgCO₂e/BOE"
        [trend]="kpi().ciTrend"
        sublabel="▼ vs 24.1 industry avg"
        cardClass="card-blue"
        valueClass="text-blue">
      </eas-kpi-card>
    </div>

    <div class="grid-3-2">
      <!-- 12-Month Chart -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">12-MONTH EMISSIONS TREND</div>
          <div style="display:flex;gap:12px;align-items:center;">
            <span style="font-size:9px;color:var(--red);font-family:'IBM Plex Mono',monospace;">■ Upstream</span>
            <span style="font-size:9px;color:var(--amber);font-family:'IBM Plex Mono',monospace;">■ Midstream</span>
            <span style="font-size:9px;color:var(--blue);font-family:'IBM Plex Mono',monospace;">■ Downstream</span>
          </div>
        </div>
        <div class="chart-area" style="height:160px;display:flex;align-items:flex-end;gap:3px;padding-bottom:20px;position:relative;">
          @for (bar of chartData; track bar.month; let i = $index) {
            <div style="flex:1;display:flex;flex-direction:column;gap:1px;align-items:center;">
              <div [style.height.px]="bar.upstream * 1000" style="width:100%;background:var(--red);opacity:0.7;border-radius:1px 1px 0 0;transition:height .5s ease;"></div>
              <div [style.height.px]="bar.midstream * 1000" style="width:100%;background:var(--amber);opacity:0.7;transition:height .5s ease;"></div>
              <div [style.height.px]="bar.downstream * 1000" style="width:100%;background:var(--blue);opacity:0.7;border-radius:0 0 1px 1px;transition:height .5s ease;"></div>
              <div style="position:absolute;bottom:4px;font-family:'IBM Plex Mono',monospace;font-size:7px;color:var(--text-muted);">{{ bar.month }}</div>
            </div>
          }
        </div>
      </div>

      <!-- Donut -->
      <div class="card">
        <div class="card-header"><div class="card-title">SCOPE SPLIT</div></div>
        <div class="donut-wrap" style="flex-direction:column;gap:10px;">
          <svg width="110" height="110" viewBox="0 0 110 110" style="margin:0 auto;">
            <circle cx="55" cy="55" r="40" fill="none" stroke="var(--border-bright)" stroke-width="14"/>
            <circle cx="55" cy="55" r="40" fill="none" stroke="var(--red)" stroke-width="14"
              stroke-dasharray="160 92" stroke-dashoffset="0" stroke-linecap="round" style="transition:stroke-dasharray .8s ease;"/>
            <circle cx="55" cy="55" r="40" fill="none" stroke="var(--amber)" stroke-width="14"
              stroke-dasharray="92 160" stroke-dashoffset="-160" stroke-linecap="round"/>
            <text x="55" y="51" text-anchor="middle" font-family="Rajdhani,sans-serif" font-size="14" font-weight="700" fill="var(--text-primary)">{{ kpi().scope1 }}</text>
            <text x="55" y="63" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="7" fill="var(--text-muted)">MtCO₂e S1</text>
          </svg>
          <div class="donut-legend">
            <div class="legend-item"><div class="legend-dot" style="background:var(--red)"></div>Scope 1<span class="legend-pct">{{ s1Pct }}%</span></div>
            <div class="legend-item"><div class="legend-dot" style="background:var(--amber)"></div>Scope 2<span class="legend-pct">{{ s2Pct }}%</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Asset Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">ASSET EMISSIONS REGISTER</div>
        <span class="card-action">View All →</span>
      </div>
      <table class="data-table">
        <thead>
          <tr><th>ASSET ID</th><th>SEGMENT</th><th>REGION</th><th>kgCO₂e/hr</th><th>OGMP LVL</th><th>STATUS</th></tr>
        </thead>
        <tbody>
          @for (asset of assets(); track asset.id) {
            <tr>
              <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--amber)">{{ asset.id }}</td>
              <td><span class="tag" [class]="segTag(asset.segment)">{{ asset.segment }}</span></td>
              <td style="color:var(--text-muted);font-size:10px;">{{ asset.region }}</td>
              <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;" [style.color]="asset.status === 'CRITICAL' ? 'var(--red)' : asset.status === 'WARNING' ? 'var(--amber)' : 'var(--text-secondary)'">{{ asset.kgco2.toLocaleString() }}</td>
              <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text-muted)">L{{ asset.ogmpLevel }}</td>
              <td><span class="badge" [class]="statusBadge(asset.status)">{{ asset.status }}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <div class="page-footer">
      <div class="footer-text">REAL-TIME MONITOR · 847 SENSORS · {{ data.filters().period }}</div>
      <div class="footer-text">LAST UPDATED: LIVE</div>
    </div>
  `
})
export class RealTimeMonitorComponent {
  readonly data = inject(EasDataService);
  readonly kpi    = this.data.kpi;
  readonly assets = this.data.assets;
  readonly chartData = this.data.getChartData();

  get s1Pct(): number {
    const k = this.kpi();
    return Math.round(k.scope1 / (k.scope1 + k.scope2) * 100);
  }
  get s2Pct(): number { return 100 - this.s1Pct; }

  segTag(seg: string): string {
    return seg === 'UPSTREAM' ? 'tag-up' : seg === 'MIDSTREAM' ? 'tag-mid' : 'tag-down';
  }
  statusBadge(s: string): string {
    return s === 'CRITICAL' ? 'badge-crit' : s === 'WARNING' ? 'badge-warn' : 'badge-ok';
  }
}

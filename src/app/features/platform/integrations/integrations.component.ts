import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eas-integrations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Integrations</div>
        <div class="page-subtitle">7 CONNECTED SYSTEMS · API · <span>REAL-TIME SYNC</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary">+ Add Integration</button>
      </div>
    </div>

    <div class="grid-2">
      @for (int of integrations; track int.name) {
        <div class="card" style="display:flex;align-items:flex-start;gap:14px;">
          <div style="width:40px;height:40px;border-radius:6px;background:var(--bg-elevated);border:1px solid var(--border-bright);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">{{ int.icon }}</div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <div style="font-size:13px;font-weight:600;">{{ int.name }}</div>
              <span class="badge" [ngClass]="int.badge">{{ int.status }}</span>
            </div>
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;">{{ int.detail }}</div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-secondary);">{{ int.meta }}</div>
          </div>
          <button class="btn btn-ghost" style="font-size:9px;padding:3px 8px;flex-shrink:0;">Configure</button>
        </div>
      }
    </div>

    <div class="page-footer">
      <div class="footer-text">INTEGRATIONS · 7 ACTIVE · API v2.4</div>
    </div>
  `
})
export class IntegrationsComponent {
  integrations = [
    { icon:'⚙', name:'SAP ERP',          status:'CONNECTED', badge:'badge-ok',   detail:'Financial & operational data sync',    meta:'1,204 records today · Last sync: 2 min ago' },
    { icon:'◎', name:'LEUCIPA IoT',       status:'LIVE',      badge:'badge-ok',   detail:'847 sensors · 2,341 events/min',       meta:'Latency: 1.2s · Uptime: 99.8%' },
    { icon:'🛰', name:'GHGSat Aerial',    status:'SYNCING',   badge:'badge-warn', detail:'Satellite methane measurement',         meta:'67% complete · ETA 18 min' },
    { icon:'📋', name:'EPA Factors',      status:'CURRENT',   badge:'badge-ok',   detail:'Emission factors v4.1 — US EPA',       meta:'Updated Jan 2026' },
    { icon:'📋', name:'DEFRA Factors',    status:'CURRENT',   badge:'badge-ok',   detail:'UK DEFRA GHG conversion factors',      meta:'Updated Dec 2025' },
    { icon:'🔬', name:'Ecoinvent LCA',    status:'CONNECTED', badge:'badge-ok',   detail:'Life cycle assessment database v3.10', meta:'License valid to Dec 2026' },
    { icon:'📊', name:'Power BI',         status:'CONNECTED', badge:'badge-ok',   detail:'Dashboard & reporting embed',          meta:'12 dashboards · Refresh: 15 min' },
  ];
}

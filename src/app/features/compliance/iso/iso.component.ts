import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplianceBarComponent } from '../../../shared/components/compliance-bar.component';

@Component({
  selector: 'eas-iso',
  standalone: true,
  imports: [CommonModule, ComplianceBarComponent],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">ISO 50001</div>
        <div class="page-subtitle">ENERGY MANAGEMENT SYSTEM · 96% COMPLIANT · <span>NEXT AUDIT: JUN 2026</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost">Audit Checklist</button>
        <button class="btn btn-primary">↓ Export Report</button>
      </div>
    </div>

    <div class="grid-4">
      @for (k of kpis; track k.label) {
        <div class="card" [class]="k.cardClass">
          <div class="card-header"><div class="card-title">{{ k.label }}</div></div>
          <div class="kpi-value" [style.color]="k.color">{{ k.value }}<span class="kpi-unit">{{ k.unit }}</span></div>
          <div class="kpi-delta delta-down">{{ k.delta }}</div>
          <div class="kpi-label">{{ k.sub }}</div>
        </div>
      }
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">ISO 50001 CLAUSE READINESS</div></div>
        @for (c of clauses; track c.label) {
          <eas-compliance-bar [label]="c.label" [pct]="c.pct"></eas-compliance-bar>
        }
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">SIGNIFICANT ENERGY USERS (SEUs)</div></div>
        @for (seu of seus; track seu.label) {
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                <span style="font-size:11px;">{{ seu.label }}</span>
                <span style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--blue);">{{ seu.value }}</span>
              </div>
              <div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden;">
                <div style="height:100%;border-radius:2px;transition:width .8s;"
                  [style.width]="seu.pct + '%'" [style.background]="'var(--blue)'">
                </div>
              </div>
            </div>
            <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;" [style.color]="seu.trend > 0 ? 'var(--red)' : 'var(--green)'">
              {{ seu.trend > 0 ? '▲' : '▼' }} {{ Math.abs(seu.trend) }}%
            </span>
          </div>
        }
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-text">ISO 50001:2018 · ENERGY INTENSITY: 8.4 GJ/BOE · NEXT AUDIT: JUN 2026</div>
      <div class="footer-text">CERTIFICATION STATUS: ACTIVE · BODY: DNV GL</div>
    </div>
  `
})
export class IsoComponent {
  readonly Math = Math;

  kpis = [
    { label:'ISO READINESS',      value:'96',  unit:'%',        delta:'▼ 0.8% last month', sub:'Next audit: Jun 2026', color:'var(--green)', cardClass:'card-green' },
    { label:'ENERGY INTENSITY',   value:'8.4', unit:' GJ/BOE',  delta:'▼ 6.2% YTD',       sub:'Target: 8.0 GJ/BOE',  color:'var(--amber)', cardClass:'' },
    { label:'TOTAL CONSUMPTION',  value:'709', unit:'k GJ/yr',  delta:'▼ 4.1% vs 2025',   sub:'All SEUs combined',    color:'var(--blue)',  cardClass:'card-blue' },
    { label:'IMPROVEMENT TARGET', value:'5.0', unit:'%/yr',     delta:'On track',          sub:'EnPI baseline 2023',  color:'var(--text-primary)', cardClass:'' },
  ];

  clauses = [
    { label:'4 — Context of Organisation', pct:98 },
    { label:'5 — Leadership & Commitment',  pct:96 },
    { label:'6 — Planning (EnB, EnPI)',     pct:94 },
    { label:'7 — Support & Competence',    pct:97 },
    { label:'8 — Operational Control',     pct:92 },
    { label:'9 — Performance Evaluation',  pct:96 },
    { label:'10 — Improvement & CAPA',     pct:89 },
  ];

  seus = [
    { label:'Compression (Upstream)',  value:'428,000 GJ/yr', pct:62, trend:-8   },
    { label:'Heating & Process',       value:'187,000 GJ/yr', pct:27, trend:-3.1 },
    { label:'Utilities & Lighting',    value:'94,000 GJ/yr',  pct:14, trend:-5.4 },
    { label:'Transport & Fleet',       value:'55,000 GJ/yr',  pct:8,  trend:1.2  },
  ];
}

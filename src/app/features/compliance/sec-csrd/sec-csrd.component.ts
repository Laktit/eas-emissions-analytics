import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplianceBarComponent } from '../../../shared/components/compliance-bar.component';

@Component({
  selector: 'eas-sec-csrd',
  standalone: true,
  imports: [CommonModule, ComplianceBarComponent],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">SEC · CSRD</div>
        <div class="page-subtitle">CLIMATE DISCLOSURE · 34 DAYS TO FILING · <span>3 ITEMS PENDING</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost">Preview Filing</button>
        <button class="btn btn-primary">Submit Draft</button>
      </div>
    </div>

    <div class="context-banner" style="border-color:var(--red-dim);background:rgba(231,76,60,0.04);">
      <span style="color:var(--red);">⚠</span>
      <span class="context-pill" style="border-color:var(--red-dim);background:rgba(231,76,60,0.15);color:var(--red);">DEADLINE: 34 DAYS</span>
      <span>SEC Q1 2026 Climate Disclosure due April 1, 2026. CFO sign-off pending.</span>
    </div>

    <div class="grid-3">
      @for (frame of frameworks; track frame.id) {
        <div class="card" [class]="frame.cardClass">
          <div class="card-header">
            <div class="card-title">{{ frame.id }}</div>
            <span class="badge" [ngClass]="frame.badge">{{ frame.status }}</span>
          </div>
          <div class="kpi-value" [style.color]="frame.color">{{ frame.pct }}<span class="kpi-unit">%</span></div>
          <div class="kpi-label" style="margin-bottom:10px;">{{ frame.sub }}</div>
          @for (item of frame.items; track item.label) {
            <eas-compliance-bar [label]="item.label" [pct]="item.pct"></eas-compliance-bar>
          }
        </div>
      }
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">SEC PENDING ITEMS</div></div>
        @for (item of secPending; track item.label) {
          <div class="alert-strip" [ngClass]="item.class">
            <span>{{ item.icon }}</span>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:11px;">{{ item.label }}</div>
              <div style="font-size:9.5px;opacity:.8;margin-top:1px;">{{ item.detail }}</div>
            </div>
            <span class="badge" [ngClass]="item.badge">{{ item.pct }}%</span>
          </div>
        }
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">CSRD ESRS E1 GAPS</div></div>
        @for (item of csrdGaps; track item.label) {
          <eas-compliance-bar [label]="item.label" [pct]="item.pct"></eas-compliance-bar>
        }
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-text">SEC / CSRD · FILING DEADLINE: APR 1 2026 · AUDIT READINESS: 83/100</div>
      <div class="footer-text">TCFD: 88% · XBRL TAGGING: 65%</div>
    </div>
  `
})
export class SecCsrdComponent {
  frameworks = [
    {
      id:'SEC CLIMATE DISCLOSURE', pct:91, status:'ON TRACK', badge:'badge-warn', cardClass:'card-amber',
      color:'var(--amber)', sub:'Deadline: April 1, 2026 (34 days)',
      items:[
        { label:'Scope 1 & 2 Disclosure', pct:98 },
        { label:'Scenario Analysis', pct:45 },
        { label:'XBRL Tagging', pct:65 },
        { label:'CFO Sign-off', pct:0  },
      ]
    },
    {
      id:'CSRD — ESRS E1', pct:65, status:'IN PROGRESS', badge:'badge-warn', cardClass:'',
      color:'var(--blue)', sub:'EU reporting — FY2026 deadline',
      items:[
        { label:'GHG Inventory', pct:88 },
        { label:'Climate Targets', pct:72 },
        { label:'Transition Plan', pct:58 },
        { label:'Biodiversity (E1-5)', pct:12 },
      ]
    },
    {
      id:'TCFD', pct:88, status:'COMPLIANT', badge:'badge-ok', cardClass:'card-green',
      color:'var(--green)', sub:'Task Force on Climate Disclosures',
      items:[
        { label:'Governance', pct:96 },
        { label:'Strategy', pct:88 },
        { label:'Risk Mgmt', pct:91 },
        { label:'Metrics & Targets', pct:84 },
      ]
    },
  ];

  secPending = [
    { label:'Scenario Analysis', detail:'Physical & transition risk scenarios required — 45% complete', class:'alert-crit', badge:'badge-crit', pct:45, icon:'⚠' },
    { label:'XBRL Tagging', detail:'SEC-structured data tagging required for filing', class:'alert-warn', badge:'badge-warn', pct:65, icon:'△' },
    { label:'CFO Sign-off', detail:'Awaiting CFO review and digital signature', class:'alert-warn', badge:'badge-warn', pct:0, icon:'△' },
  ];

  csrdGaps = [
    { label:'GHG Inventory (ESRS E1-6)',       pct:88 },
    { label:'Climate Targets (ESRS E1-4)',      pct:72 },
    { label:'Transition Plan (ESRS E1-1)',      pct:58 },
    { label:'Energy Mix (ESRS E1-5)',           pct:74 },
    { label:'Biodiversity Disclosures',         pct:12 },
  ];
}

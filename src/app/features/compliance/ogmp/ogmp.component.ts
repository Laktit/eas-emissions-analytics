import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplianceBarComponent } from '../../../shared/components/compliance-bar.component';

@Component({
  selector: 'eas-ogmp',
  standalone: true,
  imports: [CommonModule, ComplianceBarComponent],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">OGMP 2.0</div>
        <div class="page-subtitle">OIL & GAS METHANE PARTNERSHIP · LEVEL 4 TARGET · <span>78% READY</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost">View Gap Report</button>
        <button class="btn btn-primary">Submit to UNEP</button>
      </div>
    </div>

    <div class="context-banner">
      <span>▲</span>
      <span class="context-pill">ACTION REQUIRED</span>
      <span>GHGSat aerial sync at 67%. 12 sites below Level 4. Target: 85% by Q2 2026.</span>
    </div>

    <div class="grid-4">
      @for (k of kpis; track k.label) {
        <div class="card" [class]="k.cardClass">
          <div class="card-header"><div class="card-title">{{ k.label }}</div></div>
          <div class="kpi-value" [style.color]="k.color">{{ k.value }}<span class="kpi-unit">{{ k.unit }}</span></div>
          <div class="kpi-label">{{ k.sub }}</div>
        </div>
      }
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">OGMP LEVEL REQUIREMENTS</div></div>
        @for (item of requirements; track item.label) {
          <eas-compliance-bar [label]="item.label" [pct]="item.pct"></eas-compliance-bar>
        }
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">SITE COMPLIANCE REGISTER</div></div>
        <table class="data-table">
          <thead><tr><th>SITE</th><th>LEVEL</th><th>STATUS</th><th>ISSUE</th></tr></thead>
          <tbody>
            @for (site of sites; track site.id) {
              <tr>
                <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--amber);">{{ site.id }}</td>
                <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;">L{{ site.level }}</td>
                <td><span class="badge" [ngClass]="site.badge">{{ site.status }}</span></td>
                <td style="font-size:10px;color:var(--text-muted);">{{ site.issue }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-text">OGMP 2.0 · UNEP METHANE PARTNERSHIP · Q2 2026 TARGET</div>
      <div class="footer-text">OVERALL READINESS: 78% · 12 SITES BELOW L4</div>
    </div>
  `
})
export class OgmpComponent {
  kpis = [
    { label:'OVERALL READINESS', value:'78',  unit:'%', sub:'Target: 85% Q2 2026', color:'var(--amber)', cardClass:'card-amber' },
    { label:'SITES AT L4/L5',   value:'19',  unit:'',  sub:'of 31 total sites',   color:'var(--green)', cardClass:'card-green' },
    { label:'GHGSAT SYNC',       value:'67',  unit:'%', sub:'ETA: 18 minutes',     color:'var(--amber)', cardClass:'' },
    { label:'SITES BELOW L4',    value:'12',  unit:'',  sub:'Require upgrades',    color:'var(--red)',   cardClass:'card-red' },
  ];

  requirements = [
    { label:'Source-Level Measurement',    pct:88 },
    { label:'Aerial Measurement (GHGSat)', pct:67 },
    { label:'Mass Balance Verification',   pct:82 },
    { label:'Third-Party Verification',    pct:71 },
    { label:'UNEP Reporting Format',       pct:95 },
  ];

  sites = [
    { id:'C-07-PB',  level:4, status:'BREACH',   badge:'badge-crit', issue:'Methane 340% above L4 limit' },
    { id:'P-14-GC',  level:4, status:'WARNING',  badge:'badge-warn', issue:'Aerial sync pending' },
    { id:'R-02-ML',  level:3, status:'BELOW L4', badge:'badge-warn', issue:'Upgrade required by Q2' },
    { id:'W-08-NS',  level:5, status:'COMPLIANT',badge:'badge-ok',   issue:'—' },
    { id:'T-11-OF',  level:4, status:'COMPLIANT',badge:'badge-ok',   issue:'—' },
    { id:'C-02-PB',  level:4, status:'COMPLIANT',badge:'badge-ok',   issue:'—' },
  ];
}

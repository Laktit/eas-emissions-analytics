import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EasDataService } from '../../../core/services/eas-data.service';

@Component({
  selector: 'eas-forecasting',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Forecasting</div>
        <div class="page-subtitle">AI-POWERED · 87% CONFIDENCE · <span>NET ZERO 2041</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost">Update Baseline</button>
        <button class="btn btn-primary">↓ Export Forecast</button>
      </div>
    </div>

    <div class="context-banner">
      <span>▲</span>
      <span class="context-pill">C-07 RISK</span>
      <span>Unresolved breach adds ~0.04 Mt to 2026 Scope 1. Forecast update recommended.</span>
    </div>

    <div class="grid-4">
      @for (k of kpis; track k.label) {
        <div class="card" [class]="k.cardClass">
          <div class="card-header"><div class="card-title">{{ k.label }}</div></div>
          <div class="kpi-value" [style.color]="k.color">{{ k.value }}<span class="kpi-unit">{{ k.unit }}</span></div>
          <div class="kpi-delta" [ngClass]="k.deltaClass">{{ k.delta }}</div>
          <div class="kpi-label">{{ k.sub }}</div>
        </div>
      }
    </div>

    <div class="grid-2">
      <!-- Forecast Chart -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">SCOPE 1 TRAJECTORY — 2025–2041</div>
          <div style="display:flex;gap:8px;">
            <span style="font-size:9px;font-family:'IBM Plex Mono',monospace;color:var(--amber);">— Actual/Forecast</span>
            <span style="font-size:9px;font-family:'IBM Plex Mono',monospace;color:var(--red);">--- Risk (C-07)</span>
          </div>
        </div>
        <div style="position:relative;height:180px;padding:8px 0 20px;">
          <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
            <!-- Grid lines -->
            @for (y of [0,1,2,3]; track y) {
              <line [attr.x1]="0" [attr.y1]="y*40" [attr.x2]="400" [attr.y2]="y*40" stroke="var(--border)" stroke-width="1"/>
            }
            <!-- Main forecast line -->
            <polyline points="0,20 50,30 100,45 150,60 200,80 250,95 300,110 350,125 400,140"
              fill="none" stroke="var(--amber)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Risk line (dashed) -->
            <polyline points="100,45 150,55 200,72 250,85 300,98"
              fill="none" stroke="var(--red)" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.6"/>
            <!-- Confidence band -->
            <polygon points="0,15 50,24 100,38 150,52 200,72 250,88 300,103 350,118 400,133 400,147 350,132 300,117 250,102 200,88 150,68 100,52 50,36 0,25"
              fill="var(--amber)" opacity="0.06"/>
            <!-- Net zero line -->
            <line x1="0" y1="145" x2="400" y2="145" stroke="var(--green)" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
            <text x="5" y="143" font-family="IBM Plex Mono" font-size="6" fill="var(--green)" opacity="0.7">NET ZERO</text>
          </svg>
          <!-- X-axis labels -->
          <div style="display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:7px;color:var(--text-muted);margin-top:2px;">
            <span>2025</span><span>2027</span><span>2029</span><span>2031</span><span>2033</span><span>2035</span><span>2037</span><span>2039</span><span>2041</span>
          </div>
        </div>
      </div>

      <!-- Year-by-year table -->
      <div class="card">
        <div class="card-header"><div class="card-title">ANNUAL PROJECTION TABLE</div></div>
        <table class="data-table">
          <thead><tr><th>YEAR</th><th>SCOPE 1 Mt</th><th>SCOPE 2 Mt</th><th>TREND</th><th>CONFIDENCE</th></tr></thead>
          <tbody>
            @for (row of forecastTable; track row.year) {
              <tr>
                <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;" [style.color]="row.actual ? 'var(--text-primary)' : 'var(--amber)'">{{ row.year }}{{ row.actual ? ' ★' : '' }}</td>
                <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;">{{ row.s1 }}</td>
                <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;">{{ row.s2 }}</td>
                <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;" [style.color]="'var(--green)'">{{ row.trend }}</td>
                <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text-muted);">{{ row.conf }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">KEY MODEL ASSUMPTIONS</div></div>
      <div class="grid-4">
        @for (a of assumptions; track a.label) {
          <div style="padding:8px;background:var(--bg-elevated);border-radius:3px;border:1px solid var(--border-bright);">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--text-muted);margin-bottom:4px;">{{ a.label }}</div>
            <div style="font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:700;color:var(--amber);">{{ a.value }}</div>
          </div>
        }
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-text">FORECASTING · AI MODEL v3.1 · 87% CONFIDENCE · {{ data.filters().period }}</div>
      <div class="footer-text">LAST CALIBRATED: FEB 2026</div>
    </div>
  `
})
export class ForecastingComponent {
  readonly data = inject(EasDataService);

  kpis = [
    { label:'2026 PROJECTION', value:'1.09', unit:'Mt', delta:'▼ 12% vs 2025', deltaClass:'kpi-delta delta-down', sub:'if C-07 resolved', color:'var(--amber)', cardClass:'card-amber' },
    { label:'2027 PROJECTION', value:'0.91', unit:'Mt', delta:'▼ 26% vs 2025', deltaClass:'kpi-delta delta-down', sub:'on current trajectory', color:'var(--green)', cardClass:'card-green' },
    { label:'NET ZERO TARGET', value:'2041', unit:'',   delta:'3 yrs early vs plan', deltaClass:'kpi-delta delta-down', sub:'with methane detection 80%: 2038', color:'var(--blue)', cardClass:'card-blue' },
    { label:'MODEL CONFIDENCE', value:'87',  unit:'%',  delta:'± 4% range',    deltaClass:'kpi-delta delta-neutral', sub:'based on 36-month calibration', color:'var(--text-primary)', cardClass:'' },
  ];

  forecastTable = [
    { year:'2025', s1:'1.24', s2:'0.42', trend:'Baseline', conf:'Actual', actual:true },
    { year:'2026', s1:'1.09', s2:'0.38', trend:'▼ 12%',    conf:'87%',   actual:false },
    { year:'2027', s1:'0.91', s2:'0.33', trend:'▼ 26%',    conf:'81%',   actual:false },
    { year:'2028', s1:'0.76', s2:'0.28', trend:'▼ 39%',    conf:'74%',   actual:false },
    { year:'2030', s1:'0.54', s2:'0.20', trend:'▼ 56%',    conf:'65%',   actual:false },
    { year:'2035', s1:'0.28', s2:'0.11', trend:'▼ 77%',    conf:'52%',   actual:false },
    { year:'2041', s1:'0.00', s2:'0.00', trend:'NET ZERO',  conf:'—',     actual:false },
  ];

  assumptions = [
    { label:'PRODUCTION GROWTH', value:'+3.2%/yr' },
    { label:'FLEET ELECTRIFICATION', value:'35%' },
    { label:'COMPRESSOR RETROFIT', value:'60%' },
    { label:'RENEWABLE MIX', value:'20%' },
  ];
}

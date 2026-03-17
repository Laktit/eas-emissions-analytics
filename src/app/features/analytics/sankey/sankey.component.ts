import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EasDataService } from '../../../core/services/eas-data.service';

@Component({
  selector: 'eas-sankey',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Sankey / Flow Analysis</div>
        <div class="page-subtitle">EMISSION FLOW MAPPING · SOURCE TO SCOPE · <span>YTD 2026</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost">↓ Export SVG</button>
      </div>
    </div>

    <!-- Flow bars from HTML original -->
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">SOURCE BREAKDOWN — SCOPE 1</div></div>
        @for (flow of scope1Flows; track flow.label) {
          <div style="margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
              <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);">{{ flow.label }}</span>
              <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--amber);">{{ flow.pct }}%</span>
            </div>
            <div style="height:18px;background:var(--border);border-radius:2px;overflow:hidden;">
              <div style="height:100%;border-radius:2px;display:flex;align-items:center;padding-left:6px;font-family:'IBM Plex Mono',monospace;font-size:9px;transition:width .8s ease;"
                [style.width]="flow.pct + '%'" [style.background]="flow.color" [style.color]="flow.textColor">
                {{ flow.value }}
              </div>
            </div>
          </div>
        }
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">ENERGY CONSUMPTION FLOW</div></div>
        @for (flow of energyFlows; track flow.label) {
          <div style="margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
              <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);">{{ flow.label }}</span>
              <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--blue);">{{ flow.value }}</span>
            </div>
            <div style="height:18px;background:var(--border);border-radius:2px;overflow:hidden;">
              <div style="height:100%;border-radius:2px;transition:width .8s ease;"
                [style.width]="flow.pct + '%'" [style.background]="flow.color">
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- SVG Sankey diagram -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">EMISSION FLOW DIAGRAM — SIMPLIFIED SANKEY</div>
        <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);">MtCO₂e · 2026 YTD</span>
      </div>
      <div style="overflow-x:auto;">
        <svg width="100%" height="240" viewBox="0 0 700 240" style="min-width:500px;">
          <!-- Source nodes -->
          <rect x="10" y="20"  width="100" height="50"  rx="2" fill="rgba(231,76,60,0.2)"  stroke="var(--red)"   stroke-width="1"/>
          <text x="60" y="40"  text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--red)">COMBUSTION</text>
          <text x="60" y="54"  text-anchor="middle" font-family="IBM Plex Mono" font-size="9" font-weight="700" fill="var(--text-primary)">0.71 Mt</text>
          <text x="60" y="65"  text-anchor="middle" font-family="IBM Plex Mono" font-size="7" fill="var(--text-muted)">57%</text>

          <rect x="10" y="90"  width="100" height="50"  rx="2" fill="rgba(245,166,35,0.2)"  stroke="var(--amber)" stroke-width="1"/>
          <text x="60" y="110" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--amber)">FUGITIVE</text>
          <text x="60" y="124" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" font-weight="700" fill="var(--text-primary)">0.34 Mt</text>
          <text x="60" y="135" text-anchor="middle" font-family="IBM Plex Mono" font-size="7" fill="var(--text-muted)">27%</text>

          <rect x="10" y="160" width="100" height="50"  rx="2" fill="rgba(52,152,219,0.2)"  stroke="var(--blue)"  stroke-width="1"/>
          <text x="60" y="180" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="var(--blue)">PROCESS</text>
          <text x="60" y="194" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" font-weight="700" fill="var(--text-primary)">0.19 Mt</text>
          <text x="60" y="205" text-anchor="middle" font-family="IBM Plex Mono" font-size="7" fill="var(--text-muted)">16%</text>

          <!-- Flows to Scope 1 -->
          <path d="M 110 45 C 200 45, 200 80, 290 80" fill="none" stroke="var(--red)"   stroke-width="18" opacity="0.25"/>
          <path d="M 110 115 C 200 115, 200 90, 290 90" fill="none" stroke="var(--amber)" stroke-width="11" opacity="0.25"/>
          <path d="M 110 185 C 200 185, 200 100, 290 100" fill="none" stroke="var(--blue)"  stroke-width="6"  opacity="0.25"/>

          <!-- Scope 1 node -->
          <rect x="290" y="40" width="110" height="80" rx="2" fill="rgba(231,76,60,0.15)" stroke="var(--red)" stroke-width="1.5"/>
          <text x="345" y="72"  text-anchor="middle" font-family="Rajdhani" font-size="11" font-weight="700" fill="var(--red)">SCOPE 1</text>
          <text x="345" y="88"  text-anchor="middle" font-family="Rajdhani" font-size="14" font-weight="700" fill="var(--text-primary)">1.24 Mt</text>
          <text x="345" y="102" text-anchor="middle" font-family="IBM Plex Mono" font-size="7" fill="var(--text-muted)">target: 1.18 Mt</text>

          <!-- Scope 2 node -->
          <rect x="290" y="145" width="110" height="60" rx="2" fill="rgba(245,166,35,0.15)" stroke="var(--amber)" stroke-width="1.5"/>
          <text x="345" y="168" text-anchor="middle" font-family="Rajdhani" font-size="11" font-weight="700" fill="var(--amber)">SCOPE 2</text>
          <text x="345" y="184" text-anchor="middle" font-family="Rajdhani" font-size="14" font-weight="700" fill="var(--text-primary)">0.38 Mt</text>
          <text x="345" y="198" text-anchor="middle" font-family="IBM Plex Mono" font-size="7" fill="var(--text-muted)">target: 0.35 Mt</text>

          <!-- Flows to Total -->
          <path d="M 400 80 C 490 80, 490 100, 560 100" fill="none" stroke="var(--red)"   stroke-width="22" opacity="0.2"/>
          <path d="M 400 175 C 490 175, 490 110, 560 110" fill="none" stroke="var(--amber)" stroke-width="8" opacity="0.2"/>

          <!-- Total node -->
          <rect x="560" y="50" width="120" height="90" rx="2" fill="rgba(245,166,35,0.08)" stroke="var(--amber)" stroke-width="1.5"/>
          <text x="620" y="80"  text-anchor="middle" font-family="Rajdhani" font-size="10" font-weight="700" fill="var(--text-muted)">TOTAL</text>
          <text x="620" y="100" text-anchor="middle" font-family="Rajdhani" font-size="18" font-weight="700" fill="var(--amber)">1.62 Mt</text>
          <text x="620" y="115" text-anchor="middle" font-family="IBM Plex Mono" font-size="7" fill="var(--text-muted)">S1 + S2 combined</text>
          <text x="620" y="130" text-anchor="middle" font-family="IBM Plex Mono" font-size="7" fill="var(--green)">▼ 8.5% YoY</text>
        </svg>
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-text">SANKEY FLOW · SCOPE 1 + SCOPE 2 · {{ data.filters().period }}</div>
    </div>
  `
})
export class SankeyComponent {
  readonly data = inject(EasDataService);

  scope1Flows = [
    { label:'Combustion — Stationary',   pct:57, value:'0.71 Mt', color:'rgba(231,76,60,0.6)',  textColor:'#fff' },
    { label:'Fugitive — Methane',        pct:27, value:'0.34 Mt', color:'rgba(245,166,35,0.6)', textColor:'#000' },
    { label:'Process Emissions',         pct:16, value:'0.19 Mt', color:'rgba(52,152,219,0.5)', textColor:'#fff' },
  ];

  energyFlows = [
    { label:'Compression (largest SEU)', pct:62, value:'428,000 GJ/yr', color:'rgba(231,76,60,0.4)'  },
    { label:'Heating & Cooling',         pct:27, value:'187,000 GJ/yr', color:'rgba(245,166,35,0.4)' },
    { label:'Utilities & Lighting',      pct:14, value:'94,000 GJ/yr',  color:'rgba(52,152,219,0.4)' },
    { label:'Transport Fleet',           pct:8,  value:'55,000 GJ/yr',  color:'rgba(155,89,182,0.4)' },
  ];
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EasDataService } from '../../../core/services/eas-data.service';

@Component({
  selector: 'eas-benchmarking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Benchmarking</div>
        <div class="page-subtitle">14 PEERS · CARBON INTENSITY · <span>RANK #2 OF 14</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost">↓ Export</button>
        <button class="btn btn-primary">Add Peer</button>
      </div>
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
      <!-- Horizontal bar chart -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">CARBON INTENSITY — PEER COMPARISON</div>
          <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);">kgCO₂e/BOE · Lower is better</div>
        </div>
        @for (peer of data.getBenchmarkData(); track peer.name) {
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;width:88px;flex-shrink:0;" [style.color]="peer.highlight ? 'var(--amber)' : 'var(--text-muted)'">{{ peer.name }}</div>
            <div style="flex:1;height:18px;background:var(--border);border-radius:2px;overflow:hidden;">
              <div style="height:100%;border-radius:2px;display:flex;align-items:center;padding-left:6px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:600;transition:width .8s ease;"
                [style.width]="(peer.value / 30 * 100) + '%'"
                [style.background]="peer.highlight ? 'var(--amber)' : peer.value > 24 ? 'rgba(231,76,60,0.5)' : peer.value > 20 ? 'rgba(245,166,35,0.4)' : 'rgba(46,204,113,0.4)'"
                [style.color]="peer.highlight ? '#000' : 'var(--text-primary)'">
                {{ peer.value }}
              </div>
            </div>
          </div>
        }
        <!-- Industry average line marker -->
        <div style="display:flex;align-items:center;gap:8px;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">
          <div style="flex:1;height:1px;background:var(--blue);opacity:0.5;"></div>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--blue);">INDUSTRY AVG: 24.1</span>
          <div style="flex:1;height:1px;background:var(--blue);opacity:0.5;"></div>
        </div>
      </div>

      <!-- Improvement opportunities -->
      <div class="card">
        <div class="card-header"><div class="card-title">IMPROVEMENT OPPORTUNITIES</div></div>
        @for (opp of opportunities; track opp.metric) {
          <div style="margin-bottom:12px;padding:10px;background:var(--bg-elevated);border-radius:3px;border:1px solid var(--border-bright);">
            <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
              <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);">{{ opp.metric }}</span>
              <span class="badge" [ngClass]="opp.badge">{{ opp.label }}</span>
            </div>
            <div style="display:flex;align-items:baseline;gap:8px;">
              <span style="font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:700;color:var(--text-primary);">{{ opp.current }}</span>
              <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);">vs best {{ opp.best }}</span>
              <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;" [style.color]="opp.gapColor">gap: {{ opp.gap }}</span>
            </div>
          </div>
        }
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-text">BENCHMARKING · 14 PEERS · CARBON INTENSITY · {{ data.filters().period }}</div>
      <div class="footer-text">SOURCE: S&P TRUCOST · UPDATED Q4 2025</div>
    </div>
  `
})
export class BenchmarkingComponent {
  readonly data = inject(EasDataService);

  kpis = [
    { label:'OUR RANK',        value:'#2',  unit:'/ 14', sub:'Carbon intensity', color:'var(--amber)', cardClass:'card-amber' },
    { label:'OUR CI',          value:'18.4',unit:' kgCO₂e/BOE', sub:'vs 24.1 industry avg', color:'var(--green)', cardClass:'card-green' },
    { label:'VS INDUSTRY AVG', value:'▼24', unit:'%',    sub:'Better than average', color:'var(--green)', cardClass:'' },
    { label:'GAP TO #1',       value:'2.1', unit:' kgCO₂e/BOE', sub:'Peer A is at 16.3', color:'var(--blue)', cardClass:'card-blue' },
  ];

  opportunities = [
    { metric:'CARBON INTENSITY', current:'18.4', best:'16.3', gap:'−2.1', label:'NEAR TARGET', badge:'badge-warn', gapColor:'var(--amber)' },
    { metric:'METHANE INTENSITY', current:'0.14%', best:'0.08%', gap:'−0.06%', label:'ABOVE PEER', badge:'badge-crit', gapColor:'var(--red)' },
    { metric:'FLARING INTENSITY', current:'4.2 m³/BOE', best:'2.1 m³/BOE', gap:'−2.1', label:'IMPROVEMENT', badge:'badge-warn', gapColor:'var(--amber)' },
  ];
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EasDataService } from '../../../core/services/eas-data.service';

@Component({
  selector: 'eas-hotspot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Hotspot Analysis</div>
        <div class="page-subtitle">EMISSION SOURCE MAPPING · OGMP 2.0 · <span>2 CRITICAL SITES</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost">↓ Export Report</button>
        <button class="btn btn-danger">Acknowledge All</button>
      </div>
    </div>

    <!-- Critical Alerts -->
    @for (a of data.alerts(); track a.id) {
      <div class="alert-strip" [ngClass]="alertClass(a.severity)">
        <span style="font-size:13px;">{{ alertIcon(a.severity) }}</span>
        <div style="flex:1;">
          <div style="font-weight:600;font-size:11px;">{{ a.title }}</div>
          <div style="font-size:9.5px;opacity:0.8;margin-top:1px;">{{ a.detail }}</div>
        </div>
        <div class="alert-time">{{ a.time }}</div>
        <button class="btn btn-ghost" style="font-size:9px;padding:3px 8px;">ACK</button>
      </div>
    }

    <div class="grid-2">
      <!-- Heatmap -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">EMISSION INTENSITY HEATMAP</div>
          <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);">kgCO₂e/hr by site × week</div>
        </div>
        <div class="heatmap-grid" style="grid-template-columns:80px repeat(5,1fr);">
          <div></div>
          @for (col of heatCols; track col) {
            <div class="hm-col-label">{{ col }}</div>
          }
          @for (row of heatRows; track row.label) {
            <div class="hm-label">{{ row.label }}</div>
            @for (cell of row.cells; track $index) {
              <div class="hm-cell" [style.background]="heatColor(cell)" [title]="cell + ' kgCO₂e/hr'"></div>
            }
          }
        </div>
        <div style="display:flex;align-items:center;gap:4px;margin-top:12px;font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--text-muted);">
          LOW
          <div style="flex:1;height:6px;border-radius:3px;background:linear-gradient(90deg,rgba(46,204,113,0.4),rgba(245,166,35,0.6),rgba(231,76,60,0.8));"></div>
          HIGH
        </div>
      </div>

      <!-- Top emitters -->
      <div class="card">
        <div class="card-header"><div class="card-title">TOP EMISSION SOURCES</div></div>
        @for (e of topEmitters; track e.id; let i = $index) {
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text-muted);width:16px;">{{ i+1 }}</div>
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                <span style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--amber);">{{ e.id }}</span>
                <span style="font-family:'IBM Plex Mono',monospace;font-size:10px;" [style.color]="e.color">{{ e.val.toLocaleString() }} kgCO₂e/hr</span>
              </div>
              <div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden;">
                <div style="height:100%;border-radius:2px;transition:width .8s ease;" [style.width]="(e.val / 4000 * 100) + '%'" [style.background]="e.color"></div>
              </div>
            </div>
            <span class="badge" [ngClass]="e.badge">{{ e.status }}</span>
          </div>
        }
      </div>
    </div>

    <!-- C-07 Detail Card -->
    <div class="card card-red">
      <div class="card-header">
        <div class="card-title">C-07-PB INCIDENT DETAIL — PERMIAN BASIN</div>
        <span class="badge badge-crit">● CRITICAL · ACTIVE</span>
      </div>
      <div class="grid-4">
        <div><div style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--text-muted);margin-bottom:4px;">CURRENT RATE</div><div style="font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;color:var(--red);">3,847 <span style="font-size:11px;color:var(--text-muted);">kgCO₂e/hr</span></div></div>
        <div><div style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--text-muted);margin-bottom:4px;">OGMP LIMIT</div><div style="font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;color:var(--text-secondary);">1,130 <span style="font-size:11px;color:var(--text-muted);">kgCO₂e/hr</span></div></div>
        <div><div style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--text-muted);margin-bottom:4px;">ABOVE LIMIT</div><div style="font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;color:var(--red);">+340%</div></div>
        <div><div style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--text-muted);margin-bottom:4px;">EST. RESOLUTION</div><div style="font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;color:var(--amber);">72 hrs</div></div>
      </div>
      <div style="margin-top:10px;font-size:11px;color:var(--text-secondary);line-height:1.6;">
        <strong style="color:var(--text-primary);">Root cause:</strong> Compressor seal failure at injection point. Auto-remediation protocol triggered at 09:41. Field crew dispatched. If unresolved within 30 days, annual Scope 1 impact: <span style="color:var(--red);">+0.04 MtCO₂e</span>.
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-text">HOTSPOT ANALYSIS · 2 CRITICAL · 3 WARNING · {{ data.filters().period }}</div>
      <div class="footer-text">OGMP 2.0 LEVEL 4 REPORTING</div>
    </div>
  `
})
export class HotspotComponent {
  readonly data = inject(EasDataService);

  heatCols = ['W1','W2','W3','W4','W5'];
  heatRows = [
    { label:'C-07-PB',  cells:[1200,1800,2400,3100,3847] },
    { label:'P-14-GC',  cells:[1800,1900,2000,2050,2102] },
    { label:'R-02-ML',  cells:[1500,1580,1600,1630,1654] },
    { label:'W-08-NS',  cells:[900,950,960,975,987]       },
    { label:'T-11-OF',  cells:[580,590,600,608,612]       },
  ];

  topEmitters = [
    { id:'C-07-PB', val:3847, status:'CRITICAL', badge:'badge-crit', color:'var(--red)'   },
    { id:'P-14-GC', val:2102, status:'WARNING',  badge:'badge-warn', color:'var(--amber)' },
    { id:'R-02-ML', val:1654, status:'WARNING',  badge:'badge-warn', color:'var(--amber)' },
    { id:'W-08-NS', val:987,  status:'NORMAL',   badge:'badge-ok',   color:'var(--green)' },
    { id:'T-11-OF', val:612,  status:'NORMAL',   badge:'badge-ok',   color:'var(--green)' },
  ];

  heatColor(v: number): string {
    const norm = Math.min(v / 4000, 1);
    if (norm > 0.75) return `rgba(231,76,60,${0.4 + norm * 0.6})`;
    if (norm > 0.4)  return `rgba(245,166,35,${0.3 + norm * 0.5})`;
    return `rgba(46,204,113,${0.2 + norm * 0.4})`;
  }
  alertClass(s: string) { return s === 'CRITICAL' ? 'alert-crit' : s === 'WARNING' ? 'alert-warn' : 'alert-info'; }
  alertIcon(s: string)  { return s === 'CRITICAL' ? '⚠' : s === 'WARNING' ? '△' : 'ℹ'; }
}

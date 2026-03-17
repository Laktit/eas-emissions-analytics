import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EasDataService } from '../../../core/services/eas-data.service';

@Component({
  selector: 'eas-asset-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Asset Inventory</div>
        <div class="page-subtitle">31 MONITORED ASSETS · OGMP 2.0 CLASSIFIED · <span>LIVE SYNC</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost">↓ Export CSV</button>
        <button class="btn btn-primary">+ Add Asset</button>
      </div>
    </div>

    <div class="status-bar">
      <div class="status-pill pill-green"><div class="pill-dot"></div>24 NORMAL</div>
      <div class="status-pill pill-amber"><div class="pill-dot"></div>5 WARNING</div>
      <div class="status-pill pill-red"><div class="pill-dot"></div>2 CRITICAL</div>
      <div class="status-pill pill-blue"><div class="pill-dot"></div>31 TOTAL ASSETS</div>
    </div>

    <div class="grid-4">
      @for (stat of summaryStats; track stat.label) {
        <div class="card" [class]="stat.cardClass">
          <div class="card-header"><div class="card-title">{{ stat.label }}</div></div>
          <div class="kpi-value" [style.color]="stat.color">{{ stat.value }}</div>
          <div class="kpi-label">{{ stat.sub }}</div>
        </div>
      }
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">ASSET REGISTER</div>
        <div style="display:flex;gap:6px;">
          @for (f of filters; track f) {
            <span class="chip" [class.active]="activeFilter === f" (click)="activeFilter = f">{{ f }}</span>
          }
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>ASSET ID</th><th>NAME</th><th>SEGMENT</th><th>REGION</th>
            <th>kgCO₂e/hr</th><th>OGMP LVL</th><th>SENSORS</th><th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          @for (a of filteredAssets; track a.id) {
            <tr>
              <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--amber);">{{ a.id }}</td>
              <td style="font-size:11px;">{{ a.name }}</td>
              <td><span class="tag" [ngClass]="segTag(a.segment)">{{ a.segment }}</span></td>
              <td style="color:var(--text-muted);font-size:10px;">{{ a.region }}</td>
              <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;" [style.color]="rateColor(a.kgco2)">{{ a.kgco2.toLocaleString() }}</td>
              <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text-muted);">L{{ a.ogmpLevel }}</td>
              <td style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--text-secondary);">{{ a.sensors }}</td>
              <td><span class="badge" [ngClass]="statusBadge(a.status)">{{ a.status }}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <div class="page-footer">
      <div class="footer-text">ASSET INVENTORY · {{ filteredAssets.length }} ASSETS SHOWN · {{ data.filters().period }}</div>
      <div class="footer-text">OGMP LEVEL 4 COMPLIANT · ISO 50001 TRACKED</div>
    </div>
  `
})
export class AssetInventoryComponent {
  readonly data = inject(EasDataService);
  activeFilter = 'ALL';
  filters = ['ALL', 'UPSTREAM', 'MIDSTREAM', 'DOWNSTREAM', 'CRITICAL'];

  readonly allAssets = [
    { id:'C-07-PB',  name:'Permian Compressor 07',     segment:'UPSTREAM',   region:'PERMIAN',  kgco2:3847, ogmpLevel:4, sensors:28, status:'CRITICAL' },
    { id:'P-14-GC',  name:'Gulf Coast Pipeline 14',    segment:'MIDSTREAM',  region:'GULF',     kgco2:2102, ogmpLevel:4, sensors:14, status:'WARNING'  },
    { id:'R-02-ML',  name:'Midland Refinery 02',       segment:'DOWNSTREAM', region:'PERMIAN',  kgco2:1654, ogmpLevel:3, sensors:31, status:'WARNING'  },
    { id:'W-08-NS',  name:'North Sea Well 08',         segment:'UPSTREAM',   region:'NORTHSEA', kgco2:987,  ogmpLevel:5, sensors:19, status:'NORMAL'   },
    { id:'T-11-OF',  name:'Offshore Terminal 11',      segment:'MIDSTREAM',  region:'OFFSHORE', kgco2:612,  ogmpLevel:4, sensors:22, status:'NORMAL'   },
    { id:'C-02-PB',  name:'Permian Compressor 02',     segment:'UPSTREAM',   region:'PERMIAN',  kgco2:543,  ogmpLevel:4, sensors:18, status:'NORMAL'   },
    { id:'W-14-GC',  name:'Gulf Well 14',              segment:'UPSTREAM',   region:'GULF',     kgco2:498,  ogmpLevel:3, sensors:11, status:'NORMAL'   },
    { id:'P-07-NS',  name:'North Sea Pipeline 07',     segment:'MIDSTREAM',  region:'NORTHSEA', kgco2:421,  ogmpLevel:5, sensors:16, status:'NORMAL'   },
    { id:'D-03-OF',  name:'Offshore Drilling 03',      segment:'UPSTREAM',   region:'OFFSHORE', kgco2:388,  ogmpLevel:4, sensors:24, status:'NORMAL'   },
    { id:'R-09-GC',  name:'Gulf Coast Refinery 09',    segment:'DOWNSTREAM', region:'GULF',     kgco2:312,  ogmpLevel:3, sensors:27, status:'NORMAL'   },
  ];

  summaryStats = [
    { label:'TOTAL ASSETS',   value:'31',    sub:'All regions',        color:'var(--text-primary)', cardClass:'' },
    { label:'OGMP L4/L5',     value:'18',    sub:'58% of portfolio',   color:'var(--green)',         cardClass:'card-green' },
    { label:'AT-RISK ASSETS', value:'7',     sub:'Require attention',  color:'var(--amber)',         cardClass:'card-amber' },
    { label:'CRITICAL',       value:'2',     sub:'Immediate action',   color:'var(--red)',           cardClass:'card-red' },
  ];

  get filteredAssets() {
    if (this.activeFilter === 'ALL') return this.allAssets;
    if (this.activeFilter === 'CRITICAL') return this.allAssets.filter(a => a.status === 'CRITICAL');
    return this.allAssets.filter(a => a.segment === this.activeFilter);
  }

  segTag(s: string) { return s === 'UPSTREAM' ? 'tag-up' : s === 'MIDSTREAM' ? 'tag-mid' : 'tag-down'; }
  statusBadge(s: string) { return s === 'CRITICAL' ? 'badge-crit' : s === 'WARNING' ? 'badge-warn' : 'badge-ok'; }
  rateColor(v: number) { return v > 3000 ? 'var(--red)' : v > 1000 ? 'var(--amber)' : 'var(--text-secondary)'; }
}

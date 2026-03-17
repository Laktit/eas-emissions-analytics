import { Component, inject, signal, computed, HostBinding } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './core/services/theme.service';
import { EasDataService } from './core/services/eas-data.service';
import { FilterState } from './core/models/eas.models';

interface NavTab { id: string; label: string; dotClass: string; route: string; }
interface SidebarSection { label: string; items: { id: string; icon: string; label: string; badge?: string|number; route: string; }[]; }

@Component({
  selector: 'eas-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- ═══ TOP NAV ═══ -->
    <nav>
      <div class="nav-logo">
        <div class="nav-logo-icon">E</div>
        <div class="nav-logo-text"><span>E</span>AS</div>
      </div>

      <div class="nav-tabs">
        @for (tab of navTabs; track tab.id) {
          <div class="nav-tab"
               [class.active]="activeTab() === tab.id"
               (click)="setActiveTab(tab)">
            <div class="dot" [class]="tab.dotClass"></div>
            {{ tab.label }}
          </div>
        }
      </div>

      <div class="nav-right">
        <div class="nav-badge">OGMP 2.0 ✓</div>
        <div class="nav-badge" style="border-color:var(--blue-dim);color:var(--blue);">SEC READY</div>
        <div class="live-indicator">
          <div class="live-dot"></div>LIVE
        </div>
        <!-- Theme toggle -->
        <button class="theme-toggle" (click)="theme.toggle()" [title]="theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
          <div class="theme-toggle-thumb">{{ theme.theme() === 'dark' ? '🌙' : '☀️' }}</div>
        </button>
        <div class="nav-avatar">KR</div>
      </div>
    </nav>

    <!-- ═══ GLOBAL FILTER BAR ═══ -->
    <div class="global-filter-bar">
      <div class="filter-group">
        <div class="filter-label">PERIOD:</div>
        @for (p of periods; track p) {
          <div class="filter-btn" [class.active]="data.filters().period === p" (click)="setFilter('period', p)">{{ p }}</div>
        }
      </div>
      <div class="filter-divider"></div>
      <div class="filter-group">
        <div class="filter-label">SEGMENT:</div>
        @for (s of segments; track s.val) {
          <div class="filter-btn" [class.active]="data.filters().segment === s.val" (click)="setFilter('segment', s.val)">{{ s.label }}</div>
        }
      </div>
      <div class="filter-divider"></div>
      <div class="filter-group">
        <div class="filter-label">REGION:</div>
        @for (r of regions; track r.val) {
          <div class="filter-btn" [class.active]="data.filters().region === r.val" (click)="setFilter('region', r.val)">{{ r.label }}</div>
        }
      </div>
      <div class="filter-divider"></div>
      <div class="filter-group">
        <div class="filter-label">SCOPE:</div>
        @for (s of scopes; track s.val) {
          <div class="filter-btn" [class.active]="data.filters().scope === s.val" (click)="setFilter('scope', s.val)">{{ s.label }}</div>
        }
      </div>
      <div class="filter-divider"></div>
      <div class="filter-group" style="margin-left:auto;">
        <div class="filter-label">EXPORT:</div>
        <div class="export-btn export-btn-excel" (click)="exportExcel()"><span>⊞</span> EXCEL</div>
        <div class="export-btn export-btn-pdf" (click)="exportPdf()"><span>⬡</span> PDF</div>
      </div>
    </div>

    <!-- ═══ APP SHELL ═══ -->
    <div class="app-shell">
      <!-- SIDEBAR -->
      <aside>
        @for (section of sidebarSections; track section.label) {
          <div class="sidebar-section-label">{{ section.label }}</div>
          @for (item of section.items; track item.id) {
            <a class="sidebar-item"
               [routerLink]="item.route"
               routerLinkActive="active"
               [routerLinkActiveOptions]="{exact: false}">
              <span class="sidebar-icon">{{ item.icon }}</span>
              {{ item.label }}
              @if (item.badge) {
                <span class="sidebar-badge">{{ item.badge }}</span>
              }
            </a>
          }
        }
      </aside>

      <!-- MAIN CONTENT -->
      <main>
        <router-outlet />
      </main>
    </div>

    <!-- ═══ TOAST ═══ -->
    @if (toast()) {
      <div class="toast show" [class]="'toast-' + toast()!.type">
        <span class="toast-icon">{{ toast()!.icon }}</span>
        {{ toast()!.msg }}
      </div>
    }
  `
})
export class AppComponent {
  readonly theme = inject(ThemeService);
  readonly data  = inject(EasDataService);
  private router = inject(Router);

  toast = signal<{ icon:string; msg:string; type:string } | null>(null);
  activeTab = signal('operations');

  readonly navTabs: NavTab[] = [
    { id:'operations',  label:'OPERATIONS',  dotClass:'dot dot-green',  route:'real-time-monitor' },
    { id:'analytics',   label:'ANALYTICS',   dotClass:'dot dot-blue',   route:'forecasting' },
    { id:'compliance',  label:'COMPLIANCE',  dotClass:'dot dot-amber',  route:'ogmp' },
    { id:'reporting',   label:'REPORTING',   dotClass:'dot dot-cyan',   route:'report-builder' },
    { id:'alerts',      label:'ALERTS',      dotClass:'dot dot-red',    route:'hotspot-analysis' },
  ];

  readonly sidebarSections: SidebarSection[] = [
    { label:'OPERATIONS', items:[
      { id:'real-time-monitor', icon:'◉', label:'Real-Time Monitor', route:'/real-time-monitor' },
      { id:'asset-inventory',   icon:'⬡', label:'Asset Inventory',   route:'/asset-inventory' },
      { id:'iot-sensor-feed',   icon:'⊞', label:'IoT Sensor Feed',   route:'/iot-sensor-feed' },
      { id:'hotspot-analysis',  icon:'△', label:'Hotspot Analysis',  route:'/hotspot-analysis', badge:2 },
    ]},
    { label:'ANALYTICS', items:[
      { id:'forecasting',  icon:'⤴', label:'Forecasting',     route:'/forecasting' },
      { id:'whatif',       icon:'⇌', label:'What-If Scenarios',route:'/whatif' },
      { id:'benchmarking', icon:'≈', label:'Benchmarking',     route:'/benchmarking' },
      { id:'sankey',       icon:'∑', label:'Sankey / Flow',    route:'/sankey' },
    ]},
    { label:'COMPLIANCE', items:[
      { id:'ogmp',           icon:'✦', label:'OGMP 2.0',      route:'/ogmp' },
      { id:'sec-csrd',       icon:'◈', label:'SEC / CSRD',    route:'/sec-csrd' },
      { id:'iso',            icon:'◇', label:'ISO 50001',     route:'/iso' },
      { id:'report-builder', icon:'⊡', label:'Report Builder',route:'/report-builder', badge:1 },
    ]},
    { label:'PLATFORM', items:[
      { id:'ai-assistant',  icon:'☆', label:'AI Assistant',  route:'/ai-assistant' },
      { id:'knowledge-hub', icon:'◻', label:'Knowledge Hub', route:'/knowledge-hub' },
      { id:'integrations',  icon:'⊕', label:'Integrations',  route:'/integrations' },
      { id:'settings',      icon:'⊙', label:'Settings',      route:'/settings' },
    ]},
  ];

  readonly periods  = ['YTD','QTD','MTD','CUSTOM'] as const;
  readonly segments = [{val:'ALL',label:'ALL'},{val:'UPSTREAM',label:'UPSTREAM'},{val:'MIDSTREAM',label:'MIDSTREAM'},{val:'DOWNSTREAM',label:'DOWNSTREAM'}] as const;
  readonly regions  = [{val:'ALL',label:'ALL REGIONS'},{val:'PERMIAN',label:'PERMIAN'},{val:'GULF',label:'GULF COAST'},{val:'NORTHSEA',label:'N. SEA'},{val:'OFFSHORE',label:'OFFSHORE'}] as const;
  readonly scopes   = [{val:'ALL',label:'ALL'},{val:'S1',label:'SCOPE 1'},{val:'S2',label:'SCOPE 2'}] as const;

  setFilter<K extends keyof FilterState>(key: K, val: FilterState[K]): void {
    this.data.setFilter(key, val);
  }

  setActiveTab(tab: NavTab): void {
    this.activeTab.set(tab.id);
    this.router.navigate([tab.route]);
  }

  exportExcel(): void {
    this.showToast('⊞', 'Generating Excel report…', 'green');
  }

  exportPdf(): void {
    this.showToast('⬡', 'Generating PDF report…', 'red');
  }

  private showToast(icon: string, msg: string, type: string): void {
    this.toast.set({ icon, msg, type });
    setTimeout(() => this.toast.set(null), 3200);
  }
}

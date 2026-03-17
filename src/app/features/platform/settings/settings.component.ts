import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'eas-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Settings</div>
        <div class="page-subtitle">PLATFORM CONFIGURATION · USER PREFERENCES</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" (click)="saved.set(true)">Save Changes</button>
      </div>
    </div>

    @if (saved()) {
      <div class="alert-strip alert-green">
        <span>✓</span>
        <div>Settings saved successfully</div>
        <button class="btn btn-ghost" style="font-size:9px;padding:3px 8px;" (click)="saved.set(false)">✕</button>
      </div>
    }

    <div class="grid-2">
      <!-- Display Settings -->
      <div class="card">
        <div class="card-header"><div class="card-title">DISPLAY SETTINGS</div></div>

        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">
          <div>
            <div style="font-size:12px;font-weight:500;margin-bottom:2px;">Theme</div>
            <div style="font-size:10px;color:var(--text-muted);">Toggle dark / light mode</div>
          </div>
          <button class="theme-toggle" (click)="theme.toggle()">
            <div class="theme-toggle-thumb">{{ theme.theme() === 'dark' ? '🌙' : '☀️' }}</div>
          </button>
        </div>

        @for (pref of displayPrefs; track pref.label) {
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">
            <div>
              <div style="font-size:12px;font-weight:500;margin-bottom:2px;">{{ pref.label }}</div>
              <div style="font-size:10px;color:var(--text-muted);">{{ pref.desc }}</div>
            </div>
            <label style="position:relative;width:44px;height:22px;cursor:pointer;">
              <input type="checkbox" [(ngModel)]="pref.enabled" style="opacity:0;width:0;height:0;">
              <div style="position:absolute;inset:0;border-radius:11px;transition:.3s;"
                [style.background]="pref.enabled ? 'var(--amber)' : 'var(--border-bright)'">
                <div style="position:absolute;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:.3s;"
                  [style.left]="pref.enabled ? '25px' : '3px'"></div>
              </div>
            </label>
          </div>
        }
      </div>

      <!-- Portfolio Settings -->
      <div class="card">
        <div class="card-header"><div class="card-title">PORTFOLIO CONFIGURATION</div></div>

        @for (setting of portfolioSettings; track setting.label) {
          <div style="padding:10px 0;border-bottom:1px solid var(--border);">
            <div style="font-size:12px;font-weight:500;margin-bottom:6px;">{{ setting.label }}</div>
            <div style="display:flex;align-items:center;gap:8px;">
              <input type="text" [(ngModel)]="setting.value"
                style="flex:1;background:var(--bg-elevated);border:1px solid var(--border-bright);border-radius:3px;color:var(--text-primary);font-size:11px;font-family:'IBM Plex Mono',monospace;padding:5px 8px;outline:none;">
              <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);">{{ setting.unit }}</span>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Notification settings -->
    <div class="card">
      <div class="card-header"><div class="card-title">ALERT THRESHOLDS</div></div>
      <div class="grid-4">
        @for (thresh of thresholds; track thresh.label) {
          <div style="padding:8px;background:var(--bg-elevated);border-radius:3px;border:1px solid var(--border-bright);">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--text-muted);margin-bottom:4px;">{{ thresh.label }}</div>
            <input type="number" [(ngModel)]="thresh.value"
              style="width:100%;background:transparent;border:none;color:var(--amber);font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700;outline:none;">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--text-muted);">{{ thresh.unit }}</div>
          </div>
        }
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-text">SETTINGS · EAS v2.4.1 · KR ENERGY PLATFORM</div>
    </div>
  `
})
export class SettingsComponent {
  readonly theme = inject(ThemeService);
  saved = signal(false);

  displayPrefs = [
    { label:'Live Data Feed',      desc:'Auto-refresh IoT feed every 1.8s', enabled:true  },
    { label:'Animated KPIs',       desc:'Bounce animation on filter change', enabled:true  },
    { label:'Demo Mode',           desc:'Show guided demo overlay',          enabled:false },
    { label:'Compact Sidebar',     desc:'Collapse sidebar labels',           enabled:false },
  ];

  portfolioSettings = [
    { label:'Company Name',        value:'KR Energy',              unit:'' },
    { label:'Fiscal Year End',     value:'December 31',            unit:'' },
    { label:'Reporting Currency',  value:'USD',                    unit:'' },
    { label:'Production Unit',     value:'BOE',                    unit:'barrels of oil equivalent' },
  ];

  thresholds = [
    { label:'METHANE ALERT',    value:3000, unit:'kgCO₂e/hr' },
    { label:'SCOPE 1 WARN',     value:1.20, unit:'MtCO₂e' },
    { label:'OGMP MIN LEVEL',   value:4,    unit:'level' },
    { label:'SENSOR OFFLINE',   value:30,   unit:'minutes' },
  ];
}

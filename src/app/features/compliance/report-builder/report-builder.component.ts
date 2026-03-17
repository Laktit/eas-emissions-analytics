import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eas-report-builder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Report Builder</div>
        <div class="page-subtitle">AUTOMATED REPORTING · MULTI-FRAMEWORK · <span>1 DRAFT READY</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost" (click)="generating.set(false)">Reset</button>
        <button class="btn btn-primary" (click)="generateReport()">Generate Report</button>
      </div>
    </div>

    <div class="grid-2">
      <!-- Configuration -->
      <div class="card">
        <div class="card-header"><div class="card-title">REPORT CONFIGURATION</div></div>

        <div style="margin-bottom:12px;">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);margin-bottom:6px;">FRAMEWORK</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            @for (f of frameworks; track f) {
              <span class="chip" [class.active]="selectedFrameworks.includes(f)" (click)="toggleFramework(f)">{{ f }}</span>
            }
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);margin-bottom:6px;">PERIOD</div>
          <div style="display:flex;gap:6px;">
            @for (p of periods; track p) {
              <span class="chip" [class.active]="selectedPeriod === p" (click)="selectedPeriod = p">{{ p }}</span>
            }
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);margin-bottom:6px;">FORMAT</div>
          <div style="display:flex;gap:6px;">
            @for (fmt of formats; track fmt) {
              <span class="chip" [class.active]="selectedFormat === fmt" (click)="selectedFormat = fmt">{{ fmt }}</span>
            }
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);margin-bottom:6px;">INCLUDE SECTIONS</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            @for (s of sections; track s) {
              <span class="chip active">{{ s }}</span>
            }
          </div>
        </div>
      </div>

      <!-- Build Steps -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">BUILD PIPELINE</div>
          @if (generating()) {
            <span class="badge badge-ok">● RUNNING</span>
          }
        </div>

        @for (step of buildSteps; track step.num; let i = $index) {
          @if (i > 0) { <div class="step-connector"></div> }
          <div class="report-step">
            <div class="step-num" [ngClass]="stepClass(step.num)">{{ step.num }}</div>
            <div class="step-info">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-desc">{{ step.desc }}</div>
            </div>
            @if (currentStep() >= step.num) {
              <span class="badge" [ngClass]="currentStep() > step.num ? 'badge-ok' : 'badge-warn'">
                {{ currentStep() > step.num ? '✓' : '...' }}
              </span>
            }
          </div>
        }

        @if (generating() && currentStep() === 5) {
          <div class="alert-strip alert-green" style="margin-top:10px;">
            <span>✓</span>
            <div>
              <div style="font-weight:600;">Report Ready — {{ selectedFormat }}</div>
              <div style="font-size:9.5px;opacity:.8;">{{ selectedFrameworks.join(' + ') }} · {{ selectedPeriod }}</div>
            </div>
            <button class="btn btn-primary" style="font-size:9px;padding:4px 10px;">↓ Download</button>
          </div>
        }
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-text">REPORT BUILDER · AUTOMATED · MULTI-FRAMEWORK · XBRL READY</div>
    </div>
  `
})
export class ReportBuilderComponent {
  frameworks = ['SEC','CSRD','OGMP 2.0','TCFD','GRI','CDP'];
  periods    = ['YTD 2026','Q1 2026','FY 2025','CUSTOM'];
  formats    = ['PDF','XLSX','XBRL','HTML'];
  sections   = ['Emissions','Compliance','Benchmarking','Forecasting'];

  selectedFrameworks = ['SEC', 'OGMP 2.0'];
  selectedPeriod     = 'YTD 2026';
  selectedFormat     = 'PDF';

  generating   = signal(false);
  currentStep  = signal(0);

  buildSteps = [
    { num:1, title:'Data Extraction',    desc:'Pull KPIs from all 847 sensors and SAP ERP' },
    { num:2, title:'Framework Mapping',  desc:'Map data fields to SEC / OGMP requirements' },
    { num:3, title:'AI Narrative',       desc:'Generate executive summary and commentary' },
    { num:4, title:'Assurance Check',    desc:'Internal controls and third-party flags' },
    { num:5, title:'Package & Export',   desc:'Generate final document with XBRL tags' },
  ];

  toggleFramework(f: string): void {
    const i = this.selectedFrameworks.indexOf(f);
    if (i > -1) this.selectedFrameworks.splice(i, 1);
    else this.selectedFrameworks.push(f);
  }

  generateReport(): void {
    this.generating.set(true);
    this.currentStep.set(1);
    const tick = setInterval(() => {
      this.currentStep.update(s => {
        if (s >= 5) { clearInterval(tick); return 5; }
        return s + 1;
      });
    }, 700);
  }

  stepClass(n: number): string {
    const c = this.currentStep();
    if (c > n)  return 'done';
    if (c === n) return 'active';
    return '';
  }
}

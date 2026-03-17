import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'eas-whatif',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">What-If Scenarios</div>
        <div class="page-subtitle">INTERACTIVE LEVERS · REAL-TIME IMPACT · <span>NET ZERO MODELLING</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost" (click)="resetLevers()">Reset Defaults</button>
        <button class="btn btn-primary">Save Scenario</button>
      </div>
    </div>

    <div class="context-banner">
      <span>⇌</span>
      <span>Adjust the levers below to model different emission reduction pathways. Impact updates in real-time.</span>
    </div>

    <div class="grid-2">
      <!-- Levers -->
      <div class="card">
        <div class="card-header"><div class="card-title">REDUCTION LEVERS</div></div>
        @for (lever of levers; track lever.key) {
          <div class="scenario-slider-row">
            <div class="scenario-label">{{ lever.label }}</div>
            <input type="range" class="scenario-slider"
              [min]="lever.min" [max]="lever.max" [step]="lever.step"
              [(ngModel)]="lever.value" (ngModelChange)="recalc()">
            <div class="scenario-val">{{ lever.value }}{{ lever.unit }}</div>
          </div>
        }
      </div>

      <!-- Impact Panel -->
      <div class="card card-green">
        <div class="card-header">
          <div class="card-title">PROJECTED IMPACT</div>
          <span class="badge badge-ok">LIVE CALC</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;">
          @for (imp of impact(); track imp.label) {
            <div style="padding:10px;background:var(--bg-elevated);border-radius:3px;border:1px solid var(--border-bright);">
              <div style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--text-muted);margin-bottom:4px;">{{ imp.label }}</div>
              <div style="font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;" [style.color]="imp.color">{{ imp.value }}</div>
              <div style="font-size:9.5px;color:var(--text-muted);margin-top:2px;">{{ imp.sub }}</div>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Net Zero Timeline visualisation -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">NET ZERO TIMELINE COMPARISON</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        @for (scenario of scenarios(); track scenario.label) {
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);width:160px;flex-shrink:0;">{{ scenario.label }}</div>
            <div style="flex:1;height:20px;background:var(--border);border-radius:2px;overflow:hidden;position:relative;">
              <div style="position:absolute;left:0;top:0;height:100%;border-radius:2px;display:flex;align-items:center;padding-left:6px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:600;transition:width .6s ease;"
                [style.width]="scenario.width + '%'" [style.background]="scenario.color" [style.color]="scenario.textColor">
                {{ scenario.year }}
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-text">WHAT-IF SCENARIOS · LIVE MODELLING · AI-POWERED PROJECTIONS</div>
      <div class="footer-text">SENSITIVITY: ±4% · BASELINE: 2025</div>
    </div>
  `
})
export class WhatifComponent {
  levers = [
    { key:'electrification', label:'Fleet Electrification', min:0, max:100, step:5,  value:35,  unit:'%' },
    { key:'methane',         label:'Methane Detection',     min:0, max:100, step:5,  value:80,  unit:'%' },
    { key:'retrofit',        label:'Compressor Retrofit',   min:0, max:100, step:5,  value:60,  unit:'%' },
    { key:'renewable',       label:'Renewable Energy Mix',  min:0, max:100, step:5,  value:20,  unit:'%' },
    { key:'ccs',             label:'CCS Deployment',        min:0, max:20,  step:1,  value:5,   unit:'%' },
  ];

  impact = computed(() => {
    const elec  = this.levers[0].value;
    const meth  = this.levers[1].value;
    const ret   = this.levers[2].value;
    const ren   = this.levers[3].value;
    const ccs   = this.levers[4].value;
    const reduction = (elec * 0.0023) + (meth * 0.0018) + (ret * 0.0012) + (ren * 0.0009) + (ccs * 0.004);
    const pct   = Math.min(+(reduction * 100).toFixed(1), 68);
    const mt    = +(1.24 * (1 - reduction)).toFixed(2);
    const saving = +(elec * 0.052 + ret * 0.031).toFixed(1);
    const netZero = 2041 - Math.floor((pct - 12) / 4);
    return [
      { label:'PROJECTED SCOPE 1 (2026)',   value: mt + ' Mt',      sub:'vs 1.24 Mt baseline',           color:'var(--amber)' },
      { label:'TOTAL REDUCTION',             value: pct + '%',       sub:'vs 2025 baseline trajectory',   color:'var(--green)' },
      { label:'ANNUAL COST SAVING',          value: '$' + saving + 'M', sub:'opex optimisation',          color:'var(--blue)'  },
      { label:'NET ZERO TARGET',             value: String(netZero), sub:'revised from 2041',              color:'var(--cyan)'  },
    ];
  });

  scenarios = computed(() => {
    const elec  = this.levers[0].value;
    const meth  = this.levers[1].value;
    const base  = 2041;
    const curr  = base - Math.floor((elec + meth) / 14);
    return [
      { label:'BUSINESS AS USUAL', year: 2052, width: 100, color:'var(--red-dim)',   textColor:'var(--red)'   },
      { label:'CURRENT TRAJECTORY', year: 2041, width: 78,  color:'var(--amber-dim)', textColor:'var(--amber)' },
      { label:'THIS SCENARIO',      year: curr, width: Math.max(45, 78 - Math.floor((elec+meth)/8)), color:'var(--green-dim)', textColor:'var(--green)' },
      { label:'BEST CASE (ALL 100%)',year: 2035, width: 52,  color:'var(--blue-dim)',  textColor:'var(--blue)'  },
    ];
  });

  recalc(): void { /* signals auto-recompute */ }

  resetLevers(): void {
    this.levers[0].value = 35;
    this.levers[1].value = 80;
    this.levers[2].value = 60;
    this.levers[3].value = 20;
    this.levers[4].value = 5;
  }
}

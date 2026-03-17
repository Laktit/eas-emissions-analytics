import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eas-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class]="cardClass">
      <div class="card-header">
        <div class="card-title">{{ label }}</div>
      </div>
      <div class="kpi-value" [class]="valueClass">
        {{ value }}<span class="kpi-unit">{{ unit }}</span>
      </div>
      <div class="kpi-delta" [ngClass]="trendClass">
        {{ trendIcon }} {{ trendText }}
      </div>
      <div class="kpi-label">{{ sublabel }}</div>
    </div>
  `
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() unit = '';
  @Input() trend = 0;
  @Input() sublabel = '';
  @Input() cardClass = '';
  @Input() valueClass = '';
  @Input() invertTrend = false; // for methane: up is bad

  get trendClass(): string {
    const isDown = this.trend < 0;
    const isBad  = this.invertTrend ? !isDown : isDown;
    if (this.trend === 0) return 'kpi-delta delta-neutral';
    return 'kpi-delta ' + (isBad ? 'delta-down' : 'delta-up');
  }
  get trendIcon(): string { return this.trend < 0 ? '▼' : '▲'; }
  get trendText(): string { return `${Math.abs(this.trend)}% ${this.trend < 0 ? 'vs prior' : 'vs target'}`; }
}

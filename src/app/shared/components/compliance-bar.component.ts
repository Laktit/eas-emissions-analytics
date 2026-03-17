import { Component, Input } from '@angular/core';

@Component({
  selector: 'eas-compliance-bar',
  standalone: true,
  template: `
    <div class="compliance-item">
      <div class="compliance-header">
        <div class="compliance-name">{{ label }}</div>
        <div class="compliance-pct" [style.color]="color">{{ pct }}%</div>
      </div>
      <div class="compliance-bar-bg">
        <div class="compliance-bar-fill" [style.width]="pct + '%'" [style.background]="color"></div>
      </div>
    </div>
  `
})
export class ComplianceBarComponent {
  @Input() label = '';
  @Input() pct   = 0;
  get color(): string {
    if (this.pct >= 90) return 'var(--green)';
    if (this.pct >= 70) return 'var(--amber)';
    return 'var(--red)';
  }
}

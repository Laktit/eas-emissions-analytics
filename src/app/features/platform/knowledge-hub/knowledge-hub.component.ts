import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eas-knowledge-hub',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Knowledge Hub</div>
        <div class="page-subtitle">METHODOLOGY · STANDARDS · <span>DOCUMENTATION</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary">+ Upload Document</button>
      </div>
    </div>

    <div class="grid-3">
      @for (doc of docs; track doc.title) {
        <div class="card" style="cursor:pointer;transition:border-color .2s;" (mouseenter)="doc.hover=true" (mouseleave)="doc.hover=false" [style.borderColor]="doc.hover ? 'var(--amber)' : ''">
          <div style="font-size:24px;margin-bottom:8px;">{{ doc.icon }}</div>
          <div style="font-size:13px;font-weight:600;margin-bottom:4px;">{{ doc.title }}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-bottom:10px;line-height:1.5;">{{ doc.desc }}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--text-muted);">{{ doc.updated }}</span>
            <span class="badge badge-info">{{ doc.type }}</span>
          </div>
        </div>
      }
    </div>

    <div class="page-footer">
      <div class="footer-text">KNOWLEDGE HUB · {{ docs.length }} DOCUMENTS · INTERNAL USE ONLY</div>
    </div>
  `
})
export class KnowledgeHubComponent {
  docs = [
    { icon:'📘', title:'OGMP 2.0 Methodology',     desc:'Level 4 measurement and reporting guidance for oil & gas methane',         updated:'Updated Jan 2026', type:'PDF', hover:false },
    { icon:'⚖️', title:'SEC Climate Rules Guide',   desc:'SEC climate-related disclosure requirements — final rules 2024',           updated:'Updated Mar 2025', type:'PDF', hover:false },
    { icon:'🌱', title:'CSRD ESRS E1 Handbook',     desc:'European Sustainability Reporting Standards — climate & environment',       updated:'Updated Feb 2026', type:'PDF', hover:false },
    { icon:'🔥', title:'Methane Abatement Guide',   desc:'Best practices for leak detection and compressor maintenance programmes',   updated:'Updated Dec 2025', type:'PDF', hover:false },
    { icon:'📊', title:'GHG Protocol (Scope 1-3)',  desc:'Corporate GHG accounting and reporting standard — revised edition',        updated:'Updated 2022',     type:'PDF', hover:false },
    { icon:'🏭', title:'ISO 50001:2018 Standard',   desc:'Energy management systems — requirements and implementation guidance',      updated:'Updated 2018',     type:'PDF', hover:false },
    { icon:'🛰', title:'GHGSat User Manual',        desc:'Satellite methane measurement integration and data interpretation guide',   updated:'Updated Nov 2025', type:'PDF', hover:false },
    { icon:'📋', title:'Internal EHS Policy',       desc:'KR Energy environmental health and safety policy framework v3.2',          updated:'Updated Oct 2025', type:'DOC', hover:false },
    { icon:'🧮', title:'Emission Factor Tables',    desc:'EPA + DEFRA + ecoinvent combined emission factor reference tables',        updated:'Updated Jan 2026', type:'XLSX', hover:false },
  ];
}

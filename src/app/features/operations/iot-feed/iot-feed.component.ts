import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FeedItem { time: string; text: string; val: string; type: string; }

const FEED_TEMPLATES = [
  { text: 'C-07-PB methane reading',       val: () => (3800 + Math.random()*200).toFixed(0) + ' kgCO₂e/hr', type: 'red' },
  { text: 'P-14-GC pressure nominal',      val: () => (2080 + Math.random()*50).toFixed(0)  + ' kgCO₂e/hr', type: 'amber' },
  { text: 'W-08-NS sensor heartbeat',      val: () => (960 + Math.random()*30).toFixed(0)   + ' kgCO₂e/hr', type: 'green' },
  { text: 'SAP ERP sync complete',         val: () => (1200 + Math.floor(Math.random()*10)) + ' records',    type: 'blue' },
  { text: 'GHGSat pass coverage',          val: () => (65 + Math.random()*5).toFixed(1)     + '% complete',  type: 'blue' },
  { text: 'T-11-OF offshore reading',      val: () => (600 + Math.random()*20).toFixed(0)   + ' kgCO₂e/hr', type: 'green' },
  { text: 'D-03-OF offshore drill sensor', val: () => (380 + Math.random()*15).toFixed(0)   + ' kgCO₂e/hr', type: 'green' },
  { text: 'R-02-ML refinery downstream',   val: () => (1640 + Math.random()*30).toFixed(0)  + ' kgCO₂e/hr', type: 'amber' },
];

@Component({
  selector: 'eas-iot-feed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">IoT Sensor Feed</div>
        <div class="page-subtitle">LEUCIPA INTEGRATION · 847 SENSORS · <span>2,341 EVENTS/MIN</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost" (click)="togglePause()">{{ paused() ? '▶ Resume' : '⏸ Pause' }}</button>
        <button class="btn btn-primary">Configure</button>
      </div>
    </div>

    <div class="status-bar">
      <div class="status-pill pill-green"><div class="pill-dot"></div>847 / 851 ONLINE</div>
      <div class="status-pill pill-amber"><div class="pill-dot"></div>4 SENSORS OFFLINE</div>
      <div class="status-pill pill-blue"><div class="pill-dot"></div>1.2s AVG LATENCY</div>
      <div class="status-pill pill-green"><div class="pill-dot"></div>{{ paused() ? 'PAUSED' : 'LIVE STREAM' }}</div>
    </div>

    <div class="grid-4">
      @for (stat of sensorStats; track stat.label) {
        <div class="card" [class]="stat.cardClass">
          <div class="card-header"><div class="card-title">{{ stat.label }}</div></div>
          <div class="kpi-value" [style.color]="stat.color">{{ stat.value }}</div>
          <div class="kpi-label">{{ stat.sub }}</div>
        </div>
      }
    </div>

    <div class="grid-2">
      <!-- Live Feed -->
      <div class="card" style="min-height:320px;">
        <div class="card-header">
          <div class="card-title">LIVE EVENT STREAM</div>
          <div style="display:flex;align-items:center;gap:6px;font-family:'IBM Plex Mono',monospace;font-size:9px;" [style.color]="paused() ? 'var(--text-muted)' : 'var(--green)'">
            @if (!paused()) { <div class="live-dot"></div> }
            {{ paused() ? 'PAUSED' : 'STREAMING' }}
          </div>
        </div>
        <div style="max-height:280px;overflow-y:auto;">
          @for (item of feed(); track $index) {
            <div class="feed-item">
              <div class="feed-time">{{ item.time }}</div>
              <div class="feed-text">{{ item.text }}</div>
              <div class="feed-val" [style.color]="feedColor(item.type)">{{ item.val }}</div>
            </div>
          }
        </div>
      </div>

      <!-- Sensor Map -->
      <div class="card">
        <div class="card-header"><div class="card-title">SENSOR MAP — ACTIVE NODES</div></div>
        <div class="map-placeholder" style="height:280px;">
          <div class="map-grid"></div>
          @for (dot of mapDots; track dot.id) {
            <div class="map-dot" [style.left]="dot.x + '%'" [style.top]="dot.y + '%'"
              [style.width]="dot.size + 'px'" [style.height]="dot.size + 'px'"
              [style.background]="dot.color" [style.boxShadow]="'0 0 ' + dot.size + 'px ' + dot.color"
              [title]="dot.id">
            </div>
          }
          <div style="position:absolute;bottom:8px;left:10px;font-family:'IBM Plex Mono',monospace;font-size:8px;color:var(--text-muted);">
            ■ <span style="color:var(--green)">Normal</span> &nbsp;
            ■ <span style="color:var(--amber)">Warning</span> &nbsp;
            ■ <span style="color:var(--red)">Critical</span>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-text">IOT SENSOR FEED · LEUCIPA v4.2 · 2,341 EVENTS/MIN</div>
      <div class="footer-text">LATENCY: 1.2s · UPTIME: 99.8%</div>
    </div>
  `
})
export class IotFeedComponent implements OnInit, OnDestroy {
  paused  = signal(false);
  feed    = signal<FeedItem[]>([]);
  private interval?: ReturnType<typeof setInterval>;

  sensorStats = [
    { label:'ACTIVE SENSORS', value:'847',   sub:'of 851 total',     color:'var(--green)',  cardClass:'card-green' },
    { label:'EVENTS/MIN',      value:'2,341', sub:'avg last 5 min',   color:'var(--blue)',   cardClass:'card-blue'  },
    { label:'AVG LATENCY',     value:'1.2s',  sub:'p95: 2.1s',        color:'var(--amber)',  cardClass:''           },
    { label:'OFFLINE',         value:'4',     sub:'sensors down',     color:'var(--red)',    cardClass:'card-red'   },
  ];

  mapDots = [
    { id:'C-07-PB', x:28, y:45, size:12, color:'var(--red)'   },
    { id:'P-14-GC', x:52, y:62, size:9,  color:'var(--amber)' },
    { id:'W-08-NS', x:65, y:18, size:8,  color:'var(--green)' },
    { id:'T-11-OF', x:78, y:72, size:7,  color:'var(--green)' },
    { id:'C-02-PB', x:32, y:55, size:7,  color:'var(--green)' },
    { id:'R-02-ML', x:42, y:48, size:8,  color:'var(--amber)' },
    { id:'D-03-OF', x:85, y:55, size:7,  color:'var(--green)' },
    { id:'P-07-NS', x:60, y:22, size:7,  color:'var(--green)' },
  ];

  ngOnInit(): void {
    this.pushFeed();
    this.interval = setInterval(() => { if (!this.paused()) this.pushFeed(); }, 1800);
  }

  ngOnDestroy(): void { if (this.interval) clearInterval(this.interval); }

  togglePause(): void { this.paused.update(v => !v); }

  private pushFeed(): void {
    const t = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)];
    const now = new Date();
    const item: FeedItem = {
      time: `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`,
      text: t.text,
      val:  t.val(),
      type: t.type
    };
    this.feed.update(f => [item, ...f].slice(0, 40));
  }

  feedColor(type: string): string {
    return type === 'red' ? 'var(--red)' : type === 'amber' ? 'var(--amber)' : type === 'blue' ? 'var(--blue)' : 'var(--green)';
  }
}

import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/services/ai.service';

@Component({
  selector: 'eas-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <div class="page-title">Talk to Your Data</div>
        <div class="page-subtitle">AI-POWERED · LIVE CONTEXT · <span>GROUNDED IN EAS DATA</span></div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost" (click)="ai.clear(); usedFaqs.set([])">Clear Chat</button>
      </div>
    </div>

    <!-- Status banner -->
    <div style="background:linear-gradient(90deg,rgba(245,166,35,0.07),rgba(52,152,219,0.04));border:1px solid var(--amber-dim);border-radius:4px;padding:11px 16px;display:flex;align-items:center;gap:14px;flex-shrink:0;">
      <div style="font-size:20px;">⬡</div>
      <div style="flex:1;">
        <div style="font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:600;color:var(--amber);letter-spacing:1px;">Your data is loaded. Ask anything.</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:1px;font-family:'IBM Plex Mono',monospace;">KR Energy · YTD 2026 · 847 sensors · OGMP 2.0 · SEC · CSRD · ISO 50001</div>
      </div>
      <div style="display:flex;align-items:center;gap:5px;font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1px;" [style.color]="ai.loading() ? 'var(--amber)' : 'var(--green)'">
        <div style="width:6px;height:6px;border-radius:50%;background:currentColor;" [style.animation]="ai.loading() ? 'pulse 0.6s infinite' : 'pulse 1.5s infinite'"></div>
        {{ ai.loading() ? 'THINKING…' : 'LIVE' }}
      </div>
    </div>

    <!-- FAQ Chips -->
    <div style="display:flex;flex-direction:column;gap:7px;">
      <div style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-muted);letter-spacing:2px;">FREQUENTLY ASKED</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        @for (q of ai.FAQ_QUESTIONS; track q) {
          <button class="faq-chip"
            [class.used]="usedFaqs().includes(q)"
            [disabled]="ai.loading()"
            (click)="askFaq(q)">{{ q }}</button>
        }
      </div>
    </div>

    <!-- Chat window -->
    <div class="card" style="display:flex;flex-direction:column;flex:1;min-height:360px;">
      <div class="card-header" style="flex-shrink:0;">
        <div class="card-title">CONVERSATION</div>
        @if (ai.loading()) {
          <span style="font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--amber);animation:pulse 1s infinite;">● AI IS THINKING…</span>
        }
      </div>

      <div #chatContainer style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:2px 2px 10px;min-height:0;">
        @for (msg of ai.messages(); track $index) {
          <div class="chat-bubble" [class.chat-ai]="msg.role === 'assistant'" [class.chat-user]="msg.role === 'user'">
            <div class="chat-sender" [style.textAlign]="msg.role === 'user' ? 'right' : 'left'">
              {{ msg.role === 'assistant' ? 'EAS AI' : 'You' }}
              @if (msg.timestamp) {
                <span style="margin-left:8px;opacity:.5;">{{ formatTime(msg.timestamp) }}</span>
              }
            </div>
            <div [innerHTML]="formatMessage(msg.content)"></div>
          </div>
        }
        @if (ai.loading()) {
          <div class="chat-bubble chat-ai">
            <div class="chat-sender">EAS AI</div>
            <span style="opacity:.5;font-style:italic;">Analysing your data…</span>
          </div>
        }
      </div>

      <div class="chat-input-row" style="flex-shrink:0;">
        <input #chatInput type="text" class="chat-input"
          [(ngModel)]="inputText"
          [disabled]="ai.loading()"
          placeholder="Ask about emissions, compliance, forecasts, targets…"
          (keydown.enter)="send()">
        <button class="chat-send" [disabled]="ai.loading() || !inputText.trim()" (click)="send()">↑</button>
      </div>
    </div>

    <div class="page-footer">
      <div class="footer-text">TALK TO YOUR DATA · POWERED BY CLAUDE AI · KR ENERGY · EAS v2.4.1</div>
    </div>
  `
})
export class AiAssistantComponent implements AfterViewChecked {
  readonly ai = inject(AiService);
  inputText = '';
  usedFaqs  = signal<string[]>([]);

  @ViewChild('chatContainer') chatContainer?: ElementRef<HTMLDivElement>;

  ngAfterViewChecked(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  async askFaq(q: string): Promise<void> {
    if (this.ai.loading() || this.usedFaqs().includes(q)) return;
    this.usedFaqs.update(f => [...f, q]);
    await this.ai.ask(q);
  }

  async send(): Promise<void> {
    const q = this.inputText.trim();
    if (!q || this.ai.loading()) return;
    this.inputText = '';
    await this.ai.ask(q);
  }

  formatTime(d: Date): string {
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }

  formatMessage(content: string): string {
    return content
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p style="margin-top:6px;">')
      .replace(/\n/g, '<br>');
  }
}

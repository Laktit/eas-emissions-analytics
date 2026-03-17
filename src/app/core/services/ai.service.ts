import { Injectable, signal } from '@angular/core';
import { ChatMessage } from '../models/eas.models';

const EAS_SYSTEM = `You are the EAS (Emissions Analytics Solution) AI assistant for KR Energy's sustainability team. You have full access to live portfolio data below. Reply as a sharp, senior sustainability analyst — concise, specific, use real numbers. 3-4 short paragraphs max. Plain prose, no markdown bullets or headers.

KR ENERGY LIVE DATA — YTD 2026:

EMISSIONS: Scope 1: 1.24 MtCO2e (▼7.3% YoY). Scope 2: 0.38 MtCO2e (▼12.1% YoY). Methane intensity: 0.14% (▲0.02% above 0.12% target — C-07 breach is cause). Carbon intensity: 18.4 kgCO2e/BOE vs industry avg 24.1.

2026 TARGETS: Scope 1 target: 1.18 Mt (currently 5% above run-rate). Scope 2 target: 0.35 Mt (8.6% above). Methane: ≤0.12% (breached by 0.02%). Carbon intensity: ≤18.0 (currently 0.4 above).

ACTIVE ALERTS: CRITICAL — C-07-PB Permian Basin: 3,847 kgCO2e/hr, 340% above OGMP L4 limit, auto-remediation triggered, est. 72hr to resolve. If not resolved in 30 days: adds ~0.04 Mt to 2026 total. CRITICAL — SNS-R02-11 sensor offline 34min, data gap. WARNING — P-14-GC Gulf Coast 12% above baseline.

FORECASTING (87% confidence): 2025 baseline: 1.24 Mt. 2026 projection: 1.09 Mt (▼12%). Without C-07 resolution: 1.16 Mt. 2027: 0.91 Mt. Net zero: 2041. C-07 is a baseline deviation — forecast update warranted.

WHAT-IF LEVERS: Fleet electrification 35%→80%: −23% emissions, $4.2M savings. Methane detection 80%: net zero moves to 2038. CCS at 5%: expensive, low ROI. Compressor retrofit at 60%.

COMPLIANCE: OGMP 2.0: 78% (target 85% Q2). Gap: GHGSat aerial sync 67%, 12 sites below L4. SEC: 91%, deadline Apr 1 2026 (34 days). Gaps: Scenario Analysis 45%, XBRL 65%. CSRD ESRS E1: 65%. Biodiversity: 12%. ISO 50001: 96%, energy intensity 8.4 GJ/BOE ▼6.2%. TCFD: 88%. Audit readiness: 83/100.

BENCHMARKING: KR Energy rank #2 of 14 peers. 18.4 vs avg 24.1 kgCO2e/BOE. Best peer: 16.3.

Today: Feb 26, 2026. Fiscal year end: Dec 31, 2026.`;

@Injectable({ providedIn: 'root' })
export class AiService {
  readonly messages = signal<ChatMessage[]>([{
    role: 'assistant',
    content: `I have full visibility of your KR Energy portfolio. **3 priority items** today: C-07 methane breach in the Permian (340% above OGMP limit), SEC Q1 2026 filing due in 34 days, and CSRD biodiversity at 12%. Click a question above or ask your own below.`,
    timestamp: new Date()
  }]);

  readonly loading = signal(false);

  readonly FAQ_QUESTIONS = [
    'Are we on target by end of the year?',
    'Do we need to update our forecasting vs baseline?',
    'What\'s our biggest compliance risk right now?',
    'How does C-07 affect our annual Scope 1?',
    'What\'s our SEC readiness status?',
    'Can we accelerate our net zero target?',
  ];

  async ask(question: string): Promise<void> {
    if (this.loading() || !question.trim()) return;

    // Add user message
    this.messages.update(msgs => [...msgs, {
      role: 'user', content: question, timestamp: new Date()
    }]);
    this.loading.set(true);

    const history = this.messages()
      .filter(m => m.role === 'user' || (m.role === 'assistant' && m.content !== this.messages()[0].content))
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    try {
      // In development, calls go via the local proxy (server.js) to avoid CORS.
      // In production / when hosted inside claude.ai, the direct Anthropic URL works.
      const apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3001/api/chat'
        : 'https://api.anthropic.com/v1/messages';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 800,
          system: EAS_SYSTEM,
          messages: history
        })
      });

      const data = await res.json();

      if (data.error) {
        this.addError(data.error.message ?? 'API error');
      } else {
        const reply = (data.content as { text?: string }[] ?? []).map(b => b.text ?? '').join('');
        this.messages.update(msgs => [...msgs, { role: 'assistant', content: reply, timestamp: new Date() }]);
      }
    } catch (err: unknown) {
      this.addError(err instanceof Error ? err.message : 'Connection failed');
    }

    this.loading.set(false);
  }

  clear(): void {
    this.messages.set([{
      role: 'assistant',
      content: 'Session cleared. Full portfolio data still loaded — ask me anything.',
      timestamp: new Date()
    }]);
  }

  private addError(msg: string): void {
    this.messages.update(msgs => [...msgs, {
      role: 'assistant', content: `⚠️ ${msg}`, timestamp: new Date()
    }]);
  }
}

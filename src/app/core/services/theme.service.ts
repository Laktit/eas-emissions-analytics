import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>('dark');

  constructor() {
    // Restore saved preference
    const saved = localStorage.getItem('eas-theme') as Theme | null;
    if (saved === 'light') this.setTheme('light');

    // Apply theme class to body on every change
    effect(() => {
      document.body.classList.toggle('light', this.theme() === 'light');
    });
  }

  toggle(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private setTheme(t: Theme): void {
    this.theme.set(t);
    localStorage.setItem('eas-theme', t);
  }
}

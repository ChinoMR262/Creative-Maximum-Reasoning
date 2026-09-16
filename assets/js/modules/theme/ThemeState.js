/**
 * Creative Maximum Reasoning (CMR) — Theme State
 * Control dual e independiente del modo base (System / Light / Dark)
 * doc/CMR_Web_System_v2_Documentation/docs/11_THEME_SYSTEM.md
 */

export class ThemeState {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.mode = 'system'; // 'system' | 'light' | 'dark'
    this.systemQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.onSystemChange = this.onSystemChange.bind(this);
  }

  mount() {
    this.load();
    this.systemQuery.addEventListener('change', this.onSystemChange);
    this.apply();
  }

  destroy() {
    this.systemQuery.removeEventListener('change', this.onSystemChange);
  }

  load() {
    try {
      const stored = localStorage.getItem('cmr_theme_mode');
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        this.mode = stored;
      }
    } catch (_) {}
  }

  save() {
    try {
      localStorage.setItem('cmr_theme_mode', this.mode);
    } catch (_) {}
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    this.save();
    this.apply();

    if (this.eventBus) {
      this.eventBus.emit('theme:change', {
        mode: this.mode,
        resolved: this.getResolvedTheme()
      });
    }
  }

  getResolvedTheme() {
    if (this.mode === 'system') {
      return this.systemQuery.matches ? 'dark' : 'light';
    }
    return this.mode;
  }

  onSystemChange() {
    if (this.mode === 'system') {
      this.apply();
      if (this.eventBus) {
        this.eventBus.emit('theme:change', {
          mode: 'system',
          resolved: this.getResolvedTheme()
        });
      }
    }
  }

  apply() {
    const resolved = this.getResolvedTheme();
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeMode = this.mode;

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolved === 'dark' ? '#0c0c0e' : '#f5f4ef');
    }
  }

  cycle() {
    const sequence = ['system', 'dark', 'light'];
    const nextIdx = (sequence.indexOf(this.mode) + 1) % sequence.length;
    this.setMode(sequence[nextIdx]);
  }
}

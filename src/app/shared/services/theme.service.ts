import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private key = 'theme-preference';
  private _theme$ = new BehaviorSubject<Theme>(this.load());

  get theme$() {
    return this._theme$;
  }

  toggle() {
    const next: Theme = this._theme$.value === 'light' ? 'dark' : 'light';
    this.set(next);
  }

  set(theme: Theme) {
    this._theme$.next(theme);
    localStorage.setItem(this.key, theme);
    this.apply(theme);
  }

  private load(): Theme {
    const stored = localStorage.getItem(this.key) as Theme | null;
    return stored ?? 'light';
  }

  apply(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  init() {
    this.apply(this._theme$.value);
    this._theme$.subscribe(t => this.apply(t));
  }
}

import { Component } from '@angular/core';
import { ThemeService, Theme } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  theme: Theme = 'light';

  constructor(private themeSvc: ThemeService) {
    this.themeSvc.init();
    this.themeSvc.theme$.subscribe(t => (this.theme = t));
  }

  themeToggle() {
    this.themeSvc.toggle();
  }

  logout() {
    // mock logout: pode limpar storage, redirecionar, etc.
    console.log('Logout mock');
    alert('Logout simulado.'); // ou implementar redirect para /login se tiver
  }
}

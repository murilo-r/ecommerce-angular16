import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ThemeService, Theme } from './shared/services/theme.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastsComponent } from './shared/components/toasts/toasts.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

// Mock do ThemeService para controle previsível
class MockThemeService {
  theme$ = of<Theme>('light');
  init() {}
  toggle() {}
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let themeSvc: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, ToastsComponent],
      providers: [
        { provide: ThemeService, useClass: MockThemeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    themeSvc = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o header com links e botões', () => {
    const headerEl = fixture.debugElement.query(By.css('header'));
    expect(headerEl).toBeTruthy();

    const homeLink = headerEl.query(By.css('a[routerLink="/"]'));
    const produtosLink = headerEl.query(By.css('a[routerLink="/produtos"]'));
    expect(homeLink).toBeTruthy();
    expect(produtosLink).toBeTruthy();

    const themeBtn = headerEl.query(By.css('button'));
    expect(themeBtn).toBeTruthy();

    const logoutBtn = headerEl.queryAll(By.css('button'))?.find(btn =>
      btn.nativeElement.textContent.trim().toLowerCase().includes('logout')
    );
    expect(logoutBtn).toBeTruthy();
  });

  it('deve incluir router-outlet e toasts', () => {
    const outlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(outlet).toBeTruthy();

    const toasts = fixture.debugElement.query(By.css('app-toasts'));
    expect(toasts).toBeTruthy();
  });

  it('chama toggleTheme ao clicar no botão de tema', () => {
    const spy = spyOn(component, 'themeToggle').and.callThrough();
    const themeBtn = fixture.debugElement.query(By.css('button.btn-link'));
    themeBtn.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });

  it('chama logout ao clicar no botão de logout', () => {
    const spy = spyOn(component, 'logout').and.callThrough();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const logoutBtn = buttons.find(b =>
      b.nativeElement.textContent.toLowerCase().includes('logout')
    );
    expect(logoutBtn).toBeTruthy();
    logoutBtn?.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });
});

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { ProdutosListComponent } from './produtos/produtos-list/produtos-list.component';
import { ProdutoFormComponent } from './produtos/produto-form/produto-form.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HomeHeroComponent } from './home-hero/home-hero.component';
import { ThemeService } from './shared/services/theme.service';
import { MockAuthInterceptor } from './shared/interceptors/mock-auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ToastsComponent } from './shared/components/toasts/toasts.component';
import { ToastService } from './shared/services/toast.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeHeroComponent,
    ProdutosListComponent,
    ProdutoFormComponent,
    ToastsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    ThemeService,
    ToastService,
    { provide: HTTP_INTERCEPTORS, useClass: MockAuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

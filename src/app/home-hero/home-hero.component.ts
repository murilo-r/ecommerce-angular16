import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../produtos/produtos.service';
import { Produto } from '../shared/models/produto.model';
import { ThemeService, Theme } from '../shared/services/theme.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-home-hero',
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.css'],
})
export class HomeHeroComponent implements OnInit {
  produtos: Produto[] = [];
  total = 0;
  ativos = 0;
  inativos = 0;
  updatedAt = '';
  loading = false;
  theme: Theme = 'light';

  constructor(
    private svc: ProdutosService,
    private themeSvc: ThemeService
  ) {}

  ngOnInit() {
    this.themeSvc.init();
    this.themeSvc.theme$.subscribe(t => (this.theme = t));
    this.refresh();
    setInterval(() => this.refresh(), 30000);
  }

  async refresh() {
    this.loading = true;
    try {
      const produtos = await firstValueFrom(this.svc.listar());
      this.produtos = produtos ?? [];
      this.total = this.produtos.length;
      this.ativos = this.produtos.filter(p => p.status).length;
      this.inativos = this.produtos.filter(p => !p.status).length;
      this.updatedAt = new Date().toLocaleTimeString('pt-BR');
    } catch (e) {
      console.warn('Erro ao buscar produtos', e);
    } finally {
      this.loading = false;
    }
  }

  toggleTheme() {
    this.themeSvc.toggle();
  }
}

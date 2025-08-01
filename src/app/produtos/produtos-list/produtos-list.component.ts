import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../produtos.service';
import { Produto } from '../../shared/models/produto.model';
import { Departamento } from '../../shared/models/departamento.model';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-produtos-list',
  templateUrl: './produtos-list.component.html',
  styleUrls: ['./produtos-list.component.css']
})
export class ProdutosListComponent implements OnInit {
  produtos: Produto[] = [];
  departamentos: Departamento[] = [];
  filtered: Produto[] = [];
  busca$ = new Subject<string>();
  filtroDept = '';
  page = 1;
  pageSize = PAGE_SIZE;
  loading = false;

  constructor(
    private svc: ProdutosService,
    private toast: ToastService
  ) {}

  searchText = '';
  selectedDept = '';

  ngOnInit() {
    this.loadAll();
  }

  buscar() {
    this.applyFiltersWithText(this.searchText);
  }

  private applyFiltersWithText(busca: string) {
    let temp = this.produtos;

    if (this.selectedDept) {
      temp = temp.filter(p => p.departamentoCodigo === this.selectedDept);
    }

    if (busca) {
      const term = busca.toLowerCase();
      temp = temp.filter(p =>
        p.codigo.toLowerCase().includes(term) ||
        p.descricao.toLowerCase().includes(term)
      );
    }

    this.filtered = temp;
    this.page = 1;
  }

  onBuscaChange(value: string) {
    this.searchText = value;
  }

  onDeptChange(val: string) {
    this.selectedDept = val;
  }
  
  private loadAll() {
    this.loading = true;
    this.svc.listarDepartamentos().pipe(
      switchMap(depts => {
        this.departamentos = depts;
        return this.svc.listar();
      })
    ).subscribe({
      next: prods => {
        this.produtos = prods;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.toast.show('Erro ao carregar produtos.', 'error');
        this.loading = false;
      }
    });
  }

  applyFilters() {
    const texto = (this.busca$.observers.length, ''); // placeholder, usamos value manualmente
    // Como não guardamos a string, simplificamos: recompute via inputs no template
    let temp = this.produtos;

    if (this.filtroDept) {
      temp = temp.filter(p => p.departamentoCodigo === this.filtroDept);
    }

    // Busca no código/descrição: acessível via binding de input
    // Aqui só atribuímos; filtro textual é feito no getter abaixo ou refatora para armazenar busca atual
    this.filtered = temp;
    this.page = 1;
  }

  editar(p: Produto) {
    // navegação externa, pode injetar Router se desejar
  }

  excluir(p: Produto) {
    if (!confirm(`Excluir produto ${p.codigo}?`)) return;
    this.svc.excluir(p.id).subscribe({
      next: () => {
        this.toast.show('Produto excluído (lógico).', 'success');
        this.loadAll();
      },
      error: () => this.toast.show('Erro ao excluir.', 'error')
    });
  }

  get paged() {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filtered.length / this.pageSize);
  }

  mudarPagina(delta: number) {
    this.page = Math.min(Math.max(1, this.page + delta), this.totalPages());
  }
}

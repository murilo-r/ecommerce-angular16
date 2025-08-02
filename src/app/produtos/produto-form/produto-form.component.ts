import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../produtos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from '../../shared/models/produto.model';
import { Departamento } from '../../shared/models/departamento.model';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastService } from '../../shared/services/toast.service';
import { finalize, debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.css']
})
export class ProdutoFormComponent implements OnInit {
  form!: FormGroup;
  departamentos: Departamento[] = [];
  isEdit = false;
  produtoId = '';
  submitting = false;
  checkingCode = false;

  constructor(
    private svc: ProdutosService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      codigo: ['', [Validators.required, Validators.maxLength(50)], [this.codigoDuplicadoValidator.bind(this)]],
      descricao: ['', [Validators.required, Validators.maxLength(200)]],
      departamentoCodigo: ['', Validators.required],
      preco: [0, [Validators.required, Validators.min(0.01)]],
      status: [true]
    });

    this.svc.listarDepartamentos().subscribe({
      next: d => (this.departamentos = d),
      error: () => this.toast.show('Erro ao carregar departamentos.', 'error')
    });

    this.route.paramMap.subscribe(p => {
      const id = p.get('id');
      if (id) {
        this.isEdit = true;
        this.produtoId = id;
        this.svc.listar().subscribe(list => {
          const prod = list.find(x => x.id === id);
          if (prod) {
            this.form.patchValue(prod);
          }
        });
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls as { [key: string]: AbstractControl };
  }

  // Validador assíncrono de código duplicado
  private codigoDuplicadoValidator(control: AbstractControl) {
    const codigo = (control.value || '').trim();
    if (!codigo) return of(null);
    this.checkingCode = true;
    return this.svc.listar().pipe(
      debounceTime(300),
      switchMap(list => {
        const exists = list.find(p => p.codigo.toLowerCase() === codigo.toLowerCase() && p.id !== this.produtoId);
        return of(exists ? { codigoDuplicado: true } : null);
      }),
      finalize(() => (this.checkingCode = false))
    );
  }

  salvar() {
    if (this.form.invalid) {
      this.toast.show('Corrija os erros do formulário antes de salvar.', 'error');
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;

    // Construir payload e normalizar id vazio
    const produto: any = { ...this.form.value } as Produto;
    if (!this.isEdit || !produto.id) {
      delete produto.id; // não enviar id vazio para evitar erro de GUID
    } else {
      produto.id = this.produtoId; // garante que no edit o id correto seja mantido
    }

    this.svc.salvar(produto).pipe(
      finalize(() => (this.submitting = false))
    ).subscribe({
      next: () => {
        this.toast.show(`Produto ${this.isEdit ? 'atualizado' : 'criado'} com sucesso.`, 'success');
        this.router.navigate(['/']);
      },
      error: err => {
        this.toast.show('Erro ao salvar produto. Verifique os dados.', 'error');
        console.error(err);
      }
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}

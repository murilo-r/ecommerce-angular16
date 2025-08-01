import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../produtos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from '../../shared/models/produto.model';
import { Departamento } from '../../shared/models/departamento.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../shared/services/toast.service';

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
  loading = false;

  constructor(
    private svc: ProdutosService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [''],
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      departamentoCodigo: ['', Validators.required],
      preco: [0, [Validators.required, Validators.min(0)]],
      status: [true]
    });

    this.svc.listarDepartamentos().subscribe(d => this.departamentos = d);

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

  salvar() {
    if (this.form.invalid) {
      this.toast.show('Preencha os campos obrigatórios.', 'error');
      return;
    }
    this.loading = true;
    const produto: Produto = this.form.value;
    if (this.isEdit) produto.id = this.produtoId;
    this.svc.salvar(produto).subscribe({
      next: () => {
        this.toast.show(`Produto ${this.isEdit ? 'atualizado' : 'criado'} com sucesso.`, 'success');
        this.router.navigate(['/']);
      },
      error: () => {
        this.toast.show('Erro ao salvar produto.', 'error');
        this.loading = false;
      }
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}

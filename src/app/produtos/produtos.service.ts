import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produto } from '../shared/models/produto.model';
import { Departamento } from '../shared/models/departamento.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private base = '/api/produtos';
  private deptBase = '/api/departamentos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.base);
  }

  salvar(produto: Produto): Observable<any> {
    return this.http.post(this.base, produto);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  listarDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.deptBase);
  }
}

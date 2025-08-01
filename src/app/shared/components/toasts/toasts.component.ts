import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toasts',
  template: `
    <div class="toast-container">
      <div *ngFor="let t of toastSvc.toasts" [class]="['toast', t.type].join(' ')">
        <div class="msg">{{ t.message }}</div>
        <button class="close" (click)="toastSvc.dismiss(t.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 1000;
    }
    .toast {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      min-width: 200px;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      box-shadow: 0 10px 30px -5px rgba(0,0,0,0.2);
      animation: slide-in .35s ease-out;
    }
    .toast.success { background: #16a34a; }
    .toast.error { background: #dc2626; }
    .toast.info { background: #2563eb; }
    .close {
      background: transparent;
      border: none;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      margin-left: 0.5rem;
    }
    @keyframes slide-in {
      from { opacity: 0; transform: translateX(10px); }
      to { opacity:1; transform: translateX(0); }
    }
  `]
})
export class ToastsComponent {
  constructor(public toastSvc: ToastService) {}
}

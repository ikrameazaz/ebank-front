import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BankAccountService } from '../services/bank-account.service';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  
  // 🎯 Données du composant
  account: any = null;
  accountHistory: any = null;
  accountId: string = '';
  
  // 📊 Statistiques
  totalTransactions: number = 0;
  totalCredits: number = 0;
  totalDebits: number = 0;
  
  // 📄 Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  
  // 🎮 États du composant
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bankAccountService: BankAccountService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountId = params['id'];
      if (this.accountId) {
        this.loadAccountDetails();
        this.loadAccountHistory();
      }
    });
  }

  /**
   * 📊 Charge les détails du compte
   */
  loadAccountDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bankAccountService.getAccount(this.accountId).subscribe({
      next: (account) => {
        this.account = account;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load account details. Please try again.';
        console.error('Error loading account:', error);
      }
    });
  }

  /**
   * 📋 Charge l'historique des transactions
   */
  loadAccountHistory(): void {
    this.bankAccountService.getAccountHistory(this.accountId, this.currentPage, this.pageSize).subscribe({
      next: (history) => {
        this.accountHistory = history;
        this.calculateStatistics();
      },
      error: (error) => {
        console.error('Error loading account history:', error);
      }
    });
  }

  /**
   * 📈 Calcule les statistiques des transactions
   */
  calculateStatistics(): void {
    if (!this.accountHistory?.accountOperationDTOS) return;

    const operations = this.accountHistory.accountOperationDTOS;
    this.totalTransactions = operations.length;
    this.totalCredits = operations.filter((op: any) => op.type === 'CREDIT').length;
    this.totalDebits = operations.filter((op: any) => op.type === 'DEBIT').length;
  }

  /**
   * ⬅️ Page précédente
   */
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAccountHistory();
    }
  }

  /**
   * ➡️ Page suivante
   */
  nextPage(): void {
    if (this.currentPage < (this.accountHistory?.totalPages || 1) - 1) {
      this.currentPage++;
      this.loadAccountHistory();
    }
  }

  /**
   * 🔙 Retour à la page précédente
   */
  goBack(): void {
    this.router.navigate(['/accounts']);
  }

  /**
   * 💳 Ouvre le modal de transaction
   */
  openTransactionModal(): void {
    // TODO: Implémenter le modal de transaction
    console.log('Opening transaction modal for account:', this.accountId);
    alert('Transaction modal will be implemented soon!');
  }

  /**
   * 💰 Obtient la classe CSS pour le solde
   */
  getBalanceClass(): string {
    if (!this.account) return '';
    
    if (this.account.balance > 0) return 'positive';
    if (this.account.balance < 0) return 'negative';
    return 'neutral';
  }

  /**
   * 📈 Obtient la tendance du solde
   */
  getBalanceTrend(): string {
    if (!this.account) return '';
    
    if (this.account.balance > 1000) return 'trend-up';
    if (this.account.balance < 0) return 'trend-down';
    return 'trend-stable';
  }

  /**
   * 🔍 Obtient l'icône pour le solde
   */
  getBalanceIcon(): string {
    if (!this.account) return 'bi-dash';
    
    if (this.account.balance > 1000) return 'bi-trending-up';
    if (this.account.balance < 0) return 'bi-trending-down';
    return 'bi-dash';
  }

  /**
   * 🎯 Obtient l'icône pour le type d'opération
   */
  getOperationIcon(type: string): string {
    switch (type) {
      case 'CREDIT':
        return 'bi-arrow-down-circle-fill';
      case 'DEBIT':
        return 'bi-arrow-up-circle-fill';
      case 'TRANSFER':
        return 'bi-arrow-left-right';
      default:
        return 'bi-circle-fill';
    }
  }

  /**
   * 💵 Obtient la classe CSS pour le montant
   */
  getAmountClass(type: string): string {
    switch (type) {
      case 'CREDIT':
        return 'amount-positive';
      case 'DEBIT':
        return 'amount-negative';
      default:
        return 'amount-neutral';
    }
  }

  /**
   * ➕➖ Obtient le préfixe pour le montant
   */
  getAmountPrefix(type: string): string {
    switch (type) {
      case 'CREDIT':
        return '+';
      case 'DEBIT':
        return '-';
      default:
        return '';
    }
  }

  /**
   * 🔄 Actualise les données
   */
  refresh(): void {
    this.loadAccountDetails();
    this.loadAccountHistory();
  }

  /**
   * 📤 Exporte l'historique
   */
  exportHistory(): void {
    // TODO: Implémenter l'export
    console.log('Exporting account history for:', this.accountId);
    alert('Export functionality will be implemented soon!');
  }
}

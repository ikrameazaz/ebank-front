import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankAccountService } from '../services/bank-account.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  // 📊 Statistiques du dashboard
  totalCustomers: number = 0;
  totalAccounts: number = 0;
  totalBalance: number = 0;
  totalTransactions: number = 0;
  
  // 📋 Transactions récentes
  recentTransactions: any[] = [
    {
      customerName: 'mohamed',
      type: 'CREDIT',
      amount: 5591.19,
      status: 'COMPLETED',
      date: new Date('2025-06-04T21:05:00')
    },
    {
      customerName: 'mohamed',
      type: 'DEBIT',
      amount: 390.00,
      status: 'COMPLETED',
      date: new Date('2025-06-04T21:05:00')
    },
    {
      customerName: 'mohamed',
      type: 'DEBIT',
      amount: 10389.70,
      status: 'COMPLETED',
      date: new Date('2025-06-04T21:05:00')
    },
    {
      customerName: 'mohamed',
      type: 'DEBIT',
      amount: 1817.77,
      status: 'COMPLETED',
      date: new Date('2025-06-04T21:05:00')
    },
    {
      customerName: 'mohamed',
      type: 'CREDIT',
      amount: 6337.44,
      status: 'COMPLETED',
      date: new Date('2025-06-04T21:05:00')
    }
  ];

  constructor(
    private router: Router,
    private bankAccountService: BankAccountService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * 📊 Charge les données du dashboard
   */
  loadDashboardData(): void {
    // Charger les clients
    this.bankAccountService.getCustomers().subscribe({
      next: (customers) => {
        this.totalCustomers = customers.length;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
        this.totalCustomers = 5; // Valeur par défaut
      }
    });

    // Charger les comptes
    this.bankAccountService.getAccounts().subscribe({
      next: (accounts) => {
        this.totalAccounts = accounts.length;
        this.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes:', error);
        this.totalAccounts = 6;
        this.totalBalance = 217557.81;
      }
    });

    // Simuler le nombre de transactions
    this.totalTransactions = 60;
  }

  /**
   * 🧭 Navigation vers nouveau client
   */
  navigateToNewCustomer(): void {
    this.router.navigate(['/new-customer']);
  }

  /**
   * 🧭 Navigation vers les comptes
   */
  navigateToAccounts(): void {
    this.router.navigate(['/accounts']);
  }

  /**
   * 🧭 Navigation vers les transactions
   */
  navigateToTransactions(): void {
    // TODO: Implémenter la page des transactions
    console.log('Navigation vers les transactions');
  }

  /**
   * 📄 Génère un rapport
   */
  generateReport(): void {
    // TODO: Implémenter la génération de rapport
    console.log('Génération de rapport');
    alert('Fonctionnalité de rapport en cours de développement');
  }
}

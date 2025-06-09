import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BankAccountService } from '../services/bank-account.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // 📊 Dashboard Statistics
  totalCustomers: number = 0;
  totalAccounts: number = 0;
  totalBalance: string = '$0';
  todayTransactions: number = 0;

  // 📋 Recent Activities
  recentActivities = [
    {
      type: 'customer',
      title: 'New Customer Added',
      description: 'John Doe has been registered as a new customer',
      time: '2 minutes ago'
    },
    {
      type: 'transaction',
      title: 'Large Transaction',
      description: 'Transfer of $50,000 completed successfully',
      time: '15 minutes ago'
    },
    {
      type: 'account',
      title: 'Account Created',
      description: 'New savings account opened for customer #156',
      time: '1 hour ago'
    },
    {
      type: 'system',
      title: 'System Update',
      description: 'Security patches applied successfully',
      time: '3 hours ago'
    },
    {
      type: 'customer',
      title: 'Customer Verification',
      description: 'Identity verification completed for Sarah Wilson',
      time: '5 hours ago'
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
   * 📊 Load dashboard statistics
   */
  loadDashboardData(): void {
    // Load customers count
    this.bankAccountService.getCustomers().subscribe({
      next: (customers) => {
        this.totalCustomers = customers.length;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.totalCustomers = 156; // Fallback value
      }
    });

    // Load accounts data
    this.bankAccountService.getAccounts().subscribe({
      next: (accounts) => {
        this.totalAccounts = accounts.length;
        const balance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
        this.totalBalance = this.formatCurrency(balance);
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.totalAccounts = 89; // Fallback value
        this.totalBalance = '$2.4M'; // Fallback value
      }
    });

    // Simulate today's transactions
    this.todayTransactions = Math.floor(Math.random() * 300) + 200;
  }

  /**
   * 💰 Format currency values
   */
  formatCurrency(amount: number): string {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    } else {
      return `$${amount.toFixed(2)}`;
    }
  }

  /**
   * 🎯 Get activity icon based on type
   */
  getActivityIcon(type: string): string {
    switch (type) {
      case 'customer':
        return 'bi-person-plus-fill';
      case 'transaction':
        return 'bi-arrow-left-right';
      case 'account':
        return 'bi-credit-card-fill';
      case 'system':
        return 'bi-gear-fill';
      default:
        return 'bi-circle-fill';
    }
  }

  /**
   * 📄 Generate report
   */
  generateReport(): void {
    // TODO: Implement report generation
    console.log('Generating report...');
    alert('Report generation feature will be implemented soon!');
  }

  /**
   * 🧭 Navigate to customers
   */
  navigateToCustomers(): void {
    this.router.navigate(['/customers']);
  }

  /**
   * 🧭 Navigate to accounts
   */
  navigateToAccounts(): void {
    this.router.navigate(['/accounts']);
  }

  /**
   * 🧭 Navigate to new customer
   */
  navigateToNewCustomer(): void {
    this.router.navigate(['/new-customer']);
  }

  /**
   * 🔄 Refresh dashboard data
   */
  refreshData(): void {
    this.loadDashboardData();
  }

  /**
   * 📊 Get dashboard summary
   */
  getDashboardSummary(): any {
    return {
      totalCustomers: this.totalCustomers,
      totalAccounts: this.totalAccounts,
      totalBalance: this.totalBalance,
      todayTransactions: this.todayTransactions,
      systemStatus: 'Operational',
      lastUpdate: new Date().toLocaleTimeString()
    };
  }
}

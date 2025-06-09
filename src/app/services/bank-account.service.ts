import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  private baseUrl = environment.backendHost;

  constructor(private http: HttpClient) { }

  // 👥 CUSTOMERS API
  
  /**
   * 📋 Récupère la liste de tous les clients
   */
  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/customers`);
  }

  /**
   * 🔍 Recherche des clients par mot-clé
   */
  searchCustomers(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/customers/search?keyword=${keyword}`);
  }

  /**
   * 👤 Récupère un client par son ID
   */
  getCustomer(customerId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/customers/${customerId}`);
  }

  /**
   * ➕ Crée un nouveau client
   */
  saveCustomer(customer: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/customers`, customer);
  }

  /**
   * ✏️ Met à jour un client existant
   */
  updateCustomer(customerId: number, customer: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/customers/${customerId}`, customer);
  }

  /**
   * 🗑️ Supprime un client
   */
  deleteCustomer(customerId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/customers/${customerId}`);
  }

  // 💳 ACCOUNTS API

  /**
   * 📋 Récupère la liste de tous les comptes
   */
  getAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/accounts`);
  }

  /**
   * 💳 Récupère un compte par son ID
   */
  getAccount(accountId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accounts/${accountId}`);
  }

  /**
   * 📊 Récupère l'historique des opérations d'un compte
   */
  getAccountOperations(accountId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/accounts/${accountId}/operations`);
  }

  /**
   * 📄 Récupère l'historique paginé des opérations d'un compte
   */
  getAccountHistory(accountId: string, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accounts/${accountId}/pageOperations?page=${page}&size=${size}`);
  }

  // 💰 TRANSACTIONS API

  /**
   * ➖ Effectue un débit sur un compte
   */
  debit(accountId: string, amount: number, description: string): Observable<any> {
    const data = {
      accountId: accountId,
      amount: amount,
      description: description
    };
    return this.http.post<any>(`${this.baseUrl}/accounts/debit`, data);
  }

  /**
   * ➕ Effectue un crédit sur un compte
   */
  credit(accountId: string, amount: number, description: string): Observable<any> {
    const data = {
      accountId: accountId,
      amount: amount,
      description: description
    };
    return this.http.post<any>(`${this.baseUrl}/accounts/credit`, data);
  }

  /**
   * 🔄 Effectue un transfert entre deux comptes
   */
  transfer(accountSource: string, accountDestination: string, amount: number): Observable<any> {
    const data = {
      accountSource: accountSource,
      accountDestination: accountDestination,
      amount: amount
    };
    return this.http.post<any>(`${this.baseUrl}/accounts/transfer`, data);
  }

  // 📊 UTILITY METHODS

  /**
   * 📈 Calcule le solde total de tous les comptes
   */
  getTotalBalance(): Observable<number> {
    return new Observable(observer => {
      this.getAccounts().subscribe({
        next: (accounts) => {
          const total = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
          observer.next(total);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * 🔢 Compte le nombre total de transactions pour un compte
   */
  getTransactionCount(accountId: string): Observable<number> {
    return new Observable(observer => {
      this.getAccountOperations(accountId).subscribe({
        next: (operations) => {
          observer.next(operations.length);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * 📊 Obtient les statistiques d'un compte
   */
  getAccountStatistics(accountId: string): Observable<any> {
    return new Observable(observer => {
      this.getAccountOperations(accountId).subscribe({
        next: (operations) => {
          const stats = {
            totalTransactions: operations.length,
            totalCredits: operations.filter(op => op.type === 'CREDIT').length,
            totalDebits: operations.filter(op => op.type === 'DEBIT').length,
            totalCreditAmount: operations
              .filter(op => op.type === 'CREDIT')
              .reduce((sum, op) => sum + op.amount, 0),
            totalDebitAmount: operations
              .filter(op => op.type === 'DEBIT')
              .reduce((sum, op) => sum + op.amount, 0)
          };
          observer.next(stats);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * 🔍 Recherche des comptes par client
   */
  getAccountsByCustomer(customerId: number): Observable<any[]> {
    return new Observable(observer => {
      this.getAccounts().subscribe({
        next: (accounts) => {
          const customerAccounts = accounts.filter(account => 
            account.customerDTO && account.customerDTO.id === customerId
          );
          observer.next(customerAccounts);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * 📊 Obtient les statistiques globales du dashboard
   */
  getDashboardStats(): Observable<any> {
    return new Observable(observer => {
      // Charger les clients et comptes en parallèle
      Promise.all([
        this.getCustomers().toPromise(),
        this.getAccounts().toPromise()
      ]).then(([customers, accounts]) => {
        const stats = {
          totalCustomers: customers?.length || 0,
          totalAccounts: accounts?.length || 0,
          totalBalance: accounts?.reduce((sum, account) => sum + (account.balance || 0), 0) || 0,
          activeAccounts: accounts?.filter(account => account.balance > 0).length || 0
        };
        observer.next(stats);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }
}

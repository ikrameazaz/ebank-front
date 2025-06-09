import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Customer } from "../model/customer.model";
import { JsonPipe, NgForOf, NgIf, CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AccountsService } from "../services/accounts.service";
import { Observable, catchError, throwError } from 'rxjs';
import { Account } from "../model/accounts.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customersaccounts.component.html',
  standalone: true,
  imports: [
    JsonPipe,
    NgForOf,
    NgIf,
    CommonModule,
    DatePipe,
    DecimalPipe
  ],
  styleUrls: ['./customersaccounts.component.css']
})
export class CustomerAccountsComponent implements OnInit {
  customerId!: string;
  customer!: Customer;
  accounts: Array<any> = [];
  errorMessage!: string;

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private http: HttpClient
  ) {
    this.customer = this.router.getCurrentNavigation()?.extras.state as Customer;
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.loadCustomerAccounts();
  }

  loadCustomerAccounts() {
    this.http.get<Array<any>>(environment.backendHost + "/customers/" + this.customerId + "/accounts")
      .pipe(
        catchError(err => {
          this.errorMessage = err.message;
          return throwError(err);
        })
      )
      .subscribe({
        next: (data) => {
          this.accounts = data;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  goToAccountDetails(accountId: string) {
    // Naviguer vers la page des comptes avec l'ID du compte
    this.router.navigateByUrl("/accounts", {
      state: { accountId: accountId }
    });
  }
}

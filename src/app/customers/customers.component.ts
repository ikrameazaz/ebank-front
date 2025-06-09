import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CustomerService} from "../services/customer.service";
import {catchError, map, Observable, throwError} from "rxjs";
import {Customer} from "../model/customer.model";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AsyncPipe, CommonModule, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    CommonModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers!: Observable<Array<Customer>>;
  errorMessage!: string;
  searchFormGroup: FormGroup | undefined;

  constructor(private customerService: CustomerService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control("")
    });
    this.handleSearchCustomers();
  }

  handleSearchCustomers() {
    let kw = '';
    if (this.searchFormGroup) {
      kw = this.searchFormGroup.controls['keyword'].value || '';
    }
    this.customers=this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage=err.message;
        return throwError(err);
      })
    );
  } handleDeleteCustomer(c: Customer) {
    let conf = confirm("Are you sure?");
    if(!conf) return;
    this.customerService.deleteCustomer(c.id).subscribe({
      next : (resp) => {
        this.handleSearchCustomers()
      },
      error : err => {
        console.log(err);
      }
    })
  }
  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl("/customersaccounts/"+customer.id,{state :customer});
  }

}

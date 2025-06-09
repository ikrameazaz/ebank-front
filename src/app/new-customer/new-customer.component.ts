import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomerService} from '../services/customer.service';
import {Router, RouterLink} from '@angular/router';
import {Customer} from '../model/customer.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-new-customer',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.css',
  standalone: true
})
export class NewCustomerComponent implements OnInit {
  successMessage: string = '';
  isLoading: boolean = false;
  newCustomerFormGroup!: FormGroup;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder,
              private customerService: CustomerService,
              private router: Router) { }

  ngOnInit(): void {
    this.newCustomerFormGroup = this.fb.group({
      name: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      email: this.fb.control(null, [Validators.required, Validators.email])
    });
  }

  handleSaveCustomer() {
    if (this.newCustomerFormGroup.invalid) return;

    this.isSubmitting = true;
    let customer: Customer = this.newCustomerFormGroup.value;

    this.customerService.saveCustomer(customer).subscribe({
      next: data => {
        this.isSubmitting = false;
        // Afficher une notification de succès
        this.showSuccessNotification();
        // Rediriger vers la liste des clients
        this.router.navigateByUrl("/customers");
      },
      error: err => {
        this.isSubmitting = false;
        console.log(err);
        // Gérer l'erreur ici
      }
    });
  }

  // Méthode pour afficher une notification de succès (à implémenter avec une librairie comme ngx-toastr)
  private showSuccessNotification() {
    // Cette méthode est un placeholder pour l'ajout futur d'une notification
    // Vous pourriez utiliser une librairie comme ngx-toastr pour l'implémenter
    alert("Le client a été enregistré avec succès !");
  }
}

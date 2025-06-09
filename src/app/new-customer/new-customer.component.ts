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
  // 🎯 États du composant
  successMessage: string = '';
  isLoading: boolean = false;
  newCustomerFormGroup!: FormGroup;
  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * 📝 Initialise le formulaire avec tous les champs
   */
  private initializeForm(): void {
    this.newCustomerFormGroup = this.fb.group({
      name: this.fb.control('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]),
      email: this.fb.control('', [
        Validators.required,
        Validators.email
      ]),
      phone: this.fb.control('', [
        Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,15}$/)
      ]),
      address: this.fb.control('', [
        Validators.maxLength(200)
      ])
    });
  }

  /**
   * 💾 Sauvegarde le nouveau client
   */
  handleSaveCustomer(): void {
    if (this.newCustomerFormGroup.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.isSubmitting = true;

    const customerData: Customer = {
      ...this.newCustomerFormGroup.value,
      // Nettoyer les champs optionnels vides
      phone: this.newCustomerFormGroup.value.phone?.trim() || null,
      address: this.newCustomerFormGroup.value.address?.trim() || null
    };

    this.customerService.saveCustomer(customerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isSubmitting = false;
        this.showSuccessMessage = true;

        // Auto-fermer le message de succès après 3 secondes
        setTimeout(() => {
          this.closeSuccessMessage();
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.isSubmitting = false;
        console.error('Erreur lors de la création du client:', error);
        this.handleError(error);
      }
    });
  }

  /**
   * ✅ Ferme le message de succès et redirige
   */
  closeSuccessMessage(): void {
    this.showSuccessMessage = false;
    this.router.navigateByUrl("/customers");
  }

  /**
   * 🔍 Marque tous les champs comme touchés pour afficher les erreurs
   */
  private markFormGroupTouched(): void {
    Object.keys(this.newCustomerFormGroup.controls).forEach(key => {
      const control = this.newCustomerFormGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * ❌ Gère les erreurs de l'API
   */
  private handleError(error: any): void {
    let errorMessage = 'Une erreur est survenue lors de la création du client.';

    if (error.status === 400) {
      errorMessage = 'Données invalides. Veuillez vérifier les informations saisies.';
    } else if (error.status === 409) {
      errorMessage = 'Un client avec cette adresse email existe déjà.';
    } else if (error.status === 500) {
      errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
    }

    alert(errorMessage);
  }

  /**
   * 🧹 Réinitialise le formulaire
   */
  resetForm(): void {
    this.newCustomerFormGroup.reset();
    this.markFormGroupTouched();
  }

  /**
   * 📊 Vérifie si un champ a une erreur spécifique
   */
  hasFieldError(fieldName: string, errorType: string): boolean {
    const field = this.newCustomerFormGroup.get(fieldName);
    return !!(field?.touched && field?.errors?.[errorType]);
  }

  /**
   * 📝 Obtient le message d'erreur pour un champ
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.newCustomerFormGroup.get(fieldName);
    if (!field?.touched || !field?.errors) return '';

    const errors = field.errors;

    if (errors['required']) return `${fieldName} is required`;
    if (errors['minlength']) return `${fieldName} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `${fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['pattern']) return 'Please enter a valid phone number';

    return 'Invalid input';
  }
}

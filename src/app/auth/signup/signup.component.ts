import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: false
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required], // ✅ Add this
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Please enter valid values.';
      return;
    }

    const { username, email, password } = this.signupForm.value;

    this.authService.signup(username, email, password).subscribe({
      next: (res: any) => {
        console.log('Signup success:', res);
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Signup failed:', err);
        this.errorMessage = 'Signup failed. Check your input or try a different email.';
      }
    });
    
    
  }
}

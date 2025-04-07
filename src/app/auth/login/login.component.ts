import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in both username and password.';
      return;
    }

    const { username, password } = this.loginForm.value;
    this.isLoading = true;

    this.authService.login(username, password).subscribe({
      next: (result: any) => {
        this.isLoading = false;
        const token = result?.data?.login;

        if (token) {
          this.authService.saveToken(token);
          this.router.navigate(['/employees']);
        } else {
          this.errorMessage = 'Login failed: Token not received.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
        if (err?.message?.includes('Invalid credentials')) {
          this.errorMessage = 'Incorrect username or password.';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      }
    });
  }
}

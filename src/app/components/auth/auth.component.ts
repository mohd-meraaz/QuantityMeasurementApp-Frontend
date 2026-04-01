import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true;
  errorMessage = '';
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Check if we are returning from Google with a code
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.processGoogleLogin(code);
      }
    });
  }

  loginWithGoogle() {
    this.authService.initiateGoogleLogin();
  }
  
  private processGoogleLogin(code: string) {
    this.authService.handleGoogleCallback(code).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = "Google Authentication failed.";
      }
    });
  }
  authData = { username: '', email: '', password: '', confirmPassword: '', role: 'USER' };

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit() {
    if (!this.isLoginMode && this.authData.password !== this.authData.confirmPassword) {
      this.errorMessage = "Passwords do not match!";
      return;
    }

    const request = this.isLoginMode 
      ? this.authService.login({email: this.authData.email, password: this.authData.password})
      : this.authService.register(this.authData);

    request.subscribe({
      next: (res) => {
        if (this.isLoginMode) this.router.navigate(['/dashboard']);
        else { alert('Signup Successful! Please Login.'); this.isLoginMode = true; }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || "An error occurred. Please try again.";
      }
    });
  }
}
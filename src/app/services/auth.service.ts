import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://quantitymeasurementapp-production-387c.up.railway.app/auth/user';
  private googleAuthUrl = 'http://quantitymeasurementapp-production-387c.up.railway.app/auth/google';

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) localStorage.setItem('token', res.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  initiateGoogleLogin() {
    const clientId = '880694243289-hmeu169t5g1etinlqr8td1cv9crfb0gq.apps.googleusercontent.com';
    const redirectUri = 'http://localhost:4200/auth'; // Points back to this component
    const scope = 'profile email';
    const responseType = 'code';

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=offline&prompt=select_account`;
    
    window.location.href = url;
  }

  handleGoogleCallback(code: string): Observable<any> {
    return this.http.get(`${this.googleAuthUrl}/callback?code=${code}`).pipe(
      tap((res: any) => {
        if (res.token) localStorage.setItem('token', res.token);
      })
    );
  }
}
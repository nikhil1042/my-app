import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ✅ Signup
  signup(data: any) {
    return this.http.post(`${this.apiUrl}/auth/signup`, data).pipe(
      tap(res => {
        // Store user name for dashboard
        localStorage.setItem('name', data.name);
      })
    );
  }

  // ✅ Login
  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, data)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('email', data.email);
        })
      );
  }


  // ✅ Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  // ✅ Check login status
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ Get current role
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // ✅ Get token (for interceptor use)
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

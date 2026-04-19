import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtResponse } from '../dto/JwtResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private baseUrl = 'http://localhost:8080/api'; 
  private tokenKey = 'token';
  constructor(private http: HttpClient) { }
   register(data: { email: string; password: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/register`, data);
  }
  login(data: { email: string; password: string }): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.baseUrl}/login`, data);
  }
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
   getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
   isLoggedIn(): boolean {
    return !!this.getToken();
  }
   logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
    getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

}

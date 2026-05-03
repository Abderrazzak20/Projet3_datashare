import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { UserFileDTO } from '../dto/UserFileDTO';


@Injectable({
  providedIn: 'root'
})
export class FileService {
  private baseUrl = 'http://localhost:8080/api/files';
  constructor(private http: HttpClient, private auth: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
  upload(file: File, expireDays: number = 7): Observable<UserFileDTO> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('expireDays', expireDays.toString());
    return this.http.post<UserFileDTO>(`${this.baseUrl}/upload`, formData, { headers: this.getAuthHeaders() });
  }
  getMyFiles(): Observable<UserFileDTO[]> {
    return this.http.get<UserFileDTO[]>(`${this.baseUrl}/my-files`, { headers: this.getAuthHeaders() });
  }
  deleteFile(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
  downloadFile(token: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${token}`, {
      responseType: 'blob',
    });
  }

  getFileToken(token: string): Observable<UserFileDTO> {
    return this.http.get<UserFileDTO>(`${this.baseUrl}/info/${token}`);
  }
}

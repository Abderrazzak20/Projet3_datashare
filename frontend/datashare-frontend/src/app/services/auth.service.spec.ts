/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { JwtResponse } from '../dto/JwtResponse';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
const baseUrl = 'http://localhost:8080/api';
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService, provideHttpClient(), provideHttpClientTesting()
      ]

    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });
  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call register API', () => {
    const mockResponse={message:"User created"};
    service.register({email:"test@gmail.com",password:"password123"}).subscribe(res=>{
      expect(res).toEqual(mockResponse);
    });
    const req=httpMock.expectOne(`${baseUrl}/register`);
    expect(req.request.method).toBe("POST");
    req.flush(mockResponse);
  });
  
  it('should call login API', () => {
    const mockJwt:JwtResponse={token:"fake-token"};
    service.login({email:"test@gmail.com",password:"password123"}).subscribe(res=>{
      expect(res).toEqual(mockJwt);

    });
    const req=httpMock.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe("POST");
    req.flush(mockJwt);
  });

  it('should detect user logged', () => {
      localStorage.setItem("token","test123");
      expect(service.isLoggedIn()).toBeTrue();
  });
  
  it('should logout user ', () => {
    localStorage.setItem("token","test123");
    service.logout();
    expect(localStorage.getItem("token")).toBeNull();

  });
  
  it('should return auth header', () => {
      localStorage.setItem("token","test123");
      const header:HttpHeaders=service.getAuthHeaders();
      expect(header.get("Authorization")).toBe("Bearer test123")
  });
  
  
});
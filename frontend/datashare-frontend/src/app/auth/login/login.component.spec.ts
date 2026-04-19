import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routeSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj("AuthService", ["login", "saveToken"]);
    routeSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule], providers: [{
        provide: AuthService, useValue: authSpy
      },
      { provide: Router, useValue: routeSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show login form when is called', () => {
    component.toggleLogin();
    expect(component.showLogin).toBeTrue();
  });
  it('should navigate to register', () => {
    component.goToRegister();
    expect(routeSpy.navigate).toHaveBeenCalledWith(["/register"])
  });

  it('should navigate to upload', () => {
    component.goToUpload();
    expect(routeSpy.navigate).toHaveBeenCalledWith(["/upload"]);
  });
  it('should navigate to dashboard', () => {
    component.goToDasheboard();
    expect(routeSpy.navigate).toHaveBeenCalledWith(["/dashboard"]);
  });
  it('should login be correct', () => {
    const mockResponse={token:"token123"}
    authSpy.login.and.returnValue(of(mockResponse));
    component.loginData={
      email:"test@gmail.com",
      password:"password123"
    };
    component.onSubmit();
    expect(authSpy.login).toHaveBeenCalledWith(component.loginData);
    expect(authSpy.saveToken).toHaveBeenCalledWith("token123");
    expect(routeSpy.navigate).toHaveBeenCalledWith(["mon-espace"]);
  });
  
  it('should handle login error', () => {
    spyOn(window,"alert");
      authSpy.login.and.returnValue(throwError(()=>new Error("erro")));
      component.onSubmit();
      expect(component.error).toBe("credenziali non valide");
      expect(window.alert).toHaveBeenCalledWith("Mauvaise credenziale");
  });
  

});

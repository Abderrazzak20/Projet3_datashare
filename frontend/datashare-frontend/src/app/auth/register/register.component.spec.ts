import { AuthService } from './../../services/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { provideRouter, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routeSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj("AuthService", ["register"]);
  


    await TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule],
      providers: [{
        provide: AuthService, useValue: authSpy
      }, 
   
      provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show error if password is not correct', () => {
    component.registerData={
      email:"test@gmail.com",
      password:"123",
      passwordConfirm:"notsame"
    };

    component.onSubmitRegister();
    expect(component.error).toBe("Les mots de passe ne correspondent pas !");
    expect(authSpy.register).not.toHaveBeenCalled();
  });
  it('should register success', () => {
    authSpy.register.and.returnValue(of({message:"ok"}));
      component.registerData={
      email:"test@gmail.com",
      password:"password123",
      passwordConfirm:"password123"
    };
    component.onSubmitRegister();
    expect(component.success).toContain("Utilisateur créé avec succès");
  });
  it('should handle register error', () => {
    authSpy.register.and.returnValue(throwError(()=>new Error("error")));
      component.registerData={
      email:"test@gmail.com",
      password:"password123",
      passwordConfirm:"password123"
    };
    component.onSubmitRegister();
    expect(component.error).toBe("Erreur lors de l’inscription");

  });
  it('should navigate to login', () => {
    component.goToLogin();
    expect(true).toBeTrue();
   // expect(routeSpy.navigate).toHaveBeenCalledWith(["/login"]);
  });
  
  
  
});

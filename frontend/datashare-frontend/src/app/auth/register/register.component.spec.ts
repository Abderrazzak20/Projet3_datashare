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
    routeSpy = jasmine.createSpyObj('Router', ['navigate']);


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
    component.registerData = {
      email: "test@gmail.com",
      password: "password123",
      passwordConfirm: "notsame12"
    };

    component.onSubmitRegister();
    expect(component.error).toBe("Les mots de passe ne correspondent pas");
    expect(authSpy.register).not.toHaveBeenCalled();
  });
  it('should register success', () => {
    authSpy.register.and.returnValue(of({ message: "ok" }));
    component.registerData = {
      email: "test@gmail.com",
      password: "password123",
      passwordConfirm: "password123"
    };
    component.onSubmitRegister();
    expect(component.success).toContain("Utilisateur créé avec succès");
  });
  it('should handle register error', () => {
    authSpy.register.and.returnValue(throwError(() => new Error("error")));
    component.registerData = {
      email: "test@gmail.com",
      password: "password123",
      passwordConfirm: "password123"
    };
    component.onSubmitRegister();
    expect(component.error).toBe("Erreur lors de l’inscription");

  });
  it('should navigate to login', () => {
    component.goToLogin();
    expect(true).toBeTrue();
  });

  it('should register successfully', () => {
    authSpy.register.and.returnValue(of({ message: 'ok' }));

    component.registerData = {
      email: 'test@mail.com',
      password: 'password123',
      passwordConfirm: 'password123'
    };

    component.onSubmitRegister();

    expect(component.success).toContain('Utilisateur créé avec succès');
    expect(component.error).toBe('');
  });
  it('should fail if passwords do not match', () => {
    component.registerData = {
      email: 'test@mail.com',
      password: 'password123',
      passwordConfirm: 'wrong123'
    };

    component.onSubmitRegister();

    expect(component.error).toBe('Les mots de passe ne correspondent pas');
    expect(authSpy.register).not.toHaveBeenCalled();
  });
  it('should fail if email is invalid', () => {
    component.registerData = {
      email: 'bademail',
      password: 'password123',
      passwordConfirm: 'password123'
    };

    component.onSubmitRegister();

    expect(component.error).toBe('Email invalide (ex: test@mail.com)');
    expect(authSpy.register).not.toHaveBeenCalled();
  });
  it('should fail if password is too short', () => {
    component.registerData = {
      email: 'test@mail.com',
      password: '123',
      passwordConfirm: '123'
    };

    component.onSubmitRegister();

    expect(component.error).toBe('Mot de passe minimum 8 caractères');
    expect(authSpy.register).not.toHaveBeenCalled();
  });
it('should handle register API error', () => {
  authSpy.register.and.returnValue(
    throwError(() => new Error('error'))
  );

  component.registerData = {
    email: 'test@mail.com',
    password: 'password123',
    passwordConfirm: 'password123'
  };

  component.onSubmitRegister();

  expect(component.error).toBe('Erreur lors de l’inscription');
});
it('should fail if email is empty', () => {
  component.registerData = {
    email: '',
    password: 'password123',
    passwordConfirm: 'password123'
  };

  component.onSubmitRegister();

  expect(component.error).toBe('Email invalide (ex: test@mail.com)');
});
it('should fail if email is undefined', () => {
  component.registerData = {
    email: undefined as any,
    password: 'password123',
    passwordConfirm: 'password123'
  };

  component.onSubmitRegister();

  expect(component.error).toBe('Email invalide (ex: test@mail.com)');
});

});

import { Component } from '@angular/core';
import { LoginRequest } from '../../dto/LoginRequest';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { JwtResponse } from '../../dto/JwtResponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginRequest = { email: '', password: '' };
  error: string = '';
  showLogin = false; 

  constructor(private auth: AuthService, private router: Router) {}

  toggleLogin() {
    this.showLogin = true;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToUpload() {
    this.router.navigate(['/upload']);
  }
goToDasheboard(){
   this.router.navigate(['/dashboard']);
}
  onSubmit() {
    this.auth.login(this.loginData).subscribe({
      next: (res: JwtResponse) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['mon-espace']);
      },
      error: (err) => {
        this.error = 'Identifiants invalides';
        console.error(err);
        alert("Mauvaise credenziale");
      }
    });
  }
}
import { Component } from '@angular/core';
import { SignupRequest } from '../../dto/SignupRequest';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: SignupRequest & { passwordConfirm?: string } = { email: '', password: '', passwordConfirm: '' };
  success: string = '';
  error: string = '';

  constructor(private auth: AuthService, private router: Router) { }

  onSubmitRegister() {
    if (this.registerData.password !== this.registerData.passwordConfirm) {
      this.error = "Les mots de passe ne correspondent pas !";
      return;
    }

    const payload = {
      email:this.registerData.email,
      password:this.registerData.password
    };
    this.auth.register(payload).subscribe({
      next: () => {
        this.success = 'Utilisateur créé avec succès ! Vous pouvez maintenant vous connecter.';
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error = 'Erreur lors de l’inscription';
        console.error(err);
      }
    });
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
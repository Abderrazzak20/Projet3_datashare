import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mon-espace',
  imports: [CommonModule, FormsModule],
  templateUrl: './mon-espace.component.html',
  styleUrl: './mon-espace.component.css'
})
export class MonEspaceComponent {
  
  error: string = '';
  showLogin = false; // gestisce se mostrare la card login

  constructor(private auth: AuthService, private router: Router) { }

  toDasheboeard() {
   this.router.navigate(["/dashboard"]);
  }

  // Naviga alla pagina Upload (dalla home)
  goToUpload() {
    this.router.navigate(['/upload']);
  }

}


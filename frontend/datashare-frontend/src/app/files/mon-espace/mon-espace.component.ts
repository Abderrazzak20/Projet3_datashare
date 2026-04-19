import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mon-espace',
  imports: [CommonModule, FormsModule],
  templateUrl: './mon-espace.component.html',
  styleUrl: './mon-espace.component.css'
})
export class MonEspaceComponent {
  
  error: string = '';
  showLogin = false; 

  constructor( private router: Router) { }

  toDasheboeard() {
   this.router.navigate(["/dashboard"]);
  }


  goToUpload() {
    this.router.navigate(['/upload']);
  }

}


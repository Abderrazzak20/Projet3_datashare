import { FileService } from './../../services/file.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserFileDTO } from '../../dto/UserFileDTO';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'


})
export class DashboardComponent implements OnInit {
  files: UserFileDTO[] = [];
  filteredFiles: UserFileDTO[] = [];
  filter: string = "";
   isSidebarOpen = false;
   openMenuId: number | null = null;
  constructor(private fileService: FileService, private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    this.loadfiles();
  }
  loadfiles() {
    this.fileService.getMyFiles().subscribe(data => {
      this.files = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    const now = new Date();
    if (this.filter === 'active') {
      this.filteredFiles = this.files.filter(f => new Date(f.expiresAt) > now);
    } else if (this.filter === 'expired') {
      this.filteredFiles = this.files.filter(f => new Date(f.expiresAt) <= now);
    } else {
      this.filteredFiles = this.files;
    }
  }

  deleteFile(id: number) {
    if (!confirm("tu est sure de vuloire supprimer ce fichier?")) return;
    this.fileService.deleteFile(id).subscribe(() => {
      this.loadfiles();
    })
  }
  download(token: string, filename: string) {
    this.fileService.downloadFile(token).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  goToDownload(token: string | undefined) {
    if (!token) {
      alert("lien de telechargement non disponible");
    }

    this.router.navigate(['/download', token])
  }


  isExpired(date: string): boolean {
    return new Date(date).getTime() <= Date.now();
  }

  getRemainingDays(date: string): string {
    const now = new Date();
    const exp = new Date(date);
    const diffTime = exp.getTime() - now.getTime();
    const diffDays = Math.ceil((diffTime) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'aujourd’hui';
    if (diffDays === 1) return 'demain';
    return `dans ${diffDays} jours`;
  }

  setFilter(value: string) {
    this.filter = value;
    this.applyFilter();
  }
  goToUpload() {
    this.router.navigate(["/upload"]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
 

toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
}


toggleMenu(id: number) {
  this.openMenuId = this.openMenuId === id ? null : id;
}
}

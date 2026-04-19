import { Component } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileUploadResponse } from '../../dto/FileUploadResponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploadedFile: FileUploadResponse | null = null;
  fileError: string = '';
  expiration = 1;
  maxFileSize = 1 * 1024 * 1024 * 1024; // 1 GB
  UrlCopy: string = "";
  fileSize: string = '';
  constructor(private fileService: FileService) { }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    if (!file) return;
    if (file.size > this.maxFileSize) {
      this.fileError = "La taille des fichiers est limitée à 1 Go";
      this.selectedFile = null;
      return;
    }
    this.fileError = "";
    this.selectedFile = file;
  }

  removeFile() {
    this.selectedFile = null;
    this.fileError = "";
  }

 uploadFile() {
  if (!this.selectedFile) {
    alert("Sélectionner un fichier");
    return;
  }

  const file = this.selectedFile;

  // ❌ TEST TAILLE
  if (file.size > this.maxFileSize) {
    alert("Fichier trop volumineux (max 1 Go)");
    return;
  }

  const forbidden = ['.exe', '.bat', '.cmd', '.sh'];
  const name = file.name.toLowerCase();

  if (forbidden.some(ext => name.endsWith(ext))) {
    alert("Type de fichier interdit");
    return;
  }


  this.fileService.upload(file, this.expiration).subscribe({
    next: (res) => {
      this.uploadedFile = res;
      alert("Upload réussi !");
    },
    error: (err) => {
      if (err.status === 400) {
        alert("Fichier invalide");
      } else if (err.status === 401) {
        alert("Non authentifié");
      } else {
        alert("Erreur serveur");
      }
    }
  });
}

  copyLink() {
    if (this.uploadedFile) {
      this.UrlCopy = "http://localhost:4200/download/" + this.uploadedFile.downloadToken;
      navigator.clipboard.writeText(this.UrlCopy)

        .then(() => alert("Lien copié !"))
        .catch(err => console.error("Erreur copie :", err));
    }
  }

  getExpirationLabelFromDate(date?: string): string {
    if (!date) return '';

    const now = new Date();
    const exp = new Date(date);

    const diffTime = exp.getTime() - now.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days <= 1) return 'une journée';
    if (days <= 7) return 'une semaine';
    return `${days} jours`;
  }
  get downloadUrl(): string {
    return this.uploadedFile
      ? `http://localhost:4200/download/${this.uploadedFile.downloadToken}`
      : '';
  }
  formatSize(size?: number): string {
    if (size == null) return 'Taille inconnue';

    const numericSize = Number(size);
    if (isNaN(numericSize) || numericSize <= 0) return '0 Mo';

    const kb = numericSize / 1024;
    const mb = numericSize / (1024 * 1024);

    if (mb >= 1) return mb.toFixed(2) + ' Mo';
    return kb.toFixed(2) + ' Ko';
  }
}
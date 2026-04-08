import { HttpErrorResponse } from '@angular/common/http';
import { FileService } from './../../services/file.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-download',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './download.component.html',
  styleUrl: './download.component.css'
})
export class DownloadComponent implements OnInit {
  token: string = '';
  password: string = '';
  fileName: string = '';
  fileSize: string = '';
  expireInfo: string = '';
  error: string = '';
  success: string = '';
  expiresAt: string = '';
  isExpired: boolean = false;
  constructor(private fileService: FileService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get("token") || "";
    if (this.token) this.loadFileInfo();
  }

  loadFileInfo() {
    this.fileService.getFileToken(this.token).subscribe({
      next: (file) => {
        this.fileName = file.fileName;
        this.fileSize = this.formatSize(file.fileSize);
        this.expiresAt = file.expiresAt;
        this.expireInfo = `Ce fichier expirera le ${new Date(file.expiresAt).toLocaleDateString()}`;
        const now = new Date();
        const exp = new Date(file.expiresAt);
        this.isExpired = exp.getTime() < now.getTime();
      },
      error: () => {
        this.error = "Fichier introuvable ou expiré";
        this.isExpired = true;
      }
    });
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
  download() {
    if (!this.token) {
      this.error = "Le token est requis";
      return;
    }
    this.fileService.downloadFile(this.token).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = this.fileName || "downloaded_file";
        a.click();
        window.URL.revokeObjectURL(url);

        this.success = "Téléchargement réussi";
        this.error = "";
      },
      error: (err: HttpErrorResponse) => {
        this.error = "Erreur lors du téléchargement du fichier";
        this.success = "";
        console.error(err);
      }
    });

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


}

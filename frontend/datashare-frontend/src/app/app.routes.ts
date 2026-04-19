import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UploadComponent } from './files/upload/upload.component';
import { authGuard } from './guards/auth.guard';
import { DownloadComponent } from './files/download/download.component';
import { DashboardComponent } from './files/dashboard/dashboard.component';
import { MonEspaceComponent } from './files/mon-espace/mon-espace.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'upload', component: UploadComponent, canActivate: [authGuard] },
  { path: 'download/:token',component: DownloadComponent  },
    { path: 'mon-espace', component: MonEspaceComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
];

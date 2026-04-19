import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { UserFileDTO } from '../../dto/UserFileDTO';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FileService } from '../../services/file.service';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let fileServiceSpy: jasmine.SpyObj<FileService>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routeSpy: jasmine.SpyObj<Router>;


  beforeEach(async () => {
    fileServiceSpy = jasmine.createSpyObj("fileService", ["getMyFiles", "deleteFile"]);
    authSpy = jasmine.createSpyObj("AuthService", ["logout"]);
    routeSpy = jasmine.createSpyObj("Router", ["navigate"]);
    fileServiceSpy.getMyFiles.and.returnValue(of([
      {
        id: 1,
        filename: 'file1.txt',
        expiresAt: new Date(Date.now() + 86400000).toISOString()
      } as any
    ]));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent], providers: [{
        provide: FileService, useValue: fileServiceSpy
      }, { provide: AuthService, useValue: authSpy }, { provide: Router, useValue: routeSpy }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter active files', () => {
    component.filter = "active";
    component.applyFilter();
    expect(component.filteredFiles.length).toBe(1);
  });

  it('should filter expire files', () => {
    component.files = [
      { expiresAt: new Date(Date.now() - 86400000).toISOString() } as any
    ];
    component.setFilter("expired");
    expect(component.filteredFiles.length).toBe(1);
  });
  it('should delete file', () => {
    spyOn(window, "confirm").and.returnValue(true);
    fileServiceSpy.deleteFile.and.returnValue(of({}));
    component.deleteFile(1);
    expect(fileServiceSpy.deleteFile).toHaveBeenCalledWith(1);
  });
it('should navigate to upload', () => {
  component.goToUpload();
  expect(routeSpy.navigate).toHaveBeenCalledWith(["/upload"]);
});
it('should user logout', () => {
  component.logout();
  expect(authSpy.logout).toHaveBeenCalled();
  expect(routeSpy.navigate).toHaveBeenCalledWith(["/login"]);
});


});

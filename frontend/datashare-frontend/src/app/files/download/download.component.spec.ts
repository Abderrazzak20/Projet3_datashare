import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadComponent } from './download.component';
import { FileService } from '../../services/file.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('DownloadComponent', () => {
  let component: DownloadComponent;
  let fixture: ComponentFixture<DownloadComponent>;
  let FileServiceSpy: jasmine.SpyObj<FileService>;
  beforeEach(async () => {
    FileServiceSpy = jasmine.createSpyObj('FileService', [
      'getFileToken',
      'downloadFile'
    ]);

    FileServiceSpy.getFileToken.and.returnValue(of({
      fileName: "test.txt",
      fileSize: 1024,
      expiresAt: new Date(Date.now() + 86400000).toISOString()
    } as any));

    await TestBed.configureTestingModule({
      imports: [DownloadComponent],
      providers: [
        { provide: FileService, useValue: FileServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'fake-token'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load file info success', () => {
    FileServiceSpy.getFileToken.and.returnValue(of({
      fileName: "test.txt", fileSize: 1024, expiresAt: new Date(Date.now() + 86400000).toISOString()
    } as any))
    // component.loadFileInfo();
    expect(component.fileName).toBe("test.txt")
    expect(component.error).toBe("");
    expect(component.isExpired).toBeFalse();
  });
  it('should handlle load file error', () => {
    FileServiceSpy.getFileToken.and.returnValue(throwError(() => new Error("error")));
    component.loadFileInfo();
    expect(component.error).toBe('Fichier introuvable ou expiré');
    expect(component.isExpired).toBeTrue();
  });
  it('should download file success', () => {
    const blob = new Blob(['data']);

    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
    spyOn(document, 'createElement').and.callThrough();
    spyOn(window.URL, 'revokeObjectURL');

    FileServiceSpy.downloadFile.and.returnValue(of(blob));

    component.download();

    expect(FileServiceSpy.downloadFile).toHaveBeenCalledWith('fake-token');
    expect(component.success).toBe('Téléchargement réussi');
  });
  it('should handle download error', () => {
    FileServiceSpy.downloadFile.and.returnValue(
      throwError(() => new HttpErrorResponse({ error: 'fail' }))
    );
    component.download();
    expect(component.error).toBe('Erreur lors du téléchargement du fichier');
  });

});

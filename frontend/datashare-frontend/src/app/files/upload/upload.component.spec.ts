import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadComponent } from './upload.component';
import { FileService } from '../../services/file.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let fileServiceSpy: jasmine.SpyObj<FileService>;

  beforeEach(async () => {
    fileServiceSpy = jasmine.createSpyObj('FileService', ['upload']);

    await TestBed.configureTestingModule({
      imports: [UploadComponent],
      providers: [
        { provide: FileService, useValue: fileServiceSpy },
        { provide: ActivatedRoute,
          useValue: { snapshot: {
              paramMap: {
                get: () => 'fake-token'
              }}}}]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not upload if  file not selected', () => {
    spyOn(window, 'alert');

    component.uploadFile();

    expect(window.alert).toHaveBeenCalledWith('Sélectionner un fichier');
    expect(fileServiceSpy.upload).not.toHaveBeenCalled();
  });

  it('should upload file success', () => {
    const fakeFile = new File(['data'], 'test.txt');

    fileServiceSpy.upload.and.returnValue(of({ downloadToken: 'abc123' } as any));

    spyOn(window, 'alert');

    component.selectedFile = fakeFile;
    component.expiration = 1;

    component.uploadFile();

    expect(fileServiceSpy.upload).toHaveBeenCalled();
    expect(component.uploadedFile).toBeTruthy();
    expect(window.alert).toHaveBeenCalledWith('Upload réussi !');
  });

  it('should handle upload error', () => {
    const fakeFile = new File(['data'], 'test.txt');

    fileServiceSpy.upload.and.returnValue(
  
      throwError(() => ({ status: 500, message: 'upload error' }))
    );

    spyOn(window, 'alert');
    component.selectedFile = fakeFile;

    component.uploadFile();

    expect(window.alert).toHaveBeenCalledWith("Erreur serveur");
  });
  it('should block upload if file is too large', () => {
  spyOn(window, 'alert');

  const bigFile = new File(['data'], 'big.txt');
  Object.defineProperty(bigFile, 'size', { value: 2 * 1024 * 1024 * 1024 });

  component.selectedFile = bigFile;

  component.uploadFile();

  expect(window.alert).toHaveBeenCalledWith("Fichier trop volumineux (max 1 Go)");
  expect(fileServiceSpy.upload).not.toHaveBeenCalled();
});
it('should block forbidden file types', () => {
  spyOn(window, 'alert');

  const badFile = new File(['data'], 'virus.exe');

  component.selectedFile = badFile;

  component.uploadFile();

  expect(window.alert).toHaveBeenCalledWith("Type de fichier interdit");
  expect(fileServiceSpy.upload).not.toHaveBeenCalled();
});
it('should handle 400 error', () => {
  spyOn(window, 'alert');

  const file = new File(['data'], 'test.txt');
  component.selectedFile = file;

  fileServiceSpy.upload.and.returnValue(
    throwError(() => ({ status: 400 }))
  );

  component.uploadFile();

  expect(window.alert).toHaveBeenCalledWith("Fichier invalide");
});
it('should handle 401 error', () => {
  spyOn(window, 'alert');

  const file = new File(['data'], 'test.txt');
  component.selectedFile = file;

  fileServiceSpy.upload.and.returnValue(
    throwError(() => ({ status: 401 }))
  );

  component.uploadFile();

  expect(window.alert).toHaveBeenCalledWith("Non authentifié");
});
it('should ignore empty file selection', () => {
  const event = { target: { files: null } } as any;

  component.onFileSelected(event);

  expect(component.selectedFile).toBeNull();
});
it('should reject large file on selection', () => {
  const bigFile = new File(['data'], 'big.txt');
  Object.defineProperty(bigFile, 'size', { value: 2 * 1024 * 1024 * 1024 });

  const event = {
    target: { files: [bigFile] }
  } as any;

  component.onFileSelected(event);

  expect(component.fileError).toBe("La taille des fichiers est limitée à 1 Go");
  expect(component.selectedFile).toBeNull();
});
it('should supprime selected file', () => {
  component.selectedFile = new File(['data'], 'test.txt');
  component.fileError = 'error';

  component.removeFile();

  expect(component.selectedFile).toBeNull();
  expect(component.fileError).toBe('');
});
it('should copy link', async () => {
  component.uploadedFile = {
    downloadToken: 'abc123'
  } as any;

  spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());

  await component.copyLink();

  expect(navigator.clipboard.writeText).toHaveBeenCalled();
});
it('should return une journée', () => {
  const date = new Date().toISOString();
  expect(component.getExpirationLabelFromDate(date)).toBe('une journée');
});

it('should return une semaine', () => {
  const date = new Date(Date.now() + 3 * 86400000).toISOString();
  expect(component.getExpirationLabelFromDate(date)).toBe('une semaine');
});
});
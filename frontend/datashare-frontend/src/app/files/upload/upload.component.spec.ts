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
});
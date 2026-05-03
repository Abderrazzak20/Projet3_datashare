import { TestBed } from '@angular/core/testing';

import { FileService } from './file.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { UserFileDTO } from '../dto/UserFileDTO';
import { formatDate } from '@angular/common';

describe('FileService', () => {
  let service: FileService;
  let httpMock: HttpTestingController;
  let authSpy: jasmine.SpyObj<AuthService>;
  const baseUrl = 'http://localhost:8080/api/files';
  beforeEach(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authSpy.getToken.and.returnValue('fake-token');

    TestBed.configureTestingModule({
      providers: [FileService, {
        provide: AuthService, useValue: authSpy
      }, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController)
  });
  afterEach(() => {
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should upload file', () => {
    const mockResponse = {} as UserFileDTO;
    const file = new File(["Hello"], "text.txt");
    service.upload(file, 7).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${baseUrl}/upload`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body instanceof FormData).toBeTrue();
    expect(req.request.headers.get("Authorization")).toBe("Bearer fake-token");
    req.flush(mockResponse);
  });

  it('should get user files', () => {
    const mockFiles: UserFileDTO[] = [];
    service.getMyFiles().subscribe(res => {
      expect(res).toEqual(mockFiles);
    });
    const req = httpMock.expectOne(`${baseUrl}/my-files`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get("Authorization")).toBe("Bearer fake-token");
    req.flush(mockFiles);
  });

  it('should delete file', () => {
    service.deleteFile(1).subscribe(res => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe("DELETE");
    expect(req.request.headers.get("Authorization")).toBe("Bearer fake-token");
    req.flush({});
  });

  it('should download file', () => {
    const blob = new Blob(["data"]);
    service.downloadFile("token3").subscribe(res => {
      expect(res instanceof Blob).toBeTrue();
    });
    const req = httpMock.expectOne(`${baseUrl}/download/token3`);
    expect(req.request.method).toBe("GET");
    expect(req.request.responseType).toBe("blob");
    req.flush(blob);
  });
  it('should get file info', () => {
    const mockFile = {} as UserFileDTO;
    service.getFileToken("token123").subscribe(res => {
      expect(res).toEqual(mockFile);
    });
    const req = httpMock.expectOne(`${baseUrl}/info/token123`);
    expect(req.request.method).toBe("GET");
    req.flush(mockFile);
  });


});
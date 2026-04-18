import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonEspaceComponent } from './mon-espace.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

describe('MonEspaceComponent', () => {
  let component: MonEspaceComponent;
  let fixture: ComponentFixture<MonEspaceComponent>;
  let authSpy: jasmine.SpyObj<AuthService>
  let routeSpy: jasmine.SpyObj<Router>;
  beforeEach(async () => {
    routeSpy = jasmine.createSpyObj("Router", ["navigate"]);
 

    await TestBed.configureTestingModule({
      imports: [MonEspaceComponent], providers: [
        { provide: Router, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MonEspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to dashboard', () => {
    component.toDasheboeard();
    expect(routeSpy.navigate).toHaveBeenCalledWith(["/dashboard"]);
  });
   it('should navigate to upload', () => {
    component.goToUpload();
    expect(routeSpy.navigate).toHaveBeenCalledWith(["/upload"]);
  });
});

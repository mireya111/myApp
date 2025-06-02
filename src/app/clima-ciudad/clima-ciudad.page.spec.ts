import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClimaCiudadPage } from './clima-ciudad.page';

describe('ClimaCiudadPage', () => {
  let component: ClimaCiudadPage;
  let fixture: ComponentFixture<ClimaCiudadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClimaCiudadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

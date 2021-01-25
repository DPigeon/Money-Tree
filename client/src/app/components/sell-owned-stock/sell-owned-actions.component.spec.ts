import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FORM_MODULE_DPENDENCEIES,
  MATERIAL_MODULE_DEPENDENCIES,
} from '../../shared.module';
import { SellOwnedActionsComponent } from './sell-owned-actions.component';

describe('SellOwnedActionsComponent', () => {
  let component: SellOwnedActionsComponent;
  let fixture: ComponentFixture<SellOwnedActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MATERIAL_MODULE_DEPENDENCIES, FORM_MODULE_DPENDENCEIES],
      declarations: [SellOwnedActionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellOwnedActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

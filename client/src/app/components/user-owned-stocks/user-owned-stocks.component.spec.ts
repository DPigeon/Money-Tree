import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MATERIAL_MODULE_DEPENDENCIES } from '../../shared.module';
import { UserOwnedStocksComponent } from './user-owned-stocks.component';

// integration tests
describe('UserOwnedStocksComponent', () => {
  let component: UserOwnedStocksComponent;
  let fixture: ComponentFixture<UserOwnedStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: MATERIAL_MODULE_DEPENDENCIES,
      declarations: [UserOwnedStocksComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOwnedStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

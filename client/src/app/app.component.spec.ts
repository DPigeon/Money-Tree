import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MATERIAL_MODULE_DEPENDENCIES, NGRX_STORE_MODULE } from './shared.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MATERIAL_MODULE_DEPENDENCIES],
      declarations: [AppComponent, HeaderComponent],
      providers: NGRX_STORE_MODULE
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

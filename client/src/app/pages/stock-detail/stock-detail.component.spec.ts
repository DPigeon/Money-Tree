import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockDetailComponent } from './stock-detail.component';
import { StockDetailHeaderComponent } from '../../components/stock-detail-header/stock-detail-header.component';
import { StoreFacadeService } from '../../store/store-facade.service';
import { MATERIAL_MODULE_DEPENDENCIES, NGRX_STORE_MODULE, } from '../../shared.module';
import { ActivatedRoute } from '@angular/router';

const fakeActivatedRoute = {
  snapshot: {
    paramMap: {
      get(): string {
        return 'AC';
      },
    },
  },
} as any;

describe('StockDetailComponent', () => {
  let component: StockDetailComponent;
  let fixture: ComponentFixture<StockDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: MATERIAL_MODULE_DEPENDENCIES,
      declarations: [StockDetailComponent, StockDetailHeaderComponent],
      providers: [
        StoreFacadeService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        NGRX_STORE_MODULE,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

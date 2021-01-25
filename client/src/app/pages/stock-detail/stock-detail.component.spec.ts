import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockDetailComponent } from './stock-detail.component';
import { StockDetailHeaderComponent } from '../../components/stock-detail-header/stock-detail-header.component';
import { StockStatsComponent } from '../../components/stock-stats/stock-stats.component';
import { StoreFacadeService } from '../../store/store-facade.service';
import {
  FORM_MODULE_DPENDENCEIES,
  MATERIAL_MODULE_DEPENDENCIES,
  NGRX_STORE_MODULE,
} from '../../shared.module';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { UserOwnedStocksComponent } from 'src/app/components/user-owned-stocks/user-owned-stocks.component';
import { StockSearchComponent } from 'src/app/components/stock-search/stock-search.component';
import { RouterTestingModule } from '@angular/router/testing';

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
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        RouterTestingModule,
        FORM_MODULE_DPENDENCEIES,
      ],
      declarations: [
        StockDetailComponent,
        StockDetailHeaderComponent,
        StockStatsComponent,
        UserOwnedStocksComponent,
        HeaderComponent,
        StockSearchComponent,
      ],
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

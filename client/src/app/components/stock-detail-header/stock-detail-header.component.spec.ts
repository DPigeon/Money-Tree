import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDetailHeaderComponent } from './stock-detail-header.component';

describe('StockDetailHeaderComponent', () => {
  let component: StockDetailHeaderComponent;
  let fixture: ComponentFixture<StockDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockDetailHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

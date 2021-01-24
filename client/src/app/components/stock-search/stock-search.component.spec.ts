import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MATERIAL_MODULE_DEPENDENCIES,
  FORM_MODULE_DPENDENCEIES,
} from '../../shared.module';

import { StockSearchComponent } from './stock-search.component';

describe('StockSearchComponent', () => {
  let component: StockSearchComponent;
  let fixture: ComponentFixture<StockSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        RouterTestingModule,
        FORM_MODULE_DPENDENCEIES,
      ],
      declarations: [StockSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const mockRouter = {
  navigate: jest.fn(),
} as any;

describe('StockSearchComponent Unit Test', () => {
  let component: StockSearchComponent;

  beforeEach(() => {
    component = new StockSearchComponent(mockRouter);
  });

  it('should handle proper keyboard input on autocomplete', () => {
    const routingSpy = jest.spyOn(mockRouter, 'navigate');

    // case: no active option, no search result
    component.query = '';
    component.activeOption = { Symbol: '', Name: '' };
    component.searchResults = [];
    component.handleKeyboardSelectionEvent();
    expect(routingSpy).toHaveBeenCalledTimes(0);

    // case: active option, no search result
    routingSpy.mockClear();
    component.activeOption = { Symbol: 'AAPL', Name: 'Apple Inc.' };
    component.searchResults = [];
    component.handleKeyboardSelectionEvent();
    expect(routingSpy).toHaveBeenCalledTimes(1);

    // case: no active option, search result
    routingSpy.mockClear();
    component.activeOption = { Symbol: '', Name: '' };
    component.searchResults = [{ Symbol: 'AAPL', Name: 'Apple Inc.' }];
    component.handleKeyboardSelectionEvent();
    expect(routingSpy).toHaveBeenCalledTimes(1);

    // case: active option, search result
    routingSpy.mockClear();
    component.activeOption = { Symbol: '', Name: '' };
    component.searchResults = [{ Symbol: 'AAPL', Name: 'Apple Inc.' }];
    component.handleKeyboardSelectionEvent();
    expect(routingSpy).toHaveBeenCalledTimes(1);
  });

  it('should return the correct search results when querying', () => {
    const keyboardHandlerSpy = jest.spyOn(
      component,
      'handleKeyboardSelectionEvent'
    );

    // case: no key, no query
    component.query = '';
    component.queryFilter(null);
    expect(component.searchResults.length).toBe(0);

    // case: no key, query
    component.query = 'aapl';
    component.queryFilter(null);
    expect(component.searchResults.length > 0).toBe(true);
    expect(component.query).toBe('aapl');

    // case: key, query
    component.query = 'aapl';
    component.queryFilter({ key: 'Enter' } as any);
    expect(keyboardHandlerSpy).toHaveBeenCalled();
    expect(component.query).toBe('Apple Inc.');

    // case: key, no query
    keyboardHandlerSpy.mockClear();
    component.query = '';
    component.queryFilter({ key: 'Enter' } as any);
    expect(keyboardHandlerSpy).toHaveBeenCalledTimes(0);
  });
});

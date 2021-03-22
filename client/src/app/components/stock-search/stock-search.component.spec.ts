import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import FuzzySearch from 'fuzzy-search';
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
  const itemSearch = [
    {
      type: 'user',
      name: 'user user',
      id: 'u1',
      profileImage:
        'https://moneytree-profile-pictures.s3.amazonaws.com/DEFAULT-profile.jpg',
    },
    {
      type: 'user',
      name: 'money tree',
      id: 'u2',
      profileImage:
        'https://moneytree-profile-pictures.s3.amazonaws.com/AGWLLGVS3AJ327O2T-im.jpg',
    },
    {
      type: 'user',
      name: 'tree money',
      id: 'u3',
      profileImage:
        'https://moneytree-profile-pictures.s3.amazonaws.com/DEFAULT-profile.jpg',
    },
  ];

  it('should handle proper keyboard input on autocomplete', () => {
    const routingSpy = jest.spyOn(mockRouter, 'navigate');
    // case: no active option, no search result
    component.query = '';
    component.activeOption = { type: '', id: '', name: '' };
    component.searchResults = [];
    component.handleKeyboardSelectionEvent();
    expect(routingSpy).toHaveBeenCalledTimes(0);

    // case: active option, no search result
    routingSpy.mockClear();
    component.activeOption = { type: 'stock', id: 'AAPL', name: 'Apple Inc.' };
    component.searchResults = [];
    component.handleKeyboardSelectionEvent();
    expect(routingSpy).toHaveBeenCalledTimes(1);

    // case: no active option, search result
    routingSpy.mockClear();
    component.activeOption = { type: '', id: '', name: '' };
    component.searchResults = [
      { type: 'stock', id: 'AAPL', name: 'Apple Inc.' },
    ];
    component.handleKeyboardSelectionEvent();
    expect(routingSpy).toHaveBeenCalledTimes(1);

    // case: active option, search result
    routingSpy.mockClear();
    component.activeOption = { type: '', id: '', name: '' };
    component.searchResults = [
      { type: 'stock', id: 'AAPL', name: 'Apple Inc.' },
    ];
    component.handleKeyboardSelectionEvent();
    expect(routingSpy).toHaveBeenCalledTimes(1);
  });

  it('should return the correct search results when querying', () => {
    component.allSearcher = new FuzzySearch(itemSearch, ['name'], {
      caseSensitive: false,
      sort: true,
    });
    component.userSearcher = new FuzzySearch(itemSearch, ['name'], {
      caseSensitive: false,
      sort: true,
    });
    component.stockSearcher = new FuzzySearch(itemSearch, ['name'], {
      caseSensitive: false,
      sort: true,
    });
    component.selectedSearchOption = 'stocks' || 'users' || 'all';
    component.autoComplete = {
      closePanel: jest.fn(),
    } as any;
    const keyboardHandlerSpy = jest.spyOn(
      component,
      'handleKeyboardSelectionEvent'
    );

    // case: no key, no query
    component.query = '';
    component.queryFilter(null);
    expect(component.searchResults.length).toBe(0);

    // case: no key, query
    component.query = 'user';
    component.queryFilter(null);
    expect(component.searchResults.length > 0).toBe(true);
    expect(component.query).toBe('user');

    // case: key, query
    component.query = 'user';
    component.queryFilter({ key: 'Enter' } as any);
    expect(keyboardHandlerSpy).toHaveBeenCalled();
    expect(component.query).toBe('user user');

    // case: key, no query
    keyboardHandlerSpy.mockClear();
    component.query = '';
    component.queryFilter({ key: 'Enter' } as any);
    expect(keyboardHandlerSpy).toHaveBeenCalledTimes(0);
  });

  it('should return the correct classes', () => {
    component.selectedSearchOption = 'stocks';
    expect(component.isSelectedClass('stocks')).toBe('selectedOption');
    component.selectedSearchOption = 'users';
    expect(component.isSelectedClass('stocks')).toBe('searchOption');
  });

  it('should navigate to corresponding page', () => {
    const routingSpy = jest.spyOn(mockRouter, 'navigate');
    routingSpy.mockClear();
    component.navigateTo('user', 'u1', 'me');
    expect(routingSpy).toHaveBeenCalledTimes(1);
    expect(component.query).toBe('me');
  });
});

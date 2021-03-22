import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  MatAutocompleteActivatedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import FuzzySearch from 'fuzzy-search';
import { UserSearch } from 'src/app/interfaces/userSearch';
declare var require: any;
const NASDAQ = require('src/assets/stock-information/NASDAQ.json');
const AMEX = require('src/assets/stock-information/AMEX.json');
const NYSE = require('src/assets/stock-information/NYSE.json');
const allStockData = NASDAQ.concat(AMEX, NYSE);

export interface SearchItem {
  type: string;
  name: string;
  id: string;
  profileImage?: string;
}

@Component({
  selector: 'app-stock-search-input',
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.scss'],
})
export class StockSearchComponent implements OnInit {
  @Input() userSearch$: any;
  query = '';
  searchResults: SearchItem[] = [];
  activeOption: SearchItem = { type: '', id: '', name: '' };
  selectedSearchOption = 'all';
  allSearcher: FuzzySearch = null;
  userSearcher: FuzzySearch = null;
  stockSearcher: FuzzySearch = null;

  @ViewChild(MatAutocompleteTrigger) autoComplete: MatAutocompleteTrigger;

  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
    const allUsers: UserSearch[] = this.userSearch$.map((u: UserSearch) => ({
      ...u,
      type: 'user',
    }));
    const allStocks: any = allStockData.map((s: any) => ({
      ...s,
      type: 'stock',
    }));
    const users: any = await this.getStocksAndUsers([], allUsers);
    this.userSearcher = new FuzzySearch(users, ['name'], {
      caseSensitive: false,
      sort: true,
    });
    const stocks: any = await this.getStocksAndUsers(allStocks, []);
    this.stockSearcher = new FuzzySearch(stocks, ['name', 'id'], {
      caseSensitive: false,
      sort: true,
    });
    const all = stocks.concat(users);
    this.allSearcher = new FuzzySearch(all, ['name', 'id'], {
      caseSensitive: false,
      sort: true,
    });
  }

  async getStocksAndUsers(stocks: any, users: any): Promise<SearchItem[]> {
    const allSearch: SearchItem[] = [];
    stocks.forEach((s) => {
      allSearch.push({ type: s.type, name: s.Name, id: s.Symbol });
    });
    users.forEach((u) => {
      allSearch.push({
        type: u.type,
        name: u.firstName + ' ' + u.lastName,
        id: u.id,
        profileImage: u.avatarURL,
      });
    });
    return allSearch;
  }

  queryFilter(e: KeyboardEvent): void {
    if (this.query === '') {
      this.searchResults = [];
      this.selectedSearchOption = 'all';
    } else {
      if (this.selectedSearchOption === 'users') {
        this.searchResults = this.userSearcher.search(this.query).slice(0, 10);
      } else if (this.selectedSearchOption === 'stocks') {
        this.searchResults = this.stockSearcher.search(this.query).slice(0, 10);
      } else {
        this.searchResults = this.allSearcher.search(this.query).slice(0, 10);
      }
      if (e && e.key === 'Enter') {
        this.handleKeyboardSelectionEvent();
        this.autoComplete.closePanel();
      }
    }
  }

  handleKeyboardSelectionEvent(): void {
    if (this.activeOption.id !== '' || this.activeOption.name !== '') {
      this.navigateTo(
        this.activeOption.type,
        this.activeOption.id,
        this.activeOption.name
      );
      this.query = this.activeOption.name;
    } else if (this.searchResults.length > 0) {
      this.navigateTo(
        this.searchResults[0].type,
        this.searchResults[0].id,
        this.searchResults[0].name
      );
    }
  }

  getActiveOption(e: MatAutocompleteActivatedEvent): void {
    if (!!e.option) {
      this.activeOption = {
        type: e.option.value.type,
        id: e.option.value.id,
        name: e.option.value.name,
      };
    }
  }

  isSelectedClass(type: string): string {
    return type === this.selectedSearchOption
      ? 'selectedOption'
      : 'searchOption';
  }

  navigateTo(type: string, id: string, name: string): void {
    const route = (type === 'user' ? '/profile/' : '/stock-detail/') + id;
    this.router.navigate([route]);
    this.query = name;
  }
}

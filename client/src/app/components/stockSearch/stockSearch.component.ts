import { Component, ViewChild } from '@angular/core';
import { MatAutocompleteActivatedEvent } from '@angular/material/autocomplete';

import { Router } from '@angular/router';
import FuzzySearch from 'fuzzy-search';
import { StockSearch } from 'src/app/interfaces/stockSearch';
import { stockList } from 'src/assets/StockNames&Symbols';

@Component({
  selector: 'app-stock-search-input',
  templateUrl: './stockSearch.component.html',
  styleUrls: ['./stockSearch.component.scss'],
})
export class StockSearchComponent {
  query = '';
  searchResults: StockSearch[] = [];
  activeOption = '';
  searcher = new FuzzySearch(stockList, ['name', 'symbol'], {
    caseSensitive: false,
    sort: true,
  });

  constructor(private router: Router) {}

  queryFilter(e: KeyboardEvent): void {
    if (this.query === '') {
      this.searchResults = [];
    } else {
      this.searchResults = this.searcher.search(this.query).slice(0, 4);
      let symbol = '';
      if (
        e.key === 'Enter' &&
        (!!this.activeOption || this.searchResults.length > 0)
      ) {
        if (!!this.activeOption) {
          symbol = this.activeOption;
        } else {
          if (this.searchResults.length > 0) {
            symbol = this.searchResults[0].symbol;
          }
        }
        this.router.navigate(['/stock-detail/' + symbol]);
      }
    }
  }
  getActiveOption(e: MatAutocompleteActivatedEvent): void {
    this.activeOption = e.option.value;
  }
}

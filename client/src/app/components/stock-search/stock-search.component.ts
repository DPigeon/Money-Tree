import { Component } from '@angular/core';
import { MatAutocompleteActivatedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { StockSearch } from 'src/app/interfaces/stockSearch';
import FuzzySearch from 'fuzzy-search';
declare var require: any
const NASDAQ = require('src/assets/stock-information/NASDAQ.json');
const AMEX = require('src/assets/stock-information/AMEX.json');
const NYSE = require('src/assets/stock-information/NYSE.json');
const allStockData = NASDAQ.concat(AMEX, NYSE);

const searcher: FuzzySearch = new FuzzySearch(allStockData, ['Name', 'Symbol'], {
  caseSensitive: false,
  sort: true,
});

@Component({
  selector: 'app-stock-search-input',
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.scss'],
})
export class StockSearchComponent {
  query = '';
  searchResults: StockSearch[] = [];
  activeOption = '';

  constructor(private router: Router) {}

  queryFilter(e: KeyboardEvent): void {
    if (this.query === '') {
      this.searchResults = [];
    } else {
      this.searchResults = searcher.search(this.query).slice(0, 5);
      if (e && e.key === 'Enter') {
        this.handleKeyboardSelectionEvent();
      }
    }
  }

  handleKeyboardSelectionEvent() {
    if (!!this.activeOption) {
      this.router.navigate(['/stock-detail/' + this.activeOption]);
    } else if(this.searchResults.length > 0) {
      this.router.navigate(['/stock-detail/' + this.searchResults[0].symbol]);
    }
  }

  getActiveOption(e: MatAutocompleteActivatedEvent): void {
    this.activeOption = e.option.value;
  }
}

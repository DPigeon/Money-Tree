import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  stockInfo: Stock = {
    tickerSymbol: 'AC',
    companyName: 'Air Canada',
    industry: 'Transportation',
    volatility: 'High',
    stockChange: 4.27,
    stockChangePercent: 1.68,
    stockValue: 16.36,
  }
  constructor() { }

  ngOnInit(): void {
  }

}

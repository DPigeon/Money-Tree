import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-detail-header',
  templateUrl: './stock-detail-header.component.html',
  styleUrls: ['./stock-detail-header.component.scss']
})
export class StockDetailHeaderComponent implements OnInit {
  public companyName = ""
  public stockChange: number;
  public stockChangePercent: number;
  public stockValue: number;
  constructor() { }

  ngOnInit(): void {
    this.companyName = 'Air canada';
    this.stockChange = 4.27;
    this.stockChangePercent = 1.68;
    this.stockValue = 16.36;
  }

  stockChangeColor() {
    return this.stockChange < 0 ? 'negative-change' : 'positive-change';
  }
  stockInfoFormatter() {
    let sign = this.stockChange < 0 ? '-' : '+';
    return sign + this.stockChange + "("+ this.stockChangePercent+"%)";
  }
}

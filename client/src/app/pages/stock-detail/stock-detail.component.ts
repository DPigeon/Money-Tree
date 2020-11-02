import { Component, OnInit } from '@angular/core';
import { Stock } from '../../interfaces/stock';
import { StoreFacadeService } from '../../store/store-facade.service';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  stockInfo$ = this.storeFacade.currentStockLoaded$;

  constructor(private storeFacade: StoreFacadeService) { }

  ngOnInit(): void {
    this.storeFacade.loadCurrentStock('AC');

    this.stockInfo$.subscribe( val =>{
      console.log('this is the stock info', val);
    })
  }

}

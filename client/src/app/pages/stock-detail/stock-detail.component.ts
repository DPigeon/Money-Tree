import { Component, OnInit } from '@angular/core';
import { StoreFacadeService } from '../../store/store-facade.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  stockInfo$ = this.storeFacade.currentStockLoaded$;

  constructor(private storeFacade: StoreFacadeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const ticker = this.route.snapshot.paramMap.get('ticker');
    this.storeFacade.loadCurrentStock(ticker);
  }

}

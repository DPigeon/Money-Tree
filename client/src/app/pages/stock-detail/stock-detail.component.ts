import { Component, OnInit } from '@angular/core';
import { StoreFacadeService } from '../../store/store-facade.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss'],
})
export class StockDetailComponent implements OnInit {
  stockHistory$ = this.storeFacade.stockHistoryLoaded$;
  stockInfo$ = this.storeFacade.currentStockLoaded$;
  marketClock$ = this.storeFacade.currentMarketClock$;
  userInfo$ = this.storeFacade.currentUser$;
  userOwnedStocks$ = this.storeFacade.userOwnedStocks$;
  showStockChart=false;
  constructor(
    private storeFacade: StoreFacadeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    let ticker = this.route.snapshot.paramMap.get('ticker');
    this.storeFacade.loadCurrentStock(ticker);
    this.storeFacade.loadMarketClock(Number(localStorage.getItem('userId')));
    this.storeFacade.loadUserOwnedStocks(
      Number(localStorage.getItem('userId'))
    );

    this.storeFacade.loadCurrentStockHistoricalData(ticker);
    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(() => {
        ticker = this.route.snapshot.paramMap.get('ticker');
        this.storeFacade.loadCurrentStock(ticker);
        this.storeFacade.loadCurrentStockHistoricalData(ticker);
      });
      this.stockHistory$.subscribe(
        (hist)=>{
          if(!!hist){
            this.showStockChart=true;
          }  
         }); 
  }
}

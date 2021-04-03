// Module imports:
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Component imports:
import { AppComponent } from './app.component';
import { StockDetailComponent } from './pages/stock-detail/stock-detail.component';
import { StockDetailHeaderComponent } from './components/stock-detail-header/stock-detail-header.component';
import { HeaderComponent } from './components/header/header.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { HomeProfileComponent } from './components/home-profile-column/home-profile.component';
import { UserOwnedStockProfileComponent } from './components/user-owned-stock-profile/user-owned-stock-profile.component';
import { StockStatsComponent } from './components/stock-stats/stock-stats.component';
import { LoginSignupComponent } from './pages/login-signup/login-signup.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { HomeComponent } from './pages/home/home.component';
import { StockSearchComponent } from './components/stock-search/stock-search.component';
import { UserOwnedStocksComponent } from './components/user-owned-stocks/user-owned-stocks.component';
import { SellOrBuyActionsComponent } from './components/sell-buy-stock/sell-buy-actions.component';
import { FollowingsSearchComponent } from './components/followings-search/followings-search.component';
import { StockAdditionalInfoComponent } from './components/stock-additional-info/stock-additional-info.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { ListOfFollowsComponent } from './components/list-of-follows/list-of-follows.component';
import { HistoricalChartComponent } from './components/historical-chart/historical-chart.component';

// other imports:
import { Effects } from './store/effects/app.effects';
import { environment } from '../environments/environment';
import { reducer } from './store/reducers/app.reducer';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

// analytics
import { NgxHotjarModule } from 'ngx-hotjar';



@NgModule({
  declarations: [
    AppComponent,
    StockDetailComponent,
    StockDetailHeaderComponent,
    StockStatsComponent,
    UserOwnedStocksComponent,
    HeaderComponent,
    StockSearchComponent,
    LeaderboardComponent,
    LoginSignupComponent,
    SignupFormComponent,
    LoginFormComponent,
    HomeComponent,
    HomeProfileComponent,
    UserOwnedStockProfileComponent,
    EditProfileComponent,
    SellOrBuyActionsComponent,
    FollowingsSearchComponent,
    StockAdditionalInfoComponent,
    ProfileComponent,
    TransactionHistoryComponent,
    ListOfFollowsComponent,
    HistoricalChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ appState: reducer }),
    NgxHotjarModule.forRoot('2140693'),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([Effects]),
    MatCardModule,
    FlexLayoutModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatSnackBarModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

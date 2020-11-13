// Module imports:
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { LoginSignupComponent } from './pages/login-signup/login-signup.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';

// Component imports:
import { AppComponent } from './app.component';
import { StockDetailComponent } from './pages/stock-detail/stock-detail.component';
import { StockDetailHeaderComponent } from './components/stock-detail-header/stock-detail-header.component';
import { HeaderComponent } from './components/header/header.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';

// other imports:
import { Effects } from './store/effects/app.effects';
import { environment } from '../environments/environment';
import { reducer } from './store/reducers/app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    StockDetailComponent,
    StockDetailHeaderComponent,
    HeaderComponent,
    LeaderboardComponent,
    LoginSignupComponent,
    SignupFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ appState: reducer }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([Effects]),
    MatCardModule,
    FlexLayoutModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

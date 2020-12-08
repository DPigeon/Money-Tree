import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockDetailComponent } from './pages/stock-detail/stock-detail.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { LoginSignupComponent } from './pages/login-signup/login-signup.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: 'stock-detail/:ticker', component: StockDetailComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: '', component: LoginSignupComponent},
  { path: 'home', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

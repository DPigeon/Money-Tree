import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockDetailComponent } from './pages/stock-detail/stock-detail.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { LoginSignupComponent } from './pages/login-signup/login-signup.component';
import { HomeComponent } from './pages/home/home.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: 'stock-detail/:ticker', component: StockDetailComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: '', component: LoginSignupComponent },
  { path: 'home', component: HomeComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'profile/:username', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

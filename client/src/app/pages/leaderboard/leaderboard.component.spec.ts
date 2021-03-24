import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from 'src/app/components/header/header.component';
import {
  FORM_MODULE_DPENDENCEIES,
  MATERIAL_MODULE_DEPENDENCIES,
  NGRX_STORE_MODULE,
} from 'src/app/shared.module';

import { LeaderboardComponent } from './leaderboard.component';
import { StockSearchComponent } from 'src/app/components/stock-search/stock-search.component';

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MATERIAL_MODULE_DEPENDENCIES,
        FORM_MODULE_DPENDENCEIES,
        RouterTestingModule,
      ],
      declarations: [
        LeaderboardComponent,
        HeaderComponent,
        StockSearchComponent,
      ],
      providers: [NGRX_STORE_MODULE],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to leaderboard user profile', () => {
    spyOn(component, 'navigateToProfile');
    component.topUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        avatarURL: 'imageUrl',
        username: 'johnUsername',
        score: 10,
      },
    ];
    const button = fixture.debugElement.nativeElement.querySelector('img');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.navigateToProfile).toHaveBeenCalledWith('johnUsername');
    });
  });
});

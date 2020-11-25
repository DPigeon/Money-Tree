import { Injectable } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private api: ApiService) { }

  createNewUser(user: User): Observable<User>  {
    return this.api
      .post('users/create-user', user)
      .pipe(map((res: Response) => this.userFormatter(res)));
  }

  userFormatter(response: Response) {
    console.log("format user");
    console.log(response.headers.get('Location'));
    return null
  }
  userLogin(user: User): Observable<User>  {
    return this.api
      .post('users/login', user)
      .pipe(map((res: Response) => this.userFormatter(res)));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  baseUrl = 'http://localhost:8080/api/v1/'; // TODO: get the right Url depending on env: 'http://${ENV_URL}/api/';

  constructor(private http: HttpClient) {}

  get(url: string): Observable<any> {
    return this.http.get(this.baseUrl + url);
  }

  post(url: string, params: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'response'
    };
    return this.http.post(this.baseUrl + url, params, httpOptions);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'http://localhost:8080/api/v1/'; // TODO: get the right Url depending on env: 'http://${ENV_URL}/api/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response',
  };

  constructor(private http: HttpClient) { }

  get(url: string): Observable<any> {
    return this.http.get(this.baseUrl + url, this.httpOptions);
  }

  post(url: string, params: any): Observable<any> {
    return this.http.post(this.baseUrl + url, params, this.httpOptions);
  }

  update(url: string, params: any): Observable<any> {
    return this.http.put(this.baseUrl + url, params, this.httpOptions);
  }
}

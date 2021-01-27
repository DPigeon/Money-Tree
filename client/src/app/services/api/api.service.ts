import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = environment.apiURL;
  httpOptions = { observe: 'response' as 'response' };

  constructor(private http: HttpClient) {}

  get(url: string): Observable<any> {
    return this.http.get(this.baseUrl + url, this.httpOptions);
  }

  post(url: string, params: any): Observable<any> {
    return this.http.post(this.baseUrl + url, params, this.httpOptions);
  }

  update(url: string, params: any): Observable<any> {
    return this.http.put(this.baseUrl + url, params, this.httpOptions);
  }

  patch(url: string, params: any): Observable<any> {
    return this.http.patch(this.baseUrl + url, params, this.httpOptions);
  }

  delete(url: string): Observable<any> {
    return this.http.delete(this.baseUrl + url, this.httpOptions);
  }
}

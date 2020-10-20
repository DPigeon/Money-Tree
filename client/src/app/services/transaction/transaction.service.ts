import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private api: ApiService) { }
}

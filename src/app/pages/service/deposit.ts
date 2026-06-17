import { Injectable } from '@angular/core';
import { Apiservice } from '@/service/apiservice';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Deposit {  
  constructor(private apiService: Apiservice, private http: HttpClient) { }
  getDepositHistory(email: string) {
    return this.apiService.post<any>(`deposit/list`, { email });
  }
}



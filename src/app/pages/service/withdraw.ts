import { Injectable } from '@angular/core';
import { Apiservice } from '@/service/apiservice';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Withdraw {

  constructor(private apiService: Apiservice, private http: HttpClient) { }

  getWithdrawHistory(email: string) {
    return this.apiService.post<any>(`withdraw/list`, { email });
  }

}



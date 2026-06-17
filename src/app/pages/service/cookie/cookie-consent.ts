import { Injectable } from '@angular/core';
import { Observable, tap, BehaviorSubject, of, switchMap, map } from 'rxjs';
import { Apiservice } from '@/service/apiservice';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CookieConsent {
  constructor(private apiService: Apiservice, private http: HttpClient) {
  }


  //  Get Location
  private getLocation(): Observable<any> {
    return this.http.get('https://ipapi.co/json/');
  }

  // Build Payload
  private buildPayload(res: any): any {
    return {
      consent: 'accepted',
      timestamp: new Date().toISOString(),
      device: navigator.userAgent,
      language: navigator.language,
      country: res.country || 'Unknown',
      state: res.region_code || 'Unknown',
      stateName: res.region || 'Unknown',
      postal: res.postal || 'Unknown'
    };
  }

  //  Main method (call this from component)
  sendConsent(): Observable<any> {
    return this.getLocation().pipe(
      map(res => this.buildPayload(res)),
      switchMap(payload => {
        console.log('Payload:', payload);
        return this.apiService.post('consent/anonymous', payload);
      })
    );
  }
}

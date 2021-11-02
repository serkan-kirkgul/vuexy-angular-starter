import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/auth/models';

import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservableInfo, Reservation } from './home.models';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  // Public
  public currentUser: User;
  /**
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  /**
   * Get Last Reservations
   */
  getLastReservations() {
    return this._httpClient.post<any>(`${environment.apiUrl}/api/reportService/GetLastReservations`, { 
      lastReservationRequest: { count: 6 },
      agencyCode: this.currentUser.agency,
      userCode: this.currentUser.user
    }).pipe(
      map (response => {
        var data = {
          reservations: Array<Reservation>()
        }
        if (response.header.success) {
          for (let index = 0; index < response.body.reservations.length; index++) {
            const item = response.body.reservations[index];
            var res = new Reservation();
            res.bookingNumber = item.bookingNumber;
            if (item.reservableInfo) {
              res.reservableInfo = new ReservableInfo();
              res.reservableInfo.reservable = item.reservableInfo.reservable;
              res.reservableInfo.optionDate = item.reservableInfo.optionDate;
            }
            res.beginDate = item.beginDate;
            res.endDate = item.endDate;
            res.leaderName = item.leaderName;
            res.serviceName = item.serviceName;
            res.confirmationStatus = item.confirmationStatus;
            data.reservations.push(res);
          }
        }
        return data;
      })
    )
  }
  /*getLastReservations(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/reportService/GetLastReservations`, { 
        lastReservationRequest: { count: 10 },
        agencyCode: this.currentUser.agency,
        userCode: this.currentUser.user
      }). subscribe((response: any) => {
        if (response.header.success) {
          this.apiData = response.body.reservations;
          this.onApiDataChange.next(this.apiData);
          resolve(this.apiData);
        }
      }, reject);
    });
  }*/
  
}
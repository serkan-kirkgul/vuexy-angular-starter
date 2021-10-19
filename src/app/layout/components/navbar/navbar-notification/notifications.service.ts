import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  // Public
  public apiData = [];
  public onApiDataChange: BehaviorSubject<any>;

  /**
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    this.onApiDataChange = new BehaviorSubject('');
    this.getNotificationsData();
  }

  /**
   * Get Notifications Data
   */
  getNotificationsData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiUrl}/api/bookingService/GetAllReservationComments`, { getOnlyShortComment: false}).subscribe((response: any) => {
        if (response.header.success) {
          this.apiData = response.body.comments;
          this.onApiDataChange.next(this.apiData);
          resolve(this.apiData);
        }
      }, reject);
    });
  }
}

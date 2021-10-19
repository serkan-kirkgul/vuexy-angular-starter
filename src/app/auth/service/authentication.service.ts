import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  }

  /**
   * User login
   * @param agency
   * @param user
   * @param password
   * @returns user
   */
  login(agency: string, user: string, password: string) {
    return this._http
      .post<any>(`${environment.apiUrl}/api/authenticationservice/Login`, { agency, user, password })
      .pipe(
        map(response => {
          var data = {
            error: "",
            userInfo: null, 
          }
          // login successful if there's a jwt token in the response
          if (response.header.success) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            var userInfo = {
              id: response.body.userInfo.id,
              agency: response.body.userInfo.agency.code,
              agencyName: response.body.userInfo.agency.name,
              user: response.body.userInfo.code,
              userName: response.body.userInfo.name,
              avatar: 'avatar-s-11.jpg',
              role: Role.Admin,
              token: response.body.token,
              email: '',
              password: ''
            };

            localStorage.setItem('currentUser', JSON.stringify(userInfo));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'You have successfully logged in as an ' +
                userInfo.role +
                  '. Now you can start to explore. Enjoy! 🎉',
                '👋 Welcome, ' + userInfo.userName + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);

            // notify
            this.currentUserSubject.next(userInfo);

            data.userInfo = userInfo;
          } else {
            data.error = response.header.messages[0].message;
          }
          
          return data;
        })
      );
  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
}

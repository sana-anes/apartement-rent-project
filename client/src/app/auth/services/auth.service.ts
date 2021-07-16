import { BASE_URL } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,throwError, BehaviorSubject} from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

import { TokenStorageService} from '../services';

const AUTH_API =BASE_URL+'/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient , 
    private router: Router,
    private tokenStorage: TokenStorageService
    ) { }

  loginStatus = new BehaviorSubject<boolean>(this.hasToken());

  login(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      email,
      password
    }, httpOptions);
  }

  register(firstname: string,lastname: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'register', {
      firstname,
      lastname,
      email,
      password
    }, httpOptions);
  }

  requestReset(email:string): Observable<any> {
    return this.http.post(`${AUTH_API}/forget-password`,
     {
       email
     });
  }

  newPassword(resettoken:any,newPassword:string): Observable<any> {
    return this.http.post(`${AUTH_API}/new-password`, 
    {
      resettoken,
      newPassword
    }
    );
  }

  ValidPasswordToken(resettoken:any): Observable<any> {
    return this.http.post(`${AUTH_API}/valid-password-token`, 
    {
      resettoken,
    }
    );
  }





  logout() {
    this.loginStatus.next(false);
    this.tokenStorage.signOut();
    this.router.navigate(['/']);
  }

 
  isLoggedIn(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }
  /**
   * if we have token the user is loggedIn
   * @returns {boolean}
   */
  private hasToken(): boolean {
    return this.tokenStorage.check();
  }

}
import { BASE_URL } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
const API_URL = BASE_URL+'/api/user/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<any> {
    return this.http.get(API_URL + 'me', { responseType: 'json' });
  }

  getSavedProperties(): Observable<any> {
    return this.http.get(API_URL + 'savedProperties', { responseType: 'json' });
  }


}

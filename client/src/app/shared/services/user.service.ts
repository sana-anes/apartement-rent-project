import { BASE_URL } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user';

const API_URL = BASE_URL+'/api/user/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<User> {
    return this.http.get<User>(API_URL + 'me', { responseType: 'json' });
  }

  getSavedProperties(): Observable<any> {
    return this.http.get(API_URL + 'savedProperties', { responseType: 'json' });
  }

  updateUser(user:User){
    return this.http.patch(API_URL + 'update', {user}, { responseType: 'json' });
  }
  updatePassword(old_password:string,new_password:string,){
    return this.http.patch(API_URL + 'password', {old_password:old_password,new_password:new_password}, { responseType: 'json' });
  } 

getAllUsers(page:number=0):Observable<User[]>{
  return this.http.get<User[]>(`${API_URL}all?page=${page}`);

}

deleteUser(id:string):Observable<any>{
  const options = {
    httpOptions,
    body: {
      id: id
    }
  }
  return this.http.delete(`${API_URL}delete`,options);

}

search(keyword:string,page:number=0):Observable<any>{
  return this.http.get<User[]>(`${API_URL}search?q=${keyword}&page=${page}`);
}



}

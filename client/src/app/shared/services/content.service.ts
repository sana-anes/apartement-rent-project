import { Country,Category } from './../models/content';
import { BASE_URL } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
const API_URL = BASE_URL+'/api/content/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(private http: HttpClient) { }

  addCountry(label:string): Observable<any> {
    return this.http.post(`${API_URL}addCountry`,
    {
        label
    },httpOptions);

  }
  getCountries(): Observable<Country[]> {  
    return this.http.get<Country[]>(`${API_URL}countries`)
  }

  deleteCountry(id:String): Observable<any> {
    const options = {
      httpOptions,
      body: {
        id: id
      }
    }
    return this.http.delete(`${API_URL}deleteCountry`,options);

  }
  //-------------------------------------------------//

  addCategory(label:string): Observable<any> {
    return this.http.post(`${API_URL}addCategory`,
    {
        label
    },httpOptions);

  }

  getCategories(): Observable<Category[]> {  
    return this.http.get<Category[]>(`${API_URL}categories`)
  }

  deleteCategory(id:String): Observable<any> {
    const options = {
      httpOptions,
      body: {
        id: id
      }
    }
    return this.http.delete(`${API_URL}deleteCategory`,options);
  }
   
//-----------------------------------------------------------------//

getContent(): Observable<any> {  
  return this.http.get<any>(`${API_URL}content`)
}

}

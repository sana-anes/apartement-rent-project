import { Property } from './../models/property';
import { BASE_URL } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
const API_URL = BASE_URL+'/api/property/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const params = new HttpParams();

const options = {
  params,
  reportProgress: true,
};
@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  constructor(private http: HttpClient) { }


  addProperty(files:File[],property:Property): Observable<any> {
    console.log(files);
    const formData: FormData = new FormData();
      for (let i = 0; i < files.length; i++) {
            formData.append("file", files[i]);
 
    }
 
    return this.http.post(API_URL + 'add', {
      property,
      formData
    }, options);

  }

  getProperties(): Observable<Property[]> {  
    return this.http.get<Property[]>(`${API_URL}`)
  }
  getPropertiesById(id:string): Observable<Property[]> {  
    return this.http.get<Property[]>(`${API_URL}/single/${id}`)
  }
  getPropertiesByStatus(status:string): Observable<Property[]> {
    return this.http.get<Property[]>(`${API_URL}status/${status}`)
  }

  getAllProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(`${API_URL}all`)
  }

  getOtherProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(`${API_URL}others`)
  }

  saveProperty(id:String): Observable<any> {

    return this.http.post(`${API_URL}save`,{id:id},httpOptions);
  }

  unsaveProperty(id:String): Observable<any> {

    return this.http.post(`${API_URL}unsave`,{id:id},httpOptions);
  }

  deleteProperty(id:String): Observable<any> {
    const options = {
      httpOptions,
      body: {
        id: id
      }
    }
    return this.http.delete(`${API_URL}delete`,options);
  }
   
  


}

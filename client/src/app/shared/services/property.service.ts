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

  getPropertiesById(id:string): Observable<Property[]> {  
    return this.http.get<Property[]>(`${API_URL}single/${id}`)
  }
  
  getPropertiesByStatus(status:string,page:number=0): Observable<Property[]> { //user properties user

    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: { 
       status:status,
      page:page
      }
    };
    return this.http.get<Property[]>(`${API_URL}status`,httpOptions)

  }

  getAllProperties(type:string='all',country:string='all',property:string='all',rooms:string='',baths:string='',page:number=0): Observable<Property[]> { //all properties admin
    
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: { 
        type:type,
        country: country,
        property:property,
        rooms: rooms,
        baths :baths,
        page:page
      }
    };
    return this.http.get<Property[]>(`${API_URL}all`,httpOptions)
  }

  getOtherProperties(type:string='all',country:string='all',rooms:string='',baths:string='',page:number=0): Observable<Property[]> { // other users properties user
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: { 
        type:type,
        country: country,
        rooms: rooms,
        baths :baths,
        page:page
      }
    };
    return this.http.get<Property[]>(`${API_URL}others`,httpOptions)
  }

  getPublicProperties(type:string='all',country:string='all',rooms:string='',baths:string='',page:number=0): Observable<Property[]> { // other users properties user
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: { 
        type:type,
        country: country,
        rooms: rooms,
        baths :baths,
        page:page
      }
    };
    return this.http.get<Property[]>(`${API_URL}public`,httpOptions)
  }

  getSavedProperties(page:number=0): Observable<any> {
    return this.http.get(API_URL + `savedProperties/${page}`, { responseType: 'json' });
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
   
  accepteProperty(id:String):Observable<any> {

    return this.http.post(`${API_URL}accepte`,{id:id},httpOptions);
  }

}

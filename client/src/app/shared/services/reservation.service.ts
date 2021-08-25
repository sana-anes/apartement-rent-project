import { BASE_URL } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../../shared/models/reservation';
const API_URL = BASE_URL+'/api/reservation/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor(private http: HttpClient) { }


  checkAvailability(start:Date,end:Date,id:string): Observable<any> {

    return this.http.post(`${API_URL}check`,
    {
      start,
      end,
      id,
    },httpOptions);
  }
  book(start:Date,end:Date,id:string): Observable<any> {

    return this.http.post(`${API_URL}book`,
    {
      start,
      end,
      id,
    },httpOptions);
  }
  confirmReservation(id:string): Observable<any> {

    return this.http.patch(`${API_URL}confirm`,
    { id,
    },httpOptions);
  }
  getReservations(): Observable<Reservation[]> {  
    return this.http.get<Reservation[]>(`${API_URL}`)
  }
  getReservationsByProperty(id:string,page:number=0): Observable<Reservation[]> { 
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' },
      params: { 
        id:id,
        page:page
      }
    }
    
    return this.http.get<Reservation[]>(`${API_URL}/property/`,httpOptions)
  }
  getReservationsByStatus(status:string,pageN:number=0): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${API_URL}status?status=${status}&pageN=${pageN}`)
  }

  getAllReservations(page:number=0): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${API_URL}all?page=${page}`)
  }

  deleteReservation(id:String): Observable<any> {
    const options = {
      httpOptions,
      body: {
        id: id
      }
    }
    return this.http.delete(`${API_URL}delete`,options);
  }
   




}

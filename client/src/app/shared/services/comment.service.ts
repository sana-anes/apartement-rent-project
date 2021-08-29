import { Comment } from './../models/comment';
import { BASE_URL } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
const API_URL = BASE_URL+'/api/comment/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) { }

  addComment(property:string,name:string,email:string,comment:any): Observable<any> {
    return this.http.post(`${API_URL}add`,
    {   property:property,
        name:name,
        email:email,
        comment:comment  
    },httpOptions);

  }

  addReply(name:string,email:string,comment:string,parent:string): Observable<any> {
    return this.http.post(`${API_URL}reply`,
    {
        name:name,
        email:email,
        comment:comment ,
        parent:parent
    },httpOptions);

  }

  getComments(property:string): Observable<Comment[]> {  
    return this.http.get<Comment[]>(`${API_URL}comments/${property}`)
  }


  deleteComment(comment:string,property:String): Observable<any> {
    const options = {
      httpOptions,
      body: {
        property:property,
        comment:comment
      }
    }
    return this.http.delete(`${API_URL}deleteComment`,options);

  }

  deleteReply(reply:string,comment:String): Observable<any> {
    const options = {
      httpOptions,
      body: {
        reply:reply,
        comment:comment
      }
    }
    return this.http.delete(`${API_URL}deleteReply`,options);

  }

}

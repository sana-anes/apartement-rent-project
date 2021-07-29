import { Property } from './../models/property';
import { BASE_URL } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
const API_URL = BASE_URL+'/api/property/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  constructor(private http: HttpClient) { }


  addProperty(files:FileList,property:Property): Observable<any> {
    console.log(files);
    const formData: FormData = new FormData();
      for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
 
    }

    // for (var i = 0; i < file.length; i++) { 
    //   formData.append("file[]", file[i]);
    // }
    return this.http.post(API_URL + 'add', {
      property,
      formData
    }, httpOptions);

  }

  upload(files:FileList): Observable<any> {
    console.log(files);

    const formdata = new FormData();
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      formdata.append('files', element);
    }
    console.log(formdata);

    return this.http.post(API_URL + 'add', files);

  }
   
  


}

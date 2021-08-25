import { Component, OnInit } from '@angular/core';
import { Feedback } from '../../shared/models/feedback';
import { BASE_URL } from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
const API_URL = BASE_URL+'/api/feedback/';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
data:Feedback[]=[];
pageN:number=1;
total!:number;
perPage:number=8;
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {

    this.http.get(API_URL +'all').subscribe(
  (res :any)=> {
    this.data = res.data;
    this.total=res.total;          

    console.log(res.data)
  }
);
  }
  refresh(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }


  back(){
    let page=this.pageN-1
    if(page>0){
      this.pageN=page;
      this.http.get(API_URL +`all?page=${page}`).subscribe(
        (res:any)=> {
          this.pageN=this.pageN-1;
          this.data = res.data;
          this.total=res.total;          
          console.log(res)
        }
      );
        }
    }

    

    forward(){
        this.http.get(API_URL +`all?page=${this.pageN}`)
        .subscribe((res: any) => {
          if(res.data.length){
            this.pageN=this.pageN+1;
            this.data = res.data;
            this.total=res.total;
          }
          console.log(res);
     
        }, err => {
          console.log(err);
        });
      
  
      }

}

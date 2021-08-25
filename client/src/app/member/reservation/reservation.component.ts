import { Reservation } from '../../shared/models/reservation';
import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/shared/services';
import { BASE_URL } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit  {
  data: Reservation[] = [];
  base_url:string=BASE_URL;
  statusArray:string[]=['not confirmed','confirmed'];
  pageN:number=1;
  total!:number;
  perPage:number=10;
filterForm = new FormGroup({
  status: new FormControl('', [Validators.required]),
});
constructor(   
  private  reservationService:  ReservationService,
   private router: Router,
   private http: HttpClient

   ) { }
 ngOnInit(): void {
   this.reservationService.getReservationsByStatus('all')
   .subscribe((res: any) => {
    this.data = res.data;
    this.total=res.total;
     console.log(res);

   }, err => {
     console.log(err);
   });
 }

get status(): AbstractControl {
  return this.filterForm.get('status')!;
}

changeStatus(e:any) {
  this.pageN=1;
  this.status.setValue(e.target.value, {
    onlySelf: true
  })

  this.reservationService.getReservationsByStatus(this.filterForm.value.status).subscribe(
    (res: any) => {
      this.data = res.data;
      this.total=res.total;
    },
    error=>{}
)
}


confirm(id:string){
  this.reservationService.confirmReservation(id).subscribe(
    data => {
      console.log(data);
      this.refresh();

    },
    error=>{}
)
}

  delete(id:string){
    this.reservationService.deleteReservation(id)
    .subscribe((res: any) => {
      this.data = res;
      console.log(this.data);
     this.refresh();
    }, err => {
      console.log(err);
    });
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
      let status;
      this.filterForm.value.status?status=this.filterForm.value.status:status='all'
      this.reservationService.getReservationsByStatus(status,page-1)
      .subscribe((res: any) => {
        this.data = res.data;
        this.total=res.total;
   
      }, err => {
        console.log(err);
      });
    }

    }

    forward(){
       let status;
      this.filterForm.value.status?status=this.filterForm.value.status:status='all'
        this.reservationService.getReservationsByStatus(status,this.pageN)
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

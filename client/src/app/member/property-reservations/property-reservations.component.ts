import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Reservation } from '../../shared/models/reservation';
import { ReservationService } from 'src/app/shared/services';
import { Router } from '@angular/router';
@Component({
  selector: 'app-property-reservations',
  templateUrl: './property-reservations.component.html',
  styleUrls: ['./property-reservations.component.css']
})
export class PropertyReservationsComponent implements OnInit {
  id!:string;
  data: Reservation[] = [];
  pageN:number=1;
  total!:number;
  perPage:number=10;
  constructor(   
     private activatedRoute: ActivatedRoute,
     private  reservationService:  ReservationService,
     private router: Router,

    ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.reservationService.getReservationsByProperty(this.id)
    .subscribe((res: any) => {
     this.data = res.data;
     this.total=res.total;
      console.log(res);
 
    }, err => {
      console.log(err);
    });
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
      this.reservationService.getReservationsByProperty(this.id,page-1)
      .subscribe((res: any) => {
        this.data = res.data;
        this.total=res.total;
   
      }, err => {
        console.log(err);
      });
    }

    }

    forward(){
        this.reservationService.getReservationsByProperty(this.id,this.pageN)
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
